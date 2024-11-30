function submitForm() {
    const name = document.getElementById('customerName').value;
    const contact = document.getElementById('customerContact').value;
    const address = document.getElementById('customerAddress').value;
    const vehicle = document.getElementById('vehicleName').value;
    const number = document.getElementById('vehicleNumber').value;
    const kilometers = document.getElementById('kilometers').value;
    const remarks = document.getElementById('remarks').value;

    // Validate required fields
    if (!name || !contact || !address || !vehicle || !number || !kilometers) {
        alert("All mandatory fields must be filled out.");
        return;
    }

    // Send data to the backend
    const data = {
        name,
        contact,
        address,
        vehicle,
        number,
        kilometers,
        remarks
    };

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you! Your data has been submitted successfully.');
            document.getElementById('customerForm').reset(); // Reset the form
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
}
