import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { models: true },
        },
      },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = categorySchema.parse(req.body);

    const existingCategory = await prisma.category.findUnique({ where: { name: validatedData.name } });
    if (existingCategory) {
      res.status(400).json({ success: false, message: 'Category already exists' });
      return;
    }

    const category = await prisma.category.create({ data: validatedData });
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = req.params.id as string;
    const validatedData = categorySchema.parse(req.body);

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: validatedData,
    });
    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = req.params.id as string;
    await prisma.category.delete({ where: { id: categoryId } });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
