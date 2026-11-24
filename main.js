/* ===========================
   Legal Advisory Services JS
   Main Application Logic
   =========================== */

// ===== Application State =====
const AppState = {
    attorneys: [],
    appointments: [],
    cases: [],
    consultations: [],
    currentEditId: null,
    currentEditType: null
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeMobileMenu();
    initializeModals();
    initializeData();
    setupEventListeners();
});

// ===== Navigation System =====
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentPages = document.querySelectorAll('.content-page');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.dataset.page;
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding page
            contentPages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${pageName}-page`) {
                    page.classList.add('active');
                }
            });
            
            // Close mobile menu
            document.querySelector('.sidebar').classList.remove('active');
        });
    });
}

// ===== Mobile Menu =====
function initializeMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// ===== Modal System =====
function initializeModals() {
    // Attorney Modal
    const attorneyModal = document.getElementById('attorneyModal');
    const addAttorneyCard = document.getElementById('addAttorneyCard');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    
    addAttorneyCard.addEventListener('click', () => openAttorneyModal());
    closeModalBtn.addEventListener('click', () => closeModal('attorneyModal'));
    cancelBtn.addEventListener('click', () => closeModal('attorneyModal'));
    
    // Appointment Modal
    const appointmentModal = document.getElementById('appointmentModal');
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    const closeAppointmentBtn = document.getElementById('closeAppointmentModal');
    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');
    
    newAppointmentBtn.addEventListener('click', () => openAppointmentModal());
    closeAppointmentBtn.addEventListener('click', () => closeModal('appointmentModal'));
    cancelAppointmentBtn.addEventListener('click', () => closeModal('appointmentModal'));
    
    // Case Modal
    const caseModal = document.getElementById('caseModal');
    const newCaseBtn = document.getElementById('newCaseBtn');
    const closeCaseBtn = document.getElementById('closeCaseModal');
    const cancelCaseBtn = document.getElementById('cancelCaseBtn');
    
    newCaseBtn.addEventListener('click', () => openCaseModal());
    closeCaseBtn.addEventListener('click', () => closeModal('caseModal'));
    cancelCaseBtn.addEventListener('click', () => closeModal('caseModal'));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

function openAttorneyModal(attorney = null) {
    const modal = document.getElementById('attorneyModal');
    const form = document.getElementById('attorneyForm');
    const title = document.getElementById('modalTitle');
    
    form.reset();
    
    if (attorney) {
        // Edit mode
        title.textContent = 'Edit Attorney';
        document.getElementById('attorneyName').value = attorney.name;
        document.getElementById('attorneyTitle').value = attorney.title;
        document.getElementById('attorneyEmail').value = attorney.email;
        document.getElementById('attorneyPhone').value = attorney.phone;
        document.getElementById('attorneyExperience').value = attorney.experience;
        document.getElementById('attorneyBio').value = attorney.bio || '';
        AppState.currentEditId = attorney.id;
    } else {
        // Add mode
        title.textContent = 'Add Attorney';
        AppState.currentEditId = null;
    }
    
    modal.classList.add('active');
}

function openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    const form = document.getElementById('appointmentForm');
    const select = document.getElementById('appointmentAttorney');
    
    form.reset();
    
    // Populate attorney dropdown
    select.innerHTML = '<option value="">Choose an attorney...</option>';
    AppState.attorneys.forEach(attorney => {
        const option = document.createElement('option');
        option.value = attorney.id;
        option.textContent = attorney.name;
        select.appendChild(option);
    });
    
    modal.classList.add('active');
}

function openCaseModal() {
    const modal = document.getElementById('caseModal');
    const form = document.getElementById('caseForm');
    const select = document.getElementById('caseAttorney');
    
    form.reset();
    
    // Populate attorney dropdown
    select.innerHTML = '<option value="">Choose an attorney...</option>';
    AppState.attorneys.forEach(attorney => {
        const option = document.createElement('option');
        option.value = attorney.id;
        option.textContent = attorney.name;
        select.appendChild(option);
    });
    
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    AppState.currentEditId = null;
}

// ===== Form Handlers =====
function setupEventListeners() {
    // Attorney Form
    document.getElementById('attorneyForm').addEventListener('submit', handleAttorneySubmit);
    
    // Appointment Form
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);
    
    // Case Form
    document.getElementById('caseForm').addEventListener('submit', handleCaseSubmit);
}

async function handleAttorneySubmit(e) {
    e.preventDefault();
    
    const attorneyData = {
        name: document.getElementById('attorneyName').value,
        title: document.getElementById('attorneyTitle').value,
        email: document.getElementById('attorneyEmail').value,
        phone: document.getElementById('attorneyPhone').value,
        experience: parseInt(document.getElementById('attorneyExperience').value),
        bio: document.getElementById('attorneyBio').value
    };
    
    try {
        if (AppState.currentEditId) {
            // Update existing attorney
            await updateAttorney(AppState.currentEditId, attorneyData);
        } else {
            // Create new attorney
            await createAttorney(attorneyData);
        }
        
        closeModal('attorneyModal');
        await loadAttorneys();
    } catch (error) {
        console.error('Error saving attorney:', error);
        alert('Failed to save attorney. Please try again.');
    }
}

async function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const appointmentData = {
        client_name: document.getElementById('clientName').value,
        client_email: document.getElementById('clientEmail').value,
        client_phone: document.getElementById('clientPhone').value,
        attorney_id: document.getElementById('appointmentAttorney').value,
        appointment_date: document.getElementById('appointmentDate').value,
        appointment_time: document.getElementById('appointmentTime').value,
        consultation_type: document.getElementById('appointmentType').value,
        notes: document.getElementById('appointmentNotes').value,
        status: 'Scheduled'
    };
    
    try {
        await createAppointment(appointmentData);
        closeModal('appointmentModal');
        await loadAppointments();
    } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Failed to create appointment. Please try again.');
    }
}

async function handleCaseSubmit(e) {
    e.preventDefault();
    
    const caseData = {
        title: document.getElementById('caseTitle').value,
        client_name: document.getElementById('caseClient').value,
        attorney_id: document.getElementById('caseAttorney').value,
        case_type: document.getElementById('caseType').value,
        status: document.getElementById('caseStatus').value,
        description: document.getElementById('caseDescription').value
    };
    
    try {
        await createCase(caseData);
        closeModal('caseModal');
        await loadCases();
    } catch (error) {
        console.error('Error creating case:', error);
        alert('Failed to create case. Please try again.');
    }
}

// ===== Data Initialization =====
async function initializeData() {
    try {
        await Promise.all([
            loadAttorneys(),
            loadAppointments(),
            loadCases()
        ]);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// ===== API Functions - Attorneys =====
async function loadAttorneys() {
    try {
        const response = await fetch('tables/attorneys?limit=100');
        const result = await response.json();
        AppState.attorneys = result.data || [];
        renderAttorneys();
    } catch (error) {
        console.error('Error loading attorneys:', error);
        AppState.attorneys = [];
        renderAttorneys();
    }
}

async function createAttorney(data) {
    const response = await fetch('tables/attorneys', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function updateAttorney(id, data) {
    const response = await fetch(`tables/attorneys/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteAttorney(id) {
    await fetch(`tables/attorneys/${id}`, {
        method: 'DELETE'
    });
}

