from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AppUser, Appointment, Department, PatientRecord
from django.db.models import Count
import json

def parse_body(request): return json.loads(request.body)

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        data = parse_body(request)
        try:
            user = AppUser.objects.get(username=data.get('id'), password=data.get('password'))
            return JsonResponse({"success": True, "user": {"name": user.name, "role": user.role}})
        except AppUser.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid Credentials"})

@csrf_exempt
def register_api(request):
    if request.method == 'POST':
        data = parse_body(request)
        if AppUser.objects.filter(username=data.get('id')).exists():
            return JsonResponse({"success": False, "message": "Username taken"})
        AppUser.objects.create(username=data.get('id'), password=data.get('password'), name=data.get('name'), role=data.get('role'))
        return JsonResponse({"success": True})

@csrf_exempt
def appointment_api(request):
    if request.method == 'GET':
        appts = Appointment.objects.all().values()
        return JsonResponse(list(appts), safe=False)
    
    if request.method == 'POST': # Create Booking
        data = parse_body(request)
        
        # 1. Conflict Prevention (Doctor Requirement)
        if Appointment.objects.filter(doctor_name=data.get('doctor'), date=data.get('date'), time=data.get('time')).exists():
            return JsonResponse({"success": False, "message": "Slot already booked! Please choose another time."})

        # 2. Auto Serial Number (Reception Requirement)
        count = Appointment.objects.filter(date=data.get('date')).count()
        token = count + 1

        Appointment.objects.create(
            patient_name=data.get('patient'), doctor_name=data.get('doctor'),
            date=data.get('date'), time=data.get('time'), serial_number=token
        )
        return JsonResponse({"success": True, "message": f"Booked! Token #{token}"})

    if request.method == 'PUT': # Reschedule/Cancel status
        data = parse_body(request)
        appt = Appointment.objects.get(id=data.get('db_id'))
        if 'status' in data: appt.status = data.get('status')
        if 'date' in data: appt.date = data.get('date') # Reschedule logic
        appt.save()
        return JsonResponse({"success": True})

@csrf_exempt
def users_api(request):
    if request.method == 'GET':
        users = AppUser.objects.all().values()
        return JsonResponse(list(users), safe=False)
    if request.method == 'POST':
        data = parse_body(request)
        AppUser.objects.create(username=data.get('id'), password='1234', name=data.get('name'), role=data.get('role'))
        return JsonResponse({"success": True})
    if request.method == 'DELETE':
        data = parse_body(request)
        AppUser.objects.filter(id=data.get('db_id')).delete()
        return JsonResponse({"success": True})

@csrf_exempt
def reports_api(request): # Admin Requirement
    # Generate workload report
    workload = Appointment.objects.values('doctor_name').annotate(count=Count('id'))
    return JsonResponse(list(workload), safe=False)

@csrf_exempt
def departments_api(request):
    if request.method == 'GET':
        return JsonResponse(list(Department.objects.all().values()), safe=False)
    if request.method == 'POST':
        data = parse_body(request)
        Department.objects.create(name=data.get('name'), head=data.get('head'), location=data.get('loc'))
        return JsonResponse({"success": True})