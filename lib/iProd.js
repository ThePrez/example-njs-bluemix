var xt = require('./itoolkit');
var errMsg = "Invalid System Value!";
var timeoutMsg = "Timeout!";
var retryInterval = 100;  // wait 0.1 second to retry to get result in sync mode.
var retryTimes = Math.round(xt.timeout / retryInterval); 

function iProd(conn) {
	this.conn = conn;  //Pass in the connection object.
	this.errno = [
		[0, "10i0"],
		[0, "10i0", {"setlen":"rec2"}],
		["", "7A"],
		["", "1A"]
	];
}

iProd.prototype.getPTFInfo= function(PTFID, cb) {
	var outBuf = [
		[0, "12h"],  // [0]Skip
		["", "7A"],  // [1]Product ID
		["", "7A"],  // [2]PTF ID
		["", "6A"],  // [3]Release level
		["", "4A"],  // [4]Product option
		["", "4A"],  // [5]Load ID
		["", "1A"],  // [6]Loaded status
		[0, "100h"]  // [7]Skip
	];
	var PTFInfo = [
		[PTFID, "7A"],
		["*ONLY", "7A"],
		["", "6A"],
		["", "10i0"],
		["0", "1A"],
		["", "25A"]
	];

	var pgm = new xt.iPgm("QPZRTVFX", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
	pgm.addParam(0, "10i0", {"setlen":"rec1"});
	pgm.addParam(PTFInfo);
	pgm.addParam("PTFR0100", "8A");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function"; //If there is a callback function param, then it is in asynchronized mode.
	var rtValue = [];  // The returned value.
	var stop = 0;  // A flag indicating whether the process is finished.
	var retry = 0;  // How many times we have retried.
	function toJson(str) {  // Convert the XML output into JSON
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"Product_ID":output[0].data[1].value,
				"PTF":output[0].data[2].value,
				"Release":output[0].data[3].value,
				"Option":output[0].data[4].value,
				"LoadID":output[0].data[5].value,
				"Load_State":output[0].data[6].value,
			};
		}
		else
			rtValue = errMsg;
		if(async)	// If it is in asynchronized mode.
			cb(rtValue);  // Run the call back function against the returned value.
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
	if(!async)  // If it is in synchronized mode.
		return waitForResult();  // Run the user defined call back function against the returned value.
}

iProd.prototype.getProductInfo= function(prodID, option, cb) {
	var outBuf = [
		[0, "12h"],  // [0]Skip
		["", "7A"],  // [1]Product ID
		["", "6A"],  // [2]Release
		["", "4A"],  // [3]Option
		[0, "14h"],  // [4]Skip
		["", "10A"],  // [5]Load State String
		["", "10A"],  // [6]Load Error
		["", "2A"],  // [7]Load State
		[0, "44h"]  // [8]Skip
	];
	if(option == "")
		option = "0000";
	var ProdInfo = [
		[prodID, "7A"],
		["*CUR", "6A"],
		[option, "4A"],
		["*CODE", "10A"],
	];

	var pgm = new xt.iPgm("QSZRTVPR", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
	pgm.addParam(0, "10i0", {"setlen":"rec1"});
	pgm.addParam("PRDR0100", "8A");
	pgm.addParam(ProdInfo);
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function"; //If there is a callback function param, then it is in asynchronized mode.
	var rtValue = [];  // The returned value.
	var stop = 0;  // A flag indicating whether the process is finished.
	var retry = 0;  // How many times we have retried.
	function toJson(str) {  // Convert the XML output into JSON
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"Product_ID":output[0].data[1].value,
				"Release":output[0].data[2].value,
				"Option":output[0].data[3].value,
				"Load_String":output[0].data[5].value,
				"Load_Error":output[0].data[6].value,
				"Load_State":output[0].data[7].value,
			};
		}
		else
			rtValue = errMsg;
		if(async)	// If it is in asynchronized mode.
			cb(rtValue);  // Run the call back function against the returned value.
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
	if(!async)  // If it is in synchronized mode.
		return waitForResult();  // Run the user defined call back function against the returned value.
}

iProd.prototype.getInstalledProducts = function(cb) {
	var maxProd = 127;
	var outBuf = [];
	for(var i = 0; i < maxProd; i++) {
		outBuf.push(["", "7A"]); // [0]Product ID
		outBuf.push(["", "5A"]); // [1]Product option
		outBuf.push(["", "6A"]); // [2]Release level
		outBuf.push(["", "47h"]); // [3]Skip
		outBuf.push(["", "132A"]); // [4]Description text
	}
	var inputInfo = [
		[maxProd, "10i0"],
		["*ALL", "10A"],
		["1", "1A"],
		["1", "1A"],
		["*ALL", "10A"],
		["*INSTLD", "10A"],
		[maxProd, "10i0"]
	];
	var ProdInfo = [
		["", "7A"],
		["", "5A"],
		["", "6A"]
	];
	var OutputInfo = [
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"]
	];
	var pgm = new xt.iPgm("QSZSLTPR", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out"});
	pgm.addParam(inputInfo);
	pgm.addParam("PRDS0200", "8A");
	pgm.addParam(ProdInfo);
	pgm.addParam(OutputInfo, {"io":"out"});
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function"; //If there is a callback function param, then it is in asynchronized mode.
	var rtValue = [];  // The returned value.
	var stop = 0;  // A flag indicating whether the process is finished.
	var retry = 0;  // How many times we have retried.
	function toJson(str) {  // Convert the XML output into JSON
		var output = xt.xmlToJson(str);
		var length = output[0].data.length;
		var count = Number(output[0].data[length - 6].value);
		if(output[0].success) {
			for(var i = 0; i < count * 5; i+=5)
				rtValue.push({
				"ProductID":output[0].data[i].value, 
				"Option":output[0].data[i+1].value, 
				"Release":output[0].data[i+2].value, 
				"Description":output[0].data[i+4].value
				});
		}
		else
			rtValue = errMsg;
		if(async)	// If it is in asynchronized mode.
			cb(rtValue);  // Run the call back function against the returned value.
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
	if(!async)  // If it is in synchronized mode.
		return waitForResult();  // Run the user defined call back function against the returned value.
}

exports.iProd = iProd;