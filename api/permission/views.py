from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Permission
from .serializers import (
    PermissionBaseSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView


class ListView(ListAPIView):
    permissions = ['view_permission_list']
    queryset = Permission.objects.all()
    serializer_class = PermissionBaseSerializer
    pagination_class = None
    search_fields = ('codename', 'name')
    ordering_fields = ('codename', 'name')
    ordering = ('content_type__app_label',)


class DetailView(RetrieveAPIView):
    permissions = ['view_permission_detail']
    queryset = Permission.objects.all()
    serializer_class = PermissionBaseSerializer


class CreateView(CreateAPIView):
    permissions = ['add_permission']
    queryset = Permission.objects.all()
    serializer_class = PermissionBaseSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_permission']
    queryset = Permission.objects.all()
    serializer_class = PermissionBaseSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_permission']
    queryset = Permission.objects.all()
    serializer_class = PermissionBaseSerializer


class BulkDeleteView(DestroyAPIView):
    permissions = ['delete_permission']
    queryset = Permission.objects.all()
    serializer_class = PermissionBaseSerializer

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Permission.objects.filter(pk__in=pk)
        if result.count():
            return result
        raise Http404

    def delete(self, request, pk, format=None):
        object = self.get_object(pk)
        object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
