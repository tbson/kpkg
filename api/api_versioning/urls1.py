import os
from django.urls import path, include


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = (
    path(
        'admin/',
        include('apps.administrator.urls', namespace='administrator'),
    ),
    path(
        'permission/',
        include('apps.permission.urls', namespace='permission'),
    ),
    path(
        'group/',
        include('apps.group.urls', namespace='group'),
    ),
    path(
        'config/',
        include('apps.config.urls', namespace='config'),
    ),
    path(
        'category/',
        include('apps.category.urls', namespace='category'),
    ),
    path(
        'banner/',
        include('apps.banner.urls', namespace='banner'),
    ),
    path(
        'article/',
        include('apps.article.urls', namespace='article'),
    ),
    path(
        'attach/',
        include('apps.attach.urls', namespace='attach'),
    ),
    path(
        'ccalendar/',
        include('apps.ccalendar.urls', namespace='ccalendar'),
    ),
    path(
        'tag/',
        include('apps.tag.urls', namespace='tag'),
    ),
    path(
        'staff/',
        include('apps.staff.urls', namespace='staff'),
    ),
    path(
        'landing/',
        include('apps.landing_api.urls', namespace='landing_api'),
    ),
)

