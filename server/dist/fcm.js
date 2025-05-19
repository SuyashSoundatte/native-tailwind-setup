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
exports.sendSMS = exports.sendPushNotification = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ONE_SIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;
const sendPushNotification = (playerId, title, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.post('https://onesignal.com/api/v1/notifications', {
            app_id: ONE_SIGNAL_APP_ID,
            include_player_ids: [playerId],
            headings: { en: title },
            contents: { en: message },
        }, {
            headers: {
                'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Notification sent:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending push notification:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
});
exports.sendPushNotification = sendPushNotification;
const sendSMS = (phoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const response = yield axios_1.default.post('https://onesignal.com/api/v1/notifications', {
            app_id: ONE_SIGNAL_APP_ID,
            include_phone_numbers: [phoneNumber],
            contents: { en: message },
        }, {
            headers: {
                'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('SMS sent:', response.data);
    }
    catch (error) {
        console.error('Error sending SMS:', ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
    }
});
exports.sendSMS = sendSMS;
