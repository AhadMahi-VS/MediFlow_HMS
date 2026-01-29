const API_URL = "http://127.0.0.1:8000/api";
let currentUser = JSON.parse(sessionStorage.getItem('user'));

// --- 1. AUTHENTICATION ---
if(document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = document.getElementById('uName').value;
        const p = document.getElementById('uPass').value;
        try {
            const res = await fetch(`${API_URL}/login`, { method: 'POST', body: JSON.stringify({ id: u, password: p }) });
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                currentUser = data.user;
                toggleAuth('hide'); initMenu();
            } else { alert(data.message); }
        } catch (err) { alert("Server Error"); }
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({ 
                name: document.getElementById('regName').value, 
                id: document.getElementById('regUser').value, 
                password: document.getElementById('regPass').value, 
                role: document.getElementById('regRole').value 
            })
        });
        const data = await res.json();
        if(data.success) { alert("Success! Please Login."); toggleAuth('login'); }
        else { alert(data.message); }
    });
}

function toggleAuth(action) {
    const overlay = document.getElementById('auth-overlay');
    const app = document.getElementById('app');
    if(action === 'hide') {
        overlay.style.display = 'none'; app.style.display = 'flex';
        document.getElementById('dispName').innerText = currentUser.name;
        document.getElementById('dispRole').innerText = currentUser.role.toUpperCase();
    } else {
        overlay.style.display = 'flex'; app.style.display = 'none';
        if(action === 'register') { document.getElementById('loginCard').style.display = 'none'; document.getElementById('registerCard').style.display = 'block'; }
        else { document.getElementById('loginCard').style.display = 'block'; document.getElementById('registerCard').style.display = 'none'; }
    }
}

if(currentUser) { toggleAuth('hide'); initMenu(); }
function logout() { sessionStorage.removeItem('user'); location.reload(); }

// --- 2. DYNAMIC MENUS ---
function initMenu() {
    const menu = document.getElementById('dynamicMenu');
    menu.innerHTML = `<li onclick="render('dashboard')"><i class="fa-solid fa-chart-line"></i> Dashboard</li>`;

    if(currentUser.role === 'admin') {
        menu.innerHTML += `
            <li onclick="render('users')"><i class="fa-solid fa-users-gear"></i> Manage Staff</li>
            <li onclick="render('reports')"><i class="fa-solid fa-file-invoice"></i> Clinic Reports</li>
            <li onclick="render('depts')"><i class="fa-solid fa-building"></i> Departments</li>
        `;
    }
    if(currentUser.role === 'doctor' || currentUser.role === 'nurse') {
        menu.innerHTML += `
            <li onclick="render('appointments')"><i class="fa-solid fa-calendar-day"></i> Schedule</li>
            <li onclick="render('patients')"><i class="fa-solid fa-user-injured"></i> Patient Records</li>
        `;
    }
    if(currentUser.role === 'reception') {
        menu.innerHTML += `
            <li onclick="render('book')"><i class="fa-solid fa-calendar-plus"></i> Walk-in Booking</li>
            <li onclick="render('appointments')"><i class="fa-solid fa-list-ol"></i> Manage Appointments</li>
        `;
    }
    if(currentUser.role === 'patient') {
        menu.innerHTML += `<li onclick="render('book')"><i class="fa-solid fa-calendar-plus"></i> Book Appointment</li>
        <li onclick="render('appointments')"><i class="fa-solid fa-clock"></i> My Appointments</li>`;
    }
    render('dashboard');
}

