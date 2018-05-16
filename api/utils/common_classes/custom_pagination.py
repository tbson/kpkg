from rest_framework import pagination
from rest_framework.response import Response
from math import ceil
from django.conf import settings


class CustomPagination(pagination.PageNumberPagination):

    def get_paginated_response(self, data):
        next_link = self.get_next_link()
        previous_link = self.get_previous_link()

        if settings.PROTOCOL == 'https':
            if next_link:
                next_link = next_link.replace('http://', 'https://')
            if previous_link:
                previous_link = previous_link.replace('http://', 'https://')

        return Response({
            'links': {
                'next': next_link,
                'previous': previous_link
            },
            'count': self.page.paginator.count,
            'pages': ceil(self.page.paginator.count / self.page_size),
            'page_size': self.page_size,
            'items': data
        })

class CustomLimitOffsetPagination(pagination.LimitOffsetPagination):

    def get_paginated_response(self, data):
        next_link = self.get_next_link()
        previous_link = self.get_previous_link()

        if settings.PROTOCOL == 'https':
            if next_link:
                next_link = next_link.replace('http://', 'https://')
            if previous_link:
                previous_link = previous_link.replace('http://', 'https://')

        return Response({
            'links': {
                'next': next_link,
                'previous': previous_link
            },
            # 'count': self.page.paginator.count,
            # 'pages': ceil(self.page.paginator.count / self.page_size),
            # 'page_size': self.page_size,
            'items': data
        })
