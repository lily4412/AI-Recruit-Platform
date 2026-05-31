from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (DepartmentViewSet, TechSkillViewSet, JobLevelViewSet,
                    AIToolViewSet, EmploymentTypeViewSet, LocationViewSet,
                    RejectionReasonViewSet)

router = DefaultRouter()
router.register("departments",      DepartmentViewSet,     basename="department")
router.register("skills",           TechSkillViewSet,      basename="skill")
router.register("job-levels",       JobLevelViewSet,       basename="job-level")
router.register("ai-tools",         AIToolViewSet,         basename="ai-tool")
router.register("employment-types", EmploymentTypeViewSet, basename="employment-type")
router.register("locations",        LocationViewSet,       basename="location")
router.register("rejection-reasons",RejectionReasonViewSet,basename="rejection-reason")

urlpatterns = [path("", include(router.urls))]
