from django.contrib import admin
from .models import Department, TechSkill, JobLevel, AITool, EmploymentType, Location, RejectionReason

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display  = ["name", "code", "is_active"]
    search_fields = ["name", "code"]

@admin.register(TechSkill)
class TechSkillAdmin(admin.ModelAdmin):
    list_display  = ["name", "category", "is_active"]
    list_filter   = ["category"]

@admin.register(JobLevel)
class JobLevelAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "min_exp_years", "max_exp_years"]

@admin.register(AITool)
class AIToolAdmin(admin.ModelAdmin):
    list_display  = ["name", "tool_type", "vendor", "accuracy_pct", "is_integrated"]
    list_filter   = ["tool_type", "is_integrated"]
    search_fields = ["name", "vendor"]

@admin.register(EmploymentType)
class EmploymentTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "code"]

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display  = ["city", "state", "country", "is_remote"]
    list_filter   = ["country", "is_remote"]

@admin.register(RejectionReason)
class RejectionReasonAdmin(admin.ModelAdmin):
    list_display = ["reason", "is_active"]
