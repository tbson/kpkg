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
from .models import Article, ArticleTranslation
from .serializers import (
    ArticleTranslationSerializer,
    ArticleBaseSerializer,
    ArticleRetrieveSerializer,
    ArticleCreateSerializer,
    ArticleUpdateSerializer,
)
from utils.common_classes.custom_permission import CustomPermission
from utils.common_classes.base_manage_view import BaseManageView


class ListView(ListAPIView):
    permissions = ['view_article_list']
    permission_classes = [CustomPermission]
    queryset = Article.objects.all()
    serializer_class = ArticleBaseSerializer
    search_fields = ('slug', 'value')
    filter_fields = ('category', 'article', )


class DetailView(RetrieveAPIView):
    permissions = ['view_article_detail']
    permission_classes = [CustomPermission]
    queryset = Article.objects.all()
    serializer_class = ArticleRetrieveSerializer


class CreateView(CreateAPIView):
    permissions = ['add_article']
    permission_classes = [CustomPermission]
    queryset = Article.objects.all()
    serializer_class = ArticleCreateSerializer


class UpdateView(UpdateAPIView):
    permissions = ['change_article']
    permission_classes = [CustomPermission]
    queryset = Article.objects.all()
    serializer_class = ArticleUpdateSerializer


class UpdateTranslationView(UpdateAPIView):
    permissions = ['change_article']
    permission_classes = [CustomPermission]
    queryset = ArticleTranslation.objects.all()
    serializer_class = ArticleTranslationSerializer


class DeleteView(DestroyAPIView):
    permissions = ['delete_article']
    permission_classes = [CustomPermission]
    queryset = Article.objects.all()
    serializer_class = ArticleBaseSerializer


class BulkDeleteView(APIView):
    permissions = ['delete_article']
    permission_classes = [CustomPermission]

    def get_object(self):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = Article.objects.filter(pk__in=pk)
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

class TranslationPKEndPoint(BaseManageView):
    VIEWS_BY_METHOD = {
        'PUT': UpdateTranslationView.as_view,
    }
