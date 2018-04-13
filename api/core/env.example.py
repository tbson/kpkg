APP_NAME = 'Kpkg'
PROTOCOL = 'http'
DOMAIN = 'applier.dev'
ALLOWED_HOSTS = [DOMAIN, '127.0.0.1']
TIME_ZONE = 'Asia/Saigon'
EMAIL_ENABLE = True
ENV = 'LOCAL'  # 'LOCAL, PROD'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'applier',
        'USER': 'applier',
        'PASSWORD': 'applier',
        'HOST': '127.0.0.1',
        'PORT': '5432',
        'TEST': {
            'NAME': 'applier_test',
        },
    },
}

FIRST_USER_USERNAME = 'admin'
FIRST_USER_PASSWORD = 'admin'
TEST_ADMIN = {
    'username': 'applier',
    'email': 'applier@gmail.com',
    'password': 'applier',
    'first_name': 'Kpkg',
    'last_name': 'App'
}

DEFAULT_FROM_EMAIL = '"Kpkg App"<applier@gmail.com>'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587  # 587 - 465 for SSL
EMAIL_HOST_USER = 'applier@gmail.com'
EMAIL_HOST_PASSWORD = 'applier'
EMAIL_USE_TLS = True
