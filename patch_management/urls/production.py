
from django.urls import re_path
from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

from OpsMate.auth_client.client import Client
from OpsMate import settings
from django.conf.urls.static import static
from .default import URLPATTERN

client = Client(settings.SSO_SERVER, settings.SSO_PUBLIC_KEY,
                settings.SSO_PRIVATE_KEY)


urlpatterns = [
    url(r"^client/", include(client.get_urls())),
] + URLPATTERN + [
    re_path('.*', login_required(login_url='/patches/client/')
            (TemplateView.as_view(template_name='index.html'))),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
