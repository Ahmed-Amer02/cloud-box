import express from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import * as tagsController from './tagsController.js';

const router = express.Router();

router.use(requireAuth);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: work }
 *     responses:
 *       201:
 *         description: Tag created
 *       400:
 *         description: Validation error
 *   get:
 *     summary: List all of your tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of tags
 */
router.post('/', tagsController.createTag);
router.get('/', tagsController.getTags);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Tag deleted
 *       404:
 *         description: Tag not found or unauthorized
 */
router.delete('/:id', tagsController.deleteTag);

export default router;
