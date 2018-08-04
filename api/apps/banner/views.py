from django.http import Http404
from rest_framework.decorators import action
from rest_framework.viewsets import (GenericViewSet, )
from rest_framework.response import Response
from rest_framework import status
from .models import Banner, BannerTranslation
from .serializers import (
    BannerTranslationSerializer,
    BannerBaseSerializer,
    BannerRetrieveSerializer,
    BannerCreateSerializer,
    BannerUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermissionExp


class BannerViewSet(GenericViewSet):
    permissions = (
        'list_banner',
        'retrieve_banner',
        'add_banner',
        'change_banner',
        'change_translate_banner',
        'delete_banner',
        'delete_list_banner',
    )
    name = 'banner'
    serializer_class = BannerBaseSerializer
    permission_classes = (CustomPermissionExp, )
    search_fields = ('uid', 'value')
    filter_fields = ('category', 'category__uid')

    def list(self, request):
        queryset = Banner.objects.all()
        queryset = self.filter_queryset(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = BannerBaseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        obj = Banner.objects.get(pk=pk)
        serializer = BannerRetrieveSerializer(obj)
        return Response(serializer.data)

    @action(methods=['post'], detail=True)
    def add(self, request):
        serializer = BannerCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['put'], detail=True)
    def change(self, request, pk=None):
        obj = Banner.objects.get(pk=pk)
        serializer = BannerUpdateSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['put'], detail=True)
    def change_translation(self, request, pk=None):
        obj = BannerTranslation.objects.get(pk=pk)
        serializer = BannerTranslationSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['delete'], detail=True)
    def delete(self, request, pk=None):
        Banner.objects.get(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=False)
    def delete_list(self, request):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Banner.objects.filter(pk__in=pk)
        if result.count() == 0:
            raise Http404
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
