"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const util_1 = require("./util");
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use(router_1.default);
const port = process.argv[2] || 6790;
app.listen(port, () => {
    (0, util_1.getLocalIps)().map(ip => console.log(`👉 http://${ip}:${port}`));
});
