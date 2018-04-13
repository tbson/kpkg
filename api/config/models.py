from django.db import models


# Create your models here.
class Config(models.Model):
    uid = models.CharField(max_length=60, unique=True)
    value = models.CharField(max_length=250)

    class Meta:
        db_table = "configs"
        ordering = ['-id']
        permissions = (
            ("view_config_list", "Can view config list"),
            ("view_config_detail", "Can view config detail"),
        )
