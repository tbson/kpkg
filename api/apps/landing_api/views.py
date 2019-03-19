from django.db.models import Q
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from utils.common_classes.custom_pagination import CustomLimitOffsetPagination

from apps.banner.models import Banner
from apps.banner.serializers import (
    BannerBaseSerializer,
    BannerTranslationListSerializer
)

from apps.article.models import Article
from apps.article.serializers import (
    ArticleLandingSerializer,
    ArticleLandingRetrieveSerializer
)

from apps.ccalendar.models import CCalendar
from apps.ccalendar.serializers import CCalendarBaseSerializer

from apps.staff.models import Staff
from apps.staff.serializers import StaffBaseSerializer


class BannerListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Banner.objects.all()
    serializer_class = BannerTranslationListSerializer
    filter_fields = ('category__uid', 'category__type', )


class HomeArticleListView(ListAPIView):
    supportCategories = (
        'tin-hoat-ong',
        'tin-khoa-hoc',
        'kien-thuc',
        'su-kien-thien-van',
    )
    permission_classes = (AllowAny, )
    queryset = Article.objects.filter(category__uid__in=supportCategories)
    serializer_class = ArticleLandingSerializer
    filter_fields = ('category__uid', )
    pagination_class = CustomLimitOffsetPagination


class ArticleListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Article.objects.all()
    serializer_class = ArticleLandingSerializer
    filter_fields = ('category__uid', 'pin', 'tags')
    pagination_class = CustomLimitOffsetPagination


class ArticleNewsListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Article.objects.filter(Q(category__uid='tin-tuc') | Q(category__uid='kien-thuc'))
    serializer_class = ArticleLandingSerializer


class ArticleRetrieveSingleView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Article.objects.all()
    serializer_class = ArticleLandingRetrieveSerializer
    filter_fields = ('category__uid', )


class ArticleRetrieveView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = Article.objects.all()
    serializer_class = ArticleLandingRetrieveSerializer


class CCalendarListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = CCalendar.objects.all()
    serializer_class = CCalendarBaseSerializer
    pagination_class = None


class StaffListView(ListAPIView):
    permission_classes = (AllowAny, )
    queryset = Staff.objects.all()
    serializer_class = StaffBaseSerializer
    pagination_class = None
