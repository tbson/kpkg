from rest_framework import pagination
from rest_framework.response import Response
from math import ceil


class CustomPagination(pagination.PageNumberPagination):

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'pages': ceil(self.page.paginator.count / self.page_size),
            'page_size': self.page_size,
            'items': data
        })
