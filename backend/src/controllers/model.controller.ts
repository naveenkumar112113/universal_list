import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  imageUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  isVerified: z.boolean().optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  compatibilityLists: z.array(z.object({
    compatibleWith: z.string().min(1),
    connectorType: z.string().optional(),
    type: z.string().optional(),
  })).optional()
});

export const getModels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Filtering
    const brandId = req.query.brandId as string || undefined;
    const categoryId = req.query.categoryId as string || undefined;
    
    const whereClause: any = {};
    if (brandId) whereClause.brandId = brandId;
    if (categoryId) whereClause.categoryId = categoryId;

    const [models, total] = await Promise.all([
      prisma.model.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          aliases: true,
          tags: true,
          compatibilityLists: true,
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.model.count({ where: whereClause })
    ]);

    res.status(200).json({
      success: true,
      data: models,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getModelById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modelId = req.params.id as string;
    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: {
        brand: true,
        category: true,
        aliases: true,
        tags: true,
        compatibilityLists: true,
      }
    });

    if (!model) {
      res.status(404).json({ success: false, message: 'Model not found' });
      return;
    }

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    next(error);
  }
};

export const createModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = modelSchema.parse(req.body);

    const model = await prisma.model.create({
      data: {
        name: validatedData.name,
        brandId: validatedData.brandId,
        categoryId: validatedData.categoryId,
        imageUrl: validatedData.imageUrl,
        notes: validatedData.notes,
        isVerified: validatedData.isVerified || false,
        aliases: {
          create: validatedData.aliases?.map(alias => ({ aliasName: alias })) || []
        },
        tags: {
          create: validatedData.tags?.map(tag => ({ tagName: tag })) || []
        },
        compatibilityLists: {
          create: validatedData.compatibilityLists?.map(comp => ({
            compatibleWith: comp.compatibleWith,
            connectorType: comp.connectorType,
            type: comp.type,
            isVerified: true
          })) || []
        }
      },
      include: {
        brand: true,
        category: true,
        aliases: true,
        tags: true,
        compatibilityLists: true,
      }
    });

    res.status(201).json({ success: true, data: model });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
};

export const updateModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modelId = req.params.id as string;
    const { name, brandId, categoryId, isVerified, aliases, compatibilityLists } = req.body;

    const model = await prisma.model.update({
      where: { id: modelId },
      data: {
        ...(name && { name }),
        ...(brandId && { brandId }),
        ...(categoryId && { categoryId }),
        ...(isVerified !== undefined && { isVerified }),
        ...(aliases && {
          aliases: {
            deleteMany: {},
            create: aliases.map((alias: string) => ({ aliasName: alias }))
          }
        }),
        ...(compatibilityLists && {
          compatibilityLists: {
            deleteMany: {},
            create: compatibilityLists.map((comp: any) => ({
              compatibleWith: comp.compatibleWith,
              connectorType: comp.connectorType || 'Standard',
              type: comp.type || 'Display',
              isVerified: true
            }))
          }
        })
      }
    });

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    next(error);
  }
};

export const deleteModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modelId = req.params.id as string;
    await prisma.model.delete({
      where: { id: modelId }
    });

    res.status(200).json({ success: true, message: 'Model deleted successfully' });
  } catch (error) {
    next(error);
  }
};

import fs from 'fs';
import csvParser from 'csv-parser';

export const bulkImportModels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No CSV file uploaded' });
      return;
    }

    const results: any[] = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Format assumed: Model Name, Brand ID, Category ID, Compatible With (comma separated)
        let importedCount = 0;
        
        for (const row of results) {
           const brandId = String(row['Brand ID'] || row.brandId || '').trim();
           const categoryId = String(row['Category ID'] || row.categoryId || '').trim();
           const name = row['Model Name'] || row.name;

           if (!name || !brandId || !categoryId) continue;

           const newModel = await prisma.model.create({
             data: {
               name,
               brandId,
               categoryId,
               isVerified: true
             }
           });
           
           importedCount++;
           
           const compatibleStr = row['Compatible With'] || row.compatibleWith;
           if (compatibleStr) {
             const compats = compatibleStr.split(',').map((c: string) => c.trim()).filter(Boolean);
             if (compats.length > 0) {
               await prisma.compatibilityList.createMany({
                 data: compats.map((c: string) => ({
                   modelId: newModel.id,
                   compatibleWith: c,
                   isVerified: true
                 }))
               });
             }
           }
        }
        
        // Remove temp file
        fs.unlinkSync(req.file!.path);

        res.status(200).json({ 
          success: true, 
          message: `Successfully imported ${importedCount} models.` 
        });
      });

  } catch (error) {
    next(error);
  }
};

export const requestModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, brandId, categoryId, notes } = req.body;
    
    if (!name || !brandId || !categoryId) {
      res.status(400).json({ success: false, message: 'Model name, brand, and category are required' });
      return;
    }
    
    const model = await prisma.model.create({
      data: {
        name,
        brandId: String(brandId),
        categoryId: String(categoryId),
        isVerified: false,
        notes: notes || 'Model requested by user'
      }
    });
    
    res.status(201).json({ success: true, message: 'Model request submitted successfully', data: model });
  } catch (error) {
    next(error);
  }
};
