import { Router } from "express";
import multer from "multer" //? sluzy do obslugi formData (zamiast app.use(express.json()))
import path from "path";
import { addMovieHandler, searchMovieHandler } from "../controllers/movies";
import { v4 as uuid } from "uuid";
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, '../../uploads'))
    },
    filename(req, file, callback) {
        console.log(file);
        const ext = path.extname(file.originalname); // np. '.jpg'
        const name = path.basename(file.originalname, ext); // np. 'rura'
        const fileName = `${name}-${uuid()}${ext}`
        callback(null, fileName); // np. 'rura-1a2b3c4d.jpg'
    },
})
const upload = multer({storage: storage})

const router = Router()

router.post("/add", upload.single('image'), addMovieHandler)

router.get("/search", searchMovieHandler)

export default router