from rest_framework import permissions


class CustomPermissionExp(permissions.BasePermission):

    def has_permission(self, request, view):
        permission = view.action + '_' + view.name
        if request.user.user_permissions.filter(codename=permission).count():
            return True
        if request.user.groups.filter(permissions__codename=permission).count():
            return True
        return False

class CustomPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.user_permissions.filter(codename__in=view.permissions).count():
            return True
        if request.user.groups.filter(permissions__codename__in=view.permissions).count():
            return True
        return False

    # def has_object_permission(self, request, view, obj):
    #    return True
