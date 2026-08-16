import express from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import * as trashController from './trashController.js';

const router = express.Router();

router.use(requireAuth);

/**
 * @swagger
 * /trash:
 *   get:
 *     summary: List trashed items
 *     tags: [Trash]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [file, folder] }
 *         description: Optional filter -- omit to get both files and folders
 *     responses:
 *       200:
 *         description: Trashed items
 */
router.get('/', trashController.listTrash);

/**
 * @swagger
 * /trash/files/{id}/restore:
 *   post:
 *     summary: Restore a trashed file to its original location
 *     tags: [Trash]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: File restored (falls back to root if the original folder is gone or still trashed)
 *       404:
 *         description: File not found or unauthorized
 *       409:
 *         description: File is not in trash
 */
router.post('/files/:id/restore', trashController.restoreFile);

/**
 * @swagger
 * /trash/folders/{id}/restore:
 *   post:
 *     summary: Restore a trashed folder and its cascade-trashed contents
 *     tags: [Trash]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Folder restored (independently-trashed descendants are left untouched)
 *       404:
 *         description: Folder not found or unauthorized
 *       409:
 *         description: Folder is not in trash
 */
router.post('/folders/:id/restore', trashController.restoreFolder);

/**
 * @swagger
 * /trash/files/{id}:
 *   delete:
 *     summary: Permanently delete a trashed file
 *     tags: [Trash]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: File permanently deleted
 *       404:
 *         description: File not found or unauthorized
 *       409:
 *         description: File must be in trash before it can be permanently deleted
 */
router.delete('/files/:id', trashController.permanentDeleteFile);

/**
 * @swagger
 * /trash/folders/{id}:
 *   delete:
 *     summary: Permanently delete a trashed folder and its cascade-trashed contents
 *     tags: [Trash]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Folder and its contents permanently deleted
 *       404:
 *         description: Folder not found or unauthorized
 *       409:
 *         description: Folder must be in trash before it can be permanently deleted
 */
router.delete('/folders/:id', trashController.permanentDeleteFolder);

export default router;
