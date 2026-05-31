from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display   = ["action", "table_name", "record_id", "user", "timestamp"]
    list_filter    = ["action", "table_name"]
    search_fields  = ["user__username", "table_name"]
    readonly_fields = ["user", "action", "table_name", "record_id",
                       "old_value", "new_value", "timestamp"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
