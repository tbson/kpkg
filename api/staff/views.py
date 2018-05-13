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
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import Staff
from .serializers import (
    StaffBaseSerializer,
    StaffUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView


class ListView(ListAPIView):
    permissions = ['view_staff_list']
    permission_classes = [CustomPermission]
    queryset = Staff.objects.all()
    serializer_class = StaffBaseSerializer
    search_fields = ('uid', 'value')


class DetailView(RetrieveAPIView):
    permissions = ['view_staff_detail']
    permission_classes = [CustomPermission]
    queryset = Staff.objects.all()
    serializer_class = StaffBaseSerializer


class CreateView(CreateAPIView):
    permissions = ['add_staff']
    permission_classes = [CustomPermission]
    queryset = Staff.objects.all()
    serializer_class = StaffBaseSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_staff']
    permission_classes = [CustomPermission]
    queryset = Staff.objects.all()
    serializer_class = StaffUpdateSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_staff']
    permission_classes = [CustomPermission]
    queryset = Staff.objects.all()
    serializer_class = StaffBaseSerializer


class BulkDeleteView(APIView):
    permissions = ['delete_staff']
    permission_classes = [CustomPermission]

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Staff.objects.filter(pk__in=pk)
        if result.count():
            return result
        raise Http404

    def delete(self, request, format=None):
        object = self.get_object()
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
