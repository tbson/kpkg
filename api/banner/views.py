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
from .models import Banner
from .serializers import (
    BannerBaseSerializer,
    BannerCreateSerializer,
    BannerUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView


class ListView(ListAPIView):
    # permissions = ['view_banner_list']
    # permission_classes = [CustomPermission]
    # permission_classes = [CustomPermission]
    permission_classes = (AllowAny, )
    queryset = Banner.objects.all()
    serializer_class = BannerBaseSerializer
    search_fields = ('uid', 'value')
    filter_fields = ('category', 'category__uid')


class DetailView(RetrieveAPIView):
    permissions = ['view_banner_detail']
    permission_classes = [CustomPermission]
    queryset = Banner.objects.all()
    serializer_class = BannerBaseSerializer


class CreateView(CreateAPIView):
    permissions = ['add_banner']
    permission_classes = [CustomPermission]
    queryset = Banner.objects.all()
    serializer_class = BannerCreateSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_banner']
    permission_classes = [CustomPermission]
    queryset = Banner.objects.all()
    serializer_class = BannerUpdateSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_banner']
    permission_classes = [CustomPermission]
    queryset = Banner.objects.all()
    serializer_class = BannerBaseSerializer


class BulkDeleteView(APIView):
    permissions = ['delete_banner']
    permission_classes = [CustomPermission]

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Banner.objects.filter(pk__in=pk)
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
