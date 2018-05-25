from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import SerializerMethodField
from django.utils.text import slugify
from .models import Article
from category.models import Category
from attach.models import Attach
from tag.models import Tag
from attach.serializers import AttachBaseSerializer
from category.serializers import CategoryBaseSerializer
from tag.serializers import TagConsumeSerializer


class ArticleBaseSerializer(ModelSerializer):

    class Meta:
        model = Article
        exclude = ('content', )
        read_only_fields = ('id', 'tags')

    category_title = SerializerMethodField()

    def get_category_title(self, obj):
        if obj.category:
            return obj.category.title
        return obj.article.category.title

class ArticleRetrieveSerializer(ArticleBaseSerializer):
    class Meta(ArticleBaseSerializer.Meta):
        exclude = ()
    category = CategoryBaseSerializer()
    # tag_source = SerializerMethodField()

    # def get_tag_source(self, obj):
    #    return TagConsumeSerializer(Tag.objects.all(), many=True).data

class ArticleCreateSerializer(ArticleBaseSerializer):

    class Meta(ArticleBaseSerializer.Meta):
        exclude = ()
        extra_kwargs = {
            'uid': {'required': False},
        }

    def create(self, validated_data):
        if 'category' in validated_data:
            category = validated_data['category']
            if category.single is True:
                if Article.objects.filter(category_id=category.id).count() >= 1:
                    raise serializers.ValidationError({'detail': 'Can not add more item.'})
        validated_data['uid'] = slugify(validated_data['title'])
        article = Article(**validated_data)
        article.save()

        for tag in self.initial_data['tags'].split(','):
            if tag.isdigit():
                article.tags.add(tag)

        return article


class ArticleUpdateSerializer(ArticleBaseSerializer):

    class Meta(ArticleBaseSerializer.Meta):
        extra_kwargs = {
            'uid': {'required': False},
        }
        exclude = ('uuid',)

    def update(self, instance, validated_data):
        instance.tags.clear();
        for tag in self.initial_data['tags'].split(','):
            if tag.isdigit():
                instance.tags.add(tag)
        instance.__dict__.update(validated_data)
        instance.save()
        return instance


class ArticleLandingSerializer(ArticleBaseSerializer):
    related_articles = ArticleBaseSerializer(many=True, read_only=True)

    attaches = SerializerMethodField()

    def get_attaches(self, obj):
        result = Attach.objects.filter(parent_uuid=obj.uuid, richtext_image=False)
        return AttachBaseSerializer(result, many=True).data

class ArticleLandingRetrieveSerializer(ArticleLandingSerializer):
    class Meta(ArticleBaseSerializer.Meta):
        exclude = ()
    category = CategoryBaseSerializer()

