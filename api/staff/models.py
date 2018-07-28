import uuid
import os
from PIL import Image
from django.conf import settings
from django.db import models
from utils.helpers.tools import Tools

def image_destination(instance, filename):
    # ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), 'jpg')
    return os.path.join('staff', filename)

# Create your models here.
class Staff(models.Model):
    title = models.CharField(max_length=56)
    fullname = models.CharField(max_length=128)
    email = models.CharField(max_length=128, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=image_destination)
    order = models.IntegerField(default=1)

    def __str__(self):
        return '{} {}'.format(self.title, self.fullname)

    def save(self, *args, **kwargs):

        if not self._state.adding and self.image:
            item = Staff.objects.get(pk=self.pk)
            if item.image != self.image:
                # Update: remove exist image
                Tools.removeFile(item.image.path, True)
        if self.order == 0:
            if Staff.objects.count() > 0:
                self.order = Staff.objects.order_by('-order').first().order + 1
            else:
                self.order = 1
        super(Staff, self).save(*args, **kwargs)
        Tools.scaleImage(1, self.image.path)
        Tools.createThumbnail(settings.IMAGE_THUMBNAIL_WIDTH, self.image.path)

    def delete(self, *args, **kwargs):
        Tools.removeFile(self.image.path, True)
        super(Staff, self).delete(*args,**kwargs)

    class Meta:
        db_table = "staffs"
        ordering = ['-id']
        permissions = (
            ("view_staff_list", "Can view staff list"),
            ("view_staff_detail", "Can view staff detail"),
        )
