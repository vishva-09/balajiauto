const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xlsx = require('xlsx');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Fast2SMS API Key (replace with your actual key)
const FAST2SMS_API_KEY = 'kDJ8fOMVndIe9qmjyNs56tb3YzHGp7iwag2TKRxUouFZLX1cvPfwLtGKMHax26IR0miNbdSCgOvqZTXl';

app.post('/submit', async (req, res) => {
    const { name, contact, address, vehicle, number, kilometers, remarks } = req.body;

    // Validate required fields
    if (!name || !contact || !address || !vehicle || !number || !kilometers) {
        return res.status(400).json({ error: 'All mandatory fields are required!' });
    }

    // Save data to Excel
    const fileName = 'CustomerData.xlsx';
    let workbook;
    if (fs.existsSync(fileName)) {
        workbook = xlsx.readFile(fileName);
    } else {
        workbook = xlsx.utils.book_new();
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]] || xlsx.utils.json_to_sheet([]);
    const data = xlsx.utils.sheet_to_json(worksheet);
    data.push({ name, contact, address, vehicle, number, kilometers, remarks, date: new Date() });
    const newSheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0] || 'Sheet1'] = newSheet;
    xlsx.writeFile(workbook, fileName);

    // Send SMS using Fast2SMS
    const message = `Thank you ${name} for visiting Balaji Auto and Tyres! Your vehicle ${vehicle} (${number}) is recorded successfully.`;

    try {
        
        require('dotenv').config();

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

        
        const response = await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',
            {
                route: 'v3',
                sender_id: 'TXTIND',
                message: message,
                language: 'english',
                numbers: contact
            },
            {
                headers: {
                    authorization: FAST2SMS_API_KEY
                }
            }
        );
        if (response.data.return) {
            return res.json({ success: true });
        } else {
            return res.status(500).json({ error: 'Failed to send SMS' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error sending SMS', details: err });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
