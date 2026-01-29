from django.db import models

class AppUser(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20) # admin, doctor, nurse, reception, patient

class Department(models.Model):
    name = models.CharField(max_length=100)
    head = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

class Appointment(models.Model):
    patient_name = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=100)
    date = models.DateField()
    time = models.CharField(max_length=10)
    status = models.CharField(max_length=20, default='Confirmed')
    serial_number = models.IntegerField(default=0) # Token Number

class PatientRecord(models.Model):
    patient_name = models.CharField(max_length=100)
    diagnosis = models.TextField()
    prescription = models.TextField()
    date = models.DateField(auto_now_add=True)