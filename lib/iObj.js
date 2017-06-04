var xt = require('./itoolkit');
var errMsg = "Invalid System Value!";
var timeoutMsg = "Timeout!";
var retryInterval = 100;  // wait 0.1 second to retry to get result in sync mode.
var retryTimes = Math.round(xt.timeout / retryInterval); 

function iObj(conn) {
	this.conn = conn;  //Pass in the connection object.
	this.errno = [
		[0, "10i0"],
		[0, "10i0", {"setlen":"rec2"}],
		["", "7A"],
		["", "1A"]
	];
}

iObj.prototype.addToLibraryList= function(Lib) {
	var pgm = new xt.iPgm("QLICHGLL", {"lib":"QSYS"});
	pgm.addParam("*SAME", "11A");
	pgm.addParam("*SAME", "11A");
	pgm.addParam("*SAME", "11A");
	pgm.addParam(Lib, "11A");
	pgm.addParam(1, "10i0");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var rtValue;  // The returned value.
	var stop = 0;  // A flag indicating whether the process is finished.
	var retry = 0;  // How many times we have retried.
	function toJson(str) {  // Convert the XML output into JSON
		var output = xt.xmlToJson(str);
		if(output[0].success)
			rtValue = true;
		else
			rtValue = false;
		stop = 1;
	}
	function waitForResult() {
		retry++;
		if(stop == 0)
			setTimeout('waitForResult()', retryInterval);  // Check whether the result is retrieved
		else if(retry >= retryTimes)
			return timeoutMsg;
		else
			return rtValue;
	}
	this.conn.run(toJson);  // Post the input XML and get the response.
	return waitForResult();  // Run the user defined call back function against the returned value.
}

exports.iObj = iObj;