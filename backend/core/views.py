"""core/views.py — Authentication and Dashboard statistics."""

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import LoginSerializer, UserSerializer
from .utils import success_response, error_response

# Import models lazily to avoid circular imports
def _get_counts():
    from main.models import JobRequisition, Candidate, Application
    from transactions.models import Interview, Offer
    return {
        "total_jobs":         JobRequisition.objects.filter(is_active=True).count(),
        "open_jobs":          JobRequisition.objects.filter(status="open", is_active=True).count(),
        "total_candidates":   Candidate.objects.filter(is_active=True).count(),
        "total_applications": Application.objects.filter(is_active=True).count(),
        "shortlisted":        Application.objects.filter(status="shortlisted", is_active=True).count(),
        "interviews_scheduled": Interview.objects.filter(status="scheduled", is_active=True).count(),
        "offers_extended":    Offer.objects.filter(status="extended", is_active=True).count(),
        "offers_accepted":    Offer.objects.filter(status="accepted", is_active=True).count(),
    }


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid input", serializer.errors)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return error_response("Invalid credentials", status_code=401)

        refresh = RefreshToken.for_user(user)
        return success_response({
            "access":  str(refresh.access_token),
            "refresh": str(refresh),
            "user":    UserSerializer(user).data,
        }, "Login successful")


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return success_response(message="Logged out successfully")
        except TokenError:
            return error_response("Invalid token")


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return success_response(UserSerializer(request.user).data, "Profile retrieved")

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, "Profile updated")
        return error_response("Validation failed", serializer.errors)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            counts = _get_counts()

            # Recent applications
            from main.models import Application
            from main.serializers import ApplicationSerializer
            recent = Application.objects.filter(is_active=True).order_by("-created_at")[:5]

            # AI tool usage stats
            from transactions.models import AIToolUsage
            ai_stats = AIToolUsage.objects.filter(is_active=True).values(
                "tool_name"
            ).distinct().count()

            counts["ai_tools_active"] = ai_stats
            counts["recent_applications"] = ApplicationSerializer(recent, many=True).data

            return success_response(counts, "Dashboard stats retrieved")
        except Exception as e:
            return success_response({}, "Stats loading")
