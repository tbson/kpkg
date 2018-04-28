from django.http import Http404
from django.shortcuts import render
from django.conf import settings

from banner.models import Banner
from article.models import Article

data = {}
data['meta'] = {
    'title': 'Khám Phá Không Gian',
    'description': 'Khám Phá Không Gian',
    'image': settings.CLIENT_URL + 'default-thumbnail.webp'
}

def home(request):
    return render(request, 'base.html', data)

def article_list(request, category_uid):
    return render(request, 'base.html', data)

def article_detail(request, category_uid):
    item = Article.objects.filter(category__uid=category_uid).first()
    data['meta'] = {
        'title': item.title,
        'description': item.description,
        'image': item.image
    }
    return render(request, 'base.html', data)

def article_detail_pk(request, pk, category_uid):
    return render(request, 'base.html', data)

def contact(request):
    return render(request, 'base.html', data)
