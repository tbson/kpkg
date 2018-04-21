from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from banner.models import Banner
from banner.serializers import BannerBaseSerializer

from article.models import Article
from article.serializers import ArticleLandingSerializer


class BannerListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Banner.objects.all()
    serializer_class = BannerBaseSerializer
    filter_fields = ('category__uid', )

class ArticleListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Article.objects.all()
    serializer_class = ArticleLandingSerializer
    filter_fields = ('category__uid', )

class ArticleRetrieveView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = Article.objects.all()
    serializer_class = ArticleLandingSerializer
