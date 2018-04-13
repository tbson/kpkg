import uuid
import os
from PIL import Image
from django.conf import settings
from django.db import models
from utils.helpers.tools import Tools
from category.models import Category
from banner.models import Banner
from attach.models import Attach

def image_destination(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join('article', filename)

# Create your models here.
class Article(models.Model):
    category = models.ForeignKey(Category, related_name="articles", on_delete=models.CASCADE)
    banner = models.ForeignKey(Banner, related_name="relatedArticles", null=True, on_delete=models.SET_NULL)
    article = models.ForeignKey('self', related_name="relatedArticles", null=True, on_delete=models.SET_NULL)
    uuid = models.CharField(max_length=36, blank=True)
    uid = models.CharField(max_length=256)
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=image_destination)
    content = models.TextField(blank=True)

    def save(self, *args, **kwargs):

        if not self.id and not self.image:
            return

        if not self._state.adding:
            item = Article.objects.get(pk=self.pk)
            if self.content == "":
                self.content = item.content
            if self.image:
                if item.image != self.image:
                    # Update: remove exist image
                    Tools.removeFile(item.image.path, True)

        super(Article, self).save(*args, **kwargs)
        Tools.scaleImage(self.category.image_ratio, self.image.path)
        Tools.createThumbnail(settings.IMAGE_THUMBNAIL_WIDTH, self.image.path)

    def delete(self, *args, **kwargs):
        Attach.objects.removeByUUID(self.uuid)
        Tools.removeFile(self.image.path, True)
        super(Article, self).delete(*args, **kwargs)

    class Meta:
        db_table = "articles"
        ordering = ['-id']
        permissions = (
            ("view_article_list", "Can view article list"),
            ("view_article_detail", "Can view article detail"),
        )
