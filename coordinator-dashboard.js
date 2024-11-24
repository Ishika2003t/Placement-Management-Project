document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and render students
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/students');
            renderStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const renderStudents = (students) => {
        const studentTableBody = document.getElementById('student-data');
        studentTableBody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentID}</td>
                <td>${student.name}</td>
                <td>${student.cgpa}</td>
                <td>${student.year}</td>
                <td>${student.email}</td>
                <td class="placementID">${student.placementID}</td>
                <td><button class="deleteBtn">Delete</button></td>
            `;

            row.querySelector('.deleteBtn').addEventListener('click', async () => {
                try {
                    await axios.delete(`http://localhost:3000/students/${student.studentID}`);
                    fetchStudents();
                } catch (error) {
                    console.error('Error deleting student:', error);
                }
            });

            row.querySelector('.placementID').addEventListener('click', async () => {
                if (student.placementID === 0) {
                    alert("Student not placed");
                    return;
                }
                try {
                    const placementResponse = await axios.get(`http://localhost:3000/placements/${student.placementID}`);
                    const details = placementResponse.data.map(p => 
                        `Company: ${p.Company}\nDetails: ${p.Details}\nDate: ${p.Date}`).join('\n\n');
                    alert(details || 'No placement data available');
                } catch (error) {
                    console.error('Error fetching placement details:', error);
                }
            });

            studentTableBody.appendChild(row);
        });
    };

    // Fetch and render opportunities
    const fetchOpportunities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/opportunities');
            renderOpportunities(response.data);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        }
    };

    const renderOpportunities = (opportunities) => {
        const opportunityTableBody = document.getElementById('opportunity-data');
        opportunityTableBody.innerHTML = '';
        opportunities.forEach(opportunity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${opportunity.Title}</td>
                <td>${opportunity.Company}</td>
                <td>${opportunity.Description}</td>
                <td>${opportunity.Deadline}</td>
                <td><button class="delete-btn" data-id="${opportunity.Opportunity_ID}">Delete</button></td>
            `;
            row.querySelector('.delete-btn').addEventListener('click', async () => {
                try {
                    await axios.delete(`http://localhost:3000/opportunities/${opportunity.Opportunity_ID}`);
                    fetchOpportunities();
                } catch (error) {
                    console.error('Error deleting opportunity:', error);
                }
            });
            opportunityTableBody.appendChild(row);
        });
    };

    // Add a new opportunity
    document.getElementById('opportunity-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const company = document.getElementById('company').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;

        try {
            await axios.post('http://localhost:3000/opportunities', { title, company, description, deadline });
            fetchOpportunities();
            e.target.reset();
        } catch (error) {
            console.error('Error adding opportunity:', error);
        }
    });

    // Initial fetch
    fetchStudents();
    fetchOpportunities();
});
