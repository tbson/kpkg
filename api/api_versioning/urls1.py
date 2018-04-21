import os
from django.urls import path, include


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path(
        'admin/',
        include('administrator.urls', namespace='administrator'),
    ),
    path(
        'permission/',
        include('permission.urls', namespace='permission'),
    ),
    path(
        'group/',
        include('group.urls', namespace='group'),
    ),
    path(
        'config/',
        include('config.urls', namespace='config'),
    ),
    path(
        'category/',
        include('category.urls', namespace='category'),
    ),
    path(
        'banner/',
        include('banner.urls', namespace='banner'),
    ),
    path(
        'article/',
        include('article.urls', namespace='article'),
    ),
    path(
        'attach/',
        include('attach.urls', namespace='attach'),
    ),
    path(
        'landing/',
        include('landing_api.urls', namespace='landing_api'),
    ),
]

