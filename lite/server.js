import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './js/sqlite-database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
    // Return a 204 No Content if favicon doesn't exist
    res.status(204).end();
});

// Static file middleware
app.use(express.static('.'));

// API Routes

// Employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await db.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/employees/:code', async (req, res) => {
    try {
        const employee = await db.getEmployeeByCode(req.params.code);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const employee = await db.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Advances
app.get('/api/advances/:employeeId', async (req, res) => {
    try {
        const advances = await db.getAdvancesByEmployee(req.params.employeeId);
        res.json(advances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/advances', async (req, res) => {
    try {
        const advance = await db.createAdvance(req.body);
        res.status(201).json(advance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Salary Reports
app.get('/api/salary-reports/:employeeId', async (req, res) => {
    try {
        const reports = await db.getSalaryReports(req.params.employeeId);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/salary-reports', async (req, res) => {
    try {
        const report = await db.createSalaryReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Backup History
app.post('/api/backup-history', async (req, res) => {
    try {
        const backup = await db.recordBackup(req.body);
        res.status(201).json(backup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
