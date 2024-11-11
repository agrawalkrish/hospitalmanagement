const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",        // replace with your MySQL username
    password: "password", // replace with your MySQL password
    database: "hospital_management"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

// API Endpoints

// Get all patients
app.get("/patients", (req, res) => {
    const sql = "SELECT * FROM Patients";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new patient
app.post("/patients", (req, res) => {
    const { first_name, last_name, date_of_birth, gender, address, contact_number, insurance_information } = req.body;
    const sql = "INSERT INTO Patients (first_name, last_name, date_of_birth, gender, address, contact_number, insurance_information) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [first_name, last_name, date_of_birth, gender, address, contact_number, insurance_information], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Patient added successfully", patientId: results.insertId });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
