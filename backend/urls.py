from django.contrib import admin
from django.urls import path
from api.views import login_api, register_api, users_api, departments_api, appointment_api, reports_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login', login_api),
    path('api/register', register_api),
    path('api/users', users_api),
    path('api/departments', departments_api),
    path('api/appointments', appointment_api),
    path('api/reports', reports_api), # New Report Link
]