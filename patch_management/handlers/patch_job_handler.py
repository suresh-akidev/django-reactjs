from patch_management.handlers import tasks

import os
import celery

import pytz
from pytz import timezone

from OpsMate.celery import app

from patch_management.linnet_apis.models import PatchJob, GlobalConfig
from OpsMate.settings import *
from celery.result import AsyncResult


'''
Job Execution
'''

class PatchJobHandler:
  def __init__(self, job_id):
    self.job_id = job_id
    self.task_celery_status=self.run_task_celery(self.job_id)

  # This function will execute the task by getting datetime in database
  def run_task_celery(self, job_id):
    patch_management_path = os.path.join(BASE_DIR, 'patch_management/patch_scripts/patch_management_master_server_role.yml')
    configfile_path = os.path.join(BASE_DIR, 'working/{}/patchinput/configuration/configuration.yml'.format(self.job_id))
    local_inventory_path = os.path.join(BASE_DIR, 'patch_management/patch_scripts/inventory/inventory-localhost.ini')

    job = PatchJob.objects.get(job_id=self.job_id)
    actual_startdate = job.actual_startdate
    actual_enddate = job.actual_enddate

    # convert time    
    utc_actual_startdate, utc_actual_enddate = self.convert_to_utc(actual_startdate, actual_enddate)

    #Set time limit
    execution_time_limit=int((utc_actual_enddate-utc_actual_startdate).total_seconds())

    # add to celery job
    task_id = str(self.job_id)
    body = {}

    task = tasks.execute_patch_job.apply_async((patch_management_path, configfile_path, local_inventory_path, job_id), 
    eta=utc_actual_startdate, expires=utc_actual_enddate, task_id=task_id, time_limit=execution_time_limit)
    
    result_status = task.status

    if (result_status == 'FAILURE'):
      body = {
        "status": False,
        "message": "Job schedule not created. Error: <Task.Error>"
      }

    else:
      body = {
        "status": True,
        "message": "Job is created and scheduled to start at " +actual_startdate.strftime("%Y-%m-%d %H:%M:%S")
      }

    return body

  def convert_to_utc(self, actual_startdate, actual_enddate):
    replaced_actual_startdate = actual_startdate.replace(tzinfo=None)
    replaced_actual_enddate = actual_enddate.replace(tzinfo=None)

    global_config = GlobalConfig.objects.first()
    global_timezone = global_config.timezone
    globaltz = timezone(global_timezone)

    actual_startdate_aware = globaltz.localize(replaced_actual_startdate)
    actual_enddate_aware = globaltz.localize(replaced_actual_enddate)

    utc_actual_startdate = actual_startdate_aware.astimezone(pytz.utc)
    utc_actual_enddate = actual_enddate_aware.astimezone(pytz.utc)

    return utc_actual_startdate, utc_actual_enddate

  def get_task_logs(job_id):
    task_id = str(job_id)
    job_result = AsyncResult(task_id)
    return job_result.result.get('logs')

  def revoke_celery_job(job_id):
    task_id = str(job_id)
    app.control.revoke(task_id,terminate=True)
    return "Success"