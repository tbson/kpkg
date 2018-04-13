import os
from django.urls import path
from .views import (
    BaseEndPoint,
    PKEndPoint,
)


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('', BaseEndPoint.as_view()),
    path('<int:pk>', PKEndPoint.as_view()),
]
