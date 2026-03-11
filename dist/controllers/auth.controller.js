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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, email } = req.body;
            try {
                const result = yield this.authService.registerWithWallet(username, password, email);
                res.status(201).json({
                    message: "User and wallet created",
                    user: { id: result.user.id, username: result.user.username, email: result.user.email },
                    wallet: {
                        id: result.wallet.id,
                        goldBalance: result.wallet.goldBalance,
                        fiatBalance: result.wallet.fiatBalance
                    }
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const result = yield this.authService.login(username, password);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.AuthController = AuthController;
