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
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const logger_1 = __importDefault(require("./logger"));
const User_1 = require("../models/User");
const Wallet_1 = require("../models/Wallet");
const Transaction_1 = require("../models/Transaction"); // Import Transaction entity
// import other entities like Wallet, Transaction if needed
const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: POSTGRES_HOST || "localhost",
    port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432,
    username: POSTGRES_USER || "user",
    password: POSTGRES_PASSWORD || "password",
    database: POSTGRES_DB || "wallet_db",
    entities: [User_1.User, Wallet_1.Wallet, Transaction_1.Transaction], // add all your entities here
    synchronize: true, // auto-create tables, good for dev/prototype
    logging: false,
});
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.AppDataSource.initialize();
            logger_1.default.success("Connected to PostgreSQL database");
        }
        catch (err) {
            logger_1.default.error("Database connection failed:" + err);
            process.exit(1);
        }
    });
}
exports.default = connectDB;
