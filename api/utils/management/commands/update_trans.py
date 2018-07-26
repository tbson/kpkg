from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from banner.models import Banner
from banner.models import Banner, BannerTranslation
from article.models import Article


class Command(BaseCommand):
    help = 'Add missing permissions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Start...'))

        listBanner = Banner.objects.all();
        for banner in listBanner:
            Banner.objects.addTranslations(banner)

        self.stdout.write(self.style.SUCCESS('Success!'))
