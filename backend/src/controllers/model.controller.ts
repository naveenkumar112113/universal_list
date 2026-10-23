import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { z } from 'zod';
import fs from 'fs';
import csvParser from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';


const modelSchema = z.object({
  name: z.string().min(1, 'Model name is required'),
  brandId: z.union([z.number(), z.string().transform(v => parseInt(v, 10))]),
  categoryId: z.union([z.number(), z.string().transform(v => parseInt(v, 10))]),
  typeId: z.union([z.number(), z.string().transform(v => parseInt(v, 10))]).optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  notes: z.string().optional().nullable(),
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
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const brandIdParam = req.query.brandId as string || undefined;
    const categoryIdParam = req.query.categoryId as string || undefined;
    const typeIdParam = req.query.typeId as string || undefined;
    const searchParam = (req.query.search || req.query.q) as string || undefined;
    const isVerifiedParam = req.query.isVerified as string || undefined;

    const whereClause: any = { isActive: true };

    if (brandIdParam) {
      whereClause.brandId = parseInt(brandIdParam, 10);
    }
    if (categoryIdParam) {
      whereClause.categoryId = parseInt(categoryIdParam, 10);
    }
    if (typeIdParam) {
      whereClause.typeId = parseInt(typeIdParam, 10);
    }
    if (isVerifiedParam !== undefined) {
      whereClause.isVerified = isVerifiedParam === 'true';
    }

    if (searchParam && searchParam.trim().length > 0) {
      const q = searchParam.trim();
      whereClause.OR = [
        { name: { contains: q } },
        { brand: { name: { contains: q } } },
        { aliases: { some: { aliasName: { contains: q } } } },
        { compatibilityLists: { some: { compatibleWith: { contains: q } } } }
      ];
    }

    const [models, total] = await Promise.all([
      prisma.model.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          categoryType: true,
          aliases: true,
          tags: true,
          compatibilityLists: true,
          _count: {
            select: { compatibilityLists: true }
          }
        },
        orderBy: [{ isVerified: 'desc' }, { updatedAt: 'desc' }]
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
    const modelId = parseInt(String(req.params.id), 10);
    if (isNaN(modelId)) {
      res.status(400).json({ success: false, message: 'Invalid model ID' });
      return;
    }

    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: {
        brand: true,
        category: true,
        categoryType: true,
        aliases: true,
        tags: true,
        compatibilityLists: true,
        sourceCompatibilities: {
          include: { targetModel: { include: { brand: true } } }
        },
        targetCompatibilities: {
          include: { sourceModel: { include: { brand: true } } }
        }
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

export const getModelCompatibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modelId = parseInt(String(req.params.id), 10);
    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: {
        brand: true,
        category: true,
        categoryType: true,
        compatibilityLists: true,
        sourceCompatibilities: {
          include: { targetModel: { include: { brand: true } } }
        }
      }
    });

    if (!model) {
      res.status(404).json({ success: false, message: 'Model not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        model,
        compatibilities: model.compatibilityLists,
        linkedModels: model.sourceCompatibilities
      }
    });
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
        typeId: validatedData.typeId || null,
        imageUrl: validatedData.imageUrl,
        notes: validatedData.notes,
        isVerified: validatedData.isVerified ?? false,
        lastVerifiedAt: validatedData.isVerified ? new Date() : null,
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
        categoryType: true,
        aliases: true,
        tags: true,
        compatibilityLists: true,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id ? (typeof req.user.id === 'number' ? req.user.id : parseInt(String(req.user.id), 10)) : null,
        action: 'CREATE_MODEL',
        resource: 'models',
        details: `Created model: ${model.name} (Brand: ${model.brandId}, Category: ${model.categoryId})`
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
    const modelId = parseInt(String(req.params.id), 10);
    const { name, brandId, categoryId, typeId, isVerified, notes, aliases, compatibilityLists } = req.body;

    const model = await prisma.model.update({
      where: { id: modelId },
      data: {
        ...(name && { name }),
        ...(brandId && { brandId: parseInt(brandId, 10) }),
        ...(categoryId && { categoryId: parseInt(categoryId, 10) }),
        ...(typeId !== undefined && { typeId: typeId ? parseInt(typeId, 10) : null }),
        ...(isVerified !== undefined && {
          isVerified,
          lastVerifiedAt: isVerified ? new Date() : null
        }),
        ...(notes !== undefined && { notes }),
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
              type: comp.type || 'Compatibility',
              isVerified: true
            }))
          }
        })
      },
      include: {
        brand: true,
        category: true,
        categoryType: true,
        aliases: true,
        compatibilityLists: true
      }
    });

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    next(error);
  }
};

