"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdSettings = exports.getAdSettings = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const SETTINGS_FILE = path_1.default.join(__dirname, '..', 'config', 'ad-settings.json');
const adSlotSchema = zod_1.z.object({
    slotKey: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    adClient: zod_1.z.string(),
    adSlot: zod_1.z.string(),
});
const adSettingsSchema = zod_1.z.object({
    home_top: adSlotSchema,
    home_mid: adSlotSchema,
    sidebar: adSlotSchema,
    in_list: adSlotSchema,
});
const defaultSettings = {
    home_top: {
        slotKey: 'home_top',
        isActive: false,
        adClient: 'ca-pub-3940256099942544',
        adSlot: '6300978111'
    },
    home_mid: {
        slotKey: 'home_mid',
        isActive: false,
        adClient: 'ca-pub-3940256099942544',
        adSlot: '6300978111'
    },
    sidebar: {
        slotKey: 'sidebar',
        isActive: false,
        adClient: 'ca-pub-3940256099942544',
        adSlot: '6300978111'
    },
    in_list: {
        slotKey: 'in_list',
        isActive: false,
        adClient: 'ca-pub-3940256099942544',
        adSlot: '6300978111'
    }
};
const readSettingsFromFile = () => {
    try {
        if (!fs_1.default.existsSync(SETTINGS_FILE)) {
            // Ensure the config directory exists
            const dir = path_1.default.dirname(SETTINGS_FILE);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
            return defaultSettings;
        }
        const data = fs_1.default.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading ad settings file, using defaults:', error);
        return defaultSettings;
    }
};
const writeSettingsToFile = (settings) => {
    try {
        const dir = path_1.default.dirname(SETTINGS_FILE);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
        return true;
    }
    catch (error) {
        console.error('Error writing ad settings to file:', error);
        return false;
    }
};
const getAdSettings = async (req, res, next) => {
    try {
        const settings = readSettingsFromFile();
        res.status(200).json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdSettings = getAdSettings;
const updateAdSettings = async (req, res, next) => {
    try {
        const validatedData = adSettingsSchema.parse(req.body);
        const success = writeSettingsToFile(validatedData);
        if (success) {
            res.status(200).json({ success: true, data: validatedData });
        }
        else {
            res.status(500).json({ success: false, message: 'Failed to write settings to disk' });
        }
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
            return;
        }
        next(error);
    }
};
exports.updateAdSettings = updateAdSettings;
