from rest_framework import serializers
from .models import Interview, Offer, AIToolUsage


class InterviewSerializer(serializers.ModelSerializer):
    candidate_name   = serializers.CharField(source="application.candidate.full_name", read_only=True)
    requisition_title = serializers.CharField(source="application.requisition.title", read_only=True)
    type_display     = serializers.CharField(source="get_interview_type_display", read_only=True)
    status_display   = serializers.CharField(source="get_status_display", read_only=True)
    result_display   = serializers.CharField(source="get_result_display", read_only=True)

    class Meta:
        model  = Interview
        fields = "__all__"

    def validate_rating(self, value):
        if value is not None and not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


class OfferSerializer(serializers.ModelSerializer):
    candidate_name    = serializers.CharField(source="application.candidate.full_name", read_only=True)
    requisition_title = serializers.CharField(source="application.requisition.title", read_only=True)
    status_display    = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model  = Offer
        fields = "__all__"

    def validate(self, data):
        if data.get("expiry_date") and data.get("offer_date"):
            if data["expiry_date"] <= data["offer_date"]:
                raise serializers.ValidationError("Expiry date must be after offer date")
        return data


class AIToolUsageSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(
        source="application.candidate.full_name", read_only=True)
    used_by_name   = serializers.CharField(source="used_by.get_full_name", read_only=True)

    class Meta:
        model  = AIToolUsage
        fields = "__all__"
