import os
from django.urls import path
from .views import (
    BannerListView,
    ArticleListView,
    ArticleRetrieveView,
    ArticleRetrieveSingleView,
)


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('banner/', BannerListView.as_view()),
    path('article/', ArticleListView.as_view()),
    path('article-single/', ArticleRetrieveSingleView.as_view()),
    path('article/<int:pk>', ArticleRetrieveView.as_view()),
]
