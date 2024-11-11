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

// Get all doctors
app.get("/doctors", (req, res) => {
    const sql = "SELECT * FROM Doctors";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new doctor
app.post("/doctors", (req, res) => {
    const { first_name, last_name, specialization, contact_number, qualifications, experience } = req.body;
    const sql = "INSERT INTO Doctors (first_name, last_name, specialization, contact_number, qualifications, experience) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [first_name, last_name, specialization, contact_number, qualifications, experience], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Doctor added successfully", doctorId: results.insertId });
        }
    });
});

// Get all appointments with patient and doctor details
app.get("/appointments", (req, res) => {
    const sql = `
        SELECT 
            a.appointment_id, 
            a.appointment_date, 
            a.appointment_time, 
            a.appointment_reason, 
            a.appointment_status,
            p.patient_id, 
            p.first_name AS patient_first_name, 
            p.last_name AS patient_last_name,
            d.doctor_id, 
            d.first_name AS doctor_first_name, 
            d.last_name AS doctor_last_name
        FROM 
            Appointments a
        JOIN 
            Patients p ON a.patient_id = p.patient_id
        JOIN 
            Doctors d ON a.doctor_id = d.doctor_id;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new appointment
app.post("/appointments", (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, appointment_reason, appointment_status } = req.body;
    const sql = `
        INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, appointment_reason, appointment_status) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    
    db.query(sql, [patient_id, doctor_id, appointment_date, appointment_time, appointment_reason, appointment_status], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Appointment added successfully", appointmentId: results.insertId });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
