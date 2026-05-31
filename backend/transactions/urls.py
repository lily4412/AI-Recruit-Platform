from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterviewViewSet, OfferViewSet, AIToolUsageViewSet

router = DefaultRouter()
router.register("interviews",    InterviewViewSet,    basename="interview")
router.register("offers",        OfferViewSet,        basename="offer")
router.register("ai-usage",      AIToolUsageViewSet,  basename="ai-usage")

urlpatterns = [path("", include(router.urls))]
