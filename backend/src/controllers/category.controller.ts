import { Request, Response } from 'express';
import prisma from '../prisma';

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
};
