import json
from rest_framework.test import APIClient
from django.test import TestCase
from django.urls import reverse
from config.models import Config
from administrator.models import Administrator
from config.serializers import ConfigBaseSerializer
from utils.helpers.test_helpers import TestHelpers
from django.conf import settings
# Create your tests here.


class ConfigTestCase(TestCase):

    def setUp(self):
        self.token = TestHelpers.testSetup(self)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        item0 = {
            "uid": "key0",
            "value": "value0",
        }
        item1 = {
            "uid": "key1",
            "value": "value1",
        }
        item2 = {
            "uid": "key2",
            "value": "value2",
        }

        self.item0 = ConfigBaseSerializer(data=item0)
        self.item0.is_valid(raise_exception=True)
        self.item0.save()
        self.item0 = Config.objects.get(**self.item0.data)

        self.item1 = ConfigBaseSerializer(data=item1)
        self.item1.is_valid(raise_exception=True)
        self.item1.save()
        self.item1 = Config.objects.get(**self.item1.data)

        self.item2 = ConfigBaseSerializer(data=item2)
        self.item2.is_valid(raise_exception=True)
        self.item2.save()
        self.item2 = Config.objects.get(**self.item2.data)

    def test_list(self):
        response = self.client.get(
            '/api/v1/config/'
        )
        self.assertEqual(response.status_code, 200)
        response = response.json()
        self.assertEqual(response['count'], 3)

    def test_detail(self):
        # Item not exist
        response = self.client.get(
            "/api/v1/config/%d" % 0
        )
        self.assertEqual(response.status_code, 404)

        # Item exist
        response = self.client.get(
            "/api/v1/config/%d" % self.item1.pk
        )
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        dataSuccess = {
            'uid': 'key3',
            'value': 'value3'
        }
        dataFail = {
            'uid': 'key2',
            'value': 'value3'
        }

        # Add duplicate
        response = self.client.post(
            '/api/v1/config/',
            dataFail,
            format='json'
        )
        self.assertEqual(response.status_code, 400)

        # Add success
        response = self.client.post(
            '/api/v1/config/',
            dataSuccess,
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Config.objects.count(), 4)

    def test_edit(self):
        dataSuccess = {
            "uid": "key3",
            "value": "value3"
        }

        dataFail = {
            "uid": "key2",
            "value": "value2"
        }

        # Update not exist
        response = self.client.put(
            "/api/v1/config/%d" % 0,
            dataFail,
            format='json'
        )
        self.assertEqual(response.status_code, 404)

        # Update duplicate
        response = self.client.put(
            "/api/v1/config/%d" % self.item1.pk,
            dataFail,
            format='json'
        )
        self.assertEqual(response.status_code, 400)

        # Update success
        response = self.client.put(
            "/api/v1/config/%d" % self.item1.pk,
            dataSuccess,
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_delete(self):
        # Remove not exist
        response = self.client.delete(
            "/api/v1/config/%d" % 0
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Config.objects.count(), 3)

        # Remove single success
        response = self.client.delete(
            "/api/v1/config/%d" % self.item1.pk
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Config.objects.count(), 2)

        # Remove list success
        response = self.client.delete(
            "/api/v1/config/?ids=%s" % ','.join([str(self.item0.pk), str(self.item2.pk)])
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Config.objects.count(), 0)
