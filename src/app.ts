import express, { NextFunction, Request, Response } from 'express'
import cors from "cors"
import path from 'path';
import helmet from 'helmet';
import { initialize } from "./database/db";
import moviesRouter from "./routes/movies"

//TODO ADD LIST OF ALL MOVIES IN ANOTHER HTML FILE

const app = express()
const PORT = 4747;
app.use(express.json())
app.use(cors())
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, //? umożliwia ładowanie zasobów (np obrazy) z innych domen w moim przypadku z live servera
  })) //? to sa dodatkowe zabezpieczenia do API
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use("/movies", moviesRouter)

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("error detected!" + err)
    const status: any = res.statusCode === 200 ? 500 : res.statusCode; //? jezeli statusCode nie ejst ustawiony (=== 200), ustaw go na 500, jesli jest ustawiony ustaw go na taki jak jest.
    res.status(status).json({
      success: false,
      message: err.message || "Błąd serwera"
    })
}
app.use(errorHandler)
app.listen(PORT, async () => {
    console.log("server is running on PORT:" + PORT);
    await initialize();
})