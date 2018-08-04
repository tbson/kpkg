from django.http import Http404
from django.shortcuts import render
from django.conf import settings

from apps.banner.models import Banner
from apps.article.models import Article

def home(request):
    return render(request, 'base.html', {})

def article_list(request, category_uid):
    return render(request, 'base.html', {})

def article_detail(request, category_uid):
    item = Article.objects.filter(category__uid=category_uid).first()
    data = {}
    data['META'] = {
        'title': item.title,
        'description': item.description,
        'image': item.image
    }
    return render(request, 'base.html', data)

def article_detail_pk(request, pk, category_uid):
    return render(request, 'base.html', {})

def contact(request):
    return render(request, 'base.html', {})
