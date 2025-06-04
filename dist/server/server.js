"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer")); //? sluzy do obslugi formData (zamiast app.use(express.json()))
const upload = (0, multer_1.default)();
const app = (0, express_1.default)();
const PORT = 4747;
app.use((0, cors_1.default)());
app.post("/movies/add", upload.none(), (req, res) => {
    const body = req.body;
    console.log(JSON.stringify(body));
    res.send("dane zostały przesłane");
});
app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
});
