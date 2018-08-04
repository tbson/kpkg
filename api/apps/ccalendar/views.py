
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.viewsets import (GenericViewSet, )
from rest_framework.response import Response
from rest_framework import status
from .models import CCalendar
from .serializers import (
    CCalendarBaseSerializer,
)
from utils.common_classes.custom_permission import CustomPermissionExp


class CCalendarViewSet(GenericViewSet):
    permissions = (
        'list_ccalendar',
        'retrieve_ccalendar',
        'add_ccalendar',
        'change_ccalendar',
        'delete_ccalendar',
        'delete_list_ccalendar',
    )
    name = 'ccalendar'
    serializer_class = CCalendarBaseSerializer
    permission_classes = (CustomPermissionExp, )
    search_fields = ('uid', 'value')

    def list(self, request):
        queryset = CCalendar.objects.all()
        queryset = self.filter_queryset(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = CCalendarBaseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        obj = CCalendar.objects.get(pk=pk)
        serializer = CCalendarBaseSerializer(obj)
        return Response(serializer.data)

    @action(methods=['post'], detail=True)
    def add(self, request):
        serializer = CCalendarBaseSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['put'], detail=True)
    def change(self, request, pk=None):
        obj = CCalendar.objects.get(pk=pk)
        serializer = CCalendarBaseSerializer(obj, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    @action(methods=['delete'], detail=True)
    def delete(self, request, pk=None):
        CCalendar.objects.get(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=False)
    def delete_list(self, request):
        pk = self.request.query_params.get('ids', '')
        pk = [int(pk)] if pk.isdigit() else map(lambda x: int(x), pk.split(','))
        result = CCalendar.objects.filter(pk__in=pk)
        if result.count() == 0:
            raise Http404
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

