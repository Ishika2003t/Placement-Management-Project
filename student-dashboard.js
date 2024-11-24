document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and render opportunities
    const fetchOpportunities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/opportunities');
            const opportunities = response.data;
            renderOpportunities(opportunities);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        }
    };

    const renderOpportunities = (opportunities) => {
        const tableBody = document.getElementById('opportunity-data');
        tableBody.innerHTML = '';
        opportunities.forEach(opportunity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${opportunity.Title}</td>
                <td>${opportunity.Company}</td>
                <td>${opportunity.Description}</td>
                <td>${opportunity.Deadline}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    fetchOpportunities();

    // Handle password change form submission
    const passwordChangeForm = document.getElementById('password-change-form');
    const passwordChangeMessage = document.getElementById('password-change-message');

    passwordChangeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // Basic validation
        if (newPassword !== confirmPassword) {
            passwordChangeMessage.textContent = 'New passwords do not match.';
            passwordChangeMessage.style.display = 'block';
            return;
        }

        // Send request to change password
        try {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!user) {
                passwordChangeMessage.textContent = 'You must be logged in to change the password.';
                passwordChangeMessage.style.display = 'block';
                return;
            }

            const response = await axios.post('http://localhost:3000/change-password', {
                user: user.username,
                oldPassword,
                newPassword
            });

            passwordChangeMessage.textContent = response.data.message;
            passwordChangeMessage.style.display = 'block';
        } catch (error) {
            console.error('Error changing password:', error);
            passwordChangeMessage.textContent = 'Error changing password. Please try again.';
            passwordChangeMessage.style.display = 'block';
        }
    });
});
