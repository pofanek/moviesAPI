import express from 'express'
import cors from "cors"
import helmet from 'helmet';
import { initialize } from "./database/db";
import moviesRouter from "./routes/movies"

//TODO ADD LIST OF ALL MOVIES IN ANOTHER HTML FILE
//TODO a co jak ktos doda obraz z taka nazwa jaka juz jest, ale to bedzie inny obraz?

const app = express()
const PORT = 4747;

app.use(cors())
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, //? umożliwia ładowanie zasobów (np obrazy) z innych domen w moim przypadku z live servera
  })) //? to sa dodatkowe zabezpieczenia do API
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use("/movies", moviesRouter)

app.listen(PORT, async () => {
    console.log("server is running on PORT:" + PORT);
    await initialize();
})