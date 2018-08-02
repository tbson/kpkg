import os
from django.urls import path
from .views import (
    ArticleViewSet,
)


baseEndPoint = ArticleViewSet.as_view({
    'get': 'list',
    'post': 'add',
    'delete': 'delete_list'
})

pkEndpoint = ArticleViewSet.as_view({
    'get': 'retrieve',
    'put': 'change',
    'delete': 'delete'
})


translationPKEndPoint = ArticleViewSet.as_view({
    'put': 'change_translation',
})

app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('', baseEndPoint),
    path('<int:pk>', pkEndpoint),
    path('translation/<int:pk>', translationPKEndPoint),
]