// ===== API Functions - Appointments =====
async function loadAppointments() {
    try {
        const response = await fetch('tables/appointments?limit=100');
        const result = await response.json();
        AppState.appointments = result.data || [];
        renderAppointments();
    } catch (error) {
        console.error('Error loading appointments:', error);
        AppState.appointments = [];
        renderAppointments();
    }
}

async function createAppointment(data) {
    const response = await fetch('tables/appointments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteAppointment(id) {
    await fetch(`tables/appointments/${id}`, {
        method: 'DELETE'
    });
}

// ===== API Functions - Cases =====
async function loadCases() {
    try {
        const response = await fetch('tables/cases?limit=100');
        const result = await response.json();
        AppState.cases = result.data || [];
        renderCases();
    } catch (error) {
        console.error('Error loading cases:', error);
        AppState.cases = [];
        renderCases();
    }
}

async function createCase(data) {
    const response = await fetch('tables/cases', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteCase(id) {
    await fetch(`tables/cases/${id}`, {
        method: 'DELETE'
    });
}

// ===== Render Functions =====
function renderAttorneys() {
    const grid = document.getElementById('attorneysGrid');
    const addCard = document.getElementById('addAttorneyCard');
    
    // Clear existing cards except add card
    grid.innerHTML = '';
    grid.appendChild(addCard);
    
    if (AppState.attorneys.length === 0) {
        // Show empty state message in console for debugging
        console.log('No attorneys found. Click "Add Attorney" to get started.');
        return;
    }
    
    AppState.attorneys.forEach(attorney => {
        const card = createAttorneyCard(attorney);
        grid.insertBefore(card, addCard);
    });
}

function createAttorneyCard(attorney) {
    const card = document.createElement('div');
    card.className = 'attorney-card';
    
    // Attorney photo mapping
    const attorneyPhotos = {
        'Sarah Mitchell': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
        'Michael Chen': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
        'Emily Rodriguez': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
        'David Thompson': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80',
        'Robert Anderson': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80'
    };
    
    const initials = attorney.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    const photoUrl = attorneyPhotos[attorney.name];
    const avatarContent = photoUrl 
        ? `<img src="${photoUrl}" alt="${attorney.name}" onerror="this.parentElement.innerHTML='${initials}'">`
        : initials;
    
    card.innerHTML = `
        <div class="attorney-avatar">${avatarContent}</div>
        <div class="attorney-info">
            <div class="attorney-name">${attorney.name}</div>
            <div class="attorney-title">${attorney.title}</div>
            <div class="attorney-contact">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${attorney.email}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${attorney.phone}</span>
                </div>
            </div>
            <div class="attorney-experience">
                <i class="fas fa-briefcase"></i> ${attorney.experience} years of experience
            </div>
        </div>
        <div class="attorney-actions">
            <button class="btn btn-secondary" onclick="editAttorney('${attorney.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger" onclick="removeAttorney('${attorney.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

function renderAppointments() {
    const list = document.getElementById('appointmentsList');
    
    if (AppState.appointments.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No Appointments Yet</h3>
                <p>Click "New Appointment" to schedule a consultation</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    
    AppState.appointments.forEach(appointment => {
        const attorney = AppState.attorneys.find(a => a.id === appointment.attorney_id);
        const attorneyName = attorney ? attorney.name : 'Unknown Attorney';
        
        const item = document.createElement('div');
        item.className = 'appointment-item';
        
        item.innerHTML = `
            <div class="appointment-icon">
                <i class="fas fa-calendar-check"></i>
            </div>
            <div class="appointment-details">
                <h3>${appointment.client_name}</h3>
                <div class="appointment-meta">
                    <span><i class="fas fa-user-tie"></i> ${attorneyName}</span>
                    <span><i class="fas fa-calendar"></i> ${appointment.appointment_date}</span>
                    <span><i class="fas fa-clock"></i> ${appointment.appointment_time}</span>
                    <span><i class="fas fa-tag"></i> ${appointment.consultation_type}</span>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-icon btn-danger" onclick="removeAppointment('${appointment.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

function renderCases() {
    const grid = document.getElementById('casesGrid');
    
    if (AppState.cases.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-briefcase"></i>
                <h3>No Cases Yet</h3>
                <p>Click "New Case" to create your first case</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    AppState.cases.forEach(caseItem => {
        const attorney = AppState.attorneys.find(a => a.id === caseItem.attorney_id);
        const attorneyName = attorney ? attorney.name : 'Unassigned';
        
        const card = document.createElement('div');
        card.className = 'case-card';
        
        const statusClass = caseItem.status.toLowerCase().replace(' ', '-');
        
        card.innerHTML = `
            <div class="case-header">
                <div>
                    <div class="case-title">${caseItem.title}</div>
                </div>
                <span class="case-status ${statusClass}">${caseItem.status}</span>
            </div>
            <div class="case-info">
                <div class="case-info-item">
                    <i class="fas fa-user"></i>
                    <span>${caseItem.client_name}</span>
                </div>
                <div class="case-info-item">
                    <i class="fas fa-user-tie"></i>
                    <span>${attorneyName}</span>
                </div>
                <div class="case-info-item">
                    <i class="fas fa-folder"></i>
                    <span>${caseItem.case_type}</span>
                </div>
            </div>
            ${caseItem.description ? `<div class="case-description">${caseItem.description}</div>` : ''}
            <div class="case-actions">
                <button class="btn btn-secondary">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-danger" onclick="removeCase('${caseItem.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ===== Action Functions =====
async function editAttorney(id) {
    const attorney = AppState.attorneys.find(a => a.id === id);
    if (attorney) {
        openAttorneyModal(attorney);
    }
}

async function removeAttorney(id) {
    if (confirm('Are you sure you want to delete this attorney?')) {
        try {
            await deleteAttorney(id);
            await loadAttorneys();
        } catch (error) {
            console.error('Error deleting attorney:', error);
            alert('Failed to delete attorney. Please try again.');
        }
    }
}

async function removeAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            await deleteAppointment(id);
            await loadAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment. Please try again.');
        }
    }
}

async function removeCase(id) {
    if (confirm('Are you sure you want to delete this case?')) {
        try {
            await deleteCase(id);
            await loadCases();
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Failed to delete case. Please try again.');
        }
    }
}

// ===== Utility Functions =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}
