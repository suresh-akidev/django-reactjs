from __future__ import absolute_import, unicode_literals

from datetime import datetime, timezone

from celery import shared_task
from celery.schedules import crontab
from celery.decorators import periodic_task
from celery.task import PeriodicTask

from patch_management.linnet_apis.libs import *
from .time_convert import time_convert
from patch_management.linnet_apis.models import PatchJob, PatchSummary, ValidationSummary, ServerDetail
from OpsMate.celery import app
import ansible_runner
import os
from glob import glob
import pandas as pd
import yaml
import pytz

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction,IntegrityError

from OpsMate import settings
import hvac


@shared_task
def execute_patch_job(patch_management_path, configfile_path, local_inventory_path, job_id):
  command_status = 'Success'
  # check job id exists
  check_job_id = PatchJob.objects.filter(job_id=job_id)
  if check_job_id.count() == 0:
    return_body = {
      "Patching status": "Aborted",
      "Database update status": "Aborted",
      "logs": "NA"
    }
    return return_body
  job_dir=str(job_id)
  ansible_private_dir=os.path.join(WORKING_DIR, job_dir)
  extravars={}
  extravars['fact_configfilepath']=configfile_path
  extravars['NODE']='NODE'
  # Running status
  command_status='Running'
  update_database(job_id=job_id, configfile_path=configfile_path, command_status=command_status)
  
  ansible_runner_object=ansible_runner.run(private_data_dir=ansible_private_dir,playbook=patch_management_path,
  inventory=local_inventory_path,extravars=extravars,ident=job_dir,quiet=True)

  print("Ansible playbook execution completed")
  command_status='Success'
  
  update_database_status=update_database(job_id=job_id, configfile_path=configfile_path, command_status=command_status)

  return_body = {
        "Patching status": command_status,
        "Database update status": update_database_status,
        "logs": ansible_runner_object.stdout.name
      }
  return return_body


### Update Patch Summary Model
def read_master_summary_file(job_id, technology, server_name):
  server_name_short=server_name.split('.',1)[0]
  master_csv_path = os.path.join(WORKING_DIR, '{}/patchoutput/{}/Master-Execution-Summary.csv'.format(job_id, technology))
  if not os.path.exists(master_csv_path):
    return 'Failed'
  master_csv_data = pd.read_csv(master_csv_path)
  patch_failed_filter = len(master_csv_data[(master_csv_data['HostName']==server_name_short) | (master_csv_data['HostName']==server_name) | (master_csv_data['HostName']==server_name_short.lower()) | (master_csv_data['HostName']==server_name.lower())])
  if patch_failed_filter > 0:
    return 'Failed'
  patch_failed_filter = len(master_csv_data[(master_csv_data['HostName']=='localhost')])
  if patch_failed_filter > 0:
    return 'Failed'
  return 'Success'

def read_patch_kernelcheck_file(job_id, technology, server_name):
  server_name_short=server_name.split('.',1)[0]
  server_name_short=server_name_short.lower()
  csv_path = glob(os.path.join(WORKING_DIR, '{}/patchoutput/{}/PostPatch/{}{}-Patch-kernelcheck-{}.csv'.format(job_id, technology, server_name_short,'*','*')))
  if len(csv_path) == 0:
    return 'NA'
  csv_data = pd.read_csv(csv_path[0], nrows=1)
  kernel_version_list = csv_data['Current Kernel Version']
  return kernel_version_list[0]

def update_patch_summary(job_id, server_name, command_status, kernel_version):
  try:
    patch_summary = PatchSummary.objects.get(job_id = job_id, server_name_id=server_name)
    # app_timezone = GlobalConfig.objects.first().timezone
    # patch_executiontime=time_convert(datetime.now(timezone.utc),app_timezone)
    # patch_executiontime = datetime.strptime(patch_executiontime, "%Y-%m-%dT%H:%M")
    # tz = pytz.timezone(app_timezone)
    # patch_executiontime = tz.localize(patch_executiontime, is_dst=True).astimezone(tz)
    patch_summary.status = command_status
    patch_summary.kernel_version = kernel_version
    # patch_summary.patch_executiondate = patch_executiontime
    patch_summary.save(update_fields=['kernel_version', 'status'])
  except ObjectDoesNotExist:
    print("Patch summary of server not found.") 
  
