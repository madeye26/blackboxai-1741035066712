import getDatabase from './sqlite-config.js';

async function checkTable() {
  try {
    // Get database connection
    const db = await getDatabase();
    
    console.log('Connected to SQLite database');
    
    // Initialize database schema if needed
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Check if database file exists and has tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'");
    
    if (tables.length === 0) {
      console.log('Initializing database schema...');
      // Read the schema file
      const schemaPath = path.join(__dirname, 'database', 'sqlite-schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the schema into individual statements
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      // Execute each statement
      for (const statement of statements) {
        await db.exec(statement + ';');
      }
      console.log('Database schema initialized successfully');
    }
    
    // Check employees table structure
    const rows = await db.all('PRAGMA table_info(employees)');
    console.log('Employees table structure:');
    console.table(rows);
    
    // Count employees
    const count = await db.get('SELECT COUNT(*) as count FROM employees');
    console.log(`Total employees: ${count.count}`);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkTable();