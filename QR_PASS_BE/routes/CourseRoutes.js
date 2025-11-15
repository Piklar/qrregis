const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const { verifyAdmin } = require('../middlewares/auth');

// Public routes
router.post('/', verifyAdmin, courseController.createCourse);
router.post('/bulk', courseController.bulkCreateCourses);
router.get('/', courseController.getAllCourses);

// Admin protected routes
router.get('/full', verifyAdmin, courseController.getFullCourses);
router.put('/:id', verifyAdmin, courseController.updateCourse);
router.delete('/:id', verifyAdmin, courseController.deleteCourse);

module.exports = router;