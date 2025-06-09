import dotenv from "dotenv";
import { promises as fs } from "fs";
import mysql, { RowDataPacket } from "mysql2/promise"; //? /promise zeby asynchronicznosc zapytan dzialala
import { MovieDb } from '../types/movies'
dotenv.config() //? Loads .env file contents into process.env by default.

const { DB_HOST, DB_USER, DB_PASS, DB_DATABASE } = process.env;
if(!DB_HOST || !DB_USER || !DB_PASS) {
    throw Error("'.env' file is not filled out.")
}

//? connect – jedno połączenie, zapytania jedno po drugim
//? pool – wiele połączeń, zapytania równocześnie
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    multipleStatements: true //? pare zapytan w jednym query
})

const db = DB_DATABASE

async function initialize() {
    try {
await pool.query(`
        CREATE DATABASE IF NOT EXISTS ${db};
        USE ${db};
        CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL UNIQUE,
        description VARCHAR(100) NOT NULL,
        imagePath VARCHAR(255) NOT NULL
        );
        `)
        console.log("Database & Table initialized")
    } catch (err: any) {
        throw err
    }
}

async function addMovie(movieName: string, movieDescription: string, movieImagePath: string) {
    try {
        await pool.query(`
        INSERT INTO movies (name, description, imagePath)
        VALUES (?, ?, ?);`,
      [movieName, movieDescription, movieImagePath])
        console.log(`values: ${movieName}, ${movieDescription}, ${movieImagePath} got added to table.`)
    } catch (error: any) {
        if(error.code == "ER_DUP_ENTRY") {
            console.warn('Ten film już istnieje, nic nie zostało dodane.')
            await fs.rm(movieImagePath) //TODO do zmiany na unlink!
            return
        }
        throw error
    }
}

async function viewMovie(name: string): Promise<undefined | MovieDb>{ //? promise bo to asynchroniczna
    try {
        const [rows] = await pool.query(`SELECT * FROM movies WHERE name = ?`, [name]) //? [rows] to rows[0], [name] podstawia sie pod ? pokolei jakby bylo wiecej ?
        const result = rows as RowDataPacket[] //? bez tego length nie dziala xd
        if (result.length === 0) {
            console.log("nie znalazlo filmu.")
            return;
        }
        console.log(`wyswietlam film o id: ${result[0].id}`)
        console.log(result[0]);
        return result[0] as MovieDb
    } catch (error: any) {
        throw error
        return
    }
}

export { initialize, addMovie, viewMovie };