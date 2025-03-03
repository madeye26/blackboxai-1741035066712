import getDatabase from '../sqlite-config.js';

const db = {
    async getAllEmployees() {
        try {
            const dbConn = await getDatabase();
            const rows = await dbConn.all('SELECT * FROM employees');
            return rows;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw new Error('Failed to fetch employees');
        }
    },

    async getEmployeeByCode(code) {
        try {
            const dbConn = await getDatabase();
            const row = await dbConn.get('SELECT * FROM employees WHERE code = ?', [code]);
            return row;
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw new Error('Failed to fetch employee');
        }
    },

    async createEmployee(employee) {
        try {
            const dbConn = await getDatabase();
            const { code, name, basic_salary, job_title, hire_date, monthly_incentives, work_days, daily_work_hours, status } = employee;
            
            const result = await dbConn.run(
                'INSERT INTO employees (code, name, basic_salary, job_title, hire_date, monthly_incentives, work_days, daily_work_hours, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [code, name, basic_salary, job_title, hire_date, monthly_incentives || 0, work_days || 22, daily_work_hours || 8, status || 'active']
            );
            
            return { id: result.lastID, ...employee };
        } catch (error) {
            console.error('Error creating employee:', error);
            throw new Error('Failed to create employee: ' + error.message);
        }
    },

    async getAdvancesByEmployee(employeeCode) {
        try {
            const dbConn = await getDatabase();
            const rows = await dbConn.all('SELECT * FROM advances WHERE employee_code = ?', [employeeCode]);
            return rows;
        } catch (error) {
            console.error('Error fetching advances:', error);
            throw new Error('Failed to fetch advances');
        }
    },

    async createAdvance(advance) {
        try {
            const dbConn = await getDatabase();
            const { employee_code, amount, request_date, is_paid } = advance;
            
            const result = await dbConn.run(
                'INSERT INTO advances (employee_code, amount, request_date, is_paid) VALUES (?, ?, ?, ?)',
                [employee_code, amount, request_date, is_paid ? 1 : 0] // SQLite uses 1/0 for boolean
            );
            
            return { id: result.lastID, ...advance };
        } catch (error) {
            console.error('Error creating advance:', error);
            throw new Error('Failed to create advance: ' + error.message);
        }
    },
    
    async getSalaryReports(employeeCode) {
        try {
            const dbConn = await getDatabase();
            const rows = await dbConn.all('SELECT * FROM salary_records WHERE employee_code = ?', [employeeCode]);
            return rows;
        } catch (error) {
            console.error('Error fetching salary reports:', error);
            throw new Error('Failed to fetch salary reports');
        }
    },

    async createSalaryReport(report) {
        try {
            const dbConn = await getDatabase();
            const { employee_code, month, basic_salary, monthly_incentives, bonus, overtime_hours, overtime_amount, 
                   work_days, absence_days, penalty_days, allowances, deductions_purchases, deductions_advances, 
                   deductions_absence, deductions_hourly, deductions_penalties, total_deductions, gross_salary, net_salary, 
                   payment_status } = report;
            
            const result = await dbConn.run(
                `INSERT INTO salary_records (employee_code, month, basic_salary, monthly_incentives, bonus, overtime_hours, 
                overtime_amount, work_days, absence_days, penalty_days, allowances, deductions_purchases, deductions_advances, 
                deductions_absence, deductions_hourly, deductions_penalties, total_deductions, gross_salary, net_salary, payment_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [employee_code, month, basic_salary, monthly_incentives || 0, bonus || 0, overtime_hours || 0, 
                 overtime_amount || 0, work_days || 0, absence_days || 0, penalty_days || 0, allowances || 0, 
                 deductions_purchases || 0, deductions_advances || 0, deductions_absence || 0, deductions_hourly || 0, 
                 deductions_penalties || 0, total_deductions || 0, gross_salary, net_salary, payment_status || 'pending']
            );
            
            return { id: result.lastID, ...report };
        } catch (error) {
            console.error('Error creating salary report:', error);
            throw new Error('Failed to create salary report: ' + error.message);
        }
    },

    async recordBackup(backup) {
        try {
            const dbConn = await getDatabase();
            const { date, status, details } = backup;
            
            const result = await dbConn.run(
                'INSERT INTO backup_history (date, status, details) VALUES (?, ?, ?)',
                [date, status, details]
            );
            
            return { id: result.lastID, ...backup };
        } catch (error) {
            console.error('Error recording backup:', error);
            throw new Error('Failed to record backup');
        }
    },
    
    // Initialize database schema
    async initializeDatabase() {
        try {
            const dbConn = await getDatabase();
            const fs = await import('fs');
            const path = await import('path');
            const { fileURLToPath } = await import('url');
            
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            
            // Read the schema file
            const schemaPath = path.join(__dirname, '..', 'database', 'sqlite-schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            // Split the schema into individual statements
            const statements = schema.split(';').filter(stmt => stmt.trim());
            
            // Execute each statement
            for (const statement of statements) {
                await dbConn.exec(statement + ';');
            }
            
            console.log('Database schema initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing database schema:', error);
            throw error;
        }
    }
};

export default db;