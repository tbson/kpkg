from rest_framework.serializers import ModelSerializer
from .models import CCalendar


class CCalendarBaseSerializer(ModelSerializer):

    class Meta:
        model = CCalendar
        exclude = ()
        read_only_fields = ('id',)
