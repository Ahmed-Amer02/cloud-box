import express from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import * as storageController from './storageController.js';

const router = express.Router();

router.use(requireAuth);

/**
 * @swagger
 * /storage/usage:
 *   get:
 *     summary: Get current storage usage for the authenticated user
 *     tags: [Storage]
 *     responses:
 *       200:
 *         description: Storage usage summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     usedBytes: { type: integer, example: 15728640 }
 *                     quotaBytes: { type: integer, example: 5368709120 }
 *                     remainingBytes: { type: integer, example: 5352980480 }
 *                     percentageUsed: { type: number, example: 0.29 }
 */
router.get('/usage', storageController.getStorageUsage);

export default router;
