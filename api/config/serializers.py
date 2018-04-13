from rest_framework.serializers import ModelSerializer
from .models import Config


class ConfigBaseSerializer(ModelSerializer):

    class Meta:
        model = Config
        fields = [
            'id',
            'uid',
            'value'
        ]
        read_only_fields = ('id',)
