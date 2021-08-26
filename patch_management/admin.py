#from django.contrib import admin
# from django.contrib.auth.models import Group
from django.contrib.admin import AdminSite
import patch_management.linnet_apis.models as models
# Register your models here.

# admin.site.site_header = 'OpsMate Patch Management Master'
# admin.site.unregister(Group)
# admin.site.register(GlobalConfig)
# admin.site.register(BackupServerDetail)
# admin.site.register(MonitorServerDetail)
# admin.site.register(ServerDetail)
# admin.site.register(PatchDetail)




class MyAdminSite(AdminSite):
    site_header = 'OpsMate Patch Management Master'


admin_site = MyAdminSite(name='myadmin')
admin_site.register(models.GlobalConfig)
admin_site.register(models.BackupServerDetail)
admin_site.register(models.MonitorServerDetail)
admin_site.register(models.ServerDetail)
admin_site.register(models.PatchDetail)
admin_site.register(models.TechnologyDetail)
admin_site.register(models.SeverityRating)
admin_site.register(models.BusinessCriticality)
