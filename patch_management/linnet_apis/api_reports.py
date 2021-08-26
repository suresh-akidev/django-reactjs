from .signals import \
    monthly_jobs, download_report_xlsx, \
    server_wise, compliant_wise, compliance_wise

from .views import MySQLConnection
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, Http404
import os


class DownloadReportXlsxAPISet(APIView):
    def post(self, request, format=None):

        file_path = download_report_xlsx(
            request.POST["name"], request.POST["data"])
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(
                    fh.read(), content_type="application/vnd.ms-excel")
                response['Content-Disposition'] = 'inline; filename=' + \
                    os.path.basename(file_path)
                return response
        raise Http404


class CompletedJobsAPIViewSet(APIView):
    def post(self, request, format=None):
        header = ['job_id', 'change_no', 'planned_startdate',
                  'planned_enddate', 'actual_startdate', 'actual_enddate', 'patch_id']
        query = '''SELECT job.job_id, job.change_no, 
                    DATE_FORMAT(job.planned_startdate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.planned_enddate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.actual_startdate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.actual_enddate, "%d-%m-%Y %h:%i:%s %p"), 
                    job.patch_id_id
                    FROM patch_management_patchjob AS job 
                    INNER JOIN patch_management_patchsummary AS SUM ON job.job_id=SUM.job_id_id 
                    WHERE SUM.status not IN ("Scheduled", "Running") 
                    AND job.planned_startdate >= "{}" AND job.planned_startdate <= "{}" 
                    AND job.patch_id_id LIKE "{}"
                    GROUP BY job.job_id'''.format(request.POST["from_date"], request.POST["to_date"], request.POST["patch_id"])
        patchjob = MySQLConnection.sqlJson(query, header)

        return Response(patchjob)


class MonthlyJobsAPIViewSet(APIView):
    def post(self, request, format=None):
        header = ['myear', 'month', 'year']
        query = '''select DATE_FORMAT(m1, '%b %Y') AS myear, MONTHNAME(m1), YEAR(m1) FROM (
                    select ((now() - INTERVAL {}-1 MONTH) - INTERVAL DAYOFMONTH(now() - INTERVAL {}-1 MONTH)-1 DAY) +INTERVAL m MONTH as m1
                    FROM ( select @rownum:=@rownum+1 as m from
                    (select 1 union select 2 union select 3 union select 4) t1,
                    (select 1 union select 2 union select 3 union select 4) t2,
                    (select 1 union select 2 union select 3 union select 4) t3,
                    (select 1 union select 2 union select 3 union select 4) t4,
                    (select @rownum:=-1) t0 ) d1 ) d2 where m1<=NOW() ORDER BY m1 
                    '''.format(request.POST["interval"], request.POST["interval"])
        month = MySQLConnection.sqlJson(query, header)

        header = ['job_id', 'servers', 'pass', 'fail', 'month', 'myear']
        query = '''WITH s1 AS (
                    SELECT job_id_id AS job_id, 
                    COUNT(psum.status) AS servers,
                    sum(IF(psum.status = 'Success', 1, 0)) AS 'pass',
                    sum(IF(psum.status = 'Failed', 1, 0)) AS 'fail',
                    MONTHNAME(job.planned_startdate) as month,
                    DATE_FORMAT(job.planned_startdate, '%b %Y') AS myear from
                    patch_management_patchsummary AS psum 
                    JOIN patch_management_patchjob AS job ON job.job_id=psum.job_id_id AND 
                    job.planned_startdate > (now() - INTERVAL {} MONTH) 
                    WHERE psum.status IN ("Success","Failed") 
                    GROUP BY job_id_id ORDER BY job.planned_startdate)
                    SELECT COUNT(job_id), SUM(servers), SUM(pass), SUM(fail), month, myear FROM s1 
                    GROUP BY myear'''.format(request.POST["interval"])
        monthlyjob = MySQLConnection.sqlFullJson(query, header, 5)
        mjobs = monthly_jobs(month, monthlyjob)
        return Response(mjobs)


