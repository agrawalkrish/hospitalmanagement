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
app.get("/patient-details", (req, res) => {
    db.query("SELECT * FROM PatientDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });

// Add a new patient
app.post("/add-patient", (req, res) => {
    const { first_name, last_name, date_of_birth, gender, address, contact_number, insurance_information, medical_history } = req.body;
  
    const sql = `CALL AddPatient(?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [first_name, last_name, date_of_birth, gender, address, contact_number, insurance_information, medical_history], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Patient added successfully!" });
    });
  });

// Delete a patient by ID
app.delete("/delete-patient/:id", (req, res) => {
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
app.get("/doctor-details", (req, res) => {
    db.query("SELECT * FROM DoctorDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });


// Add a new doctor
app.post("/add-doctor", (req, res) => {
    const { first_name, last_name, specialization, contact_number, qualifications, experience } = req.body;
  
    const sql = `CALL AddDoctor(?, ?, ?, ?, ?, ?)`;
    db.query(sql,  [first_name, last_name, specialization, contact_number, qualifications, experience], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Doctor added successfully!" });
    });
  });

// Delete a doctor by ID
  app.delete("/delete-doctor/:id", (req, res) => {
    const doctorId = req.params.id;
    const sql = "DELETE FROM Doctors WHERE doctor_id = ?";

    db.query(sql, [doctorId], (err, results) => {
        if (err) {
            console.error("Error deleting doctor:", err);
            res.status(500).json({ error: "Database error" });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "doctor not found" });
        } else {
            console.log("doctor deleted successfully, ID:", doctorId);
            res.json({ message: "doctor deleted successfully" });
        }
    });
});

// Get all appointments with patient and doctor details
app.get("/appointments-details", (req, res) => {
    db.query("SELECT * FROM AppointmentDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });

// Add a new appointment
app.post("/add-appointments", (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, appointment_reason, appointment_status }  = req.body;
  
    const sql = `CALL ScheduleAppointment(?, ?, ?, ?, ?, ?)`;
    db.query(sql,  [patient_id, doctor_id, appointment_date, appointment_time, appointment_reason, appointment_status], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "appointments added successfully!" });
    });
  });

  

  app.update("/update-appointment/:id", (req, res) => {
    const appointmentId = req.params.id;
    //complete it 
    const sql = "UPDATE appointments SET appointment_status 'Completed' WHERE condition appointment_id= ?";

    db.query(sql, [appointmentId], (err, results) => {
        if (err) {
            console.error("Error Updating bill:", err);
            res.status(500).json({ error: "Database error" });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "bill not found" });
        } else {
            console.log("Bill updated successfully, ID:", patientId);
            res.json({ message: "Bill updated successfully" });
        }
    });
});
// Get all inpatient records with patient details
app.get("/inpatientRecords-details", (req, res) => {
    db.query("SELECT * FROM InpatientRecordDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });
// Add a new inpatient record

app.post("/add-inpatientRecords", (req, res) => {
    const { patient_id, admission_date, discharge_date, room_number, ward, diagnosis, treatment_plan }= req.body;
  
    const sql = `CALL AddInpatientRecord(?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql,  [patient_id, admission_date, discharge_date, room_number, ward, diagnosis, treatment_plan], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "inpatientRecords added successfully!" });
    });
  });
  

// Get all outpatient records with patient details
app.get("/outpatientRecords-details", (req, res) => {
    db.query("SELECT * FROM OutpatientRecordDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });
// Add a new outpatient record
app.post("/add-outpatientRecords", (req, res) => {
    const { patient_id, visit_date, reason_for_visit, diagnosis, treatment_provided }= req.body;
  
    const sql = `CALL AddOutpatientRecord(?, ?, ?, ?, ?)`;
    db.query(sql,  [patient_id, visit_date, reason_for_visit, diagnosis, treatment_provided], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Outpatient record added successfully" });
    });
  });

// Get all laboratory test records with patient details
app.get("/laboratoryTests-details", (req, res) => {
    db.query("SELECT * FROM LabTestDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });


// Add a new laboratory test record
app.post("/add-laboratoryTests", (req, res) => {
    const { patient_id, test_date, test_name, test_results } = req.body;
  
    const sql = `CALL AddLaboratoryTest(?, ?, ?, ?)`;
    db.query(sql,  [patient_id, test_date, test_name, test_results], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Laboratory test record added successfully" });
    });
  });


// Get all prescriptions with patient and doctor details
app.get("/prescriptions-details", (req, res) => {
    db.query("SELECT * FROM PrescriptionDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });
// Add a new prescription record
app.post("/add-prescriptions", (req, res) => {
    const { patient_id, doctor_id, prescription_date, medication_name, dosage, quantity } = req.body;
  
    const sql = `CALL AddPrescription(?, ?, ?, ?, ?, ?)`;
    db.query(sql, [patient_id, doctor_id, prescription_date, medication_name, dosage, quantity], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Prescription added successfully" });
    });
  });

// Get all staff records
app.get("/staff-details", (req, res) => {
    db.query("SELECT * FROM StaffDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });

// Add a new staff record
app.post("/add-staff", (req, res) => {
    const { first_name, last_name, job_title, department, contact_number } = req.body;
  
    const sql = `CALL AddStaff(?, ?, ?, ?, ?)`;
    db.query(sql, [first_name, last_name, job_title, department, contact_number], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Staff added successfully!" });
    });
  });


// Get all billing records with patient details
app.get("/billing-details", (req, res) => {
    db.query("SELECT * FROM BillingDetails", (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json(results);
    });
  });

// Add a new billing record
app.post("/add-billing", (req, res) => {
    const { patient_id, bill_date, items, total_amount, payment_status }  = req.body;
  
    const sql = `CALL AddBilling(?, ?, ?, ?, ?)`;
    db.query(sql, [patient_id, bill_date, items, total_amount, payment_status], (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: "Billing record added successfully!" });
    });
  });

  app.update("/update-bill/:id", (req, res) => {
    const billId = req.params.id;
    //complete it 
    const sql = "UPDATE billing SET payment_status= 'Paid' WHERE condition bill_id= ?";

    db.query(sql, [billId], (err, results) => {
        if (err) {
            console.error("Error Updating bill:", err);
            res.status(500).json({ error: "Database error" });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "bill not found" });
        } else {
            console.log("Bill updated successfully, ID:", patientId);
            res.json({ message: "Bill updated successfully" });
        }
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
