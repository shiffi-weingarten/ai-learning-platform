import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../prisma';
import { generateLesson } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth';

export const submitValidation = [
  body('categoryId').isInt({ min: 1 }).withMessage('Valid categoryId required'),
  body('subCategoryId').isInt({ min: 1 }).withMessage('Valid subCategoryId required'),
  body('prompt').trim().isLength({ min: 3 }).withMessage('Prompt must be at least 3 characters'),
];

export const submitPrompt = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { categoryId, subCategoryId, prompt } = req.body;

  const [category, subCategory] = await Promise.all([
    prisma.category.findUnique({ where: { id: Number(categoryId) } }),
    prisma.subCategory.findUnique({ where: { id: Number(subCategoryId) } }),
  ]);

  if (!category) return res.status(404).json({ error: 'Category not found' });
  if (!subCategory) return res.status(404).json({ error: 'Sub-category not found' });
  if (subCategory.categoryId !== category.id)
    return res.status(400).json({ error: 'Sub-category does not belong to category' });

  const response = await generateLesson(category.name, subCategory.name, prompt);

  const record = await prisma.prompt.create({
    data: {
      userId: req.userId!,
      categoryId: category.id,
      subCategoryId: subCategory.id,
      prompt,
      response,
    },
    include: {
      category: { select: { name: true } },
      subCategory: { select: { name: true } },
    },
  });

  res.status(201).json(record);
};

export const getMyHistory = async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const [prompts, total] = await Promise.all([
    prisma.prompt.findMany({
      where: { userId: req.userId! },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.prompt.count({ where: { userId: req.userId! } }),
  ]);

  res.json({ data: prompts, total, page, limit, totalPages: Math.ceil(total / limit) });
};
