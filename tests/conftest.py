import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "OpsMate.testing")
os.environ.setdefault("opstool_host", "opstool-host")
os.environ.setdefault("VAULT_ADDR", "VAULT_ADDR")
os.environ.setdefault("VAULT_TOKEN", "VAULT_TOKEN")
os.environ.setdefault("AMQ_USER", "AMQ_USER")
os.environ.setdefault("AMQ_PASS", "AMQ_PASS")
os.environ.setdefault("AMQ_VHOST", "AMQ_VHOST")
os.environ.setdefault("REACT_APP_OPSTOOL_HOST", "https://localhost")

import pytest
import django
from .fixtures import *
 
def pytest_configure(config):
    django.setup()