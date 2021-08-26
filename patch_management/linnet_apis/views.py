# # Create your views here.
from .libs import *

from .models import\
    ServerDetail,\
    PatchJob,\
    PatchDetail,\
    PatchSummary,\
    BackupServerDetail,\
    MonitorServerDetail,\
    BusinessCriticality,\
    TechnologyDetail
from .serializers import \
    ConfigTemplateSerializer, \
    SchedulerSerializers, \
    TechnologyCloneSerializer, \
    TechnologyEditSerializer, \
    ConfigPathSerializer

from .signals import \
    booleanCheck,\
    list_dictionaries, list_dictionaries_key, \
    createFolder, writeFile, writeJSONfile,\
    csv_reader, serverDataformat,\
    read_validation_logs, patch_job_schedule, \
    get_task_logs, create_serverlist_xlsx

from patch_management.handlers.api_external import SnowChange

from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, Http404
from django.db import connection
from django.utils.encoding import smart_str
from django.db import IntegrityError
from django.core.exceptions import ValidationError, ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import re
import pandas as pd
import csv


class MySQLConnection:
    def sqlOne(query):
        with connection.cursor() as cursor:
            cursor.execute(query)
            data = cursor.fetchone()
        return data

    def sqlAll(query):
        data = []
        with connection.cursor() as cursor:
            cursor.execute(query)
            data = cursor.fetchall()
        return data

    def sqlJson(query, header):
        data = []
        with connection.cursor() as cursor:
            cursor.execute(query)
            data = cursor.fetchall()
        return (list_dictionaries(header, data))

    def sqlFullJson(query, header, key):
        data = []
        with connection.cursor() as cursor:
            cursor.execute(query)
            data = cursor.fetchall()
        return (list_dictionaries_key(header, data, key))

    def callProc(query, header):
        data = []
        with connection.cursor() as cursor:
            cursor.callproc(query)
            data = cursor.fetchall()
        return (list_dictionaries(header, data))


# @api_view(['POST'])
# def ServerUploadAPIView(request):
class ServerUploadAPIView(APIView):
    def post(self, request, format=None):
        dinA = 0
        dinU = 0
        server_overwrite = False
        csv_file = request.FILES['serverUpload']
        dataA = []
        dataU = []
        error = []
        if request.POST['server_overwrite'] == 'true':
            server_overwrite = True
        else:
            server_overwrite = False

        for row in csv_reader(csv_file):
            # print("***************************")
            # print(row)
            # print("***************************")
            try:
                if '\ufeffServer Name' in row:
                    row['Server Name'] = row.pop('\ufeffServer Name')

                self.server_insert(row)
                dataA.append(row)
                dinA += 1
            except IntegrityError:
                if server_overwrite:
                    try:
                        self.server_update(row)
                        dataU.append(row)
                        dinU += 1
                    except ObjectDoesNotExist:
                        error.append(
                            row['Server Name']+' Backup / Monitoring server has to be updated in the global config')
                        # print(row['Server Name']+' Backup / Monitoring server has to be updated global config')
                    except:
                        error.append(row['Server Name'] +
                                     ' Something went wrong')
                        # print(row['Server Name']+' Something went wrong')
                else:
                    error.append(row['Server Name'] +
                                 ' Server already exists in the database')
                    # print(row['Server Name']+' Server details already exists in the database')
            except ValidationError:
                error.append(row['Server Name'] +
                             ' NULL value will not be accepted')
                # print(row['Server Name']+' NULL value will not be accepted')
            except ObjectDoesNotExist:
                error.append(
                    row['Server Name']+' Backup / Monitoring server has to be updated in the global config')
                # print(row['Server Name']+' Backup / Monitoring server has to be updated global config')
            except:
                if 'Server Name' in row:
                    error.append(row['Server Name']+' Something went wrong')
                else:
                    error.append(
                        'Download the template and fill it before uploading')
                    # print(row['Server Name']+' Something went wrong')
                    break

        data = {
            'Insert': serverDataformat(dataA),
            'Update': serverDataformat(dataU),
            'messages': error
        }
        return Response(data)

    def server_insert(self, row):
        server_det = ServerDetail(
            server_name=row['Server Name'],
            ip_address=row['IP address'],
            os_name=row['OS Name'],
            criticality=BusinessCriticality.objects.get(
                criticality=row['Criticality']),
            credential_path=row['Credential Path'],
            backup_server=BackupServerDetail.objects.get(
                backup_server=row['Backup Server']),
            backup_enabled=booleanCheck(row['Backup Enabled']),
            monitor_server=MonitorServerDetail.objects.get(
                monitor_server=row['Monitoring Server']),
            monitor_enabled=booleanCheck(row['Monitoring Enabled'])
        )
        server_det.save()

    def server_update(self, row):
        server_det = ServerDetail.objects.get(server_name=row['Server Name'])
        server_det.ip_address = row['IP address']
        server_det.os_name = row['OS Name']
        server_det.criticality = BusinessCriticality.objects.get(
            criticality=row['Criticality'])
        server_det.credential_path = row['Credential Path']
        server_det.backup_server = BackupServerDetail.objects.get(
            backup_server=row['Backup Server'])
        server_det.backup_enabled = booleanCheck(row['Backup Enabled'])
        server_det.monitor_server = MonitorServerDetail.objects.get(
            monitor_server=row['Monitoring Server'])
        server_det.monitor_enabled = booleanCheck(row['Monitoring Enabled'])
        server_det.save()


