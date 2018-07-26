import os
from django.urls import path
from .views import (
    BaseEndPoint,
    PKEndPoint,
    TranslationPKEndPoint,
)


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('', BaseEndPoint.as_view()),
    path('<int:pk>', PKEndPoint.as_view()),
    path('translation/<int:pk>', TranslationPKEndPoint.as_view()),
]
