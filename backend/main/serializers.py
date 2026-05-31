from rest_framework import serializers
from .models import JobRequisition, Candidate, Application
from master.serializers import (DepartmentSerializer, TechSkillSerializer, JobLevelSerializer,
                                  EmploymentTypeSerializer, LocationSerializer)


class JobRequisitionSerializer(serializers.ModelSerializer):
    department_detail      = DepartmentSerializer(source="department", read_only=True)
    level_detail           = JobLevelSerializer(source="level", read_only=True)
    employment_type_detail = EmploymentTypeSerializer(source="employment_type", read_only=True)
    location_detail        = LocationSerializer(source="location", read_only=True)
    skills_detail          = TechSkillSerializer(source="required_skills", many=True, read_only=True)
    posted_by_name         = serializers.CharField(source="posted_by.get_full_name", read_only=True)
    application_count      = serializers.SerializerMethodField()
    status_display         = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model  = JobRequisition
        fields = "__all__"
        read_only_fields = ["job_id", "created_at", "updated_at"]

    def get_application_count(self, obj):
        return obj.applications.filter(is_active=True).count()

    def validate(self, data):
        if data.get("min_experience", 0) > data.get("max_experience", 99):
            raise serializers.ValidationError("min_experience cannot exceed max_experience")
        if data.get("min_salary") and data.get("max_salary"):
            if data["min_salary"] > data["max_salary"]:
                raise serializers.ValidationError("min_salary cannot exceed max_salary")
        return data


class CandidateSerializer(serializers.ModelSerializer):
    skills_detail    = TechSkillSerializer(source="skills", many=True, read_only=True)
    full_name        = serializers.ReadOnlyField()
    source_display   = serializers.CharField(source="get_source_display", read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model  = Candidate
        fields = "__all__"
        read_only_fields = ["candidate_id", "created_at", "updated_at", "ai_profile_score"]

    def get_application_count(self, obj):
        return obj.applications.filter(is_active=True).count()

    def validate_email(self, value):
        qs = Candidate.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A candidate with this email already exists.")
        return value


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_detail    = CandidateSerializer(source="candidate", read_only=True)
    requisition_detail  = JobRequisitionSerializer(source="requisition", read_only=True)
    status_display      = serializers.CharField(source="get_status_display", read_only=True)
    reviewed_by_name    = serializers.CharField(source="reviewed_by.get_full_name", read_only=True)

    class Meta:
        model  = Application
        fields = "__all__"
        read_only_fields = ["application_id", "created_at", "updated_at",
                             "ai_match_score", "ai_screened_at", "is_auto_shortlisted"]

    def validate(self, data):
        # Prevent duplicate application
        candidate    = data.get("candidate", getattr(self.instance, "candidate", None))
        requisition  = data.get("requisition", getattr(self.instance, "requisition", None))
        qs = Application.objects.filter(candidate=candidate, requisition=requisition)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This candidate has already applied for this position.")
        return data