class ServerDownloadCSVAPIView(APIView):
    def get(self, request, format=None):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="ThePythonDjango.csv"'
        response.write(u'\ufeff'.encode('utf8'))
        writer = csv.writer(response, csv.excel)
        writer.writerow([
            smart_str(u"Server Name"),
            smart_str(u"IP address"),
            smart_str(u"OS Name"),
            smart_str(u"Criticality"),
            smart_str(u"Credential Path"),
            smart_str(u"Backup Enabled"),
            smart_str(u"Backup Server"),
            smart_str(u"Monitoring Enabled"),
            smart_str(u"Monitoring Server"),
        ])

        return response


class ServerDownloadAPIView(APIView):
    def get(self, request, format=None):
        file_path = self.create_xlsx()

        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(
                    fh.read(), content_type="application/vnd.ms-excel")
                response['Content-Disposition'] = 'inline; filename=' + \
                    os.path.basename(file_path)
                return response
        raise Http404

    def create_xlsx(self):

        technology = self.get_values('technology')
        criticality = self.get_values('criticality')
        backup = self.get_values('backup')
        monitor = self.get_values('monitor')

        return create_serverlist_xlsx(technology, criticality, backup, monitor)

    def get_values(self, argument):
        method = getattr(self, argument, lambda: "Invalid Table")
        return method()

    def technology(self):
        array = []
        for item in TechnologyDetail.objects.all():
            array.append(item.technology_name)
        return (array)

    def criticality(self):
        array = []
        for item in BusinessCriticality.objects.all():
            array.append(item.criticality)
        return (array)

    def backup(self):
        array = []
        for item in BackupServerDetail.objects.all():
            array.append(item.backup_server)
        return (array)

    def monitor(self):
        array = []
        for item in MonitorServerDetail.objects.all():
            array.append(item.monitor_server)
        return (array)


class TechnologyDetailViewSet(APIView):
    def get(self, request, format=None):
        header = ['technology_id', 'technology_name']
        query = '''SELECT technology_id,
                    GROUP_CONCAT(technology_name SEPARATOR ' / ') AS technology_name
                    FROM patch_management_technologydetail
                    GROUP BY technology_id;'''

        return Response(MySQLConnection.sqlJson(query, header))


