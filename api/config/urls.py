import os
from django.urls import path
from .views import (
    MainViewSet,
)


baseEndPoint = MainViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'bulk_destroy'
})

pkEndpoint = MainViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('', baseEndPoint),
    path('<int:pk>', pkEndpoint),
]
