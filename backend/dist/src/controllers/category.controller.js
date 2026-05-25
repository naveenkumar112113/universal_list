"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const db_1 = __importDefault(require("../config/db"));
const zod_1 = require("zod");
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Category name is required"),
});
const getCategories = async (req, res, next) => {
    try {
        const categories = await db_1.default.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { models: true },
                },
            },
        });
        res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body);
        const existingCategory = await db_1.default.category.findUnique({ where: { name: validatedData.name } });
        if (existingCategory) {
            res.status(400).json({ success: false, message: 'Category already exists' });
            return;
        }
        const category = await db_1.default.category.create({ data: validatedData });
        res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
            return;
        }
        next(error);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const validatedData = categorySchema.parse(req.body);
        const category = await db_1.default.category.update({
            where: { id: categoryId },
            data: validatedData,
        });
        res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
            return;
        }
        next(error);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        await db_1.default.category.delete({ where: { id: categoryId } });
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
