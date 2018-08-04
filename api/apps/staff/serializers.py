from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import SerializerMethodField
from django.utils.text import slugify
from .models import Staff


class StaffBaseSerializer(ModelSerializer):

    class Meta:
        model = Staff
        exclude = ()
        read_only_fields = ('id',)

    def create(self, validated_data):
        email = validated_data['email']
        if (Staff.objects.filter(email=email).count() >= 1):
            raise ValidationError({'email': 'Duplicate email'})
        instance = Staff(**validated_data)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        email = validated_data['email']
        if (Staff.objects.exclude(pk=instance.pk).filter(email=email).count() >= 1):
            raise ValidationError({'email': 'Duplicate email'})
        instance.__dict__.update(validated_data)
        instance.save()
        return instance


class StaffUpdateSerializer(StaffBaseSerializer):

    class Meta(StaffBaseSerializer.Meta):
        extra_kwargs = {
            'image': {'required': False},
        }

