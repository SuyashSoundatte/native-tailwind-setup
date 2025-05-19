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
const fcm_1 = require("./fcm");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/notify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { playerId, title, message } = req.body;
    let result;
    try {
        if (playerId) {
            result = yield (0, fcm_1.sendPushNotification)(playerId, title, message);
        }
        // if (phoneNumber) {
        //   await sendSMS(phoneNumber, message);
        // }
        console.log(result);
        res.status(200).json({ success: true, notificationId: result.data.id });
    }
    catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
