import { Router } from 'express';
import { getAllUsers, getUserPrompts } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated user list
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/prompts:
 *   get:
 *     summary: Get a user's prompt history (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User's prompt history
 */
router.get('/users/:userId/prompts', getUserPrompts);

export default router;
