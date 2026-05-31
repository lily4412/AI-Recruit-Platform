"""logs/utils.py — Helper to create audit log entries."""

from .models import AuditLog


def log_action(user, action, table_name, record_id=None, old_value=None, new_value=None):
    """Create an AuditLog entry. Call from views after every data mutation."""
    try:
        # Sanitize JSON-serializable values
        def clean(val):
            if val is None:
                return None
            if isinstance(val, dict):
                return {k: str(v) if not isinstance(v, (dict, list, str, int, float, bool, type(None))) else v
                        for k, v in val.items()}
            return val

        AuditLog.objects.create(
            user=user,
            action=action,
            table_name=table_name,
            record_id=record_id,
            old_value=clean(old_value),
            new_value=clean(new_value),
        )
    except Exception:
        pass  # Never let logging break the main flow
