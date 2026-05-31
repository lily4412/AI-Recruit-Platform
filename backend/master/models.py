"""
master/models.py
Reference/lookup tables: technologies, departments, job levels, AI tools, etc.
"""

from django.db import models
from core.models import BaseModel


class Department(BaseModel):
    name        = models.CharField(max_length=100, unique=True)
    code        = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table  = "master_department"
        ordering  = ["name"]

    def __str__(self):
        return f"{self.code} — {self.name}"


class TechSkill(BaseModel):
    name     = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=[
        ("language",   "Programming Language"),
        ("framework",  "Framework/Library"),
        ("database",   "Database"),
        ("cloud",      "Cloud/DevOps"),
        ("ai_ml",      "AI/ML"),
        ("soft_skill", "Soft Skill"),
        ("other",      "Other"),
    ], default="other")

    class Meta:
        db_table = "master_tech_skill"
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class JobLevel(BaseModel):
    name         = models.CharField(max_length=50, unique=True)
    code         = models.CharField(max_length=10, unique=True)
    min_exp_years = models.PositiveIntegerField(default=0)
    max_exp_years = models.PositiveIntegerField(default=50)

    class Meta:
        db_table = "master_job_level"
        ordering = ["min_exp_years"]

    def __str__(self):
        return self.name


class AITool(BaseModel):
    """Reference table for AI recruitment tools used in the platform."""

    TOOL_TYPE_CHOICES = [
        ("ats",          "Applicant Tracking System"),
        ("screening",    "Resume Screening"),
        ("chatbot",      "Chatbot / Virtual Assistant"),
        ("video_ai",     "Video Interview AI"),
        ("predictive",   "Predictive Analytics"),
        ("jd_optimizer", "JD Optimizer"),
        ("sourcing",     "Candidate Sourcing"),
    ]

    name         = models.CharField(max_length=100)
    tool_type    = models.CharField(max_length=20, choices=TOOL_TYPE_CHOICES)
    vendor       = models.CharField(max_length=100, blank=True)
    description  = models.TextField(blank=True)
    accuracy_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    is_integrated = models.BooleanField(default=False)

    class Meta:
        db_table = "master_ai_tool"
        ordering = ["tool_type", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_tool_type_display()})"


class EmploymentType(BaseModel):
    name = models.CharField(max_length=50, unique=True)  # Full-time, Contract, etc.
    code = models.CharField(max_length=10, unique=True)

    class Meta:
        db_table = "master_employment_type"

    def __str__(self):
        return self.name


class Location(BaseModel):
    city       = models.CharField(max_length=100)
    state      = models.CharField(max_length=100)
    country    = models.CharField(max_length=100, default="India")
    is_remote  = models.BooleanField(default=False)

    class Meta:
        db_table = "master_location"
        unique_together = ["city", "state", "country"]

    def __str__(self):
        return f"{self.city}, {self.state}" + (" (Remote)" if self.is_remote else "")


class RejectionReason(BaseModel):
    reason = models.CharField(max_length=200, unique=True)

    class Meta:
        db_table = "master_rejection_reason"

    def __str__(self):
        return self.reason
