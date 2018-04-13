from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import SerializerMethodField
from django.utils.text import slugify
from .models import Article
from category.models import Category


class ArticleBaseSerializer(ModelSerializer):

    class Meta:
        model = Article
        exclude = ()
        read_only_fields = ('id',)

    category_title = SerializerMethodField()

    def get_category_title(self, obj):
        return obj.category.title


class ArticleCreateSerializer(ArticleBaseSerializer):

    class Meta(ArticleBaseSerializer.Meta):
        extra_kwargs = {
            'uid': {'required': False},
        }

    def create(self, validated_data):
        category = validated_data['category']
        if category.single is True:
            if Article.objects.filter(category_id=category.id).count() >= 1:
                raise serializers.ValidationError({'detail': 'Can not add more item.'})
        validated_data['uid'] = slugify(validated_data['title'])
        article = Article(**validated_data)
        article.save()
        return article


class ArticleUpdateSerializer(ArticleBaseSerializer):

    class Meta(ArticleBaseSerializer.Meta):
        extra_kwargs = {
            'uid': {'required': False},
            'image': {'required': False},
        }
        exclude = ('uuid',)

