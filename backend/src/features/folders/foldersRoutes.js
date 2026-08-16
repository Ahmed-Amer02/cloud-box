import express from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import * as foldersController from '../folders/foldersController.js';

const router = express.Router();

router.use(requireAuth);

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Documents
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example : null
 *     responses:
 *       201:
 *         description: Folder created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parent folder not found, unauthorized, or trashed
 */
router.post('/', foldersController.createFolder);

/**
 * @swagger
 * /folders:
 *   get:
 *     summary: List root-level folders
 *     tags: [Folders]
 *     responses:
 *       200:
 *         description: List of root folders
 */
router.get('/', foldersController.getFolder);

/**
 * @swagger
 * /folders/{id}/breadcrumbs:
 *   get:
 *     summary: Get the breadcrumb trail for a folder (root to leaf)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Ordered array of ancestor folders, including the folder itself
 *       404:
 *         description: Folder not found or unauthorized
 */
router.get('/:id/breadcrumbs', foldersController.getFolderBreadcrumbs);

/**
 * @swagger
 * /folders/{id}:
 *   get:
 *     summary: Get a folder's contents (subfolders and files)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Folder contents
 *       404:
 *         description: Folder not found or unauthorized
 *   patch:
 *     summary: Rename or move a folder
 *     tags: [Folders]
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
 *               name: { type: string, example: Renamed Folder }
 *               parentId: { type: string, format: uuid, nullable: true, example: null }
 *     responses:
 *       200:
 *         description: Folder updated
 *       400:
 *         description: Validation error, or move would create a cycle
 *       404:
 *         description: Folder (or target parent) not found or unauthorized
 *   delete:
 *     summary: Move a folder to trash (cascades to its contents)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Folder moved to trash
 *       404:
 *         description: Folder not found or unauthorized
 */
router.get('/:id', foldersController.getFolder);
router.patch('/:id', foldersController.updateFolder);
router.delete('/:id', foldersController.deleteFolder);

export default router;
