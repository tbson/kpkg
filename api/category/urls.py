import os
from django.urls import path
from .views import (
    CategoryViewSet,
)


baseEndPoint = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'destroy_list'
})

pkEndpoint = CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('', baseEndPoint),
    path('<int:pk>', pkEndpoint),
]