export const deleteModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modelId = parseInt(String(req.params.id), 10);
    await prisma.model.update({
      where: { id: modelId },
      data: { isActive: false }
    });

    res.status(200).json({ success: true, message: 'Model deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

export const addCompatibilityRelationship = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modelId = parseInt(String(req.params.id), 10);
    const { compatibleWith, connectorType, type, notes } = req.body;

    if (!compatibleWith) {
      res.status(400).json({ success: false, message: 'Compatible model name is required' });
      return;
    }

    const compRecord = await prisma.compatibilityList.create({
      data: {
        modelId,
        compatibleWith: String(compatibleWith).trim(),
        connectorType: connectorType || null,
        type: type || null,
        isVerified: true
      }
    });

    res.status(201).json({ success: true, data: compRecord });
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
        brandId: parseInt(String(brandId), 10),
        categoryId: parseInt(String(categoryId), 10),
        isVerified: false,
        notes: notes || 'Model requested by technician'
      }
    });

    res.status(201).json({ success: true, message: 'Model request submitted successfully', data: model });
  } catch (error) {
    next(error);
  }
};

export interface BulkImportJob {
  importId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total: number;
  inserted: number;
  newModels: number;
  duplicates: number;
  failed: number;
  progress: number;
  currentModel?: string;
  message?: string;
  errors: Array<{ row: number; name?: string; message: string }>;
  startedAt: number;
  completedAt?: number;
}

const importJobs = new Map<string, BulkImportJob>();

// Clean up jobs older than 30 minutes
const cleanupOldJobs = () => {
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
  for (const [id, job] of importJobs.entries()) {
    if (job.startedAt < thirtyMinutesAgo) {
      importJobs.delete(id);
    }
  }
};
setInterval(cleanupOldJobs, 10 * 60 * 1000).unref();

export const getBulkImportProgress = async (req: Request, res: Response): Promise<void> => {
  const importId = String(req.params.importId);
  const job = importJobs.get(importId);
  if (!job) {
    res.status(404).json({ success: false, message: 'Import job not found' });
    return;
  }
  res.status(200).json({ success: true, data: job });
};

// Helper: normalize extra spaces (trim leading/trailing, collapse multiple consecutive spaces, tabs, newlines, non-breaking spaces)
const cleanText = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/[\u00A0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
};

// Helper: flexible row field lookup with key trimming and space normalization
const getRowField = (row: any, ...keys: string[]): string => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) {
      const cleaned = cleanText(row[k]);
      if (cleaned) return cleaned;
    }
  }
  const normalizedKeys = keys.map(k => k.toLowerCase().replace(/[\s_-]+/g, ''));
  for (const actualKey of Object.keys(row)) {
    const norm = actualKey.toLowerCase().replace(/[\s_-]+/g, '');
    if (normalizedKeys.includes(norm)) {
      const cleaned = cleanText(row[actualKey]);
      if (cleaned) return cleaned;
    }
  }
  return '';
};

interface CachedModel {
  id: number;
  name: string;
  brandId: number;
  categoryId: number;
  compatibilitySet: Set<string>;
}

