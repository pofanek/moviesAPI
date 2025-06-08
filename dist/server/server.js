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
const fs_1 = require("fs");
const database_1 = require("./database");
//TODO REMOVING MOVIES.
//TODO ADD LIST OF ALL MOVIES IN ANOTHER HTML FILE
//TODO a co jak ktos doda obraz z taka nazwa jaka juz jest, ale to bedzie inny obraz?
function clearFolder(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs_1.promises.readdir(folderPath);
        console.log(files);
        files.forEach(element => {
            fs_1.promises.rm(folderPath + "/" + element);
        });
    });
}
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, __dirname + '/uploads');
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
    const bodySTr = JSON.stringify(body);
    const bodyObj = JSON.parse(bodySTr);
    const file = req.file;
    console.log(JSON.stringify(body));
    console.log("nazwa pliku: " + (file === null || file === void 0 ? void 0 : file.filename));
    console.log("sciezka pliku: " + (file === null || file === void 0 ? void 0 : file.path));
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.addMovie)(bodyObj.movieName, bodyObj.description, file.path);
        res.send("dane zostały przesłane");
    }))();
});
app.get("/movies/search", (req, res) => {
    const query = req.query;
    const querySTr = JSON.stringify(query);
    const queryObj = JSON.parse(querySTr);
    console.log('server received: ' + queryObj.query);
    var result;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        result = yield (0, database_1.viewMovie)(queryObj.query);
        console.log(result);
        res.send(result);
    }))();
});
app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.initialize)();
    }))();
});
