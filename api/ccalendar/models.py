from django.db import models
from utils.models.model import TimeStampedModel


# Create your models here.
class CCalendar(TimeStampedModel):
    title = models.CharField(max_length=256)
    url = models.CharField(max_length=256, blank=True)
    start = models.DateField()
    end = models.DateField()

    def __str__(self):
        return '{}'.format(self.title)

    class Meta:
        db_table = "ccalendars"
        ordering = ['-start']
        permissions = (
            ("list_ccalendar", "Can list ccalendar"),
            ("retrieve_ccalendar", "Can retrieve ccalendar"),
            ("delete_list_ccalendar", "Can delete list ccalendar"),
        )
