import os
from django.urls import path
from .views import (
    BannerViewSet,
)


baseEndPoint = BannerViewSet.as_view({
    'get': 'list',
    'post': 'add',
    'delete': 'delete_list'
})

pkEndpoint = BannerViewSet.as_view({
    'get': 'retrieve',
    'put': 'change',
    'delete': 'delete'
})


translationPKEndPoint = BannerViewSet.as_view({
    'put': 'change_translation',
})

app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('', baseEndPoint),
    path('<int:pk>', pkEndpoint),
    path('translation/<int:pk>', translationPKEndPoint),
]
