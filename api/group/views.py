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
from django.contrib.auth.models import Group
from .serializers import (
    GroupBaseSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView


class ListView(ListAPIView):
    permissions = ['view_group_list']
    permission_classes = [CustomPermission]
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer
    pagination_class = None
    search_fields = ['name']


class DetailView(RetrieveAPIView):
    permissions = ['view_group_detail']
    permission_classes = [CustomPermission]
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer


class CreateView(CreateAPIView):
    permissions = ['add_group']
    permission_classes = [CustomPermission]
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_group']
    permission_classes = [CustomPermission]
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_group']
    permission_classes = [CustomPermission]
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer


class BulkDeleteView(DestroyAPIView):
    permissions = ['delete_group']
    permission_classes = [CustomPermission]
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Group.objects.filter(pk__in=pk)
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
