from django.db import models


class GlobalConfig(models.Model):
    account_name = models.CharField(
        max_length=50, primary_key=True, blank=True)
    smtp_mail_server = models.CharField(max_length=50, blank=True)
    from_address = models.CharField(max_length=50, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    itsm_api_url = models.CharField(max_length=50, blank=True)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.account_name


class SeverityRating(models.Model):
    severity = models.CharField(max_length=50, primary_key=True)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.severity


class BusinessCriticality(models.Model):
    criticality = models.CharField(max_length=50, primary_key=True)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.criticality


class BackupServerDetail(models.Model):
    backup_server = models.CharField(
        max_length=50, primary_key=True, blank=True)
    server_ip = models.CharField(max_length=50, blank=True)
    status = models.CharField(
        max_length=50, default='in-production', blank=True)
    backup_url = models.CharField(max_length=50, blank=True)
    account_name = models.ForeignKey(GlobalConfig, on_delete=models.PROTECT)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.backup_server


class MonitorServerDetail(models.Model):
    monitor_server = models.CharField(
        max_length=50, primary_key=True, blank=True)
    server_ip = models.CharField(max_length=50, blank=True)
    status = models.CharField(
        max_length=50, default='in-production', blank=True)
    monitor_url = models.CharField(max_length=50, blank=True)
    account_name = models.ForeignKey(GlobalConfig, on_delete=models.PROTECT)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.monitor_server


class ServerDetail(models.Model):
    server_name = models.CharField(max_length=50, primary_key=True, blank=True)
    ip_address = models.CharField(max_length=50, blank=True)
    os_name = models.CharField(max_length=50, blank=True)
    status = models.CharField(
        max_length=50, default='in-production', blank=True)
    criticality = models.ForeignKey(
        BusinessCriticality, on_delete=models.PROTECT)
    credential_path = models.CharField(max_length=50, blank=True)
    backup_server = models.ForeignKey(
        BackupServerDetail, on_delete=models.PROTECT)
    backup_enabled = models.BooleanField(default=False)
    monitor_server = models.ForeignKey(
        MonitorServerDetail, on_delete=models.PROTECT)
    monitor_enabled = models.BooleanField(default=False)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.server_name


class PatchDetail(models.Model):
    patch_id = models.CharField(max_length=25, primary_key=True, blank=True)
    patch_name = models.CharField(max_length=50)
    severity = models.ForeignKey(SeverityRating, on_delete=models.PROTECT)
    release_date = models.DateField(blank=True)
    technology_id = models.CharField(max_length=25, blank=True)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.patch_id


class PatchJob(models.Model):
    job_id = models.AutoField(primary_key=True)
    change_no = models.CharField(max_length=10)
    planned_startdate = models.DateTimeField(blank=True)
    planned_enddate = models.DateTimeField(blank=True)
    actual_startdate = models.DateTimeField(blank=True)
    actual_enddate = models.DateTimeField(blank=True)
    patch_id = models.ForeignKey(PatchDetail, on_delete=models.PROTECT)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)


class PatchSummary(models.Model):
    summary_id = models.AutoField(primary_key=True)
    patch_id = models.ForeignKey(PatchDetail, on_delete=models.PROTECT)
    job_id = models.ForeignKey(PatchJob, on_delete=models.PROTECT)
    server_name = models.ForeignKey(ServerDetail, on_delete=models.PROTECT)
    patch_executiondate = models.DateTimeField(blank=True)
    status = models.CharField(max_length=10, blank=True)
    kernel_version = models.CharField(max_length=50)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)


class ValidationSummary(models.Model):
    validation_id = models.AutoField(primary_key=True)
    patch_id = models.ForeignKey(PatchDetail, on_delete=models.PROTECT)
    job_id = models.ForeignKey(PatchJob, on_delete=models.PROTECT)
    server_name = models.ForeignKey(ServerDetail, on_delete=models.PROTECT)
    check_name = models.CharField(max_length=50)
    status = models.CharField(max_length=10, blank=True)
    prepatch_outputpath = models.CharField(max_length=150)
    postpatch_outputpath = models.CharField(max_length=150)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)


class TechnologyDetail(models.Model):
    technology_id = models.CharField(max_length=25, blank=True)
    technology_name = models.CharField(max_length=50)
    created_by = models.CharField(
        max_length=50, default='Admin', editable=False)
    created_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.technology_name
