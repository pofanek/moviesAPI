import express from 'express'
import cors from "cors"
import multer from "multer" //? sluzy do obslugi formData (zamiast app.use(express.json()))
import {promises as fs} from "fs";
import { initialize, addMovie, viewMovie } from "./database";
//TODO REMOVING MOVIES.
async function clearFolder(folderPath: string) {
    const files = await fs.readdir(folderPath)
    console.log(files)
    files.forEach(element => {
        fs.rm(folderPath + "/" + element)
        
    });
}
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, __dirname + '/uploads')
    },
    filename(req, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    },
})
const upload = multer({storage: storage})
const app = express()
const PORT = 4747
app.use(cors())
app.post("/movies/add",upload.single('image') , (req, res) => { //? image to name mojego inputa z type="file"
    const body: Body = req.body
    const bodySTr: string = JSON.stringify(body)
    const bodyObj: any = JSON.parse(bodySTr)
    const file = req.file
    console.log(JSON.stringify(body));
    console.log("nazwa pliku: " + file?.filename);
    console.log("sciezka pliku: " + file?.path);
    (async () => {
        await addMovie(bodyObj.movieName, bodyObj.description, file!.path)
    })();
    res.send("dane zostały przesłane")
})

app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    (async () => {
        await initialize()
    })();
})