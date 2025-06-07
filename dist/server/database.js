"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = initialize;
exports.addMovie = addMovie;
exports.viewMovie = viewMovie;
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise")); //? /promise zeby asynchronicznosc zapytan dzialala
dotenv_1.default.config(); //? Loads .env file contents into process.env by default.
//? connect – jedno połączenie, zapytania jedno po drugim
//? pool – wiele połączeń, zapytania równocześnie
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true //? pare zapytan w jednym query
});
const db = process.env.DB_DATABASE;
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pool.query(`
        CREATE DATABASE IF NOT EXISTS ${db};
        USE ${db};
        CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL UNIQUE,
        description VARCHAR(100) NOT NULL,
        imagePath VARCHAR(20) NOT NULL
        );
        `);
            console.log("Database & Table initialized");
        }
        catch (err) {
            throw err;
        }
    });
}
function addMovie(movieName, movieDescription, movieImagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pool.query(`
        INSERT INTO movies (name, description, imagePath)
        VALUES (?, ?, ?);`, [movieName, movieDescription, movieImagePath]);
            console.log(`values ${movieName}, ${movieDescription}, ${movieImagePath} got added to table.`);
        }
        catch (error) {
            if (error.code == "ER_DUP_ENTRY") {
                console.log('Ten film już istnieje, nic nie zostało dodane.');
                return;
            }
            throw error;
        }
    });
}
function viewMovie(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield pool.query(`SELECT * FROM movies WHERE name = ?`, [name]); //? [rows] to rows[1] [name] podstawia sie pod ? pokolei jakby bylo wiecej ?
            const result = rows; //? bez tego length nie dziala xd
            if (result.length === 0) {
                console.log("nie znalazlo filmu.");
                return;
            }
            console.log(`wyswietlam film o id: ${result[0].id}`);
            console.log(result[0]);
        }
        catch (error) {
            console.log(error);
        }
    });
}
