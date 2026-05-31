"""logs/models.py — Audit trail for all data changes."""

from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel


class AuditLog(BaseModel):
    ACTION_CHOICES = [
        ("CREATE", "Create"),
        ("UPDATE", "Update"),
        ("DELETE", "Delete"),
        ("LOGIN",  "Login"),
        ("LOGOUT", "Logout"),
        ("AI_SCREEN", "AI Screening"),
    ]

    user        = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                     related_name="audit_logs")
    action      = models.CharField(max_length=20, choices=ACTION_CHOICES)
    table_name  = models.CharField(max_length=100)
    record_id   = models.BigIntegerField(null=True, blank=True)
    old_value   = models.JSONField(null=True, blank=True)
    new_value   = models.JSONField(null=True, blank=True)
    ip_address  = models.GenericIPAddressField(null=True, blank=True)
    user_agent  = models.TextField(blank=True)
    timestamp   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "logs_audit_log"
        ordering = ["-timestamp"]

    def __str__(self):
        return (f"{self.action} on {self.table_name}#{self.record_id} "
                f"by {self.user} at {self.timestamp}")
