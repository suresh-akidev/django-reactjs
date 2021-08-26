#from .settings import *
import OpsMate.settings
SECRET_KEY = OpsMate.settings.SECRET_KEY
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
INSTALLED_APPS = OpsMate.settings.INSTALLED_APPS + [
    "tests",
]
