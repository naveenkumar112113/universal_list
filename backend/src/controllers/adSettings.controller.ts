import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const SETTINGS_FILE = path.join(__dirname, '..', 'config', 'ad-settings.json');

const adSlotSchema = z.object({
  slotKey: z.string(),
  isActive: z.boolean(),
  adClient: z.string(),
  adSlot: z.string(),
});

const adSettingsSchema = z.object({
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

const readSettingsFromFile = (): any => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      // Ensure the config directory exists
      const dir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      return defaultSettings;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ad settings file, using defaults:', error);
    return defaultSettings;
  }
};

const writeSettingsToFile = (settings: any): boolean => {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing ad settings to file:', error);
    return false;
  }
};

export const getAdSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = readSettingsFromFile();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateAdSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = adSettingsSchema.parse(req.body);
    const success = writeSettingsToFile(validatedData);
    
    if (success) {
      res.status(200).json({ success: true, data: validatedData });
    } else {
      res.status(500).json({ success: false, message: 'Failed to write settings to disk' });
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
};
