import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalModels = await prisma.model.count();
    const totalBrands = await prisma.brand.count();
    const totalCategories = await prisma.category.count();
    const verifiedModels = await prisma.model.count({ where: { isVerified: true } });

    // Category breakdown
    const categoriesRaw = await prisma.category.findMany({
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
    const trendingSearches = await prisma.searchKeyword.findMany({
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
  } catch (error) {
    next(error);
  }
};

export const getRecentUpdates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Fetch latest 10 models added or updated
    const recentModels = await prisma.model.findMany({
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
  } catch (error) {
    next(error);
  }
};
