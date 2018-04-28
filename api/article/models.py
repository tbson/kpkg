import uuid
import os
from PIL import Image
from django.utils.timezone import now
from django.conf import settings
from django.db import models
from utils.helpers.tools import Tools
from category.models import Category
from banner.models import Banner
from attach.models import Attach

def image_destination(instance, filename):
    # ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), 'webp')
    return os.path.join('article', filename)

# Create your models here.
class Article(models.Model):
    category = models.ForeignKey(Category, related_name="articles", null=True, on_delete=models.CASCADE)
    article = models.ForeignKey('self', related_name="related_articles", null=True, on_delete=models.CASCADE)
    uuid = models.CharField(max_length=36, blank=True)
    uid = models.CharField(max_length=256)
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=image_destination)
    content = models.TextField(blank=True)
    use_slide = models.BooleanField(default=False)
    order = models.IntegerField(default=1)
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if not self._state.adding:
            item = Article.objects.get(pk=self.pk)
            if self.content == "":
                self.content = item.content
            if self.description == "":
                self.description = item.description
            if self.image:
                if item.image != self.image:
                    # Update: remove exist image
                    Tools.removeFile(item.image.path, True)
        if self.order == 0:
            if Article.objects.count() > 0:
                self.order = Article.objects.order_by('-order').first().order + 1
            else:
                self.order = 1
        super(Article, self).save(*args, **kwargs)
        if self.category:
            image_ratio = self.category.image_ratio
        else:
            image_ratio = self.article.category.image_ratio
        Tools.scaleImage(image_ratio, self.image.path)
        Tools.createThumbnail(settings.IMAGE_THUMBNAIL_WIDTH, self.image.path)

    def delete(self, *args, **kwargs):
        Attach.objects.removeByUUID(self.uuid)
        Tools.removeFile(self.image.path, True)
        super(Article, self).delete(*args, **kwargs)

    class Meta:
        db_table = "articles"
        ordering = ['-order']
        permissions = (
            ("view_article_list", "Can view article list"),
            ("view_article_detail", "Can view article detail"),
        )
