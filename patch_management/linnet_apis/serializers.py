from rest_framework import serializers
from .models \
    import GlobalConfig,\
    BackupServerDetail,\
    MonitorServerDetail,\
    ServerDetail,\
    PatchSummary,\
    PatchDetail,\
    TechnologyDetail,\
    SeverityRating,\
    BusinessCriticality,\
    PatchJob,\
    ValidationSummary


class GlobalConfigSerializers(serializers.ModelSerializer):
    class Meta:
        model = GlobalConfig
        # fields = ['account_name', 'smtp_mail_server', 'from_address', 'timezone', 'itsm_api_url']
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class MonitorServerDetailSerializers(serializers.ModelSerializer):
    class Meta:
        model = MonitorServerDetail
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class BackupServerDetailSerializers(serializers.ModelSerializer):
    class Meta:
        model = BackupServerDetail
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ServerDetailSerializers(serializers.ModelSerializer):
    class Meta:
        model = ServerDetail
        # fields = ['server_name', 'ip_address', 'os_name', 'credential_path', 'backup_server', 'backup_enabled', 'monitor_server', 'monitor_enabled' ]
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


# class ServerUploadSerializer(serializers.Serializer):
#     file = serializers.FileField()

#     class Meta:
#         fields = ('file',)

#     def validate_agree_terms(self, value):
#         if not value:
#             raise serializers.ValidationError("Validation error")
#         return value


class PatchDetailSerializers(serializers.ModelSerializer):
    class Meta:
        model = PatchDetail
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class PatchJobSerializers(serializers.ModelSerializer):
    class Meta:
        model = PatchJob
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class TechnologySerializers(serializers.ModelSerializer):
    class Meta:
        model = TechnologyDetail
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class SeverityRatingSerializers(serializers.ModelSerializer):
    class Meta:
        model = SeverityRating
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class BusinessCriticalitySerializers(serializers.ModelSerializer):
    class Meta:
        model = BusinessCriticality
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ScheduledSummarySerializers(serializers.ModelSerializer):
    class Meta:
        model = PatchSummary
        fields = fields = ['server_name']


class PatchSummarySerializers(serializers.ModelSerializer):
    class Meta:
        model = PatchSummary
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ValidationSummarySerializers(serializers.ModelSerializer):
    class Meta:
        model = ValidationSummary
        fields = '__all__'

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class SchedulerSerializers(serializers.Serializer):
    change_no = serializers.CharField()
    planned_startdate = serializers.DateTimeField()
    planned_enddate = serializers.DateTimeField()
    actual_startdate = serializers.DateTimeField()
    actual_enddate = serializers.DateTimeField()
    patch_id = serializers.CharField()

    technology_id = serializers.CharField()
    config_content = serializers.CharField()

    server_list = serializers.ListField(child=serializers.CharField())

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ConfigTemplateSerializer(serializers.Serializer):
    technology_id = serializers.CharField()

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ConfigurationSerializer(serializers.Serializer):
    technology_id = serializers.CharField()
    configuration_template = serializers.CharField()

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ConfigPathSerializer(serializers.Serializer):
    path = serializers.CharField()

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class ServerGroupTechSerializer(serializers.Serializer):
    os_name = serializers.CharField()
    technology_name = serializers.CharField()

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class TechnologyCloneSerializer(serializers.Serializer):
    technology_id = serializers.CharField()
    technology_name = serializers.CharField()

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


class TechnologyEditSerializer(serializers.Serializer):
    technology_name = serializers.CharField()
    id = serializers.IntegerField()

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Validation error")
        return value


# class TechnologyAddSerializer(serializers.Serializer):

#     technology_id = serializers.CharField()
#     technology_name = serializers.CharField()
#     file_upload = serializers.FileField()

#     def validate_agree_terms(self, value):
#         if not value:
#             raise serializers.ValidationError("Validation error")
#         return value
