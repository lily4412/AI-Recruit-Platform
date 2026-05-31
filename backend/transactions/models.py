"""
transactions/models.py
Transactional/operational data: Interviews, Offers, AI Tool Usage records.
"""

from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel
from main.models import Application
from master.models import AITool


class Interview(BaseModel):
    """Scheduled interview for an application."""

    TYPE_CHOICES   = [
        ("screening",    "Screening Round"),
        ("technical",    "Technical Round"),
        ("hr",           "HR Round"),
        ("managerial",   "Managerial Round"),
        ("panel",        "Panel Interview"),
        ("ai_video",     "AI Video Interview"),
    ]
    STATUS_CHOICES = [
        ("scheduled",  "Scheduled"),
        ("completed",  "Completed"),
        ("cancelled",  "Cancelled"),
        ("no_show",    "No Show"),
        ("rescheduled","Rescheduled"),
    ]
    RESULT_CHOICES = [
        ("pending",  "Pending"),
        ("pass",     "Pass"),
        ("fail",     "Fail"),
        ("on_hold",  "On Hold"),
    ]

    application     = models.ForeignKey(Application, on_delete=models.CASCADE, related_name="interviews")
    interview_type  = models.CharField(max_length=20, choices=TYPE_CHOICES)
    round_number    = models.PositiveIntegerField(default=1)
    scheduled_at    = models.DateTimeField()
    duration_mins   = models.PositiveIntegerField(default=60)
    location_or_link = models.CharField(max_length=500, blank=True, help_text="Room or video link")
    interviewers    = models.ManyToManyField(User, related_name="interviews_conducted", blank=True)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    result          = models.CharField(max_length=20, choices=RESULT_CHOICES, default="pending")
    feedback        = models.TextField(blank=True)
    rating          = models.PositiveIntegerField(null=True, blank=True,
                                                   help_text="Interviewer rating 1-5")
    ai_assessment   = models.TextField(blank=True, help_text="AI video analysis notes")
    ai_score        = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    scheduled_by    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                         related_name="interviews_scheduled")

    class Meta:
        db_table = "transactions_interview"
        ordering = ["scheduled_at"]

    def __str__(self):
        return (f"Interview #{self.round_number} — "
                f"{self.application.candidate.full_name} — {self.get_interview_type_display()}")


class Offer(BaseModel):
    """Job offer extended to a candidate."""

    STATUS_CHOICES = [
        ("draft",     "Draft"),
        ("extended",  "Extended"),
        ("accepted",  "Accepted"),
        ("declined",  "Declined"),
        ("revoked",   "Revoked"),
        ("expired",   "Expired"),
    ]

    application     = models.OneToOneField(Application, on_delete=models.CASCADE, related_name="offer")
    offer_date      = models.DateField()
    expiry_date     = models.DateField()
    offered_salary  = models.DecimalField(max_digits=12, decimal_places=2)
    joining_date    = models.DateField(null=True, blank=True)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    offer_letter    = models.FileField(upload_to="offers/", null=True, blank=True)
    decline_reason  = models.TextField(blank=True)
    notes           = models.TextField(blank=True)
    created_by      = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                         related_name="offers_created")

    class Meta:
        db_table = "transactions_offer"
        ordering = ["-offer_date"]

    def __str__(self):
        return (f"Offer — {self.application.candidate.full_name} — "
                f"₹{self.offered_salary} — {self.get_status_display()}")


class AIToolUsage(BaseModel):
    """Records every time an AI tool is used in the recruitment process."""

    application     = models.ForeignKey(Application, on_delete=models.CASCADE,
                                         related_name="ai_tool_usages", null=True, blank=True)
    ai_tool         = models.ForeignKey(AITool, on_delete=models.SET_NULL, null=True,
                                         related_name="usages")
    tool_name       = models.CharField(max_length=100)  # Denormalized for history
    score_generated = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    output_notes    = models.TextField(blank=True)
    processing_time_ms = models.PositiveIntegerField(null=True, blank=True)
    used_by         = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                         related_name="ai_usages")

    class Meta:
        db_table = "transactions_ai_tool_usage"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tool_name} — {self.application} — {self.created_at.date()}"
