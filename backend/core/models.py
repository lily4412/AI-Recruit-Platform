"""
core/models.py
Base abstract model and User Profile for AI IT Recruitment Platform.
"""

from django.db import models
from django.contrib.auth.models import User


class BaseModel(models.Model):
    """Abstract base model — all app models inherit from this."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class UserProfile(BaseModel):
    """Extended profile for authenticated users."""

    ROLE_CHOICES = [
        ("admin",     "Admin"),
        ("hr_manager","HR Manager"),
        ("recruiter", "Recruiter"),
        ("analyst",   "Analyst"),
    ]

    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role        = models.CharField(max_length=20, choices=ROLE_CHOICES, default="recruiter")
    phone       = models.CharField(max_length=15, blank=True)
    department  = models.CharField(max_length=100, blank=True)
    avatar      = models.ImageField(upload_to="avatars/", null=True, blank=True)

    class Meta:
        db_table = "core_user_profile"
        verbose_name = "User Profile"

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.role})"
