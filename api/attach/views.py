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
from .models import Attach
from .serializers import (
    AttachBaseSerializer,
    AttachCreateSerializer,
    AttachUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView
from utils.helpers.tools import Tools


class ListView(ListAPIView):
    def get_queryset(self):
        query = self.request.GET.dict()
        if 'richtext_image' in query:
            query['richtext_image'] = Tools.stringToBool(query['richtext_image'])
        return Attach.objects.filter(**query)

    permissions = ['view_attach_list']
    permission_classes = [CustomPermission]
    queryset = get_queryset
    serializer_class = AttachBaseSerializer
    search_fields = ('title',)
    filter_fields = ('parent_uuid', 'richtext_image',)


class DetailView(RetrieveAPIView):
    permissions = ['view_attach_detail']
    permission_classes = [CustomPermission]
    queryset = Attach.objects.all()
    serializer_class = AttachBaseSerializer


class CreateView(CreateAPIView):
    permissions = ['add_attach']
    permission_classes = [CustomPermission]
    queryset = Attach.objects.all()
    serializer_class = AttachCreateSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_attach']
    permission_classes = [CustomPermission]
    queryset = Attach.objects.all()
    serializer_class = AttachUpdateSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_attach']
    permission_classes = [CustomPermission]
    queryset = Attach.objects.all()
    serializer_class = AttachBaseSerializer


class BulkDeleteView(APIView):
    permissions = ['delete_attach']
    permission_classes = [CustomPermission]

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Attach.objects.filter(pk__in=pk)
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
