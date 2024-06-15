const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadDestination = 'uploads';

const storage = multer.diskStorage({
    destination:
})

router.get('/register', (req, res) => {
    res.send('/register: works!')
})

module.exports = router;