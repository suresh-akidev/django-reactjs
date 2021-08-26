from .default import *


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'patches',
        'USER': 'mysqluser',
        'PASSWORD': 'mysqlpassword',
        'HOST': '127.0.0.1',
        'PORT': '3306'
    }
}


CORS_ORIGIN_WHITELIST = [

    "http://localhost:3000",
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3001",

]

STATIC_URL = '/patches/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'patch_frontend/build/static')
]
