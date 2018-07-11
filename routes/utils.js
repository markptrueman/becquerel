var express = require('express');
var router = express.Router();
var util = require('../modules/util')
/* GET home page. */
router.get('/curiestats', async function(req, res, next) {
    let power = await util.getCurieVp();
    let queuesize = await util.getQueueSize();
    let stats = {"vp" : power, "queuesize" : queuesize}
    res.json (stats);
});

module.exports = router;
