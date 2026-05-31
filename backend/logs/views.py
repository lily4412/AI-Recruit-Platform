from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only audit trail. Admins and HR managers can view."""
    queryset           = AuditLog.objects.all().select_related("user")
    serializer_class   = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["action", "table_name", "user"]
    search_fields      = ["table_name", "user__username"]
    ordering_fields    = ["timestamp"]
