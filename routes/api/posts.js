const express = require('express');
const router = express.Router();

// @route       Get Api/posts/test 
// @dec         Test Route
// @access      Public
router.get('/test', (req, res) => {res.json({msg: 'Post Works'})});




module.exports = router;

