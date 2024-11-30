import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true, // Wait for available connection if pool is busy
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue limit (can be adjusted based on needs)
});

// Wrap the pool query in a Promise for async usage
export const query = (sql: string, values: any[]) => {
  return new Promise<any>((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
