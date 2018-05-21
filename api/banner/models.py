import uuid
import os
from PIL import Image
from django.conf import settings
from django.db import models
from utils.helpers.tools import Tools
from category.models import Category

def image_destination(instance, filename):
    # ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), 'jpg')
    return os.path.join('banner', filename)

# Create your models here.
class Banner(models.Model):
    category = models.ForeignKey(Category, related_name="banners", on_delete=models.CASCADE)
    uuid = models.CharField(max_length=36, blank=True)
    uid = models.CharField(max_length=256)
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=image_destination)
    order = models.IntegerField(default=1)

    def save(self, *args, **kwargs):

        if not self._state.adding and self.image:
            item = Banner.objects.get(pk=self.pk)
            if item.image != self.image:
                # Update: remove exist image
                Tools.removeFile(item.image.path, True)
        if self.order == 0:
            if Banner.objects.count() > 0:
                self.order = Banner.objects.order_by('-order').first().order + 1
            else:
                self.order = 1
        super(Banner, self).save(*args, **kwargs)
        Tools.scaleImage(self.category.image_ratio, self.image.path)
        Tools.createThumbnail(settings.IMAGE_THUMBNAIL_WIDTH, self.image.path)

    def delete(self, *args, **kwargs):
        Tools.removeFile(self.image.path, True)
        super(Banner, self).delete(*args,**kwargs)

    class Meta:
        db_table = "banners"
        ordering = ['-id']
        permissions = (
            ("view_banner_list", "Can view banner list"),
            ("view_banner_detail", "Can view banner detail"),
        )
