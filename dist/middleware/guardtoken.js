"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (token) => {
    return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
};
const guardToken = (req, res, next) => {
    const token = (() => {
        const headers = req.headers;
        const bearer = headers.authorization;
        return bearer.split(' ')[1];
    })();
    if (token) {
        try {
            const decoded = verifyToken(token);
            res.status(202).send();
        }
        catch (error) {
            res.status(400).send();
        }
    }
    else {
        res.status(400).send();
    }
};
exports.guardToken = guardToken;
