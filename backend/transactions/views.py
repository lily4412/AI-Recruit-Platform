from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Interview, Offer, AIToolUsage
from .serializers import InterviewSerializer, OfferSerializer, AIToolUsageSerializer
from core.utils import success_response, error_response
from logs.utils import log_action


class InterviewViewSet(viewsets.ModelViewSet):
    queryset           = Interview.objects.filter(is_active=True).select_related(
                            "application__candidate", "application__requisition", "scheduled_by"
                         ).prefetch_related("interviewers")
    serializer_class   = InterviewSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["status", "result", "interview_type", "application"]
    search_fields      = ["application__candidate__first_name", "application__candidate__last_name"]
    ordering_fields    = ["scheduled_at", "created_at"]

    def perform_create(self, serializer):
        obj = serializer.save(scheduled_by=self.request.user)
        # Update application status
        app = obj.application
        if app.status not in ["interview_scheduled", "interviewed"]:
            app.status = "interview_scheduled"
            app.save()
        log_action(self.request.user, "CREATE", "Interview", obj.pk, None, serializer.data)

    def perform_update(self, serializer):
        old = InterviewSerializer(self.get_object()).data
        obj = serializer.save()
        log_action(self.request.user, "UPDATE", "Interview", obj.pk, old, serializer.data)

    def perform_destroy(self, instance):
        old = InterviewSerializer(instance).data
        instance.is_active = False
        instance.save()
        log_action(self.request.user, "DELETE", "Interview", instance.pk, old, None)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return success_response(message="Interview cancelled")


class OfferViewSet(viewsets.ModelViewSet):
    queryset           = Offer.objects.filter(is_active=True).select_related(
                            "application__candidate", "application__requisition", "created_by"
                         )
    serializer_class   = OfferSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["status", "application"]
    search_fields      = ["application__candidate__first_name", "application__candidate__last_name"]
    ordering_fields    = ["offer_date", "offered_salary"]

    def perform_create(self, serializer):
        obj = serializer.save(created_by=self.request.user)
        app = obj.application
        app.status = "offer_extended"
        app.save()
        log_action(self.request.user, "CREATE", "Offer", obj.pk, None, serializer.data)

    def perform_update(self, serializer):
        old = OfferSerializer(self.get_object()).data
        obj = serializer.save()
        if obj.status == "accepted":
            obj.application.status = "hired"
            obj.application.save()
        log_action(self.request.user, "UPDATE", "Offer", obj.pk, old, serializer.data)

    def perform_destroy(self, instance):
        old = OfferSerializer(instance).data
        instance.is_active = False
        instance.save()
        log_action(self.request.user, "DELETE", "Offer", instance.pk, old, None)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return success_response(message="Offer revoked")


class AIToolUsageViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only audit of AI tool usage."""
    queryset           = AIToolUsage.objects.filter(is_active=True).select_related(
                            "application__candidate", "ai_tool", "used_by"
                         )
    serializer_class   = AIToolUsageSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["ai_tool", "used_by"]
    search_fields      = ["tool_name", "application__candidate__first_name"]
    ordering_fields    = ["created_at", "score_generated"]
