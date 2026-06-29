const API_URL = ''; // Backend serves this frontend — same origin, no CORS needed

// State
let currentUser = null;

// DOM Elements
const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authError = document.getElementById('auth-error');
const userGreeting = document.getElementById('user-greeting');
const reimbursementForm = document.getElementById('reimbursement-form');
const reimbursementsList = document.getElementById('reimbursements-list');
const updateStatusPanel = document.getElementById('update-status-panel');
const statusForm = document.getElementById('status-form');

// Initialize
async function init() {
    await checkAuth();
}

// Utility for API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Send cookies
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'API request failed');
        return data;
    } catch (error) {
        throw error;
    }
}

// Auth Handlers
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
    authError.textContent = '';
    
    if (tab === 'login') {
        document.querySelector('.tab[onclick="switchTab(\'login\')"]').classList.add('active');
        loginForm.classList.add('active');
    } else {
        document.querySelector('.tab[onclick="switchTab(\'register\')"]').classList.add('active');
        registerForm.classList.add('active');
    }
}

async function checkAuth() {
    try {
        const data = await apiCall('/auth/me');
        currentUser = data.user;
        showDashboard();
    } catch (err) {
        showAuth();
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const data = await apiCall('/auth/login', 'POST', { email, password });
        currentUser = data.user;
        showDashboard();
    } catch (err) {
        authError.textContent = err.message;
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        await apiCall('/auth/register', 'POST', { name, email, password, role });
        // Automatically login after register
        const loginData = await apiCall('/auth/login', 'POST', { email, password });
        currentUser = loginData.user;
        showDashboard();
    } catch (err) {
        authError.textContent = err.message;
    }
});

async function logout() {
    try {
        await apiCall('/auth/logout', 'POST');
    } catch (err) {
        // Even if the request fails, clear local state
        console.warn('Logout request failed, clearing local state anyway.');
    }
    currentUser = null;
    showAuth();
}

// UI State
function showAuth() {
    authView.classList.add('active');
    dashboardView.classList.remove('active');
}

function showDashboard() {
    authView.classList.remove('active');
    dashboardView.classList.add('active');
    userGreeting.textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;
    
    if (['RM', 'APE', 'CFO'].includes(currentUser.role)) {
        updateStatusPanel.style.display = 'block';
    } else {
        updateStatusPanel.style.display = 'none';
    }
    
    loadReimbursements();
}

// Reimbursement Handlers
reimbursementForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('reimb-title').value;
    const amount = parseFloat(document.getElementById('reimb-amount').value);
    const description = document.getElementById('reimb-desc').value;

    try {
        await apiCall('/reimbursements', 'POST', { title, amount, description });
        reimbursementForm.reset();
        loadReimbursements();
        alert('Reimbursement submitted successfully!');
    } catch (err) {
        alert('Failed to submit: ' + err.message);
    }
});

statusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('status-id').value;
    const status = document.getElementById('status-action').value;

    try {
        await apiCall(`/reimbursements/${id}/status`, 'PATCH', { status });
        statusForm.reset();
        loadReimbursements();
        alert('Status updated successfully!');
    } catch (err) {
        alert('Failed to update status: ' + err.message);
    }
});

async function loadReimbursements() {
    try {
        const data = await apiCall('/reimbursements/my');
        const isManager = currentUser && ['RM', 'APE', 'CFO'].includes(currentUser.role);
        const heading = document.querySelector('.list-panel h2');
        if (heading) {
            heading.textContent = isManager ? 'All Reimbursements (Manager View)' : 'My Reimbursements';
        }
        renderReimbursements(data.reimbursements || []);
    } catch (err) {
        console.error('Failed to load reimbursements', err);
    }
}

function renderReimbursements(list) {
    reimbursementsList.innerHTML = '';
    
    if (list.length === 0) {
        reimbursementsList.innerHTML = '<p style="color: var(--text-muted)">No reimbursements found.</p>';
        return;
    }

    list.forEach(r => {
        const card = document.createElement('div');
        card.className = 'reimb-card';
        card.innerHTML = `
            <div class="reimb-header">
                <div class="reimb-title">${r.title}</div>
                <div class="reimb-amount">$${parseFloat(r.amount).toFixed(2)}</div>
            </div>
            ${r.description ? `<div class="reimb-desc">${r.description}</div>` : ''}
            <div class="status-badges">
                <span class="badge ${r.rmApproval.toLowerCase()}">RM: ${r.rmApproval}</span>
                <span class="badge ${r.apeApproval.toLowerCase()}">APE: ${r.apeApproval}</span>
                <span class="badge ${r.finalStatus.toLowerCase()}">Final: ${r.finalStatus}</span>
            </div>
            <div class="reimb-meta">
                ID: ${r.id} | Date: ${new Date(r.createdAt).toLocaleDateString()}
            </div>
        `;
        reimbursementsList.appendChild(card);
    });
}

// Start App
init();
