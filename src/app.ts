import express from 'express'
import cors from "cors"
import multer from "multer" //? sluzy do obslugi formData (zamiast app.use(express.json()))
import { initialize, addMovie, viewMovie } from "./database";
//TODO ADD LIST OF ALL MOVIES IN ANOTHER HTML FILE
//TODO a co jak ktos doda obraz z taka nazwa jaka juz jest, ale to bedzie inny obraz?
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, __dirname + '/uploads')
    },
    filename(req, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    },
})
type Movie = {
    id: number
    name: string
    description: string
    imagePath: string
}
const upload = multer({storage: storage})
const app = express()
const PORT = 4747
app.use(cors())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.post("/movies/add",upload.single('image') , (req, res) => { //? image to name mojego inputa z type="file"
    const { movieName, description } = req.body as { movieName: string; description: string; };
    const file = req.file
    console.log("nazwa pliku: " + file?.filename);
        (async () => {
            await addMovie(movieName, description, 'http://localhost:4747/uploads/' + file!.originalname);
            res.send("dane zostały przesłane")
        })();
})
app.get("/movies/search", (req, res) => {
    const query = req.query as {query: string}
    console.log('server received: ' + query.query);
    (async () => { //? W ASYNC WYWOLUJE SIE ASYNCHRONICZNIE CZYLI POKOLEI
        const result: Movie | {} = await viewMovie(query.query);
        console.log(result)
        res.send(result)
    })();
})
app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    (async () => {
        await initialize();
    })();
})