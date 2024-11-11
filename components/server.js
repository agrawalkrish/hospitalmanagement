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
    password: "Kir@n197#", // replace with your MySQL password
    database: "hospitalmanagement"
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

// Delete a patient by ID
app.delete("/patients/:id", (req, res) => {
    const patientId = req.params.id;
    const sql = "DELETE FROM Patients WHERE patient_id = ?";

    db.query(sql, [patientId], (err, results) => {
        if (err) {
            console.error("Error deleting patient:", err);
            res.status(500).json({ error: "Database error" });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "Patient not found" });
        } else {
            console.log("Patient deleted successfully, ID:", patientId);
            res.json({ message: "Patient deleted successfully" });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
