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

// Get all inpatient records with patient details
app.get("/inpatientRecords", (req, res) => {
    const sql = `
        SELECT 
            ir.inpatient_id, 
            ir.admission_date, 
            ir.discharge_date, 
            ir.room_number, 
            ir.ward, 
            ir.diagnosis, 
            ir.treatment_plan,
            p.first_name AS patient_first_name,
            p.last_name AS patient_last_name
        FROM 
            InpatientRecords ir
        JOIN 
            Patients p ON ir.patient_id = p.patient_id;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new inpatient record
app.post("/inpatientRecords", (req, res) => {
    const { patient_id, admission_date, discharge_date, room_number, ward, diagnosis, treatment_plan } = req.body;
    const sql = `
        INSERT INTO InpatientRecords (patient_id, admission_date, discharge_date, room_number, ward, diagnosis, treatment_plan) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    
    db.query(sql, [patient_id, admission_date, discharge_date, room_number, ward, diagnosis, treatment_plan], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Inpatient record added successfully", inpatientId: results.insertId });
        }
    });
});

// Get all outpatient records with patient details
app.get("/outpatientRecords", (req, res) => {
    const sql = `
        SELECT 
            orc.outpatient_id, 
            orc.visit_date, 
            orc.reason_for_visit, 
            orc.diagnosis, 
            orc.treatment_provided,
            p.first_name AS patient_first_name,
            p.last_name AS patient_last_name
        FROM 
            OutpatientRecords orc
        JOIN 
            Patients p ON orc.patient_id = p.patient_id;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new outpatient record
app.post("/outpatientRecords", (req, res) => {
    const { patient_id, visit_date, reason_for_visit, diagnosis, treatment_provided } = req.body;
    const sql = `
        INSERT INTO OutpatientRecords (patient_id, visit_date, reason_for_visit, diagnosis, treatment_provided) 
        VALUES (?, ?, ?, ?, ?);
    `;
    
    db.query(sql, [patient_id, visit_date, reason_for_visit, diagnosis, treatment_provided], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Outpatient record added successfully", outpatientId: results.insertId });
        }
    });
});

// Get all laboratory test records with patient details
app.get("/laboratoryTests", (req, res) => {
    const sql = `
        SELECT 
            lt.test_id, 
            lt.test_date, 
            lt.test_name, 
            lt.test_results,
            p.first_name AS patient_first_name,
            p.last_name AS patient_last_name
        FROM 
            LaboratoryTests lt
        JOIN 
            Patients p ON lt.patient_id = p.patient_id;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new laboratory test record
app.post("/laboratoryTests", (req, res) => {
    const { patient_id, test_date, test_name, test_results } = req.body;
    const sql = `
        INSERT INTO LaboratoryTests (patient_id, test_date, test_name, test_results) 
        VALUES (?, ?, ?, ?);
    `;
    
    db.query(sql, [patient_id, test_date, test_name, test_results], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Laboratory test record added successfully", testId: results.insertId });
        }
    });
});

// Get all prescriptions with patient and doctor details
app.get("/prescriptions", (req, res) => {
    const sql = `
        SELECT 
            p.prescription_id, 
            p.prescription_date, 
            p.medication_name, 
            p.dosage, 
            p.quantity,
            patient.first_name AS patient_first_name,
            patient.last_name AS patient_last_name,
            doctor.first_name AS doctor_first_name,
            doctor.last_name AS doctor_last_name
        FROM 
            Prescriptions p
        JOIN 
            Patients patient ON p.patient_id = patient.patient_id
        JOIN 
            Doctors doctor ON p.doctor_id = doctor.doctor_id;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new prescription record
app.post("/prescriptions", (req, res) => {
    const { patient_id, doctor_id, prescription_date, medication_name, dosage, quantity } = req.body;
    const sql = `
        INSERT INTO Prescriptions (patient_id, doctor_id, prescription_date, medication_name, dosage, quantity) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    
    db.query(sql, [patient_id, doctor_id, prescription_date, medication_name, dosage, quantity], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Prescription added successfully", prescriptionId: results.insertId });
        }
    });
});

// Get all staff records
app.get("/staff", (req, res) => {
    const sql = `
        SELECT 
            staff_id, 
            first_name, 
            last_name, 
            job_title, 
            department, 
            contact_number
        FROM 
            Staff;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new staff record
app.post("/staff", (req, res) => {
    const { first_name, last_name, job_title, department, contact_number } = req.body;
    const sql = `
        INSERT INTO Staff (first_name, last_name, job_title, department, contact_number) 
        VALUES (?, ?, ?, ?, ?);
    `;
    
    db.query(sql, [first_name, last_name, job_title, department, contact_number], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Staff record added successfully", staffId: results.insertId });
        }
    });
});

// Get all billing records with patient details
app.get("/billing", (req, res) => {
    const sql = `
        SELECT 
            b.bill_id, 
            b.bill_date, 
            b.items, 
            b.total_amount, 
            b.payment_status,
            patient.first_name AS patient_first_name,
            patient.last_name AS patient_last_name
        FROM 
            Billing b
        JOIN 
            Patients patient ON b.patient_id = patient.patient_id;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// Add a new billing record
app.post("/billing", (req, res) => {
    const { patient_id, bill_date, items, total_amount, payment_status } = req.body;
    const sql = `
        INSERT INTO Billing (patient_id, bill_date, items, total_amount, payment_status) 
        VALUES (?, ?, ?, ?, ?);
    `;
    
    db.query(sql, [patient_id, bill_date, items, total_amount, payment_status], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Billing record added successfully", billId: results.insertId });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
