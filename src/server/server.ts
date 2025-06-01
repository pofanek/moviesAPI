import express from 'express';
const app = express()
const PORT = 4747;

app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
})