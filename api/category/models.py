from django.db import models


# Create your models here.
class Category(models.Model):
    uid = models.CharField(max_length=256, unique=True)
    title = models.CharField(max_length=256, unique=True)
    type = models.CharField(max_length=50)
    single = models.BooleanField(default=False)

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