export const bulkImportModels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No CSV file uploaded' });
      return;
    }

    const importId = (req.query.importId as string) || (req.headers['x-import-id'] as string) || uuidv4();
    const isStreaming = req.query.stream === 'true' || 
      (req.headers.accept && req.headers.accept.includes('text/event-stream'));

    const initialJob: BulkImportJob = {
      importId,
      status: 'pending',
      total: 0,
      inserted: 0,
      newModels: 0,
      duplicates: 0,
      failed: 0,
      progress: 0,
      errors: [],
      startedAt: Date.now(),
    };
    importJobs.set(importId, initialJob);

    if (isStreaming) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
      }
    }

    const sendEvent = (
      type: 'start' | 'progress' | 'complete' | 'error',
      patch: Partial<BulkImportJob>
    ) => {
      const current = importJobs.get(importId) || initialJob;
      const updated: BulkImportJob = { ...current, ...patch };
      importJobs.set(importId, updated);

      if (isStreaming && !res.writableEnded) {
        const payload = JSON.stringify({
          type,
          ...updated,
        });
        res.write(`data: ${payload}\n\n`);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
      }
    };

    const filePath = req.file.path;
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser({
        mapHeaders: ({ header }) => cleanText(header)
      }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Filter out completely blank rows to ensure exact record counting
        const validRows = results.filter(row => {
          return Object.values(row).some(v => cleanText(v).length > 0);
        });
        const total = validRows.length;

        sendEvent('start', {
          status: 'processing',
          total,
          inserted: 0,
          newModels: 0,
          duplicates: 0,
          failed: 0,
          progress: 0,
          message: `Parsed ${total} records from CSV. Starting import...`,
        });

        let newModelsCount = 0;
        let duplicatesCount = 0;
        let failedCount = 0;
        const errors: Array<{ row: number; name?: string; message: string }> = [];
        const brandCache = new Map<string, any>();
        const categoryCache = new Map<string, any>();
        const modelCache = new Map<string, CachedModel>();
        let lastUpdateTime = 0;

        try {
          for (let i = 0; i < total; i++) {
            const row = validRows[i];
            const rowNumber = i + 1;

            // Extract and clean values, handling extra spaces
            const modelName = getRowField(row, 'Model Name', 'name', 'Model', 'model');
            const brandVal = getRowField(row, 'Brand', 'brand', 'Brand Name');
            const categoryVal = getRowField(row, 'Category', 'category', 'Category Name');
            const compatibleStr = getRowField(row, 'Compatible Models', 'Compatible With', 'compatibleWith', 'Compatible');

            try {
              if (!modelName || !brandVal || !categoryVal) {
                failedCount++;
                errors.push({
                  row: rowNumber,
                  name: modelName || 'Unknown',
                  message: 'Missing required field (Model Name, Brand, or Category)',
                });
              } else {
                const brandStr = brandVal;
                const categoryStr = categoryVal;

                // 1. Resolve Brand with space normalization
                const brandKey = brandStr.toLowerCase();
                let brand = brandCache.get(brandKey);
                if (!brand) {
                  brand = await prisma.brand.findFirst({
                    where: { name: brandStr }
                  });
                  if (!brand) {
                    const allBrands = await prisma.brand.findMany();
                    brand = allBrands.find(b => cleanText(b.name).toLowerCase() === brandKey) || null;
                  }
                  if (!brand) {
                    brand = await prisma.brand.create({
                      data: {
                        name: brandStr,
                        slug: brandStr.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      }
                    });
                  }
                  brandCache.set(brandKey, brand);
                }

                // 2. Resolve Category with space normalization
                const categoryKey = categoryStr.toLowerCase();
                let category = categoryCache.get(categoryKey);
                if (!category) {
                  category = await prisma.category.findFirst({
                    where: { name: categoryStr }
                  });
                  if (!category) {
                    const allCategories = await prisma.category.findMany();
                    category = allCategories.find(c => cleanText(c.name).toLowerCase() === categoryKey) || null;
                  }
                  if (!category) {
                    category = await prisma.category.create({
                      data: {
                        name: categoryStr,
                        slug: categoryStr.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      }
                    });
                  }
                  categoryCache.set(categoryKey, category);
                }

                // 3. Handle Duplicate Model Name (check in batch cache and DB)
                const modelCacheKey = `${brand.id}:${category.id}:${modelName.toLowerCase()}`;
                let cachedModel = modelCache.get(modelCacheKey);
                let isDuplicate = false;

                if (!cachedModel) {
                  // Check existing models in database for this brand and category
                  let existingModel = await prisma.model.findFirst({
                    where: {
                      brandId: brand.id,
                      categoryId: category.id,
                      name: {
                        equals: modelName,
                      }
                    },
                    include: {
                      compatibilityLists: true
                    }
                  });

                  if (!existingModel) {
                    // Check if an existing model in DB matches when extra spaces are collapsed
                    const candidateModels = await prisma.model.findMany({
                      where: {
                        brandId: brand.id,
                        categoryId: category.id,
                      },
                      include: {
                        compatibilityLists: true
                      }
                    });
                    const modelNameLower = modelName.toLowerCase();
                    existingModel = candidateModels.find(
                      m => cleanText(m.name).toLowerCase() === modelNameLower
                    ) || null;
                  }

                  if (existingModel) {
                    isDuplicate = true;
                    // If the existing model name had unnormalized spaces, sanitize it
                    if (existingModel.name !== modelName && cleanText(existingModel.name).toLowerCase() === modelName.toLowerCase()) {
                      await prisma.model.update({
                        where: { id: existingModel.id },
                        data: { name: modelName, lastVerifiedAt: new Date(), isVerified: true }
                      });
                      existingModel.name = modelName;
                    } else {
                      // Touch model verification
                      await prisma.model.update({
                        where: { id: existingModel.id },
                        data: {
                          lastVerifiedAt: new Date(),
                          isVerified: true
                        }
                      });
                    }

                    cachedModel = {
                      id: existingModel.id,
                      name: existingModel.name,
                      brandId: existingModel.brandId,
                      categoryId: existingModel.categoryId,
                      compatibilitySet: new Set(
                        (existingModel.compatibilityLists || []).map(c => cleanText(c.compatibleWith).toLowerCase())
                      )
                    };
                    modelCache.set(modelCacheKey, cachedModel);
                  }
                } else {
                  isDuplicate = true;
                }

                // Parse and sanitize compatibility items (handling extra spaces and comma-separated tokens)
                const rawCompats = compatibleStr
                  ? compatibleStr.split(',').map(c => cleanText(c)).filter(Boolean)
                  : [];
                const seenInRow = new Set<string>();
                const uniqueCompatsInRow: string[] = [];
                for (const raw of rawCompats) {
                  const lower = raw.toLowerCase();
                  if (!seenInRow.has(lower)) {
                    seenInRow.add(lower);
                    uniqueCompatsInRow.push(raw);
                  }
                }

                if (isDuplicate && cachedModel) {
                  duplicatesCount++;

                  // Merge new compatibilities into existing model without duplicate rows
                  const newCompatsToAdd: string[] = [];
                  for (const c of uniqueCompatsInRow) {
                    const cLower = c.toLowerCase();
                    if (!cachedModel.compatibilitySet.has(cLower)) {
                      cachedModel.compatibilitySet.add(cLower);
                      newCompatsToAdd.push(c);
                    }
                  }

                  if (newCompatsToAdd.length > 0) {
                    await prisma.compatibilityList.createMany({
                      data: newCompatsToAdd.map(c => ({
                        modelId: cachedModel!.id,
                        compatibleWith: c,
                        type: category.name,
                        isVerified: true
                      }))
                    });
                  }
                } else {
                  newModelsCount++;

                  // Create new Model record
                  const newModel = await prisma.model.create({
                    data: {
                      name: modelName,
                      brandId: brand.id,
                      categoryId: category.id,
                      isVerified: true,
                      lastVerifiedAt: new Date()
                    }
                  });

                  const compatibilitySet = new Set<string>();
                  if (uniqueCompatsInRow.length > 0) {
                    await prisma.compatibilityList.createMany({
                      data: uniqueCompatsInRow.map(c => {
                        compatibilitySet.add(c.toLowerCase());
                        return {
                          modelId: newModel.id,
                          compatibleWith: c,
                          type: category.name,
                          isVerified: true
                        };
                      })
                    });
                  }

                  modelCache.set(modelCacheKey, {
                    id: newModel.id,
                    name: newModel.name,
                    brandId: newModel.brandId,
                    categoryId: newModel.categoryId,
                    compatibilitySet
                  });
                }
              }
            } catch (rowErr: any) {
              failedCount++;
              errors.push({
                row: rowNumber,
                name: modelName || 'Unknown',
                message: rowErr.message || 'Failed to process model',
              });
            }

            const currentImported = newModelsCount + duplicatesCount;
            const processed = currentImported + failedCount;
            const progress = total > 0 ? Math.round((processed / total) * 100) : 100;
            const isLast = i === total - 1;
            const now = Date.now();

            if (
              isLast ||
              total <= 100 ||
              (total <= 500 && processed % 5 === 0) ||
              (total > 500 && processed % 25 === 0) ||
              (now - lastUpdateTime >= 100)
            ) {
              lastUpdateTime = now;
              sendEvent('progress', {
                status: 'processing',
                inserted: currentImported,
                newModels: newModelsCount,
                duplicates: duplicatesCount,
                failed: failedCount,
                progress,
                currentModel: modelName || undefined,
                errors: errors.slice(0, 50),
              });
            }
          }

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          const totalImported = newModelsCount + duplicatesCount;
          const completionMessage = failedCount > 0
            ? `Bulk import completed: ${totalImported} of ${total} record(s) processed (${newModelsCount} new, ${duplicatesCount} duplicates merged, ${failedCount} failed).`
            : duplicatesCount > 0
            ? `Successfully imported ${totalImported} model(s) (${newModelsCount} new, ${duplicatesCount} duplicates merged).`
            : `Successfully imported ${totalImported} model(s).`;

          if (isStreaming) {
            sendEvent('complete', {
              status: 'completed',
              total,
              inserted: totalImported,
              newModels: newModelsCount,
              duplicates: duplicatesCount,
              failed: failedCount,
              progress: 100,
              message: completionMessage,
              errors: errors.slice(0, 50),
              completedAt: Date.now(),
            });
            res.end();
          } else {
            res.status(200).json({
              success: true,
              message: completionMessage,
              data: {
                importId,
                total,
                inserted: totalImported,
                newModels: newModelsCount,
                duplicates: duplicatesCount,
                failed: failedCount,
                progress: 100,
                errors: errors.slice(0, 50),
              }
            });
          }
        } catch (err: any) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          if (isStreaming) {
            sendEvent('error', {
              status: 'failed',
              message: err.message || 'Import processing error',
              completedAt: Date.now(),
            });
            res.end();
          } else {
            next(err);
          }
        }
      })
      .on('error', (err) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        if (isStreaming) {
          sendEvent('error', {
            status: 'failed',
            message: err.message || 'CSV stream parsing error',
            completedAt: Date.now(),
          });
          res.end();
        } else {
          next(err);
        }
      });

  } catch (error) {
    next(error);
  }
};


export const exportSampleCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const csvHeaders = 'Model Name,Brand,Category,Compatible Models\n';
    const sampleRows = [
      'Galaxy S24,Samsung,Tempered Glass,"Galaxy S23, Galaxy S22"',
      'iPhone 15 Pro,Apple,Tempered Glass,"iPhone 14 Pro, iPhone 16 Pro"',
      'Vivo Y200 5G,Vivo,CC Board / Charging Board,"Vivo Y100, Vivo V29e"',
      'Redmi Note 13 Pro,Xiaomi,Battery,"Poco X6 5G, Redmi Note 12 Pro"',
      'OnePlus 12R,OnePlus,Combo / Display,"Realme GT Neo 5, OnePlus 11R"',
      'Realme 12 Pro,Realme,Strip / Flex Cable,"Realme 12 Pro Plus"',
      'Pixel 8 Pro,Google,Display Connector,"Pixel 7 Pro"'
    ].join('\n');

    const csvContent = csvHeaders + sampleRows + '\n';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sample_models_import.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
