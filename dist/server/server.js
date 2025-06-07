"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer")); //? sluzy do obslugi formData (zamiast app.use(express.json()))
const database_1 = require("./database");
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, './server/uploads');
    },
    filename(req, file, callback) {
        console.log(file);
        callback(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const app = (0, express_1.default)();
const PORT = 4747;
app.use((0, cors_1.default)());
app.post("/movies/add", upload.single('image'), (req, res) => {
    const body = req.body;
    const file = req.file;
    console.log(JSON.stringify(body));
    console.log("nazwa pliku: " + (file === null || file === void 0 ? void 0 : file.filename));
    res.send("dane zostały przesłane");
});
app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.initialize)();
    }))();
});
