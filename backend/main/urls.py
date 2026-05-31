from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobRequisitionViewSet, CandidateViewSet, ApplicationViewSet

router = DefaultRouter()
router.register("jobs",         JobRequisitionViewSet, basename="job")
router.register("candidates",   CandidateViewSet,      basename="candidate")
router.register("applications", ApplicationViewSet,    basename="application")

urlpatterns = [path("", include(router.urls))]
