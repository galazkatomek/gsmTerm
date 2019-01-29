var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile('/sys/bus/w1/devices/28-0000095c9ffc/w1_slave', (err, data) => {
    if (err) throw err;
    console.log(data);
    res.send('respond: ' + data );
  });
  
});

module.exports = router;
