// Frontend Database Service

const API_BASE_URL = 'http://localhost:3001/api';

const DatabaseService = {
    // Employees
    async getAllEmployees() {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },

    async getEmployeeByCode(code) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${code}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('Failed to fetch employee');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    },

    async createEmployee(employee) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
            if (!response.ok) throw new Error('Failed to create employee');
            return await response.json();
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    },

    // Advances
    async getAdvancesByEmployee(employeeId) {
        try {
            const response = await fetch(`${API_BASE_URL}/advances/${employeeId}`);
            if (!response.ok) throw new Error('Failed to fetch advances');
            return await response.json();
        } catch (error) {
            console.error('Error fetching advances:', error);
            throw error;
        }
    },

    async createAdvance(advance) {
        try {
            const response = await fetch(`${API_BASE_URL}/advances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(advance)
            });
            if (!response.ok) throw new Error('Failed to create advance');
            return await response.json();
        } catch (error) {
            console.error('Error creating advance:', error);
            throw error;
        }
    },

    // Salary Reports
    async getSalaryReports(employeeCode) {
        try {
            const response = await fetch(`${API_BASE_URL}/salary-reports/${employeeCode}`);
            if (!response.ok) throw new Error('Failed to fetch salary reports');
            return await response.json();
        } catch (error) {
            console.error('Error fetching salary reports:', error);
            throw error;
        }
    },

    async createSalaryReport(report) {
        try {
            const response = await fetch(`${API_BASE_URL}/salary-reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(report)
            });
            if (!response.ok) throw new Error('Failed to create salary report');
            return await response.json();
        } catch (error) {
            console.error('Error creating salary report:', error);
            throw error;
        }
    }
};

export default DatabaseService;