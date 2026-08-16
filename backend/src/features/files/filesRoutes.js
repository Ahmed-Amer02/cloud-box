import express from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import * as filesController from './filesController.js';

const router = express.Router();

router.use(requireAuth);

/**
 * @swagger
 * /files/search:
 *   get:
 *     summary: Search files by name, MIME type, or tag
 *     tags: [Files]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: mimeType
 *         schema: { type: string }
 *       - in: query
 *         name: tagId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: limit
 *         schema: { type: string, example: "20" }
 *     responses:
 *       200:
 *         description: Matching files with pagination metadata
 *       400:
 *         description: At least one of name, mimeType, or tagId is required
 */
router.get('/search', filesController.searchFiles);

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Get a single file's metadata
 *     description: Works for files at the root (folderId is null) the same as nested files -- the lookup is by id and owner only.
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: File metadata
 *       404:
 *         description: File not found or unauthorized
 */
router.get('/:id', filesController.getFile);

/**
 * @swagger
 * /files/{id}/download:
 *   get:
 *     summary: Get a presigned download URL for a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Presigned S3 URL, valid for a limited time
 *       404:
 *         description: File not found or unauthorized
 */
router.get('/:id/download', filesController.downloadFile);

/**
 * @swagger
 * /files/{id}:
 *   patch:
 *     summary: Rename a file or move it to a different folder
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: renamed-file.pdf }
 *               folderId: { type: string, format: uuid, nullable: true, example: null  }
 *     responses:
 *       200:
 *         description: File updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: File (or target folder) not found or unauthorized
 *   delete:
 *     summary: Move a file to trash
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: File moved to trash
 *       404:
 *         description: File not found, unauthorized, or already in trash
 */
router.patch('/:id', filesController.updateFile);
router.delete('/:id', filesController.deleteFile);

/**
 * @swagger
 * /files/{id}/tags:
 *   post:
 *     summary: Attach a tag to a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tagId]
 *             properties:
 *               tagId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Tag attached
 *       404:
 *         description: File or tag not found or unauthorized
 */
router.post('/:id/tags', filesController.attachTag);

/**
 * @swagger
 * /files/{id}/tags/{tagId}:
 *   delete:
 *     summary: Detach a tag from a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Tag detached
 *       404:
 *         description: File or tag not found or unauthorized
 */
router.delete('/:id/tags/:tagId', filesController.detachTag);

export default router;
