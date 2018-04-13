import uuid
import os
from PIL import Image
from django.db import models
from utils.helpers.tools import Tools
from category.models import Category

def image_destination(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join('banner', filename)

# Create your models here.
class Banner(models.Model):
    category = models.ForeignKey(Category, related_name="banners", on_delete=models.CASCADE)
    uuid = models.CharField(max_length=36, blank=True)
    uid = models.CharField(max_length=256)
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=image_destination)

    def save(self, *args, **kwargs):

        if not self.id and not self.image:
            return

        if not self._state.adding and self.image:
            item = Banner.objects.get(pk=self.pk)
            if item.image != self.image:
                # Update: remove exist image
                Tools.removeFile(item.image.path, True)

        super(Banner, self).save(*args, **kwargs)
        width = 1200;
        thumbnailWidth = 300
        Tools.scaleImage(width, self.image.path)
        Tools.createThumbnail(thumbnailWidth, self.image.path)

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
