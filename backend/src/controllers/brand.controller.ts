import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export const getBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { models: true },
        },
      },
    });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = brandSchema.parse(req.body);

    const existingBrand = await prisma.brand.findUnique({ where: { name: validatedData.name } });
    if (existingBrand) {
      res.status(400).json({ success: false, message: 'Brand already exists' });
      return;
    }

    const brand = await prisma.brand.create({ data: validatedData });
    res.status(201).json({ success: true, data: brand });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id as string);
    const validatedData = brandSchema.parse(req.body);

    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: validatedData,
    });
    res.status(200).json({ success: true, data: brand });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id as string);
    await prisma.brand.delete({ where: { id: brandId } });
    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};
