"""ai_recruitment URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from core.views import LoginView, LogoutView, DashboardStatsView, UserProfileView

# from core.views import home
from core import views 

urlpatterns = [

    # path("", home),   # 👈 ADD THIS
    path("", views.home),  
    # Admin
    path("admin/", admin.site.urls),

    # Auth endpoints
    path("api/auth/login/",   LoginView.as_view(),        name="login"),
    path("api/auth/logout/",  LogoutView.as_view(),       name="logout"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/profile/", UserProfileView.as_view(),  name="profile"),

    # Dashboard
    path("api/dashboard/stats/", DashboardStatsView.as_view(), name="dashboard"),

    # Feature apps
    path("api/master/",       include("master.urls")),
    path("api/",              include("main.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/logs/",         include("logs.urls")),

    # API Schema / Docs
   path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