### Update Validation Summary Model
def read_patch_validation_file(job_id, technology, server_name):
  server_name_short=server_name.split('.',1)[0]
  validation_file_path = glob(os.path.join(WORKING_DIR, '{}/patchoutput/{}/PatchValidation/Patch-{}.csv'.format(job_id, technology,'*')))
  validation_csv_data = pd.read_csv(validation_file_path[0])
  current_server_fields = validation_csv_data['Hostname'] == server_name_short.lower()
  current_server_data = validation_csv_data[current_server_fields]
  return current_server_data

def update_validation_summary(job_id_obj, server_name, technology, validation_data):
  server_name_short=server_name.split('.',1)[0]
  validation_file_path = glob(os.path.join(WORKING_DIR, '{}/patchoutput/{}/PatchValidation/Patch-{}.csv'.format(job_id_obj.job_id, technology,'*')))
  validation_csv_data = pd.read_csv(validation_file_path[0])
  current_server_fields = validation_csv_data['Hostname'] == server_name_short.lower()
  current_server_data = validation_csv_data[current_server_fields]
  server_name_obj = ServerDetail.objects.get(server_name=server_name)
  
  with transaction.atomic():
    try:
      for validation_check_item in current_server_data.to_dict('records'):
        validation_db_insert = ValidationSummary(patch_id=job_id_obj.patch_id, job_id=job_id_obj, server_name=server_name_obj, 
        check_name=validation_check_item.get('Check name'), status=validation_check_item.get('Result'), 
        prepatch_outputpath=validation_check_item.get('Pre-Sanity output file'), postpatch_outputpath=validation_check_item.get('Post-Sanity output file'))
        validation_db_insert.save()
    except IntegrityError:
      print("Insert into validation summary failed")

def get_all_servername(job_id):
  server_name_list = []
  patch_summary = PatchSummary.objects.filter(job_id = job_id)

  for summary in patch_summary:
    server_name_list.append(summary.server_name.server_name)

  return server_name_list

'''
@Description: This function will update database after patch execution completed
@Date: 12/18/2020
'''
def update_database(job_id, configfile_path, command_status):
  # get all servername from job_id
  server_name_list = get_all_servername(job_id)
  technology=''
  job_id_obj = PatchJob.objects.get(job_id = job_id)
  if command_status == 'Success':
    # get technology
    with open(configfile_path,'r') as f:
      for data in yaml.safe_load_all(f):
        technology =  data.get('Technology')

  for current_server in server_name_list:
    if command_status == 'Success':
      master_exec_status=read_master_summary_file(job_id, technology, current_server)
      if master_exec_status == 'Success':
        current_kernel_version = read_patch_kernelcheck_file(job_id, technology, current_server)
        update_patch_summary(job_id, current_server, command_status, current_kernel_version )
        validation_data = read_patch_validation_file(job_id, technology, current_server)
        if not validation_data.empty:
          update_validation_summary(job_id_obj,current_server, technology, validation_data)
      else:
        command_status=master_exec_status
        update_patch_summary(job_id, current_server, command_status, 'NA' )
    else:
      update_patch_summary(job_id, current_server, command_status, 'NA' )
  return command_status

### Task: Renew Vault Tokens Daily
@periodic_task(run_every=crontab(hour=1, minute=0))
def renew_vault_token_daily():
  url = settings.VAULT_ADDR
  token = settings.VAULT_TOKEN

  client = hvac.Client (
    url= url,
    token= token
  )
  
  client.renew_token()
