from __future__ import absolute_import, unicode_literals

import os
from datetime import timedelta

from celery import Celery
#from celery.schedules import crontab

#from OpsMate.settings import *
import OpsMate.settings as settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "OpsMate.settings")
CURR_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Celery("OpsMate")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.update(
    {
        "broker_url": f"amqp://{settings.AMQ_USER}:{settings.AMQ_PASS}@{settings.OpsTool_Host}:5672/{settings.AMQ_VHOST}",
        "task_serializer": "json",
        "result_serializer": "json",
        "accept_content": ["json"],
        "task_track_started": True,
        "result_expires": timedelta(weeks=1)
    }
)

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print("Request: {0!r}".format(self.request))
