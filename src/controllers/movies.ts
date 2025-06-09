import { Request, Response, NextFunction } from "express";
import { MovieDb } from '../types/movies'
import { addMovie, viewMovie } from "../database/db";

export const addMovieHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieName, movieDescription } = req.body as { movieName: string; movieDescription: string; };
        const file = req.file
        if(!file){
            res.status(404)
            throw Error("file not found.")
        }
        if(!movieName || !movieDescription){
            res.status(404)
            throw Error("movie name or description not found.")
        }
        console.log("nazwa pliku: " + file?.filename);
        await addMovie(movieName, movieDescription, 'http://localhost:4747/uploads/' + file.filename);
        res.status(201).json({success: true, message: "dane zostały przesłane"})
    } catch (error) {
        next(error) //? bez next po app.use() w ktorym handler sie znajduje nic by sie nie wykonalo. (tak samo to dziala jakby nie bylo reponse w try bloku)
    }
}

export const searchMovieHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query as {query: string}
        console.log('server received: ' + query.query);
        const result: MovieDb | undefined = await viewMovie(query.query);
        if(!result) {
            res.status(404)
            throw Error("Movie wasn't reveived from database.")
        }
        res.json({success: true, message: "dane zostały odebrane przez serwer", result: result})
    } catch (error) {
        next(error)
    }
}