from django.http import Http404
from django.shortcuts import render

from banner.models import Banner
from article.models import Article


def home(request):
    return render(request, 'base.html')

def article_list(request, category_uid):
    return render(request, 'base.html')

def article_detail(request, category_uid):
    data = {}
    item = Article.objects.filter(category__uid=category_uid).first()
    data['item'] = item
    data['meta'] = {
        'title': item.title,
        'description': item.description,
        'image': item.image
    }
    return render(request, 'base.html', data)

def article_detail_pk(request, pk, category_uid):
    return render(request, 'base.html')

def contact(request):
    return render(request, 'base.html')
