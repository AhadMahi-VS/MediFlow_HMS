# 🏥 MediFlow - Hospital Management System (Full Stack)

**MediFlow** is a complete Information System for hospitals, built with **Python (Django)**, **MySQL**, and a Modern Frontend. It manages Patients, Doctors, Appointments, and Billing efficiently.

![Status](https://img.shields.io/badge/Status-Complete-success)
![Stack](https://img.shields.io/badge/Stack-Django_|_MySQL-blue)

---

## ⚡ How to Run (The Easy Way)

We have included an **Automated Script** to set up everything for you.

### 1️⃣ Pre-requisites (Install these first)
*   **[Download Python](https://www.python.org/downloads/)** (Make sure to check "Add to PATH" during installation).
*   **[Download XAMPP](https://www.apachefriends.org/)** (For the MySQL Database).

### 2️⃣ Start the Database
1.  Open **XAMPP Control Panel**.
2.  Click **Start** next to **MySQL**.
3.  Wait until it turns **Green**.

### 3️⃣ Run the Project
1.  Download this repository (Click **Code** -> **Download ZIP** and unzip it).
2.  Open the folder.
3.  Double-click the file named **`RUN_ME.bat`**.

**That's it!** The script will automatically:
*   Install required Python libraries.
*   Connect to your Database.
*   Start the Server.
*   Open the Website in your browser.

---

## 🔐 Login Credentials (Demo Accounts)

Use these accounts to test different roles:

| Role | Username | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin` | `1234` |
| **Doctor** | `doctor` | `1234` |
| **Nurse** | `nurse` | `1234` |
| **Receptionist** | `front` | `1234` |
| **Patient** | `patient` | `1234` |

---

## 🛠️ Features Included

### 1. 🛡️ Admin
*   Manage Staff (Add/Remove Doctors & Nurses).
*   View Workload Reports.
*   Manage Departments.

### 2. 👨‍⚕️ Doctor
*   View Daily Schedule (with Patient Token Numbers).
*   Prevent Overbooking (Conflict Detection).
*   View Patient Records.

### 3. 👩‍⚕️ Nurse
*   Triage Dashboard.
*   Update Patient Vitals.

### 4. 👩‍💼 Receptionist
*   Walk-in Booking.
*   Global Patient Search.
*   Billing & Invoicing.

### 5. 😷 Patient
*   Online Booking (with VIP option).
*   View Medical History & Labs.
*   Cancel/Reschedule Appointments.

---

## ⚠️ Troubleshooting
*   **"MySQL Error":** Make sure XAMPP MySQL is running (Green).
*   **"Python not found":** Make sure you installed Python and restarted your computer.
*   **"Script closes immediately":** Right-click `RUN_ME.bat` and run as Administrator.

---
*Developed by Ahad,Mustafizur,Nishat,F.K.Murad.*