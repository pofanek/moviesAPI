import { Router } from "express";
import multer from "multer" //? sluzy do obslugi formData (zamiast app.use(express.json()))
import path from "path";
import { addMovieHandler, searchMovieHandler } from "../controllers/movies";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, '../uploads'))
    },
    filename(req, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    },
})

const upload = multer({storage: storage})

const router = Router()

router.post("/add", upload.single('image'), addMovieHandler)

router.get("/search", searchMovieHandler)

export default router