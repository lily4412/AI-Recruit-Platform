"""
main/views.py
ViewSets for JobRequisition, Candidate, Application.
Includes simulated AI screening endpoint.
"""

import random
from datetime import datetime
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import JobRequisition, Candidate, Application
from .serializers import JobRequisitionSerializer, CandidateSerializer, ApplicationSerializer
from core.utils import success_response, error_response, created_response
from logs.utils import log_action


class JobRequisitionViewSet(viewsets.ModelViewSet):
    queryset           = JobRequisition.objects.filter(is_active=True).select_related(
                            "department", "level", "employment_type", "location", "posted_by"
                         ).prefetch_related("required_skills", "applications")
    serializer_class   = JobRequisitionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["status", "department", "level", "employment_type"]
    search_fields      = ["title", "job_id", "description"]
    ordering_fields    = ["created_at", "title", "status"]

    def perform_create(self, serializer):
        obj = serializer.save(posted_by=self.request.user)
        log_action(self.request.user, "CREATE", "JobRequisition", obj.pk, None, serializer.data)

    def perform_update(self, serializer):
        old = JobRequisitionSerializer(self.get_object()).data
        obj = serializer.save()
        log_action(self.request.user, "UPDATE", "JobRequisition", obj.pk, old, serializer.data)

    def perform_destroy(self, instance):
        old = JobRequisitionSerializer(instance).data
        instance.is_active = False
        instance.save()
        log_action(self.request.user, "DELETE", "JobRequisition", instance.pk, old, None)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return success_response(message="Job requisition deactivated successfully")

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        """Publish a draft job requisition."""
        obj = self.get_object()
        if obj.status != "draft":
            return error_response("Only draft requisitions can be published")
        obj.status = "open"
        obj.save()
        log_action(request.user, "UPDATE", "JobRequisition", obj.pk, {"status": "draft"}, {"status": "open"})
        return success_response(JobRequisitionSerializer(obj).data, "Job published successfully")

    @action(detail=True, methods=["get"], url_path="applications")
    def applications(self, request, pk=None):
        """List all applications for this requisition."""
        obj  = self.get_object()
        apps = obj.applications.filter(is_active=True).select_related("candidate")
        serializer = ApplicationSerializer(apps, many=True)
        return success_response(serializer.data, f"Applications for {obj.job_id}")


