const express = require('express');
const router = express.Router();
const { store, login, test, index, token } = require('../controllers/user.controller')
const authenticateToken = require('../middlewares/authenticateToken');
const upload= require('../middlewares/multer')

router.get('/', authenticateToken, index);
router.get('/test', authenticateToken, test);
router.post('/register', upload.single('file'), store);
router.post('/login', login);

module.exports = router;