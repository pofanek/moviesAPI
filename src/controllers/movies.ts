import { Request, Response, NextFunction } from "express";
import { MovieDb } from '../types/movies'
import { addMovie, viewMovie } from "../database/db";

export const addMovieHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieName, description } = req.body as { movieName: string; description: string; };
        const file = req.file
        console.log("nazwa pliku: " + file?.filename);
        await addMovie(movieName, description, 'http://localhost:4747/uploads/' + file!.originalname);
        res.send("dane zostały przesłane")
    } catch (error) {
        next(error) //? bez next po app.use() w ktorym handler sie znajduje nic by sie nie wykonalo. (tak samo to dziala jakby nie bylo reponse w try bloku)
    }
}

export const searchMovieHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query as {query: string}
        console.log('server received: ' + query.query);
        const result: MovieDb | {} = await viewMovie(query.query);
        console.log(result)
        res.send(result)  
    } catch (error) {
        next(error)
    }
}