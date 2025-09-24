const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus
} = require('../controllers/userController');
// Authentication middleware removed

// Public routes (No authentication required)
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle', toggleUserStatus);

module.exports = router;