// --- 3. RENDERING ---
async function render(screen) {
    const container = document.getElementById('main-container');
    const title = document.getElementById('pageTitle');
    container.innerHTML = 'Loading...';

    // DASHBOARD
    if(screen === 'dashboard') {
        title.innerText = 'Overview';
        container.innerHTML = `<div class="card"><h3>Welcome, ${currentUser.name}</h3></div>`;
    }

    // REPORTS (Admin Requirement)
    if(screen === 'reports') {
        title.innerText = 'Clinic Reports';
        const res = await fetch(`${API_URL}/reports`);
        const data = await res.json();
        container.innerHTML = `<div class="card"><h3>Doctor Workload</h3>
        <ul>${data.map(d => `<li>${d.doctor_name}: <strong>${d.count}</strong> patients</li>`).join('')}</ul>
        </div>`;
    }

    // APPOINTMENTS (Doctor/Nurse/Reception/Patient)
    if(screen === 'appointments') {
        title.innerText = 'Schedule';
        const res = await fetch(`${API_URL}/appointments`);
        const data = await res.json();
        
        let html = '';
        // SEARCH BAR (Reception Requirement)
        if(currentUser.role === 'reception') {
            html += `<input type="text" id="search" placeholder="Search Patient..." style="width:100%; padding:10px; margin-bottom:10px" onkeyup="filterTable()">`;
        }

        html += `<table class="card" id="appTable"><thead><tr><th>Serial #</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>`;
        
        data.forEach(a => {
            // Filter Logic
            if(currentUser.role === 'patient' && a.patient_name !== currentUser.name) return;
            if((currentUser.role === 'doctor' || currentUser.role === 'nurse') && a.doctor_name !== currentUser.name) return;

            // Action Buttons
            let actions = '-';
            if(currentUser.role === 'patient' || currentUser.role === 'reception') {
                actions = `<button class="btn btn-danger" onclick="cancelAppt(${a.id})">Cancel</button>`;
            }

            html += `<tr><td>#${a.serial_number}</td><td>${a.patient_name}</td><td>${a.doctor_name}</td><td>${a.date}</td><td>${a.status}</td><td>${actions}</td></tr>`;
        });
        
        container.innerHTML = html + `</tbody></table>`;
    }

    // USER MANAGEMENT (Admin)
    if(screen === 'users') {
        title.innerText = 'Staff Management';
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        container.innerHTML = `<div style="margin-bottom:15px;"><button class="btn btn-primary" onclick="openModal('addUser')">+ Add Staff</button></div>
        <table class="card"><thead><tr><th>Name</th><th>Role</th><th>Action</th></tr></thead><tbody>
        ${users.map(u => `<tr><td>${u.name}</td><td>${u.role}</td><td><button class="btn btn-danger" onclick="delUser(${u.id})">Remove</button></td></tr>`).join('')}</tbody></table>`;
    }

    // BOOKING FORM
    if(screen === 'book') {
        title.innerText = 'Book Appointment';
        container.innerHTML = `<div class="card">
            <label>Doctor</label><input id="bkDoc" placeholder="Dr. House">
            <label>Date</label><input type="date" id="bkDate">
            <label>Time</label><input type="text" id="bkTime" placeholder="09:00">
            <button class="btn btn-primary full" onclick="bookNow()">Confirm Booking</button>
        </div>`;
    }
}

// --- 4. ACTIONS ---

// Conflict Check & Serial Number handled by Backend
async function bookNow() {
    const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST', body: JSON.stringify({
            patient: currentUser.name,
            doctor: document.getElementById('bkDoc').value,
            date: document.getElementById('bkDate').value,
            time: document.getElementById('bkTime').value
        })
    });
    const data = await res.json();
    if(data.success) { alert(data.message); render('appointments'); } // Shows Token #
    else { alert(data.message); } // Shows "Slot Taken"
}

// Cancel (Patient Requirement)
async function cancelAppt(id) {
    if(confirm("Cancel Appointment?")) {
        await fetch(`${API_URL}/appointments`, { method: 'PUT', body: JSON.stringify({ db_id: id, status: 'Cancelled' }) });
        render('appointments');
    }
}

// Search (Reception Requirement)
window.filterTable = function() {
    const q = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#appTable tbody tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

// Add User Logic
async function addUser() {
    await fetch(`${API_URL}/users`, {
        method: 'POST', body: JSON.stringify({
            id: document.getElementById('nuId').value,
            name: document.getElementById('nuName').value,
            role: document.getElementById('nuRole').value
        })
    });
    closeModal(); render('users');
}
async function delUser(id) {
    if(confirm("Remove user?")) {
        await fetch(`${API_URL}/users`, { method: 'DELETE', body: JSON.stringify({ db_id: id }) });
        render('users');
    }
}

function openModal(type) {
    const body = document.getElementById('modalBody');
    document.getElementById('modalTitle').innerText = 'Action';
    if(type === 'addUser') {
        body.innerHTML = `<input id="nuName" placeholder="Name"><input id="nuId" placeholder="Username"><select id="nuRole"><option value="doctor">Doctor</option><option value="nurse">Nurse</option><option value="reception">Reception</option></select><button class="btn btn-primary full" onclick="addUser()">Add</button>`;
    }
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }