const express = require('express');
const router = express.Router();

// @route       Get Api/profile/test 
// @dec         Test Route
// @access      Public
router.get('/test', (req, res) => {res.json({msg: 'Profile Works'})});






module.exports = router;