class TechnologyConfigAPIView(APIView):
    def post(self, request, *args, **kwargs):
        data = self.set_values(kwargs['type'], request)
        # if (data['status']):
        #     return Response(data, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)

    def set_values(self, argument, request):
        method = getattr(self, argument, lambda: "Invalid Table")
        return method(request)

    def clone(self, request):
        serializer = TechnologyCloneSerializer(data=request.data)
        if serializer.is_valid():
            tech_det = TechnologyDetail(
                technology_id=serializer.data['technology_id'],
                technology_name=serializer.data['technology_name'],
            )
            tech_det.save()
            return ({'data': "({}) Technology has been cloned".format(serializer.data["technology_name"]), 'status': True})
        return ({'data': "Cannot clone!!", 'status': False})

    def edit(self, request):
        serializer = TechnologyEditSerializer(data=request.data)
        if serializer.is_valid():
            tech_det = TechnologyDetail.objects.get(id=serializer.data['id'])
            tech_det.technology_name = serializer.data['technology_name']
            tech_det.save()
            return ({'data': "({}) Technology has been updated".format(serializer.data["technology_name"]), 'status': True})
        return ({'data': "Cannot edit!!", 'status': False})

    def add(self, request):
        if (self.upload(request.FILES['file_upload'])):
            tech_det = TechnologyDetail(
                technology_id=request.POST['technology_id'].split(".")[0],
                technology_name=request.POST['technology_name'],
            )
            tech_det.save()
            return ({'data': "({}) Technology has been added".format(request.POST["technology_name"]), 'status': True})
        return ({'data': "The same config file already exists, please work with OpsMate Team!!!", 'status': False})

    def upload(self, file):
        fs = FileSystemStorage()
        path = os.path.join(CONFIGFILE_DIR, file.name)
        if (fs.exists(path)):
            return False
        else:
            fs.save(path, file)
            return True


class PatchApprovalView(APIView):
    def get(self, request, *args, **kwargs):
        data = self.patch_change_approval(kwargs['pk'])
        return Response(data)

    def patch_change_approval(self, change_no):
        query = '''SELECT itsm_api_url, timezone
                        FROM patch_management_globalconfig'''
        (itsm_api_url, timezone) = (MySQLConnection.sqlOne(query))

        return (SnowChange(itsm_api_url, change_no, timezone).data)


class PatchApprovalItsmView(APIView):
    def get(self, request, *args, **kwargs):
        data = self.itsm_check()
        return Response(data)

    def itsm_check(self):
        query = '''SELECT itsm_api_url
                        FROM patch_management_globalconfig'''
        (itsm_api_url,) = (MySQLConnection.sqlOne(query))
        data = {
            'ItsmAPI': False if itsm_api_url == 'NO' else True}
        return (data)


class ServerTechViewSet(APIView):
    def get(self, request, *args, **kwargs):
        header = ['server_name', 'ip_address', 'os_name', 'status', 'criticality',
                  'credential_path', 'backup_server', 'backup_enabled', 'monitor_server', 'monitor_enabled']
        query = '''SELECT ser.server_name, ser.ip_address, ser.os_name, ser.status, ser.criticality_id,
                    ser.credential_path, ser.backup_server_id, ser.backup_enabled, ser.monitor_server_id, ser.monitor_enabled
                    FROM patch_management_serverdetail AS ser 
                    INNER JOIN patch_management_technologydetail AS tech ON tech.technology_name=ser.os_name
                    WHERE tech.technology_id LIKE "{}"'''.format(kwargs['technology_id'])
        server = MySQLConnection.sqlJson(query, header)
        return Response(server)


