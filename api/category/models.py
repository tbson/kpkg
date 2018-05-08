from django.db import models
from django.utils.text import slugify


# Create your models here.
class Category(models.Model):
    uid = models.CharField(max_length=256, unique=True)
    title = models.CharField(max_length=256, unique=True)
    type = models.CharField(max_length=50)
    image_ratio = models.FloatField(default=1.618)
    width_ratio = models.IntegerField(default=100)
    single = models.BooleanField(default=False)


    def save(self, *args, **kwargs):
        self.uid = slugify(self.title);
        super(Category, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        for banner in self.banners.all():
            banner.delete()
        for article in self.articles.all():
            article.delete()
        super(Category, self).delete(*args,**kwargs)

    class Meta:
        db_table = "categories"
        ordering = ['-id']
        permissions = (
            ("view_category_list", "Can view category list"),
            ("view_category_detail", "Can view category detail"),
        )
