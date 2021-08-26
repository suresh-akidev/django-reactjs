from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.urls import re_path
from .default import URLPATTERN

urlpatterns = URLPATTERN + [
    # --- Trung Doan: created for testing
    # path('api/jobs/execute', api_jobs.JobExecutionViewSet.as_view()),
    # --- End comment

    re_path('.*', TemplateView.as_view(template_name='index.html')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