class MothlyJobListAPIViewSet(APIView):
    def post(self, request, format=None):
        header = ['job_id', 'change_no', 'planned_startdate',
                  'planned_enddate', 'actual_startdate', 'actual_enddate', 'patch_id']
        query = '''SELECT job.job_id, job.change_no, 
                    DATE_FORMAT(job.planned_startdate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.planned_enddate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.actual_startdate, "%d-%m-%Y %h:%i:%s %p"), 
                    DATE_FORMAT(job.actual_enddate, "%d-%m-%Y %h:%i:%s %p"), 
                    job.patch_id_id
                    FROM patch_management_patchjob AS job 
                    INNER JOIN  patch_management_patchsummary AS sum ON job.job_id=sum.job_id_id 
                    AND sum.status IN ("Success","Failed")
                    WHERE DATE_FORMAT(job.planned_startdate, "%b %Y") = "{}" 
                    GROUP BY job.job_id'''.format(request.POST["myear"])
        patchjob = MySQLConnection.sqlJson(query, header)

        return Response(patchjob)


class MothlyServerListAPIViewSet(APIView):
    def post(self, request, format=None):
        header = ['job_id', 'server_name', 'patch_id', 'patch_executiondate',
                  'status', 'kernel_version', 'status']
        query = '''SELECT job.job_id, sum.server_name_id, sum.patch_id_id, sum.patch_executiondate, 
                    sum.status, sum.kernel_version, sum.status
                    FROM patch_management_patchjob AS job 
                    INNER JOIN  patch_management_patchsummary AS sum ON job.job_id=sum.job_id_id 
                    AND sum.`status` IN ("Success","Failed")
                    WHERE DATE_FORMAT(job.planned_startdate, "%b %Y") = "{}"'''.format(request.POST["myear"])
        patchjob = MySQLConnection.sqlJson(query, header)

        return Response(patchjob)


class CompletedServersAPIViewSet(APIView):
    def post(self, request, format=None):
        header = ['job_id', 'server_name', 'patch_id', 'patch_executiondate',
                  'status', 'kernel_version', 'status']
        query = '''SELECT job.job_id, sum.server_name_id, sum.patch_id_id, sum.patch_executiondate, 
                    sum.status, sum.kernel_version, sum.status
                    FROM patch_management_patchjob AS job 
                    INNER JOIN  patch_management_patchsummary AS sum ON job.job_id=sum.job_id_id 
                    INNER JOIN patch_management_serverdetail AS ser ON ser.server_name = sum.server_name_id 
                    WHERE sum.status not IN ("Scheduled", "Running") 
                    AND job.planned_startdate >= "{}" AND job.planned_startdate <= "{}" 
                    AND ser.os_name LIKE "{}"'''.format(request.POST["from_date"], request.POST["to_date"], request.POST["technology"])
        patchjob = MySQLConnection.sqlJson(query, header)

        return Response(patchjob)


class DashboardReportAPIViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data = self.set_values(kwargs['type'])
        return Response(data)

    def set_values(self, argument):
        method = getattr(self, argument, lambda: "Invalid Table")
        return method()

    def compliant(self):
        header = ['technology_id', 'patch_id', 'patch_name', 'release_date',
                  'Compliant', 'NonCompliant', 'total']
        query = '''WITH
                cte1 AS (
                    SELECT max_patch.technology_id, patch.patch_id, patch.patch_name, max_patch.release_date FROM 
                    patch_management_patchdetail AS patch, 
                    (SELECT technology_id, MAX(release_date) AS release_date
                    FROM patch_management_patchdetail GROUP BY technology_id) AS max_patch 
                    WHERE patch.technology_id=max_patch.technology_id AND 
                    patch.release_date=max_patch.release_date),

                cte2 AS (
                    SELECT max_patch.patch_id_id, COUNT(max_patch.patch_id_id) AS count FROM
                        (SELECT a.patch_id_id, a.server_name_id FROM 
                        patch_management_patchsummary a,
                        patch_management_serverdetail AS b
                            WHERE b.STATUS='in-production' 
                                AND a.STATUS !='Failed' 
                                AND a.server_name_id=b.server_name
                                AND a.patch_id_id IN 
                                    (select patch_id from patch_management_patchdetail 
                                        where release_date IN 
                                        (select max(release_date) from patch_management_patchdetail 
                                        GROUP BY technology_id)
                                    )
                        GROUP BY a.patch_id_id, a.server_name_id) AS max_patch
                        GROUP BY max_patch.patch_id_id),

                cte3 AS (
                    SELECT b.technology_id AS tech, COUNT(b.technology_id) AS count FROM 
                    patch_management_serverdetail AS a,
                    patch_management_technologydetail AS b 
                    WHERE a.STATUS='in-production' AND a.os_name=b.technology_name
                    GROUP BY b.technology_id)

                SELECT cte1.*, 
                cte2.count AS NonCompliant, 
                (cte3.count-cte2.count) AS Compliant, 
                cte3.count AS total 
                FROM cte1 
                JOIN cte2 ON cte1.patch_id=cte2.patch_id_id
                JOIN cte3 ON cte1.technology_id=cte3.tech'''
        return compliant_wise(MySQLConnection.sqlJson(query, header))

    def compliance(self):
        header = ['Below45', 'Below60', 'Below90', "Above90"]
        query = '''SELECT 
                    SUM(IF(counts <= 45, 1, 0)) AS 'below45',
                    SUM(IF(counts > 45 AND counts <= 60, 1, 0)) AS 'below60',
                    SUM(IF(counts > 60 AND counts <= 90, 1, 0)) AS 'below90',
                    SUM(IF(counts > 90, 1, 0)) AS 'above90'
                    FROM (
                            SELECT server_name_id, MAX(patch_executiondate), 
                            DATEDIFF(NOW(), MAX(patch_executiondate)) AS 'counts' FROM 
                            patch_management_patchsummary WHERE STATUS !='Failed'
                            GROUP by server_name_id
                            ) AS cte1 '''
        value = MySQLConnection.sqlAll(query)
        return {
            "header": header,
            "value": value[0]
        }


class DashboardMonthlyAPIViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data = self.serverwise(kwargs['month'])
        return Response(data)

    def serverwise(self, month):
        header = ['status', 'count']
        query = '''SELECT max_patch.status as status, COUNT(max_patch.STATUS) AS count FROM
                        (SELECT STATUS, server_name_id, patch_id_id  FROM patch_management_patchsummary
                        WHERE DATE_FORMAT(patch_executiondate, '%Y %m %d') >= DATE_FORMAT(now() - INTERVAL {}-1 MONTH, '%Y %m 01')
                        GROUP BY STATUS, server_name_id, patch_id_id) AS max_patch
                    GROUP BY max_patch.STATUS
                    UNION all
                    SELECT "Servers" AS servers, COUNT(*) FROM 
                    patch_management_serverdetail 
                    WHERE STATUS='in-production' '''.format(month)
        return server_wise(MySQLConnection.sqlJson(query, header))


class DashboardDetailsAPIViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data = self.set_values(kwargs['type'], kwargs['month'])
        return Response(data)

    def set_values(self, type, month):
        method = getattr(self, type, lambda: "Invalid Table")
        return method(type, month)

    def ActiveJobs(self, type, month):
        return MySQLConnection.sqlJson(self.Query(type, month), self.Header())

    def Success(self, type, month):
        return MySQLConnection.sqlJson(self.Query(type, month), self.Header())

    def Failed(self, type, month):
        return MySQLConnection.sqlJson(self.Query(type, month), self.Header())

    def Header(self):
        return ['summary_id', 'job_id', 'server_name', 'patch_executiondate', 'patch_id']

    def Query(self, type, month):
        query = '''SELECT summary_id, job_id_id, server_name_id, 
                    DATE_FORMAT(max(patch_executiondate), "%d-%m-%Y %h:%i:%s %p"), patch_id_id FROM 
                    patch_management_patchsummary
                    WHERE DATE_FORMAT(patch_executiondate, '%Y %m %d') >= DATE_FORMAT(now() - INTERVAL {}-1 MONTH, '%Y %m 01')
                    AND status IN ({}) GROUP BY server_name_id, patch_id_id
                    '''.format(month, "'Scheduled','Running'" if type == "ActiveJobs" else "'{}'".format(type))
        return query

    def Running(self, type, month):
        return MySQLConnection.sqlJson(self.Query2(type), self.Header2())

    def Scheduled(self, type, month):
        return MySQLConnection.sqlJson(self.Query2(type), self.Header2())

    def Header2(self):
        return ['summary_id', 'job_id', 'server_name', 'patch_executiondate', 'patch_id']

    def Query2(self, type):
        query = '''SELECT summary_id, job_id_id, server_name_id, 
                    DATE_FORMAT(patch_executiondate, "%d-%m-%Y %h:%i:%s %p"), patch_id_id FROM
                    patch_management_patchsummary
                    WHERE status IN ('{}') ORDER BY patch_executiondate 
                    LIMIT 5 '''.format(type)
        return query
