
from .libs import *
from .models import \
    GlobalConfig,\
    BackupServerDetail,\
    MonitorServerDetail,\
    ServerDetail,\
    PatchSummary,\
    PatchDetail,\
    TechnologyDetail,\
    SeverityRating,\
    BusinessCriticality,\
    PatchJob, ValidationSummary
from .serializers import \
    GlobalConfigSerializers,\
    BackupServerDetailSerializers,\
    MonitorServerDetailSerializers,\
    ServerDetailSerializers,\
    PatchSummarySerializers,\
    ServerGroupTechSerializer,\
    PatchDetailSerializers,\
    TechnologySerializers,\
    SeverityRatingSerializers,\
    BusinessCriticalitySerializers,\
    PatchJobSerializers,\
    ScheduledSummarySerializers,\
    ValidationSummarySerializers
from .signals import \
    deleteFolder, revoke_job_schedule

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# from datetime import datetime
from django.db.models import ProtectedError, Q, Count


class GlobalSettingView(generics.ListCreateAPIView):
    queryset = GlobalConfig.objects.all()
    serializer_class = GlobalConfigSerializers
    # permission_classes = (IsAdminOrReadOnly, )


class GlobalSettingViewSet(APIView):

    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = GlobalConfig.objects.all()
            serializer = GlobalConfigSerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                GlobalConfig, pk=kwargs['account_name'])
            serializer = GlobalConfigSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(
            GlobalConfig, pk=kwargs['account_name'])
        serializer = GlobalConfigSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(GlobalConfigSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(
                GlobalConfig, pk=kwargs['account_name'])
            data_object.delete()
            return Response("Global Config deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': str(e)})


class BackupServerView(generics.ListCreateAPIView):
    queryset = BackupServerDetail.objects.filter(status='in-production')
    serializer_class = BackupServerDetailSerializers


class BackupServerViewSet(APIView):

    # def post(self, request, format=None):
    #     data_object = BackupServerDetail.objects.all()
    #     serializer = BackupServerDetailSerializers(data_object, many=True)
    #     return Response(serializer.data)

    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = BackupServerDetail.objects.filter(
                status='in-production')
            serializer = BackupServerDetailSerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                BackupServerDetail, pk=kwargs['backup_server'])
            serializer = BackupServerDetailSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(
            BackupServerDetail, pk=kwargs['backup_server'])
        serializer = BackupServerDetailSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(BackupServerDetailSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(
                BackupServerDetail, pk=kwargs['backup_server'])
            data_object.delete()
            return Response("Backup Server deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': "Cannot delete!! Backup has enabled with this Server"})


class MonitorServerView(generics.ListCreateAPIView):
    queryset = MonitorServerDetail.objects.filter(status='in-production')
    serializer_class = MonitorServerDetailSerializers


class MonitorServerViewSet(APIView):

    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = MonitorServerDetail.objects.filter(
                status='in-production')
            serializer = MonitorServerDetailSerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                MonitorServerDetail, pk=kwargs['monitor_server'])
            serializer = MonitorServerDetailSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(
            MonitorServerDetail, pk=kwargs['monitor_server'])
        serializer = MonitorServerDetailSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(MonitorServerDetailSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(
                MonitorServerDetail, pk=kwargs['monitor_server'])
            data_object.delete()
            return Response("Monitor Server deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': "Cannot delete!! Monitoring has enabled with this Server"})


class ServerView(generics.ListCreateAPIView):
    queryset = ServerDetail.objects.filter(status='in-production')
    serializer_class = ServerDetailSerializers


class ServerViewSet(APIView):
    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = ServerDetail.objects.filter(status='in-production')
            serializer = ServerDetailSerializers(data_object, many=True)
            return Response(serializer.data)
        else:
            data_object = get_object_or_404(
                ServerDetail, pk=kwargs['server_name'], status='in-production')
            serializer = ServerDetailSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(
            ServerDetail, pk=kwargs['server_name'], status='in-production')
        serializer = ServerDetailSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(ServerDetailSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        if ((self.check_server_schedule(kwargs['server_name'])) == 0):
            try:
                data_object = get_object_or_404(
                    ServerDetail, pk=kwargs['server_name'])
                data_object.delete()
                return Response("Server Detail deleted", status=status.HTTP_204_NO_CONTENT)
            except ProtectedError as e:
                data_object = ServerDetail.objects.filter(
                    pk=kwargs['server_name']).first()
                serializer = ServerDetailSerializers(
                    data_object, data={'status': 'decommissioned'}, partial=True)
                if serializer.is_valid():
                    data_object = serializer.save()
                    return Response("Server Detail deleted", status=status.HTTP_204_NO_CONTENT)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': "Cannot delete!! Job has been scheduled/Running for Server"})

    def check_server_schedule(self, server_name):
        # data_object = PatchSummary.objects.filter(server_name=server_name).filter(status__in=["Scheduled", "Running"])
        data_object = PatchSummary.objects.filter(server_name=server_name).filter(
            Q(status="Scheduled") | Q(status="Running"))
        serializer = PatchSummarySerializers(data_object, many=True)
        return (len(serializer.data))


class ServerGroupTechAPIView(APIView):
    def get(self, request, format=None):
        data = ServerDetail.objects.values(
            'os_name').annotate(dcount=Count('os_name'))
        return Response(data)

    def post(self, request, format=None):
        serializer = ServerGroupTechSerializer(data=request.data)
        if serializer.is_valid():
            os_name = ServerDetail.objects.filter(os_name=serializer.data["os_name"]).update(
                os_name=serializer.data["technology_name"])
            return Response(data={"{} Server(s) has been updated".format(os_name)})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatchDetailView(generics.ListCreateAPIView):
    queryset = PatchDetail.objects.all()
    serializer_class = PatchDetailSerializers


class PatchDetailViewSet(APIView):

    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = PatchDetail.objects.all().order_by('-release_date')
            serializer = PatchDetailSerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(PatchDetail, pk=kwargs['patch_id'])
            serializer = PatchDetailSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(PatchDetail, pk=kwargs['patch_id'])
        serializer = PatchDetailSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(PatchDetailSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(PatchDetail, pk=kwargs['patch_id'])
            data_object.delete()
            return Response("Patch Detail deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': "Cannot delete!! Patch has been scheduled for Servers"})


class PatchDetailTechViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = PatchDetail.objects.filter(
            technology_id=kwargs['technology_id'])
        serializer = PatchDetailSerializers(data_object, many=True)
        return Response(serializer.data)


class PatchDetailSeverityViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = PatchDetail.objects.filter(
            severity=kwargs['severity'])
        serializer = PatchDetailSerializers(data_object, many=True)
        return Response(serializer.data)


class TechnologyDetailView(generics.ListCreateAPIView):
    queryset = TechnologyDetail.objects.all()
    serializer_class = TechnologySerializers


class TechnologyDetailViewSet(APIView):
    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = TechnologyDetail.objects.all()
            serializer = TechnologySerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                TechnologyDetail, pk=kwargs['technology_id'])
            serializer = TechnologySerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(
            TechnologyDetail, pk=kwargs['technology_id'])
        serializer = TechnologySerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(TechnologySerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(
                TechnologyDetail, pk=kwargs['technology_id'])
            data_object.delete()
            return Response("Technology Detail deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': str(e)})


class SeverityRatingView(generics.ListCreateAPIView):
    queryset = SeverityRating.objects.all()
    serializer_class = SeverityRatingSerializers


class SeverityRatingViewSet(APIView):
    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = SeverityRating.objects.all()
            serializer = SeverityRatingSerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                SeverityRating, pk=kwargs['severity'])
            serializer = SeverityRatingSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(SeverityRating, pk=kwargs['severity'])
        serializer = SeverityRatingSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(SeverityRatingSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(
                SeverityRating, pk=kwargs['severity'])
            data_object.delete()
            return Response("Severity Rating deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': str(e)})


class BusinessCriticalityView(generics.ListCreateAPIView):
    queryset = BusinessCriticality.objects.all()
    serializer_class = BusinessCriticalitySerializers


class BusinessCriticalityViewSet(APIView):
    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = BusinessCriticality.objects.all()
            serializer = BusinessCriticalitySerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                BusinessCriticality, pk=kwargs['criticality'])
            serializer = BusinessCriticalitySerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(
            BusinessCriticality, pk=kwargs['criticality'])
        serializer = BusinessCriticalitySerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(BusinessCriticalitySerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            data_object = get_object_or_404(
                BusinessCriticality, pk=kwargs['criticality'])
            data_object.delete()
            return Response("Business Criticality deleted", status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            return Response(status=status.HTTP_423_LOCKED, data={'detail': str(e)})


class PatchJobView(generics.ListCreateAPIView):
    queryset = PatchJob.objects.all()
    serializer_class = PatchJobSerializers


class PatchJobViewSet(APIView):
    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = PatchJob.objects.all()
            serializer = PatchJobSerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(PatchJob, pk=kwargs['job_id'])
            serializer = PatchJobSerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(PatchJob, pk=kwargs['job_id'])
        serializer = PatchJobSerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(PatchJobSerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        if((self.check_server_schedule(kwargs['job_id'])) == 0):
            return Response(status=status.HTTP_423_LOCKED, data={'detail': "Scheduled Job is running which can't able to delete now"})
        else:
            if (PatchJobDelete.deleteJob(self, kwargs['job_id'])):
                return Response("Patch Job deleted", status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_423_LOCKED, data={'detail': "Something went wrong"})

    def check_server_schedule(self, job_id):
        data_object = PatchSummary.objects.filter(
            job_id=job_id, status="Scheduled")
        serializer = PatchSummarySerializers(data_object, many=True)
        return (len(serializer.data))


class PatchJobDelete:
    def deleteJob(self, job_id):
        try:
            # data_object = get_list_or_404(PatchSummary, job_id=job_id)
            data_object = PatchSummary.objects.filter(job_id=job_id)
            data_object.delete()

            data_object = get_object_or_404(PatchJob, job_id=job_id)
            data_object.delete()

            PatchJobDelete.delete_configuration_template(self, job_id)

            revoke_job_schedule(job_id)
            return True
        except:
            return False

    def delete_configuration_template(self, job_id):
        # JOBID_DIR = WORKING_DIR + "/{}/".format(job_id)
        JOBID_DIR = os.path.join(WORKING_DIR, '{}/'.format(job_id))
        deleteFolder(JOBID_DIR)


class PatchSummaryView(generics.ListCreateAPIView):
    queryset = PatchSummary.objects.all()
    serializer_class = PatchSummarySerializers


class PatchSummaryViewSet(APIView):
    def get(self, request, *args, **kwargs):
        if (len(kwargs) == 0):
            data_object = PatchSummary.objects.all()
            serializer = PatchSummarySerializers(data_object, many=True)
        else:
            data_object = get_object_or_404(
                PatchSummary, pk=kwargs['summary_id'])
            serializer = PatchSummarySerializers(data_object)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        data_object = get_object_or_404(PatchSummary, pk=kwargs['summary_id'])
        serializer = PatchSummarySerializers(
            data_object, data=request.data, partial=True)
        if serializer.is_valid():
            data_object = serializer.save()
            return Response(PatchSummarySerializers(data_object).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        data_object = get_object_or_404(PatchSummary, pk=kwargs['summary_id'])
        data_object.delete()
        return Response("Patch Summary deleted", status=status.HTTP_204_NO_CONTENT)


class SummaryWithScheduledViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = PatchSummary.objects.filter(status="Scheduled")
        serializer = ScheduledSummarySerializers(data_object, many=True)
        return Response(serializer.data)


class SummaryWithJobViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = PatchSummary.objects.filter(job_id=kwargs['job_id'])
        serializer = PatchSummarySerializers(data_object, many=True)
        return Response(serializer.data)


class SummaryWithPatchViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = PatchSummary.objects.filter(patch_id=kwargs['patch_id'])
        serializer = PatchSummarySerializers(data_object, many=True)
        return Response(serializer.data)


class SummaryWithServersViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = PatchSummary.objects.filter(
            server_name=kwargs['server_name'])
        serializer = PatchSummarySerializers(data_object, many=True)
        return Response(serializer.data)


class PatchComplaintReportSet(APIView):
    def get(self, request, *args, **kwargs):
        # order_by('release_date').desc().first()
        # data_object = PatchDetail.objects.all().order_by('-release_date').first()
        data_object = PatchDetail.objects.filter(
            patch_id="*").order_by('-release_date').first()
        serializer = PatchDetailSerializers(data_object, many=True)
        # data_object = PatchSummary.objects.filter(status="Scheduled")
        # serializer = ScheduledSummarySerializers(data_object, many=True)
        return Response(serializer.data)


class ValidationWithJobServerViewSet(APIView):
    def get(self, request, *args, **kwargs):
        data_object = ValidationSummary.objects.filter(
            job_id=kwargs['job_id'], server_name=kwargs['server_name'])
        serializer = ValidationSummarySerializers(data_object, many=True)
        return Response(serializer.data)
