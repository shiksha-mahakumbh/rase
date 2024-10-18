import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Define the handler
export async function POST(req: Request) {
  const body = await req.json(); // Get the JSON body
  const {
    name,
    type,
    website,
    cont,
    role,
    email,
    contactNumber,
    feeReceipt,
    vb,
    feeAmount,
    category,
    description,
    services,
    registrationNumber,
    contribution,
    designation,
    institutionName,
    event_type,
    address,
    views,
  } = body;

  try {
    // Insert the form data into the database
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO registrations (name, type, website, cont, role, email, contactNumber, feeReceipt, vb, feeAmount, category, description, services, registrationNumber, contribution, designation, institutionName, event_type, address, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        website,
        cont,
        role,
        email,
        contactNumber,
        feeReceipt,
        vb,
        feeAmount,
        category,
        description,
        services,
        registrationNumber,
        contribution,
        designation,
        institutionName,
        event_type,
        address,
        views,
      ]
    );

    return NextResponse.json({ message: 'Registration successful!', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
