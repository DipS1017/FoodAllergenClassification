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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../models/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, gender, phoneNumber } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield db_1.default.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                gender,
                phoneNumber: phoneNumber || null,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "User Creation Failed" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: "invalid email or password" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, roles: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});
exports.login = login;
