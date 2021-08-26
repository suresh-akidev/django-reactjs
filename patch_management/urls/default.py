from django.urls import path
from patch_management.linnet_apis import views
from patch_management.linnet_apis import api_views
from patch_management.linnet_apis import api_reports
from patch_management.admin import admin_site
from django.conf.urls import url

URLPATTERN = [
    path('admin/', admin_site.urls),

    # api path for settings
    path('api/settings/', api_views.GlobalSettingView.as_view()),
    path('api/settings/get/', api_views.GlobalSettingViewSet.as_view()),
    path('api/settings/<str:account_name>/',
         api_views.GlobalSettingViewSet.as_view()),
    path('api/backup/', api_views.BackupServerView.as_view()),
    path('api/backup/get/', api_views.BackupServerViewSet.as_view()),
    path('api/backup/<str:backup_server>/',
         api_views.BackupServerViewSet.as_view()),
    path('api/monitor/', api_views.MonitorServerView.as_view()),
    path('api/monitor/get/', api_views.MonitorServerViewSet.as_view()),
    path('api/monitor/<str:monitor_server>/',
         api_views.MonitorServerViewSet.as_view()),

    path('api/servers/', api_views.ServerView.as_view()),
    path('api/servers/get/', api_views.ServerViewSet.as_view()),
    path('api/servers/technology/<str:technology_id>/',
         views.ServerTechViewSet.as_view()),
    path('api/servers/<str:server_name>/', api_views.ServerViewSet.as_view()),
    path('api/server/upload/', views.ServerUploadAPIView.as_view()),
    path('api/server/download/', views.ServerDownloadAPIView.as_view()),
    path('api/server/grouptechology/',
         api_views.ServerGroupTechAPIView.as_view()),
    path('api/server/techologyconfig/<str:type>/',
         views.TechnologyConfigAPIView.as_view()),

    path('api/patches/', api_views.PatchDetailView.as_view()),
    path('api/patches/get/', api_views.PatchDetailViewSet.as_view()),
    path('api/patches/<str:patch_id>/', api_views.PatchDetailViewSet.as_view()),
    path('api/patches/tech/<str:technology_id>/',
         api_views.PatchDetailTechViewSet.as_view()),
    path('api/patches/severity/<str:severity>/',
         api_views.PatchDetailSeverityViewSet.as_view()),

    path('api/technology/get/', api_views.TechnologyDetailViewSet.as_view()),
    path('api/technology/unique/get/', views.TechnologyDetailViewSet.as_view()),
    path('api/severity/get/', api_views.SeverityRatingViewSet.as_view()),
    path('api/criticality/get/', api_views.BusinessCriticalityViewSet.as_view()),

    path('api/itsm-api/', views.PatchApprovalItsmView.as_view()),
    url(r'^api/job-change/approval/(?P<pk>[\w-]+)/$',
        views.PatchApprovalView.as_view()),
    path('api/jobs/', api_views.PatchJobView.as_view()),
    path("api/configuration/template/retrieve/",
         views.ConfigurationTemplateGet.as_view()),
    path('api/scheduled/server/', api_views.SummaryWithScheduledViewSet.as_view()),
    path('api/scheduler/', views.SchedulerConfigAPIView.as_view()),

    path('api/activejobs/get/', views.ActiveJobsAPIViewSet.as_view()),
    path('api/jobs/get/', api_views.PatchJobViewSet.as_view()),
    path('api/jobs/<int:job_id>/', api_views.PatchJobViewSet.as_view()),


    path('api/summary/', api_views.PatchSummaryView.as_view()),
    path('api/summary/get/', api_views.PatchSummaryViewSet.as_view()),
    path('api/summary/<int:summary_id>/',
         api_views.PatchSummaryViewSet.as_view()),

    # url('^api/summary/job/(?P<job_id>.+)/$', api_views.SummaryWithJobViewSet.as_view()),
    path('api/summary/job/<int:job_id>/',
         api_views.SummaryWithJobViewSet.as_view()),
    path('api/summary/patch/<str:patch_id>/',
         api_views.SummaryWithPatchViewSet.as_view()),
    path('api/summary/server/<str:server_name>/',
         api_views.SummaryWithServersViewSet.as_view()),


    path('api/validation/job/<int:job_id>/server/<str:server_name>/',
         api_views.ValidationWithJobServerViewSet.as_view()),
    path("api/validation/retrieve/path/",
         views.ValidationSummaryLogsGet.as_view()),
    path("api/joblogs/retrieve/path/<int:job_id>/",
         views.JobLogsGet.as_view()),

    path('api/completedjobs/get/', api_reports.CompletedJobsAPIViewSet.as_view()),
    path('api/completedservers/get/',
         api_reports.CompletedServersAPIViewSet.as_view()),

    path('api/menuactive/', views.SettingMenuActiveAPIView.as_view()),
    path('api/dashboard/serverwise/<int:month>/',
         api_reports.DashboardMonthlyAPIViewSet.as_view()),
    path('api/dashboard/status/<str:type>/',
         api_reports.DashboardReportAPIViewSet.as_view()),
    path('api/dashboard/details/<str:type>/<int:month>/',
         api_reports.DashboardDetailsAPIViewSet.as_view()),

    path('api/excelreports/download/get/',
         api_reports.DownloadReportXlsxAPISet.as_view()),

    path('api/analytics/monthlyjobs/get/',
         api_reports.MonthlyJobsAPIViewSet.as_view()),
    path('api/analytics/monthlyjobs/joblist/',
         api_reports.MothlyJobListAPIViewSet.as_view()),
    path('api/analytics/monthlyjobs/serverlist/',
         api_reports.MothlyServerListAPIViewSet.as_view()),

]
