from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from apps.administrator.serializers import (
    AdministratorBaseSerializer,
)


def jwt_response_payload_handler(token, user=None, request=None):
    if hasattr(user, 'administrator'):
        parent = user.administrator
        parent.fingerprint = request.META.get('HTTP_FINGERPRINT', '')
        parent.save()
        data = AdministratorBaseSerializer(parent).data
        data['is_admin'] = True
    else:
        parent = user.customer
        parent.fingerprint = request.META.get('HTTP_FINGERPRINT', '')
        parent.save()
    data['token'] = token
    tokenData = {'token': token}
    valid_data = VerifyJSONWebTokenSerializer().validate(tokenData)
    return {
        'user': data
    }


def getToken(headers):
    result = headers.get('Authorization', None)
    if(result):
        return result.split(' ')[1]
    return ''
