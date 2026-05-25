"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentUpdates = exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async (req, res, next) => {
    try {
        const totalModels = await db_1.default.model.count();
        const totalBrands = await db_1.default.brand.count();
        const totalCategories = await db_1.default.category.count();
        const verifiedModels = await db_1.default.model.count({ where: { isVerified: true } });
        // Category breakdown
        const categoriesRaw = await db_1.default.category.findMany({
            include: {
                _count: {
                    select: { models: true }
                }
            }
        });
        const categories = categoriesRaw.map(c => ({
            id: c.id,
            name: c.name,
            modelCount: c._count.models
        }));
        // Top trending search keywords
        const trendingSearches = await db_1.default.searchKeyword.findMany({
            orderBy: { count: 'desc' },
            take: 5
        });
        res.status(200).json({
            success: true,
            data: {
                totalModels,
                totalBrands,
                totalCategories,
                verifiedModels,
                verifiedPercentage: totalModels > 0 ? Math.round((verifiedModels / totalModels) * 100) : 0,
                categories,
                trendingSearches: trendingSearches.map(t => t.keyword)
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
const getRecentUpdates = async (req, res, next) => {
    try {
        // Fetch latest 10 models added or updated
        const recentModels = await db_1.default.model.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                brand: true,
                category: true
            },
            take: 10
        });
        const updates = recentModels.map(m => ({
            id: m.id,
            date: m.createdAt.toLocaleDateString('en-GB'), // DD/MM/YYYY
            title: `${m.brand.name} ${m.name} ${m.category.name} List Added`,
            status: m.isVerified ? 'Verified' : 'New'
        }));
        res.status(200).json({
            success: true,
            data: updates
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecentUpdates = getRecentUpdates;
