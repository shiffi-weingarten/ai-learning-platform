import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const search = (req.query.search as string) || '';
  const skip = (page - 1) * limit;

  const where = search
    ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { phone: { contains: search } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { prompts: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ data: users, total, page, limit, totalPages: Math.ceil(total / limit) });
};

export const getUserPrompts = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.userId);
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, phone: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [prompts, total] = await Promise.all([
    prisma.prompt.findMany({
      where: { userId },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.prompt.count({ where: { userId } }),
  ]);

  res.json({ user, data: prompts, total, page, limit, totalPages: Math.ceil(total / limit) });
};
