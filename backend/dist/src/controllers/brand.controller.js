"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrands = void 0;
const db_1 = __importDefault(require("../config/db"));
const zod_1 = require("zod");
const brandSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Brand name is required"),
    logoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
const getBrands = async (req, res, next) => {
    try {
        const brands = await db_1.default.brand.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { models: true },
                },
            },
        });
        res.status(200).json({ success: true, data: brands });
    }
    catch (error) {
        next(error);
    }
};
exports.getBrands = getBrands;
const createBrand = async (req, res, next) => {
    try {
        const validatedData = brandSchema.parse(req.body);
        const existingBrand = await db_1.default.brand.findUnique({ where: { name: validatedData.name } });
        if (existingBrand) {
            res.status(400).json({ success: false, message: 'Brand already exists' });
            return;
        }
        const brand = await db_1.default.brand.create({ data: validatedData });
        res.status(201).json({ success: true, data: brand });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
            return;
        }
        next(error);
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res, next) => {
    try {
        const brandId = req.params.id;
        const validatedData = brandSchema.parse(req.body);
        const brand = await db_1.default.brand.update({
            where: { id: brandId },
            data: validatedData,
        });
        res.status(200).json({ success: true, data: brand });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
            return;
        }
        next(error);
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res, next) => {
    try {
        const brandId = req.params.id;
        await db_1.default.brand.delete({ where: { id: brandId } });
        res.status(200).json({ success: true, message: 'Brand deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBrand = deleteBrand;
