const express = require('express');
const router = express.Router();
const AWS =require('aws-sdk');
const fs = require('fs');
const s3 =new AWS.S3({
  accessKeyId: "AKIAWS4524I3YQ33H56S",
  secretAccessKey: "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"
});

router.get('/', async (req, res) => {
    res.render('index');
});



module.exports = router;