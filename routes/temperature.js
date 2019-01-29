var express = require('express');
var fs = require('fs');
var router = express.Router();

var parseSensorData = function (tempText) {
	var tConst = 't=';
	if (tempText.indexOf(tConst) < 0){
		return;
	}
	var temp1 = tempText.substring(tempText.indexOf(tConst) + 2, tempText.length);
	return ((temp1/1000)-2);	 
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile('/sys/bus/w1/devices/28-0000095c9ffc/w1_slave', (err, data) => {
    if (err) throw err;
    
    res.send(parseSensorData(data));
  });
  
});

module.exports = router;
