"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectHeaderScript = injectHeaderScript;
const htmlUtils_1 = require("../utils/htmlUtils");
function injectHeaderScript(req, res, next) {
    const originalSend = res.send;
    res.send = function (body) {
        if (typeof body === 'string' && body.toLowerCase().includes('<!doctype html>')) {
            body = (0, htmlUtils_1.injectScript)(body);
        }
        return originalSend.call(this, body);
    };
    next();
}
