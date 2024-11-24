document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await axios.post('http://localhost:3000/login', { role, username, password });
        if (response.data.success) {
            // Store login details in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify({
                role,
                username,
                timestamp: Date.now(), // Store the time of login
            }));

            // Redirect to the appropriate dashboard based on role
            if (role === 'student') window.location.href = '/student-dashboard.html';
            else if (role === 'admin') window.location.href = '/admin-dashboard.html';
            else window.location.href = '/coordinator-dashboard.html';
        } else {
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
        document.getElementById('error-message').style.display = 'block';
    }
});

// Function to validate session on other pages
function validateSession() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || !user.token || Date.now() - user.timestamp > 3600000) { // Session expires in 1 hour
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login.html';
    }
}

// Call validateSession on all protected pages
if (window.location.pathname !== '/login.html') {
    validateSession();
}
