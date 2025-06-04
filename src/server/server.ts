import express from 'express'
import cors from "cors"
import multer from "multer" //? sluzy do obslugi formData (zamiast app.use(express.json()))
const upload = multer()
const app = express()
const PORT = 4747

app.use(cors())

app.post("/movies/add",upload.none() , (req, res) => {
    const body: Body = req.body
    console.log(JSON.stringify(body))
    res.send("dane zostały przesłane")
})

app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT)
})