class CandidateViewSet(viewsets.ModelViewSet):
    queryset           = Candidate.objects.filter(is_active=True).prefetch_related("skills", "applications")
    serializer_class   = CandidateSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["source", "gender"]
    search_fields      = ["first_name", "last_name", "email", "candidate_id",
                          "current_company", "current_title"]
    ordering_fields    = ["created_at", "total_experience", "ai_profile_score"]

    def perform_create(self, serializer):
        obj = serializer.save(added_by=self.request.user)
        log_action(self.request.user, "CREATE", "Candidate", obj.pk, None, serializer.data)

    def perform_update(self, serializer):
        old = CandidateSerializer(self.get_object()).data
        obj = serializer.save()
        log_action(self.request.user, "UPDATE", "Candidate", obj.pk, old, serializer.data)

    def perform_destroy(self, instance):
        old = CandidateSerializer(instance).data
        instance.is_active = False
        instance.save()
        log_action(self.request.user, "DELETE", "Candidate", instance.pk, old, None)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return success_response(message="Candidate deactivated")

    @action(detail=True, methods=["post"], url_path="ai-score")
    def ai_score(self, request, pk=None):
        """Simulate AI profile scoring for a candidate."""
        candidate = self.get_object()
        # Simulated AI score based on experience and skill count
        skill_count = candidate.skills.count()
        exp_factor  = min(float(candidate.total_experience) / 10, 1.0)
        base_score  = (skill_count * 5 + exp_factor * 50 + random.uniform(10, 30))
        score       = round(min(base_score, 100), 2)

        candidate.ai_profile_score = score
        candidate.save(update_fields=["ai_profile_score", "updated_at"])
        return success_response({"ai_profile_score": score, "candidate_id": candidate.candidate_id},
                                 "AI profile score computed")


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset           = Application.objects.filter(is_active=True).select_related(
                            "candidate", "requisition", "reviewed_by", "rejection_reason"
                         )
    serializer_class   = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields   = ["status", "requisition", "candidate", "is_auto_shortlisted"]
    search_fields      = ["application_id", "candidate__first_name", "candidate__last_name",
                          "requisition__title"]
    ordering_fields    = ["created_at", "ai_match_score", "status"]

    def perform_create(self, serializer):
        obj = serializer.save()
        log_action(self.request.user, "CREATE", "Application", obj.pk, None, serializer.data)

    def perform_update(self, serializer):
        old = ApplicationSerializer(self.get_object()).data
        obj = serializer.save()
        log_action(self.request.user, "UPDATE", "Application", obj.pk, old, serializer.data)

    def perform_destroy(self, instance):
        old = ApplicationSerializer(instance).data
        instance.is_active = False
        instance.save()
        log_action(self.request.user, "DELETE", "Application", instance.pk, old, None)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return success_response(message="Application removed")

    @action(detail=True, methods=["post"], url_path="ai-screen")
    def ai_screen(self, request, pk=None):
        """Run AI screening on this application — computes match score."""
        app       = self.get_object()
        req       = app.requisition
        candidate = app.candidate

        # Simulated AI match score
        req_skills  = set(req.required_skills.values_list("name", flat=True))
        can_skills  = set(candidate.skills.values_list("name", flat=True))
        skill_match = len(req_skills & can_skills) / max(len(req_skills), 1) * 40

        exp_match   = 0
        if req.min_experience <= candidate.total_experience <= req.max_experience:
            exp_match = 30
        elif candidate.total_experience >= req.min_experience:
            exp_match = 20

        random_score = random.uniform(5, 30)
        total_score  = round(min(skill_match + exp_match + random_score, 100), 2)

        auto_shortlist = total_score >= float(req.ai_score_threshold)
        notes = (
            f"Skill match: {len(req_skills & can_skills)}/{len(req_skills)} skills matched. "
            f"Experience: {candidate.total_experience} yrs (req: {req.min_experience}-{req.max_experience}). "
            f"AI Score: {total_score}%. "
            + ("AUTO-SHORTLISTED ✓" if auto_shortlist else "Did not meet threshold.")
        )

        app.ai_match_score       = total_score
        app.ai_screening_notes   = notes
        app.ai_screened_at       = timezone.now()
        app.is_auto_shortlisted  = auto_shortlist
        if auto_shortlist:
            app.status = "shortlisted"
        else:
            app.status = "ai_screening"
        app.save()

        # Log AI screening usage
        from transactions.models import AIToolUsage
        from master.models import AITool
        tool = AITool.objects.filter(tool_type="screening", is_integrated=True).first()
        if tool:
            AIToolUsage.objects.create(
                application=app,
                ai_tool=tool,
                tool_name=tool.name,
                score_generated=total_score,
                output_notes=notes,
                used_by=request.user,
            )

        return success_response({
            "application_id":    app.application_id,
            "ai_match_score":    total_score,
            "auto_shortlisted":  auto_shortlist,
            "notes":             notes,
            "new_status":        app.status,
        }, "AI screening completed")

    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        """Update application status with audit trail."""
        app        = self.get_object()
        new_status = request.data.get("status")
        valid      = dict(Application.STATUS_CHOICES).keys()
        if new_status not in valid:
            return error_response(f"Invalid status. Valid: {list(valid)}")
        old_status = app.status
        app.status = new_status
        if "reviewer_notes" in request.data:
            app.reviewer_notes = request.data["reviewer_notes"]
        app.reviewed_by = request.user
        app.save()
        log_action(request.user, "UPDATE", "Application", app.pk,
                   {"status": old_status}, {"status": new_status})
        return success_response(ApplicationSerializer(app).data, "Status updated")
