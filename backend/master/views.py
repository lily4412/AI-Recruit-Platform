from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Department, TechSkill, JobLevel, AITool, EmploymentType, Location, RejectionReason
from .serializers import (DepartmentSerializer, TechSkillSerializer, JobLevelSerializer,
                           AIToolSerializer, EmploymentTypeSerializer, LocationSerializer,
                           RejectionReasonSerializer)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset           = Department.objects.filter(is_active=True)
    serializer_class   = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    search_fields      = ["name", "code"]
    ordering_fields    = ["name", "created_at"]


class TechSkillViewSet(viewsets.ModelViewSet):
    queryset           = TechSkill.objects.filter(is_active=True)
    serializer_class   = TechSkillSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["category"]
    search_fields      = ["name"]


class JobLevelViewSet(viewsets.ModelViewSet):
    queryset           = JobLevel.objects.filter(is_active=True)
    serializer_class   = JobLevelSerializer
    permission_classes = [IsAuthenticated]


class AIToolViewSet(viewsets.ModelViewSet):
    queryset           = AITool.objects.filter(is_active=True)
    serializer_class   = AIToolSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["tool_type", "is_integrated"]
    search_fields      = ["name", "vendor"]


class EmploymentTypeViewSet(viewsets.ModelViewSet):
    queryset           = EmploymentType.objects.filter(is_active=True)
    serializer_class   = EmploymentTypeSerializer
    permission_classes = [IsAuthenticated]


class LocationViewSet(viewsets.ModelViewSet):
    queryset           = Location.objects.filter(is_active=True)
    serializer_class   = LocationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["is_remote", "country"]
    search_fields      = ["city", "state"]


class RejectionReasonViewSet(viewsets.ModelViewSet):
    queryset           = RejectionReason.objects.filter(is_active=True)
    serializer_class   = RejectionReasonSerializer
    permission_classes = [IsAuthenticated]
