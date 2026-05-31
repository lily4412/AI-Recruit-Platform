from rest_framework import serializers
from .models import Department, TechSkill, JobLevel, AITool, EmploymentType, Location, RejectionReason


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Department
        fields = "__all__"


class TechSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TechSkill
        fields = "__all__"


class JobLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobLevel
        fields = "__all__"


class AIToolSerializer(serializers.ModelSerializer):
    tool_type_display = serializers.CharField(source="get_tool_type_display", read_only=True)

    class Meta:
        model  = AITool
        fields = "__all__"


class EmploymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EmploymentType
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Location
        fields = "__all__"


class RejectionReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model  = RejectionReason
        fields = "__all__"
