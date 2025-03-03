-- SQLite schema for payroll system

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    job_title TEXT,
    department TEXT,
    basic_salary REAL NOT NULL,
    monthly_incentives REAL DEFAULT 0,
    work_days INTEGER DEFAULT 22,
    daily_work_hours INTEGER DEFAULT 8,
    hire_date TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salary records table
CREATE TABLE IF NOT EXISTS salary_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT NOT NULL,
    month TEXT NOT NULL,
    basic_salary REAL NOT NULL,
    monthly_incentives REAL DEFAULT 0,
    bonus REAL DEFAULT 0,
    overtime_hours INTEGER DEFAULT 0,
    overtime_amount REAL DEFAULT 0,
    work_days INTEGER DEFAULT 0,
    absence_days INTEGER DEFAULT 0,
    penalty_days INTEGER DEFAULT 0,
    allowances REAL DEFAULT 0,
    deductions_purchases REAL DEFAULT 0,
    deductions_advances REAL DEFAULT 0,
    deductions_absence REAL DEFAULT 0,
    deductions_hourly REAL DEFAULT 0,
    deductions_penalties REAL DEFAULT 0,
    total_deductions REAL DEFAULT 0,
    gross_salary REAL NOT NULL,
    net_salary REAL NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'cancelled')),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_code) REFERENCES employees(code) ON DELETE CASCADE
);

-- Advances table
CREATE TABLE IF NOT EXISTS advances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT NOT NULL,
    amount REAL NOT NULL,
    request_date TEXT NOT NULL,
    is_paid INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_code) REFERENCES employees(code) ON DELETE CASCADE
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT NOT NULL,
    leave_type TEXT NOT NULL CHECK(leave_type IN ('annual', 'sick', 'unpaid', 'other')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    approved_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_code) REFERENCES employees(code) ON DELETE CASCADE
);

-- Time tracking table
CREATE TABLE IF NOT EXISTS time_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT NOT NULL,
    date TEXT NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    total_hours REAL,
    overtime_hours REAL DEFAULT 0,
    status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late', 'half_day')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_code) REFERENCES employees(code) ON DELETE CASCADE
);

-- Performance evaluations table
CREATE TABLE IF NOT EXISTS performance_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT NOT NULL,
    evaluation_date TEXT NOT NULL,
    evaluator_code TEXT NOT NULL,
    productivity_score INTEGER CHECK (productivity_score BETWEEN 1 AND 5),
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
    attendance_score INTEGER CHECK (attendance_score BETWEEN 1 AND 5),
    communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
    overall_score REAL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_code) REFERENCES employees(code) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_code) REFERENCES employees(code) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT NOT NULL,
    assigned_by TEXT NOT NULL,
    due_date TEXT,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(code) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES employees(code) ON DELETE CASCADE
);

-- Backup history table
CREATE TABLE IF NOT EXISTS backup_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leave_employee ON leave_requests(employee_code);
CREATE INDEX IF NOT EXISTS idx_time_employee_date ON time_records(employee_code, date);
CREATE INDEX IF NOT EXISTS idx_performance_employee ON performance_evaluations(employee_code);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);