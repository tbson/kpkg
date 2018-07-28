from django.http import Http404
from rest_framework.decorators import action
from rest_framework.viewsets import (GenericViewSet, )
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from .serializers import (
    CategoryBaseSerializer,
)
from utils.common_classes.custom_permission import CustomPermissionExp


class CategoryViewSet(GenericViewSet):
    permissions = (
        'list_category',
        'retrieve_category',
        'create_category',
        'update_category',
        'destroy_category',
        'destroy_list_category',
    )
    name = 'category'
    serializer_class = CategoryBaseSerializer
    permission_classes = (CustomPermissionExp, )
    search_fields = ('uid', 'title')
    filter_fields = ('type', )

    def list(self, request):
        queryset = Category.objects.all()
        queryset = self.filter_queryset(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = CategoryBaseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        obj = Category.objects.get(pk=pk)
        serializer = CategoryBaseSerializer(obj)
        return Response(serializer.data)

    def create(self, request):
        serializer = CategoryBaseSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    def update(self, request, pk=None):
        obj = Category.objects.get(pk=pk)
        serializer = CategoryBaseSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        Category.objects.get(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=True)
    def destroy_list(self, request):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Category.objects.filter(pk__in=pk)
        if result.count() == 0:
            raise Http404
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
