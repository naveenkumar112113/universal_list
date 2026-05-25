import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const searchModels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.length < 2) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    // Advanced search using Prisma OR
    // We are searching in model name, brand name, category name, aliases, and tags
    const models = await prisma.model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
          { aliases: { some: { aliasName: { contains: query, mode: 'insensitive' } } } },
          { tags: { some: { tagName: { contains: query, mode: 'insensitive' } } } },
          { compatibilityLists: { some: { compatibleWith: { contains: query, mode: 'insensitive' } } } }
        ]
      },
      include: {
        brand: true,
        category: true,
        aliases: true,
        tags: true,
        compatibilityLists: true,
      },
      take: 20 // Limit for auto-suggest
    });

    // Log the search history if user is authenticated (Optional but good for analytics)
    if (req.user) {
      // Run asynchronously without waiting
      prisma.searchHistory.create({
        data: {
          userId: req.user.id,
          query: query
        }
      }).catch(console.error);
    }
    
    // Update keyword search count
    prisma.searchKeyword.upsert({
      where: { keyword: query.toLowerCase() },
      update: { count: { increment: 1 } },
      create: { keyword: query.toLowerCase(), count: 1 }
    }).catch(console.error);

    res.status(200).json({ success: true, data: models });
  } catch (error) {
    next(error);
  }
};

export const getTrendingSearches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trending = await prisma.searchKeyword.findMany({
      orderBy: { count: 'desc' },
      take: 10
    });
    res.status(200).json({ success: true, data: trending });
  } catch (error) {
    next(error);
  }
};

export const getSuggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const suggestions = await prisma.model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
          { aliases: { some: { aliasName: { contains: query, mode: 'insensitive' } } } }
        ]
      },
      select: {
        id: true,
        name: true,
        brand: { select: { name: true } },
        category: { select: { name: true } }
      },
      take: 10
    });

    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};

