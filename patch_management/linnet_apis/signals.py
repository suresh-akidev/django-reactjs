
import csv
import io
import os
import shutil
import json
from patch_management.handlers.patch_job_handler import PatchJobHandler
import xlsxwriter
from .libs import WORKING_DIR, CONFIGFILE_DIR


def monthly_jobs(month, jobs):
    report = []
    categories = []
    servers = []
    job = []
    fail = []
    pasd = []

    for key in month:
        row_data = {}
        mon = key['myear']
        categories.append(mon)
        # print(mon)
        if mon in jobs.keys():
            row_data = {
                "job": jobs[mon]['job_id'],
                "servers": jobs[mon]['servers'],
                "pass": jobs[mon]['pass'],
                "fail": jobs[mon]['fail'],
                "percentage": ((jobs[mon]['pass']/jobs[mon]['servers'])*100),
                "myear": key["myear"],
                "month": key['month'],
                "year": key['year']
            }
            servers.append(jobs[mon]['servers'])
            job.append(jobs[mon]['job_id'])
            pasd.append(jobs[mon]['pass'])
            fail.append(jobs[mon]['fail'])
        else:
            row_data = {
                "job": 0,
                "servers": 0,
                "pass": 0,
                "fail": 0,
                "percentage": 0,
                "myear": key["myear"],
                "month": key['month'],
                "year": key['year']
            }
            servers.append(0)
            job.append(0)
            pasd.append(0)
            fail.append(0)
        # print(row_data)
        report.append(row_data)
    data = {
        "report": report,
        "categories": categories,
        "jobs": job,
        "servers": servers,
        "pass": pasd,
        "fail": fail,
    }
    return data


def compliant_wise(reader):
    total = []
    Compliant = []
    NonCompliant = []
    categories = []
    for row in reader:
        Compliant.append(row["Compliant"])
        NonCompliant.append(row["NonCompliant"])
        total.append(row["total"])
        categories.append(row["technology_id"])

    data = {
        "Compliant": Compliant,
        "NonCompliant": NonCompliant,
        "total": total,
        "categories": categories,
    }
    return data


def server_wise(reader):
    data = {}
    for row in reader:
        data[row["status"]] = row["count"]
    return data


def compliance_wise(reader):
    data = {}
    for row in reader:
        data["below45"] = row["below45"]
        data["below60"] = row["below60"]
        data["below90"] = row["below90"]
        data["above90"] = row["above90"]
    return data


def item_exists(items, master, sub):
    return master in items.keys() and sub in items[master].keys()


def get_item(items, master, sub):
    return items[master][sub] if item_exists(items, master, sub) else None


def convert_header(csvHeader):
    header_ = csvHeader[0]
    cols = [x.strip() for x in header_.split(",")]
    return cols


def csv_reader(csv_file):
    decoded_file = csv_file.read().decode('utf-8')
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string, delimiter=';', quotechar='|')
    header_ = next(reader)
    header_cols = convert_header(header_)
    parsed_items = []
    for line in reader:
        parsed_row_data = {}
        i = 0
        row_item = line[0].split(',')
        for item in row_item:
            key = header_cols[i]
            parsed_row_data[key] = item
            i += 1
        parsed_items.append(parsed_row_data)

    return parsed_items


def list_dictionaries_key(cols, reader, key):
    data = {}
    key_val = ""
    for row in reader:
        row_data = {}
        i = 0
        for item in row:
            col = cols[i]
            row_data[col] = item
            if (key == i):
                key_val = item
            i += 1
        row_data = {key_val: row_data}
        data.update(row_data)

    return (data)


def list_dictionaries(cols, reader):
    data = []
    for row in reader:
        row_data = {}
        i = 0
        for item in row:
            key = cols[i]
            row_data[key] = item
            i += 1
        data.append(row_data)

    return data


def serverDataformat(csv_file):
    data = []
    for row in csv_file:
        data1 = {
            'server_name': row['Server Name'],
            'ip_address': row['IP address'],
            'os_name': row['OS Name'],
            'criticality': row['Criticality'],
            'credential_path': row['Credential Path'],
            'backup_server': row['Backup Server'],
            'backup_enabled': booleanCheck(row['Backup Enabled']),
            'monitor_server': row['Monitoring Server'],
            'monitor_enabled': booleanCheck(row['Monitoring Enabled'])
        }
        data.append(data1)
    return data


