import os
from django.urls import path
from .views import (
    BannerListView,
    CCalendarListView,
    StaffListView,
    HomeArticleListView,
    ArticleListView,
    ArticleNewsListView,
    ArticleRetrieveView,
    ArticleRetrieveSingleView,
)


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('banner/', BannerListView.as_view()),
    path('ccalendar/', CCalendarListView.as_view()),
    path('staff/', StaffListView.as_view()),
    path('home-article/', HomeArticleListView.as_view()),
    path('article/', ArticleListView.as_view()),
    path('article-news/', ArticleNewsListView.as_view()),
    path('article-single/', ArticleRetrieveSingleView.as_view()),
    path('article/<int:pk>', ArticleRetrieveView.as_view()),
]
