from django.contrib import admin
from .models import JobRequisition, Candidate, Application


@admin.register(JobRequisition)
class JobRequisitionAdmin(admin.ModelAdmin):
    list_display  = ["job_id", "title", "department", "status", "vacancies", "created_at"]
    list_filter   = ["status", "department", "level"]
    search_fields = ["job_id", "title"]
    filter_horizontal = ["required_skills"]


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display  = ["candidate_id", "full_name", "email", "total_experience",
                     "source", "ai_profile_score", "created_at"]
    list_filter   = ["source", "gender"]
    search_fields = ["candidate_id", "first_name", "last_name", "email"]
    filter_horizontal = ["skills"]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display  = ["application_id", "candidate", "requisition", "status",
                     "ai_match_score", "is_auto_shortlisted", "created_at"]
    list_filter   = ["status", "is_auto_shortlisted"]
    search_fields = ["application_id", "candidate__first_name", "requisition__title"]
