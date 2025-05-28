from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
class IsAdmin(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in SAFE_METHODS:
                # Allow read-only access to anyone, even unauthenticated
                return True
            # Write permissions only for authenticated admins
            return request.user.is_authenticated and getattr(request.user, 'peran', None) == 'admin'