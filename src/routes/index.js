const express = require('express');
const router = express.Router();
const AWS =require('aws-sdk');
const fs = require('fs');

router.get('/', async (req, res) => {
    res.render('index');
});



module.exports = router;