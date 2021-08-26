from patch_management.linnet_apis.libs import *
from patch_management.linnet_apis.serializers import *
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from patch_management import tasks
from patch_management.handlers import patch_job_handler


class JobExecutionViewSet(APIView):
    def post(self, request, format=None):
        if (bool('job_id' in request.data) == False):
            body = {
                "message": "Please provide jod_id in payload"
            }

            return Response(body, status=status.HTTP_404_NOT_FOUND)

        else:
            job_id = request.data['job_id']
            patchJobHandler = patch_job_handler.PatchJobHandler(job_id)
            task_status = patchJobHandler.run_task_celery(job_id)

        return Response(task_status, status=status.HTTP_200_OK)
