import os
from django.urls import path
from rest_framework_jwt.views import (
    obtain_jwt_token,
    refresh_jwt_token,
    verify_jwt_token,
)
from .views import (
    BaseEndPoint,
    PKEndPoint,
    ProfileView,
    ResetPasswordView,
    ChangePasswordView,
    ProfileView,
)


app_name = os.getcwd().split(os.sep)[-1]
urlpatterns = [
    path('token-auth/', obtain_jwt_token, name='login'),
    path('token-refresh/', refresh_jwt_token, name='refresh'),
    path('token-verify/', verify_jwt_token, name='verify'),

    path('', BaseEndPoint.as_view()),
    path('<int:pk>', PKEndPoint.as_view()),

    path('profile/', ProfileView.as_view(), name='profile'),
    path('reset-password/', ResetPasswordView.as_view(), name='resetPassword'),
    path('change-password/', ChangePasswordView.as_view(), name='changePassword'),
]
