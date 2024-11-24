document.addEventListener('DOMContentLoaded', () => {
    // Load coordinators on page load
    loadCoordinators();

    // Create Coordinator Form Submission
    document.getElementById('create-coordinator-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await axios.post('http://localhost:3000/coordinators', { username, password });
            if (response.data.success) {
                alert('Placement Coordinator created successfully!');
                document.getElementById('create-coordinator-form').reset();
                loadCoordinators();
            }
        } catch (error) {
            console.error('Error creating coordinator:', error);
            alert('An error occurred while creating the coordinator.');
        }
    });
});

// Function to load coordinators
async function loadCoordinators() {
    try {
        const response = await axios.get('http://localhost:3000/coordinators');
        const tableBody = document.getElementById('coordinators-table');
        tableBody.innerHTML = '';

        response.data.forEach(coordinator => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${coordinator.username}</td>
                <td><button onclick="deleteCoordinator('${coordinator.username}')">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading coordinators:', error);
    }
}

// Function to delete a coordinator
async function deleteCoordinator(username) {
    if (confirm(`Are you sure you want to delete coordinator "${username}"?`)) {
        try {
            const response = await axios.delete(`http://localhost:3000/coordinators/${username}`);
            if (response.data.success) {
                alert('Coordinator deleted successfully!');
                loadCoordinators();
            }
        } catch (error) {
            console.error('Error deleting coordinator:', error);
            alert('An error occurred while deleting the coordinator.');
        }
    }
}
