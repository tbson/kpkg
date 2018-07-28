from django.http import Http404
from rest_framework.decorators import action
from rest_framework.viewsets import (ViewSet, GenericViewSet, )
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from rest_framework import status
from .models import Config
from .serializers import (
    ConfigBaseSerializer,
)
from utils.common_classes.custom_permission import CustomPermissionExp
from rest_framework.permissions import AllowAny


class ConfigViewSet(GenericViewSet):
    permissions = (
        'list_config',
        'retrieve_config',
        'create_config',
        'update_config',
        'destroy_config',
        'destroy_list_config',
    )
    name = 'config'
    serializer_class = ConfigBaseSerializer
    permission_classes = (CustomPermissionExp, )
    search_fields = ('uid', 'value')

    def list(self, request):
        queryset = Config.objects.all()
        queryset = self.filter_queryset(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = ConfigBaseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        obj = Config.objects.get(pk=pk)
        serializer = ConfigBaseSerializer(obj)
        return Response(serializer.data)

    def create(self, request):
        serializer = ConfigBaseSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    def update(self, request, pk=None):
        obj = Config.objects.get(pk=pk)
        serializer = ConfigBaseSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        Config.objects.get(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=True)
    def destroy_list(self, request):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Config.objects.filter(pk__in=pk)
        if result.count() == 0:
            raise Http404
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

