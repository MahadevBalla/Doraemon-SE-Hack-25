// routes/movementRoutes.js
import express from 'express';
import {
  createMovement,
  getMovements,
  reverseMovement,
  validateMovement
} from '../controllers/movementController.js';

const router = express.Router();

// Create movement
// router.post('/', validateMovement, createMovement);

// Get movements with filters
router.get('/', getMovements);

// Reverse movement
router.post('/:id/reverse', reverseMovement);

export default router;