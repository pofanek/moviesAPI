import express from 'express'
import cors from "cors"
import multer from "multer" //? sluzy do obslugi formData (zamiast app.use(express.json()))
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './uploads')
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
    const file = req.file
    console.log(JSON.stringify(body))
    console.log("nazwa pliku: " + file?.filename)
    res.send("dane zostały przesłane")
})

app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT)
})