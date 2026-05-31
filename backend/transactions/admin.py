from django.contrib import admin
from .models import Interview, Offer, AIToolUsage


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display  = ["application", "interview_type", "round_number", "scheduled_at", "status", "result", "rating"]
    list_filter   = ["status", "result", "interview_type"]
    search_fields = ["application__candidate__first_name", "application__candidate__last_name"]
    filter_horizontal = ["interviewers"]


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display  = ["application", "offered_salary", "offer_date", "expiry_date", "status"]
    list_filter   = ["status"]
    search_fields = ["application__candidate__first_name"]


@admin.register(AIToolUsage)
class AIToolUsageAdmin(admin.ModelAdmin):
    list_display  = ["tool_name", "application", "score_generated", "used_by", "created_at"]
    list_filter   = ["ai_tool"]
    readonly_fields = ["created_at", "updated_at"]
