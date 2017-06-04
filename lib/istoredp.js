// IBM_PROLOG_BEGIN_TAG 
// This is an automatically generated prolog. 
//  
// istoredp.js
//  
// Licensed Materials - Property of IBM 
//  
// (C) COPYRIGHT International Business Machines Corp. 2014,2014 
// All Rights Reserved 
//  
// US Government Users Restricted Rights - Use, duplication or 
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp. 
//
// DB2 Stored Procedure interface for XML Service Toolkit
//
//
// IBM_PROLOG_END_TAG 

var db = require('../../db2i/lib/db2.js');

var db2Call = function(callback,xlib,xdatabase,xuser,xpassword,xipc,xctl,xml_input_script,xbuf) {
	var xmlOut = "NULL";
	var sql;
	if(xbuf === undefined) 
		sql = "call " + xlib + ".iPLUG512K(?,?,?,?)";
	else {
		xbuf = Number(xbuf);
		if(xbuf <= 0)
			sql = "call " + xlib + ".iPLUG32K(?,?,?,?)";
		else if(xbuf <= 4096 )
			sql = "call " + xlib + ".iPLUG4K(?,?,?,?)";
		else if(xbuf <= 32768 )
			sql = "call " + xlib + ".iPLUG32K(?,?,?,?)";
		else if(xbuf <= 65536 )
			sql = "call " + xlib + ".iPLUG65K(?,?,?,?)";
		else if(xbuf <= 524288 )
			sql = "call " + xlib + ".iPLUG512K(?,?,?,?)";
		else if(xbuf <= 1048576 )
			sql = "call " + xlib + ".iPLUG1M(?,?,?,?)";
		else if(xbuf <= 5242880)
			sql = "call " + xlib + ".iPLUG5M(?,?,?,?)";
		else if(xbuf <= 10485760)
			sql = "call " + xlib + ".iPLUG10M(?,?,?,?)";
		else sql = "call " + xlib + ".iPLUG15M(?,?,?,?)";
	}
	try{
		//db.debug(true);  //Enable Debug info
		db.init(function(){
			db.serverMode(true);  //Enable Server Mode if needed
			db.setEnvAttr(db.SQL_ATTR_INCLUDE_NULL_IN_LEN, db.SQL_FALSE);
		});
		db.conn(xdatabase, xuser, xpassword, function(){
			db.autoCommit(true);  //Enable Auto Commit if needed
			db.setConnAttr(db.SQL_ATTR_TXN_ISOLATION , db.SQL_TXN_READ_UNCOMMITTED);
			db.setConnAttr(db.SQL_ATTR_DBC_SYS_NAMING , db.SQL_FALSE);
		});
		db.prepare(sql);
		db.bindParam([
			[xipc, db.SQL_PARAM_INPUT, 1],
			[xctl, db.SQL_PARAM_INPUT, 1],
			[xml_input_script, db.SQL_PARAM_INPUT, 0],
			[xmlOut, db.SQL_PARAM_OUTPUT, 0],
		]);
		db.execute(function cb(outArray) {  //out is an array of the output parameters.
			if(outArray.length == 1)
				callback(outArray[0]);  // For XML service, there is always only one return XML output. So handle it directly.
			else
				callback(outArray);  // For multiple return result, caller should handle it as an array.
		});
		db.close();
	} catch(e) {
		console.log(e);
	}
}

exports.db2Call = db2Call;