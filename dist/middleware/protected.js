"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// Middleware pour protéger la route
const protectRoute = (req, res, next) => {
    const { username, password } = req.query;
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        //   res.redirect("/app")
        res.status(200).send({ token: (0, jsonwebtoken_1.sign)(Math.random().toString(), process.env.JWT_SECRET) });
        return;
    }
    res.status(400).send();
};
exports.protectRoute = protectRoute;
