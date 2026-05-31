from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserProfile
        fields = ["id", "role", "phone", "department", "avatar", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    profile    = UserProfileSerializer(read_only=True)
    full_name  = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ["id", "username", "email", "first_name", "last_name", "full_name",
                  "is_staff", "date_joined", "profile"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
