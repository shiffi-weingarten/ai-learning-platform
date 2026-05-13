import { Router } from 'express';
import { submitPrompt, submitValidation, getMyHistory } from '../controllers/prompt.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/prompts:
 *   post:
 *     summary: Submit a prompt and get an AI-generated lesson
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, subCategoryId, prompt]
 *             properties:
 *               categoryId: { type: integer }
 *               subCategoryId: { type: integer }
 *               prompt: { type: string }
 *     responses:
 *       201:
 *         description: Lesson generated
 */
router.post('/', authenticate, submitValidation, submitPrompt);

/**
 * @swagger
 * /api/prompts/history:
 *   get:
 *     summary: Get current user's learning history
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated history
 */
router.get('/history', authenticate, getMyHistory);

export default router;
