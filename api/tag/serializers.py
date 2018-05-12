from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework.validators import UniqueValidator
from django.utils.text import slugify
from .models import Tag


class TagBaseSerializer(ModelSerializer):

    class Meta:
        model = Tag
        exclude = ()
        read_only_fields = ('id',)
        extra_kwargs = {
            'uid': {'required': False},
        }

    def create(self, validated_data):
        uid = slugify(validated_data['title'])
        if (Tag.objects.filter(uid=uid).count() >= 1):
            raise ValidationError({'title': 'Duplicate tag'})
        validated_data['uid'] = uid
        tag = Tag(**validated_data)
        tag.save()
        return tag

    def update(self, instance, validated_data):
        uid = slugify(validated_data['title'])
        if (Tag.objects.exclude(pk=instance.pk).filter(uid=uid).count() >= 1):
            raise ValidationError({'title': 'Duplicate tag'})
        validated_data['uid'] = uid
        instance.__dict__.update(validated_data)
        instance.save()
        return instance


class TagConsumeSerializer(TagBaseSerializer):
    class Meta(TagBaseSerializer.Meta):
        exclude = ('created_at', 'updated_at', 'uid')
