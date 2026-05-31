"""core/utils.py — Consistent API response helpers."""

from rest_framework.response import Response
from rest_framework import status


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    return Response({"status": "success", "message": message, "data": data}, status=status_code)


def error_response(message="Error", data=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"status": "error", "message": message, "data": data}, status=status_code)


def created_response(data=None, message="Created successfully"):
    return success_response(data, message, status.HTTP_201_CREATED)
