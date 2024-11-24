async function populateFilteredTable() {
    try {
        const response = await axios.get('http://localhost:3000/students');
        const filter = JSON.parse(sessionStorage.getItem('filterQuery'));
        console.log(filter);
        if (filter) {
            const filteredData = applyFilter(response.data, filter.query, filter.columnIndex, filter.isNumeric);
            renderFilteredRows(filteredData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to filter data based on query
function applyFilter(data, query, columnIndex, isNumeric) {
    console.log(data)
    return data.filter(student => {
        console.log(Object.values(student));
        const value = Object.values(student)[columnIndex];
        console.log(value);
        if (isNumeric) {
            const numericValue = parseFloat(value);
            if (query.startsWith('>')) return numericValue > parseFloat(query.slice(1));
            if (query.startsWith('<')) return numericValue < parseFloat(query.slice(1));
            return numericValue === parseFloat(query);
        } else {
            return value.toLowerCase().includes(query.toLowerCase());
        }
    });
}

// Render filtered rows in the table
function renderFilteredRows(data) {
    const tableBody = document.querySelector('#filtered-student-data');
    tableBody.innerHTML = '';

    data.forEach(student => {
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

        // Add delete button functionality
        row.querySelector('.deleteBtn').addEventListener('click', async () => {
            try {
                await axios.delete(`http://localhost:3000/students/${student.studentID}`);
                populateFilteredTable();  // Refresh filtered table
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        });

        tableBody.appendChild(row);
    });
}

// Call populate function when content is loaded
document.addEventListener('DOMContentLoaded', populateFilteredTable);
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
