APP_NAME = 'APP_NAME'
PROTOCOL = 'https'
DOMAIN = 'my.domain'
ALLOWED_HOSTS = [DOMAIN, '127.0.0.1']
TIME_ZONE = 'Asia/Saigon'
EMAIL_ENABLE = True
ENV = 'LOCAL'  # 'LOCAL, PROD'
IMAGE_MAX_WIDTH = 1200
IMAGE_THUMBNAIL_WIDTH = 300
IMAGE_RATIO = 1.618
UPLOAD_MAX_SIZE = 4
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'docker',
        'USER': 'docker',
        'PASSWORD': 'docker',
        'HOST': 'db_service',
        'PORT': '5432',
        'TEST': {
            'NAME': 'docker_test',
        },
    },
}

FIRST_USER_USERNAME = 'admin'
FIRST_USER_PASSWORD = 'admin'
TEST_ADMIN = {
    'username': 'admin',
    'email': 'admin@gmail.com',
    'password': '1234567890',
    'first_name': 'First',
    'last_name': 'Admin'
}

DEFAULT_FROM_EMAIL = '"APP_NAME"<admin@gmail.com>'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587  # 587 - 465 for SSL
EMAIL_HOST_USER = 'admin@gmail.com'
EMAIL_HOST_PASSWORD = 'password'
EMAIL_USE_TLS = True
