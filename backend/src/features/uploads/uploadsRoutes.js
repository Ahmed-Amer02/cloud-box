import express from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import * as uploadsController from './uploadsController.js';
import { uploadLimiter } from '../../middlewares/rateLimiters.js';

const router = express.Router();

router.use(requireAuth);
router.use(uploadLimiter);

/**
 * @swagger
 * /uploads/init:
 *   post:
 *     summary: Start an upload session
 *     description: Returns an uploadId used to stream the actual file bytes in a follow-up request.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileName]
 *             properties:
 *               fileName: { type: string, example: report.pdf }
 *               folderId: { type: string, format: uuid, nullable: true, example: null  }
 *     responses:
 *       201:
 *         description: Upload session created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Target folder not found, unauthorized, or trashed
 */
router.post('/init', uploadsController.initUpload);

/**
 * @swagger
 * /uploads/{uploadId}:
 *   post:
 *     summary: Stream the file for a previously-initialized upload session
 *     description: Body must be multipart/form-data with the file under a field named "file". The file is streamed to S3 as it's parsed -- never fully buffered in memory.
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded and created
 *       404:
 *         description: Upload session not found, expired, or already claimed
 *       413:
 *         description: File exceeds the maximum allowed size
 *       507:
 *         description: Storage quota exceeded
 */
router.post('/:uploadId', uploadsController.streamUpload);

export default router;