def booleanCheck(val):
    ret = False
    if val.upper() == 'YES':
        ret = True
    elif val.upper() == 'TRUE':
        ret = True
    elif val == '1':
        ret = True
    elif val == 1:
        ret = True
    elif val == True:
        ret = True
    else:
        ret = False
    return (ret)


def readerValidationModel(val):
    data = []
    din = 0
    for row in val:
        row_data = {
            'key': "{}".format(din),
            'label': row['check_name'],
            'icon': "fa fa-folder",
            'title': row['check_name'],
            'children': [{
                'key': "{}-{}-1".format(din, din),
                'label': "Prepatch - {}".format(row['status']),
                'icon': "fa fa-file",
                'title': row['prepatch_outputpath'],
                'value': row['prepatch_outputpath'],
            },
                {
                'key': "{}-{}-2".format(din, din),
                'label': "Postpatch - {}".format(row['status']),
                'icon': "fa fa-file",
                'title': row['postpatch_outputpath'],
                'value': row['postpatch_outputpath'],
            }, ],
        }
        data.append(row_data)
        din += 1
    return (data)


def read_validation_logs(path):
    file_config_template = open(path, "r")
    validation_logs = file_config_template.read()
    file_config_template.close()

    return validation_logs


def patch_job_schedule(job_id):
    task_status = PatchJobHandler(job_id).task_celery_status
    return (task_status)


def revoke_job_schedule(job_id):
    task_status = PatchJobHandler.revoke_celery_job(job_id)
    return (task_status)


def get_task_logs(job_id):
    # path = PatchJobHandler.get_task_logs(job_id)
    path = "{}{}/artifacts/{}/stdout".format(WORKING_DIR, job_id, job_id)
    return (path)


def createFolder(folder_path):
    os.makedirs(folder_path, exist_ok=True)


def createFile(file_path):
    if not os.path.exists(file_path):
        with open(file_path, "w"):
            pass


def writeFile(filename, data):
    f = open(filename, "w")
    f.write(data)
    f.close()


def writeJSONfile(filename, data):
    with open(filename, "w") as outfile:
        json.dump(data, outfile)


def deleteFolder(folder_path):
    shutil.rmtree(folder_path, ignore_errors=True)


def xlsx_path(filename):
    file_path = os.path.join(CONFIGFILE_DIR, "f{}".format(filename))
    return file_path


def create_serverlist_xlsx(technology, criticality, backup, monitor):
    file_path = xlsx_path("server-template.xlsx")
    workbook = xlsxwriter.Workbook(file_path)
    worksheet = workbook.add_worksheet()
    header = (
        "Server Name",  # 0 A
        "IP address",  # 1 B
        "OS Name",  # 2 C
        "Criticality",  # 3 D
        "Credential Path",  # 4 E
        "Backup Enabled",  # 5 F
        "Backup Server",  # 6 G
        "Monitoring Enabled",  # 7 H
        "Monitoring Server"  # 8 I
    )
    col = 0

    for item in (header):
        worksheet.write(0, col, item)
        worksheet.set_column(col, col, len(item))
        col += 1

    for item in range(2, 500):
        worksheet.data_validation('C{}'.format(item), {
            'validate': 'list',
            'source': technology
        })
        worksheet.data_validation('D{}'.format(item), {
            'validate': 'list',
            'source': criticality
        })
        worksheet.data_validation('F{}'.format(item), {
            'validate': 'list',
            'source': [True, False]
        })
        worksheet.data_validation('G{}'.format(item), {
            'validate': 'list',
            'source': backup
        })
        worksheet.data_validation('H{}'.format(item), {
            'validate': 'list',
            'source': [True, False]
        })
        worksheet.data_validation('I{}'.format(item), {
            'validate': 'list',
            'source': monitor
        })

    workbook.close()
    return file_path


def download_report_xlsx(reportname, data):
    file_path = xlsx_path("{}.xlsx".format(reportname))
    workbook = xlsxwriter.Workbook(file_path)
    worksheet = workbook.add_worksheet()

    col = 0
    for item in (data[0].keys()):
        worksheet.write(0, col, item)
        # worksheet.set_column(col, col, len(item))
        col += 1
    row = 1
    for row_data in (data):
        col = 0
        for item in row_data:
            worksheet.write(row, col, item)
            col += 1
    workbook.close()
    return file_path