class SchedulerConfigAPIView(APIView):
    def post(self, request, format=None):
        serializer = SchedulerSerializers(data=request.data)
        if serializer.is_valid():
            # change_no = serializer.data["change_no"]
            # planned_startdate = serializer.data["planned_startdate"]
            # planned_enddate = serializer.data["planned_enddate"]
            # actual_startdate = serializer.data["actual_startdate"]
            # actual_enddate = serializer.data["actual_enddate"]
            # patch_id = serializer.data["patch_id"]
            # technology_id = serializer.data["technology_id"]
            # config_content = serializer.data["config_content"]
            # server_list = serializer.data["server_list"]

            job_id = self.patch_job_create(serializer)
            if type(job_id) == int:
                config_det = self.patch_job_config(job_id, serializer)
                summaries = self.patch_job_servers(job_id, serializer)
                job_schedule = patch_job_schedule(job_id)
                if (job_schedule["status"]):
                    body = {
                        "statusCode": 200,
                        "message": "success",
                        "schedule": {
                            "job_id": job_id,
                            "schedule": job_schedule["message"]
                        },
                        "config": config_det,
                        "summaries": summaries,
                    }
                    return Response(body, status=status.HTTP_200_OK)
                else:
                    self.PatchJobDelete.deleteJob(self, job_id)
                    body = {
                        "statusCode": 404,
                        "message": "Ansible Failed",
                        "schedule": {
                            "job_id": job_id,
                            "schedule": job_schedule["message"]
                        },
                        "config": "Configuration file has not been created",
                        "summaries": "NA",
                    }
                    return Response(body, status=status.HTTP_400_BAD_REQUEST)
            else:
                body = {
                    "statusCode": 400,
                    "message": "Failed",
                    "schedule": {
                        "job_id": job_id,
                        "schedule": "it's not configured due to some issue"
                    },
                    "config": "Configuration file has not been created",
                    "summaries": "NA",
                }
                return Response(body, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch_job_create(self, serializer):
        # PatchJob
        data = ""
        try:
            patch_job = PatchJob(
                change_no=serializer.data["change_no"],
                planned_startdate=serializer.data["planned_startdate"],
                planned_enddate=serializer.data["planned_enddate"],
                actual_startdate=serializer.data["actual_startdate"],
                actual_enddate=serializer.data["actual_enddate"],
                patch_id=PatchDetail.objects.get(
                    patch_id=serializer.data["patch_id"])
            )
            patch_job.save()
            data = patch_job.job_id
        except IntegrityError:
            data = "Failed due to duplicate"
        except ValidationError:
            data = "Failed due to Null value"
        except ObjectDoesNotExist:
            data = "Failed due to ForeignKey"
        except:
            data = "Something went wrong"

        return data

    def patch_job_config(self, job_id, serializer):
        query = '''SELECT account_name, 
                        smtp_mail_server, 
                        from_address
                        FROM patch_management_globalconfig'''
        (account_name, smtp_mail_server, from_address) = (
            MySQLConnection.sqlOne(query))

        config_content = re.sub(
            r"(?<=Account_Name:).*", r" {}".format(
                account_name), serializer.data["config_content"]
        )
        config_content = re.sub(
            r"(?<=Technology:).*", r" {}".format(
                serializer.data["technology_id"]), config_content
        )
        config_content = re.sub(
            r"(?<=SMTP_Mail_Server:).*", r" {}".format(smtp_mail_server), config_content
        )
        config_content = re.sub(
            r"(?<=From_Address:).*", r" {}".format(from_address), config_content
        )
        config_content = re.sub(
            r"(?<=Master_Server_Output_path:).*", r" {}{}".format(WORKING_DIR,
                                                                  job_id), config_content
        )
        config_content = re.sub(
            r"(?<=Inventory_List:).*", r" {}{}/patchinput/inventory/inventory.csv".format(
                WORKING_DIR, job_id), config_content
        )
        # Inventory_List: /opt/app/working/1/patchinput/inventory/inventory.csv

        # write configuration json file and yaml file in configuration folder
        # JOBID_DIR = WORKING_DIR + "/{}/".format(job_id)
        JOBID_DIR = os.path.join(WORKING_DIR, '{}/'.format(job_id))
        createFolder(JOBID_DIR)
        # PATCHINPUT_DIR = JOBID_DIR + "/patchinput/"
        PATCHINPUT_DIR = os.path.join(JOBID_DIR, 'patchinput/')
        createFolder(PATCHINPUT_DIR)
        # YML_DIR = PATCHINPUT_DIR + "/configuration/"
        YML_DIR = os.path.join(PATCHINPUT_DIR, 'configuration/')
        createFolder(YML_DIR)

        # config_yaml = "{}configuration.yml".format(YML_DIR)
        config_yaml = os.path.join(YML_DIR, 'configuration.yml')
        writeFile(config_yaml, config_content)

        # write inventory csv format in inventory folder
        # serverStr = ",".join(server_list)
        serverStr = " - ".replace('-', ",".join('"{}"'.format(i)
                                                for i in serializer.data["server_list"]))
        header = ['servername', 'username', 'password',
                  'monitor_enabled', 'monitor_server',
                  'backup_enabled', 'backup_server',
                  'actual_startdate', 'actual_enddate']

        query = '''SELECT server_name, 
                    CONCAT("$HVAC:", credential_path ,"/username") AS username, 
                    CONCAT("$HVAC:", credential_path,"/password") AS password, 
                    monitor_enabled, monitor_server_id, 
					backup_enabled, backup_server_id,
                    '{}' as actual_startdate, '{}' as actual_enddate
                    FROM patch_management_serverdetail
                    WHERE server_name in ({})'''.format(serializer.data["actual_startdate"], serializer.data["actual_enddate"], serverStr)

        data = MySQLConnection.sqlJson(query, header)
        # step 1: get Vault Path (username, password) from DB
        # INVENTORY_DIR = PATCHINPUT_DIR + "/inventory/"
        INVENTORY_DIR = os.path.join(PATCHINPUT_DIR, 'inventory/')
        createFolder(INVENTORY_DIR)

        # fileJson = "{}inventory.json".format(INVENTORY_DIR)
        fileJson = os.path.join(INVENTORY_DIR, 'inventory.json')
        writeJSONfile(fileJson, data)
        # fileCSV = "{}inventory.csv".format(INVENTORY_DIR)
        fileCSV = os.path.join(INVENTORY_DIR, 'inventory.csv')
        # step 2: exported CSV format
        fileJson = pd.read_json(fileJson)
        exported_inventory_csv = fileJson.to_csv(fileCSV, index=False)

        return "Configuration file has been created"

    def patch_job_servers(self, job_id, serializer):
        data = []
        for row in serializer.data["server_list"]:
            try:
                patch_summary = PatchSummary(
                    patch_id=PatchDetail.objects.get(
                        patch_id=serializer.data["patch_id"]),
                    job_id=PatchJob.objects.get(job_id=job_id),
                    server_name=ServerDetail.objects.get(server_name=row),
                    patch_executiondate=serializer.data["actual_startdate"],
                    status="Scheduled",
                    kernel_version="NA"
                )
                patch_summary.save()
                data1 = {
                    'server_name': row,
                    # 'summary_id': patch_summary.summary_id,
                    'status': "Success"
                }
                data.append(data1)
            except IntegrityError:
                data1 = {
                    'server_name': row,
                    # 'summary_id': -1,
                    'status': "Failed due to duplicate"
                }
                data.append(data1)
            except ValidationError:
                data1 = {
                    'server_name': row,
                    # 'summary_id': -1,
                    'status': "Failed due to Null value"
                }
                data.append(data1)
            except ObjectDoesNotExist:
                data1 = {
                    'server_name': row,
                    # 'summary_id': -1,
                    'status': "Failed due to ForeignKey"
                }
                data.append(data1)
            except:
                data1 = {
                    'server_name': row,
                    # 'summary_id': -1,
                    'status': "Something went wrong"
                }
                data.append(data1)
        return data


class ConfigurationTemplateGet(APIView):
    def post(self, request, format=None):
        serializer = ConfigTemplateSerializer(data=request.data)
        if serializer.is_valid():
            technology_id = serializer.data["technology_id"]

            config_template_data, config_explanation_data = self.read_configuration_template(
                technology_id)
            body = {
                "statusCode": 200,
                "message": "success",
                "config_content": config_template_data,
                "editExplanation": config_explanation_data,
            }
            return Response(body, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def read_configuration_template(self, technology_id):
        query = '''SELECT account_name, 
                    smtp_mail_server, 
                    from_address 
                    FROM patch_management_globalconfig'''
        (account_name, smtp_mail_server, from_address) = (
            MySQLConnection.sqlOne(query))
        file_config_template = open(
            os.path.join(
                CONFIGFILE_DIR, f"{technology_id}.yml"
            ), "r"
        )
        config_template_data = file_config_template.read()
        config_template_data = re.sub(
            r"(?<=Account_Name:).*", r" {}".format(account_name), config_template_data
        )
        config_template_data = re.sub(
            r"(?<=Technology:).*", r" {}".format(technology_id), config_template_data
        )
        config_template_data = re.sub(
            r"(?<=SMTP_Mail_Server:).*", r" {}".format(smtp_mail_server), config_template_data
        )
        config_template_data = re.sub(
            r"(?<=From_Address:).*", r" {}".format(from_address), config_template_data
        )

        config_template_data = re.sub(
            r"(?<=Master_Server_Output_path:).*", r" {}".format(WORKING_DIR), config_template_data
        )

        file_config_template.close()
        file_config_explanation = open(
            os.path.join(
                PATCHSCRIPT_DIR, f"reference-configfile.yml"
            ), "r"
        )
        config_explanation_data = file_config_explanation.read()
        file_config_explanation.close()
        return config_template_data, config_explanation_data


class ValidationSummaryLogsGet(APIView):
    def post(self, request, format=None):
        serializer = ConfigPathSerializer(data=request.data)
        if serializer.is_valid():
            path = serializer.data["path"]
            validation_logs = read_validation_logs(path)
            body = {
                "statusCode": 200,
                "message": "success",
                "validation_logs": validation_logs,
            }
            return Response(body, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobLogsGet(APIView):
    def get(self, request, *args, **kwargs):
        validation_logs = read_validation_logs(get_task_logs(kwargs['job_id']))
        body = {
            "statusCode": 200,
            "message": "success",
            "validation_logs": validation_logs,
        }
        return Response(body, status=status.HTTP_200_OK)


class SettingMenuActiveAPIView(APIView):
    def get(self, request, format=None):
        menucount = 0
        query = '''WITH menu AS (
                    SELECT count(account_name) AS c  FROM patch_management_globalconfig 
                    UNION ALL
                    SELECT count(backup_server)  AS c FROM patch_management_backupserverdetail 
                    UNION ALL
                    SELECT count(monitor_server)  AS c FROM patch_management_monitorserverdetail 
                    ) SELECT SUM(IF(c = 0, 0, 1)) AS 'Sum' FROM menu'''
        (menucount,) = (MySQLConnection.sqlOne(query))

        return Response(menucount)


# @api_view(['GET'])
# def ActiveJobsAPIViewSet(request):
class ActiveJobsAPIViewSet(APIView):
    def get(self, request, format=None):
        header = ['job_id', 'change_no', 'planned_startdate',
                  'planned_enddate', 'actual_startdate', 'actual_enddate', 'patch_id', 'status']
        query = '''SELECT job.job_id, job.change_no, 
                    DATE_FORMAT(job.planned_startdate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.planned_enddate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.actual_startdate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.actual_enddate, "%d-%m-%Y %h:%i:%s %p"), 
                    job.patch_id_id, SUM.`status`
                    FROM patch_management_patchjob AS job 
                    INNER JOIN patch_management_patchsummary AS SUM ON job.job_id=SUM.job_id_id 
                    WHERE SUM.status IN ("Scheduled", "Running") 
                    GROUP BY job.job_id order by planned_startdate, job_id'''
        patchjob = MySQLConnection.sqlJson(query, header)

        return Response(patchjob)
