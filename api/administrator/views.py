from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .models import Administrator
from .serializers import (
    AdministratorBaseSerializer,
    AdministratorRetrieveSerializer,
    AdministratorCreateSerializer,
    AdministratorUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.conf import settings
from utils.helpers.res_tools import getToken
from utils.helpers.tools import Tools


class ListView(ListAPIView):
    permissions = ['view_administrator_list']
    permission_classes = [CustomPermission]
    queryset = Administrator.objects.all()
    serializer_class = AdministratorRetrieveSerializer
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']


class DetailView(RetrieveAPIView):
    permissions = ['view_administrator_detail']
    permission_classes = [CustomPermission]
    queryset = Administrator.objects.all()
    serializer_class = AdministratorRetrieveSerializer


class CreateView(CreateAPIView):
    permissions = ['add_administrator']
    permission_classes = [CustomPermission]
    queryset = Administrator.objects.all()
    serializer_class = AdministratorCreateSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_administrator']
    permission_classes = [CustomPermission]
    queryset = Administrator.objects.all()
    serializer_class = AdministratorUpdateSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_administrator']
    permission_classes = [CustomPermission]
    queryset = Administrator.objects.all()
    serializer_class = AdministratorBaseSerializer


class BulkDeleteView(DestroyAPIView):
    permissions = ['delete_administrator']
    permission_classes = [CustomPermission]
    queryset = Administrator.objects.all()
    serializer_class = AdministratorBaseSerializer

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Administrator.objects.filter(pk__in=pk)
        if result.count():
            return result
        raise Http404

    def delete(self, request, format=None):
        object = self.get_object(pk)
        object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get(self, request, format=None):
        serializer = AdministratorBaseSerializer(self.get_object().administrator)
        return Response(serializer.data)

    def post(self, request, format=None):
        params = self.request.data
        administrator = self.get_object().administrator
        serializer = AdministratorUpdateSerializer(administrator, data=params, partial=True)
        if serializer.is_valid() is True:
            serializer.save();
            return Response(serializer.data)
        else:
            raise ValidationError(serializer.errors)


class ResetPasswordView(APIView):
    permission_classes = (AllowAny, )

    def get_object(self, queryStr, type="username"):
        try:
            if type == "username":
                return Administrator.objects.get(user__username=queryStr)
            elif type == "reset_password_token":
                return Administrator.objects.get(reset_password_token=queryStr)
            elif type == "change_password_token":
                return Administrator.objects.get(change_password_token=queryStr)
            else:
                raise Http404
        except Administrator.DoesNotExist:
            raise Http404

    # Reset password confirm
    def get(self, request, format=None):
        token = self.request.GET.get("token", "")
        item = self.get_object(token, "reset_password_token")
        user = item.user
        if item.reset_password_token == "":
            raise Http404
        user.password = item.reset_password_tmp
        item.reset_password_tmp = ""
        item.reset_password_token = ""
        item.reset_password_created = None
        user.save()
        item.save()
        return Response()

    # Reset password
    def post(self, request, format=None):
        params = self.request.data
        item = self.get_object(params["username"])
        user = item.user

        token = Tools.getUuid()

        item.reset_password_token = token
        item.reset_password_tmp = make_password(params["password"])
        item.reset_password_created = timezone.now()
        item.save()
        url = settings.BASE_URL + "admin/reset-password/" + str(token)
        subject = "Rest set password for %s %s" % (user.first_name, user.last_name)
        body = "Reset password confirm link: %s" % (url)
        to = user.email

        Tools.sendEmail(subject, body, to)
        return Response({"url": url})

class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def post(self, request, format=None):
        params = self.request.data

        user = self.get_object()

        # Check correct old password
        if check_password(params["oldPassword"], user.password) is False:
            raise ValidationError({"detail": "Incorrect old password"})

        user.password = make_password(params["password"])
        user.save()

        return Response()


class BaseEndPoint(BaseManageView):
    VIEWS_BY_METHOD = {
        'GET': ListView.as_view,
        'POST': CreateView.as_view,
        'DELETE': BulkDeleteView.as_view,
    }


class PKEndPoint(BaseManageView):
    VIEWS_BY_METHOD = {
        'GET': DetailView.as_view,
        'PUT': UpdateView.as_view,
        'DELETE': DeleteView.as_view,
    }
