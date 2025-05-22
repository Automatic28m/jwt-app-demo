import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

console.log('MySQL pool created');

export async function getUserFromEmail(email) {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM user
            WHERE email = ?
        `, [email]);
        return rows;
    } catch (error) {
        console.error("❌ getUserFromEmail query error:", error.message);
        return []; // return empty array to avoid crashing
    }
}


export async function register(fullname, email, encryptedPassword) {
    try {
        const [result] = await pool.query(`
            INSERT INTO user
            (fullname, email, password)
            VALUES (?,?,?)
            `, [fullname, email, encryptedPassword]);
        const id = result.insertId;
        console.log('✅ New user created with id:', id);
        return {
            status: 201,
            message: 'New user has been created',
            userId: id
        };
    } catch (error) {
        console.error('❌ Registration failed:', error.message);
        return {
            status: 500,
            message: 'Registration failed',
            error: error.message
        };
    }
}

//Login
export async function login(email) {
    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM user
            WHERE email = ?
            `, [email]);
        return rows

    } catch (error) {
        console.error("Login failed:", error.message);
        return {
            status: 500,
            message: "Login failed",
            error: error.message
        }
    }
}