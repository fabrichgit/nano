"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const deploymentRoutes_1 = __importDefault(require("./routes/deploymentRoutes"));
const injectScript_1 = require("./middleware/injectScript");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const protected_1 = require("./middleware/protected");
const guardtoken_1 = require("./middleware/guardtoken");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true
}));
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', "login.html"));
});
app.get('/app', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', "app.html"));
});
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'views')));
express_1.default.static(path_1.default.join(__dirname, "../uploads"));
app.use("*", injectScript_1.injectHeaderScript);
app.get('/~/:id*', (_req, res) => {
    const sub = _req.originalUrl.replace("/~", "");
    const basePath = path_1.default.join(__dirname, '../uploads', sub);
    if (sub.split("/").length !== 2) {
        res.sendFile(basePath);
        return;
    }
    // Lire les fichiers et dossiers dans le chemin
    fs_1.default.readdir(basePath, { withFileTypes: true }, (err, files) => {
        if (err) {
            res.status(404).send('Chemin introuvable');
            return;
        }
        // Trouver le premier dossier
        const firstDirectory = files.find(file => file.isDirectory());
        if (!firstDirectory) {
            res.status(404).send('Aucun dossier trouvé');
            return;
        }
        const folderPath = path_1.default.join(basePath, firstDirectory.name);
        res.sendFile(folderPath + "/");
    });
});
app.use('/api/deployments', deploymentRoutes_1.default);
app.get("/auth", guardtoken_1.guardToken);
app.get('/ping', (_req, res) => {
    res.json("pong !");
});
app.get('/protected', protected_1.protectRoute, (req, res) => {
    res.send('Bienvenue dans la zone protégée!');
});
app.get('*', (req, res, next) => {
    try {
        const redr = req.headers["referer"]?.split("/");
        const originalUrl = req.originalUrl;
        if (!redr || !originalUrl) {
            res.redirect(originalUrl + "/");
            return;
        }
        const sub = redr.join("").replace("/~", "");
        const basePath = path_1.default.join(__dirname, '../uploads', redr?.at(4));
        // Lire les fichiers et dossiers dans le chemin
        fs_1.default.readdir(basePath, { withFileTypes: true }, (err, files) => {
            if (err) {
                res.status(404).send('Chemin introuvable');
                return;
            }
            // Trouver le premier dossier
            const firstDirectory = files.find(file => file.isDirectory());
            if (!firstDirectory) {
                res.status(404).send('Aucun dossier trouvé');
                return;
            }
            const folderPath = path_1.default.join(basePath, firstDirectory.name);
            // res.send({redr, originalUrl, folderPath})
            const final = `/${redr?.at(3)}/${redr?.at(4)}/${folderPath.split("/").reverse().at(0)}${originalUrl}`;
            res.redirect(final);
            // res.sendFile(folderPath+"/");
        });
    }
    catch (error) {
        next(error);
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
