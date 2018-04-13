from django.urls import reverse
from django.contrib.auth.models import Permission
from django.contrib.auth.models import User
from core import env


class TestHelpers():

    @staticmethod
    def testSetup(testInstance):
        # Add original user
        user = User.objects.create_superuser(
            username=env.FIRST_USER_USERNAME,
            password=env.FIRST_USER_PASSWORD,
            email=''
        )

        # Grand all permission to this user
        permissions = Permission.objects.all()
        for p in permissions:
            user.user_permissions.add(p)
        user.save()

        # Login then create new user for real test
        testInstance.client.login(
            username=env.FIRST_USER_USERNAME,
            password=env.FIRST_USER_PASSWORD
        )
        newAdminResponse = testInstance.client.post(
            reverse('api_v1:administrator:create'),
            env.TEST_ADMIN
        ).json()

        # Grand add permission to new user
        user = User.objects.get(username=newAdminResponse['username'])
        for p in permissions:
            user.user_permissions.add(p)
        user.save()

        # Logout
        testInstance.client.logout()
        testInstance.client.login(
            username=env.TEST_ADMIN['username'],
            password=env.TEST_ADMIN['password']
        )

        # Test user login and get token
        response = testInstance.client.post(
            reverse('api_v1:administrator:login'),
            {
                'username': env.TEST_ADMIN['username'],
                'password': env.TEST_ADMIN['password']
            }
        )
        return response.json()['user']['token']
