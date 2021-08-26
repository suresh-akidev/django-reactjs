from .default import *


# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # for Patchmanagement
        'NAME': 'opsmate',
        'USER': 'mysqluser',
        'PASSWORD': 'mysqlpassword',
        'HOST': 'opstool-mariadb',
        'PORT': '3306'
    }
}


# Prod env static settings
OpsTool_Host = os.environ['opstool_host']

STATIC_LOCATION = "patches/static/"
STATIC_URL = f"https://{OpsTool_Host}/{STATIC_LOCATION}/"
STATIC_ROOT = "/opt/app/static/patchmanagement"
STATICFILES_DIRS = (os.path.join(BASE_DIR, "patch_frontend/build/static/"),)

# ---------------------


CORS_ORIGIN_WHITELIST = [

    f"https://{OpsTool_Host}",

]


# celery setting.
CELERY_CACHE_BACKEND = "celery"
CELERY_RESULT_BACKEND = "django-db"
CELERY_TIMEZONE = "Etc/UTC"
DJANGO_CELERY_RESULTS_TASK_ID_MAX_LENGTH = 191

# SSO Settings

SSO_PRIVATE_KEY = "6DklVQeqH7JPABC9vOAvQVflDzPaUtS1etlUMQ4incNuAuXEWHVsj7xQ6ksnzlV1"
SSO_PUBLIC_KEY = "m6ewSQEqKwess4uf6UnjAiuOmQExngwc8ICPibqkqgHtG9e9fvLKJXRkdDHS6OT4"

SSO_SERVER = "https://" + OpsTool_Host + "/server/"
# Default Login Page
LOGIN_REDIRECT_URL = "/"
LOGIN_URL = "https://" + OpsTool_Host + "/login/"
LOGOUT_URL = "https://" + OpsTool_Host + "/logout/"

# RabbitMQ
AMQ_USER = os.environ['AMQ_USER']
AMQ_PASS = os.environ['AMQ_PASS']
AMQ_VHOST = os.environ['AMQ_VHOST']

# ----------Vault - HVAC API
# Production
VAULT_ADDR = os.environ['VAULT_ADDR']
VAULT_TOKEN = os.environ['VAULT_TOKEN']
