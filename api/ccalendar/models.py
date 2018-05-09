from django.db import models
from utils.models.model import TimeStampedModel


# Create your models here.
class CCalendar(TimeStampedModel):
    title = models.CharField(max_length=256)
    url = models.CharField(max_length=256, blank=True)
    start = models.DateField()
    end = models.DateField()

    class Meta:
        db_table = "ccalendars"
        ordering = ['-start']
        permissions = (
            ("view_ccalendar_list", "Can view ccalendar list"),
            ("view_ccalendar_detail", "Can view ccalendar detail"),
        )
