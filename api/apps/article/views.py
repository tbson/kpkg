from django.http import Http404
from rest_framework.decorators import action
from rest_framework.viewsets import (GenericViewSet, )
from rest_framework.response import Response
from rest_framework import status
from .models import Article, ArticleTranslation
from .serializers import (
    ArticleTranslationSerializer,
    ArticleBaseSerializer,
    ArticleRetrieveSerializer,
    ArticleCreateSerializer,
    ArticleUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermissionExp


class ArticleViewSet(GenericViewSet):
    permissions = (
        'list_article',
        'retrieve_article',
        'add_article',
        'change_article',
        'change_translate_article',
        'delete_article',
        'delete_list_article',
    )
    name = 'article'
    serializer_class = ArticleBaseSerializer
    permission_classes = (CustomPermissionExp, )
    search_fields = ('slug', 'value')
    filter_fields = ('category', 'article', )

    def list(self, request):
        queryset = Article.objects.all()
        queryset = self.filter_queryset(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = ArticleBaseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        obj = Article.objects.get(pk=pk)
        serializer = ArticleRetrieveSerializer(obj)
        return Response(serializer.data)

    @action(methods=['post'], detail=True)
    def add(self, request):
        serializer = ArticleCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['put'], detail=True)
    def change(self, request, pk=None):
        obj = Article.objects.get(pk=pk)
        serializer = ArticleUpdateSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['put'], detail=True)
    def change_translation(self, request, pk=None):
        obj = ArticleTranslation.objects.get(pk=pk)
        serializer = ArticleTranslationSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['delete'], detail=True)
    def delete(self, request, pk=None):
        Article.objects.get(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=False)
    def delete_list(self, request):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Article.objects.filter(pk__in=pk)
        if result.count() == 0:
            raise Http404
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
