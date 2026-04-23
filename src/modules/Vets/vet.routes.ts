import { Router } from 'express';
import * as vetController from './vet.controller';
import { protect, restrictTo } from '../../common/middlewares/auth.middleware';
import { isAdmin } from '../../common/middlewares/admin.middleware'; // Import your new middleware

const router = Router();

// 1. Vet Registration: 
// Accessible by logged-in users who have the 'VET' role
router.post('/register', protect, restrictTo('VET'), vetController.registerVetProfile);

// 2. Clinic Management: 
// Only for logged-in users who are VETS
router.patch('/clinic', protect, restrictTo('VET'), vetController.updateClinic);

// 3. Admin Verification: 
// Only for logged-in users who have the 'ADMIN' role
router.patch('/:id/verify', protect, isAdmin, vetController.verifyVet);

export default router;