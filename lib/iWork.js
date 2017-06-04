var xt = require('./itoolkit');
var errMsg = "Invalid System Value!";
var timeoutMsg = "Timeout!";
var retryInterval = 100;  // wait 0.1 second to retry to get result in sync mode.
var retryTimes = Math.round(xt.timeout / retryInterval); 

	
function iWork(conn) {
	this.conn = conn;  //Pass in the connection object.
	this.errno = [
		[0, "10i0"],
		[0, "10i0", {"setlen":"rec2"}],
		["", "7A"],
		["", "1A"]
	];
}

iWork.prototype.getSysValue = function(sysValue, cb) {
	var outBuf = [
		[0, "10i0"],
		[0, "10i0"],
		["", "36h"],
		["", "10A"],
		["", "1A"],
		["", "1A"],
		[0, "10i0"],
		[0, "10i0"]
	];
	var pgm = new xt.iPgm("QWCRSVAL", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out"});
	pgm.addParam(66, "10i0");
	pgm.addParam(1, "10i0");
	pgm.addParam(sysValue, "10A");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function"; //If there is a callback function param, then it is in asynchronized mode.
	var rtValue;  // The returned value.
	var stop = 0;  // A flag indicating whether the process is finished.
	var retry = 0;  // How many times we have retried.
	function toJson(str) {  // Convert the XML output into JSON
		var output = xt.xmlToJson(str);
		if(output[0].success) 
			rtValue = output[0].data[6].value;  //Get the returned value from the output array.
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

iWork.prototype.getSysStatus = function(cb) {
	var outBuf = [
		[0, "10i0"],
		[0, "10i0"],
		["", "8B"],
		["", "8A"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"]
	];
	var pgm = new xt.iPgm("QWCRSSTS", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
	pgm.addParam(0, "10i0", {"setlen":"rec1"});
	pgm.addParam("SSTS0100", "8A");
	pgm.addParam("*NO", "10A");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function";
	var rtValue;
	var stop = 0;
	var retry = 0;
	function toJson(str) {
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"System_name":output[0].data[3].value,
				"Users_currently_signed_on":output[0].data[4].value,
				"Users_temporarily_signed_off_(disconnected)":output[0].data[5].value,
				"Users_suspended_by_system_request":output[0].data[6].value,
				"Users_suspended_by_group_jobs":output[0].data[7].value,
				"Users_signed_off_with_printer_output_waiting_to_print":output[0].data[8].value,
				"Batch_jobs_waiting_for_messages":output[0].data[9].value,
				"Batch_jobs_running":output[0].data[10].value,
				"Batch_jobs_held_while_running":output[0].data[11].value,
				"Batch_jobs_ending":output[0].data[12].value,
				"Batch_jobs_waiting_to_run_or_already_scheduled":output[0].data[13].value,
				"Batch_jobs_held_on_a_job_queue":output[0].data[14].value,
				"Batch_jobs_on_a_held_job_queue":output[0].data[15].value,
				"Batch_jobs_on_an_unassigned_job_queue":output[0].data[16].value,
				"Batch_jobs_ended_with_printer_output_waiting_to_print":output[0].data[17].value,
			};
		}
		else
			rtValue = errMsg;
		if(async)
			cb(rtValue);
		stop = 1;
	}
	function waitForResult() {
		retry++;
		if(stop == 0)
			setTimeout('waitForResult()', retryInterval);
		else if(retry >= retryTimes)
			return timeoutMsg;
		else
			return rtValue;
	}
	this.conn.run(toJson);
	if(!async)
		return waitForResult();
}

iWork.prototype.getSysStatusExt = function(cb) {
	var outBuf = [
		[0, "10i0"],
		[0, "10i0"],
		["", "8B"],
		["", "8A"],
		["", "6A"],
		["", "1A"],
		["", "1A"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		["", "1A"],
		["", "3A"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "20u0"]
	];
	var pgm = new xt.iPgm("QWCRSSTS", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
	pgm.addParam(0, "10i0", {"setlen":"rec1"});
	pgm.addParam("SSTS0200", "8A");
	pgm.addParam("*NO", "10A");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function";
	var rtValue;
	var stop = 0;
	var retry = 0;
	function toJson(str) {
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"System_name":output[0].data[3].value,
				"Elapsed_time":output[0].data[4].value,
				"Restricted_state_flag":output[0].data[5].value,
				//"Reserved":output[0].data[6].value,
				"%_processing_unit_used":output[0].data[7].value,
				"Jobs_in_system":output[0].data[8].value,
				"%_permanent_addresses":output[0].data[9].value,
				"%_temporary_addresses":output[0].data[10].value,
				"System_ASP":output[0].data[11].value,
				"%_system_ASP_used":output[0].data[12].value,
				"Total_auxiliary_storage":output[0].data[13].value,
				"Current_unprotected_storage_used":output[0].data[14].value,
				"Maximum_unprotected_storage_used":output[0].data[15].value,
				"%_DB_capability":output[0].data[16].value,
				"Main_storage_size":output[0].data[17].value,
				"Number_of_partitions":output[0].data[18].value,
				"Partition_identifier":output[0].data[19].value,
				//"Reserved":output[0].data[20].value,
				"Current_processing_capacity":output[0].data[21].value,
				"Processor_sharing_attribute":output[0].data[22].value,
				//"Reserved":output[0].data[23].value,
				"Number_of_processors":output[0].data[24].value,
				"Active_jobs_in_system":output[0].data[25].value,
				"Active_threads_in_system":output[0].data[26].value,
				"Maximum_jobs_in_system":output[0].data[27].value,
				"%_temporary_256MB_segments_used":output[0].data[28].value,
				"%_temporary_4GB_segments_used":output[0].data[29].value,
				"%_permanent_256MB_segments_used":output[0].data[30].value,
				"%_permanent_4GB_segments_used":output[0].data[31].value,
				"%_current_interactive_performance":output[0].data[32].value,
				"%_uncapped_CPU_capacity_used":output[0].data[33].value,
				"%_shared_processor_pool_used_":output[0].data[34].value,
				"Main_storage_size":output[0].data[35].value,				
			};
		}
		else
			rtValue = errMsg;
		if(async)
			cb(rtValue);
		stop = 1;
	}
	function waitForResult() {
		retry++;
		if(stop == 0)
			setTimeout('waitForResult()', retryInterval);
		else if(retry >= retryTimes)
			return timeoutMsg;
		else
			return rtValue;
	}
	this.conn.run(toJson);
	if(!async)
		return waitForResult();
}

iWork.prototype.getJobStatus = function(jobId, cb) {
	var outBuf = [
		[0, "10i0"],
		[0, "10i0"],
		["", "10A"],
		["", "16h"],
		["", "26A"]
	];
	var pgm = new xt.iPgm("QWCRJBST", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
	pgm.addParam(0, "10i0", {"setlen":"rec1"});
	pgm.addParam(jobId, "6A");
	pgm.addParam("JOBS0100", "8A");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function";
	var rtValue;
	var stop = 0;
	var retry = 0;
	function toJson(str) {
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"Job_status":output[0].data[2].value,
				"Fully_qualified_job_name":output[0].data[4].value
			};
		}
		else
			rtValue = errMsg;
		if(async)
			cb(rtValue);
		stop = 1;
	}
	function waitForResult() {
		retry++;
		if(stop == 0)
			setTimeout('waitForResult()', retryInterval);
		else if(retry >= retryTimes)
			return timeoutMsg;
		else
			return rtValue;
	}
	this.conn.run(toJson);
	if(!async)
		return waitForResult();
}

iWork.prototype.getJobInfo = function(jobName, userName, jobNumber, cb) {
	var outBuf = [
		[0, "10i0"],
		[0, "10i0"],
		["", "10A"],
		["", "10A"],
		["", "6A"],
		["", "16h"],
		["", "10A"],
		["", "1A"],
		["", "1A"],
		["", "10A"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		["", "1A"],
		["", "10A"],
		["", "4A"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "10i0"],
		["", "1A"],
		[0, "10i0"],
		[0, "10i0"],
		[0, "20u0"],
		[0, "20u0"],
		[0, "20u0"],
		[0, "20u0"],
		["", "4A"],
		["", "10A"],
		["", "1A"],
		["", "4A"],
		["", "10A"],
		["", "10A"],
		["", "10A"]
	];
	var JobId = [
		[jobName, "10A"],
		[userName, "10A"],
		[jobNumber, "6A"],
	];
	var pgm = new xt.iPgm("QUSRJOBI", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
	pgm.addParam(0, "10i0", {"setlen":"rec1"});
	pgm.addParam("JOBI0200", "8A");
	pgm.addParam(JobId);
	pgm.addParam("", "16A");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	
	var async = cb && xt.getClass(cb) == "Function";
	var rtValue;
	var stop = 0;
	var retry = 0;
	function toJson(str) {
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"Job_name":output[0].data[2].value,
				"User_name":output[0].data[3].value,
				"Job_number":output[0].data[4].value,
				//"Internal_job_identifier":output[0].data[5].value,
				"Job_status":output[0].data[6].value,
				"Job_type":output[0].data[7].value,
				"Job_subtype":output[0].data[8].value,
				"Subsystem_description_name":output[0].data[9].value,
				"Run_priority_(job)":output[0].data[10].value,
				"System_pool_identifier":output[0].data[11].value,
				"Processing_unit_time_used":output[0].data[12].value,
				"Number_of_auxiliary_I/O_requests":output[0].data[13].value,
				"Number_of_interactive_transactions":output[0].data[14].value,
				"Response_time_total":output[0].data[15].value,
				"Function_type":output[0].data[16].value,
				"Function_name":output[0].data[17].value,
				"Active_job_status":output[0].data[18].value,
				"Number_of_database_lock_waits":output[0].data[19].value,
				"Number_of_internal_machine_lock_waits":output[0].data[20].value,
				"Number_of_nondatabase_lock_waits":output[0].data[21].value,
				"Time_spent_on_database_lock_waits":output[0].data[22].value,
				"Time_spent_on_internal_machine_lock_waits":output[0].data[23].value,
				"Time_spent_on_nondatabase_lock_waits":output[0].data[24].value,
				//"Reserved":output[0].data[25].value,
				"Current_system_pool_identifier":output[0].data[26].value,
				"Thread_count":output[0].data[27].value,
				"Processing_unit_time_used_-_total_for_the_job":output[0].data[28].value,
				"Number_of_auxiliary_I/O_requests":output[0].data[29].value,
				"Processing_unit_time_used_for_database":output[0].data[30].value,
				"Page_faults":output[0].data[31].value,
				"Active_job_status_for_jobs_ending":output[0].data[32].value,
				"Memory_pool_name":output[0].data[33].value,
				"Message_reply":output[0].data[34].value,	
				"Message_key":output[0].data[35].value,	
				"Message_queue_name":output[0].data[36].value,	
				"Message_queue_library_name":output[0].data[37].value,	
				"Message_queue_library_ASP_device_name":output[0].data[38].value,	
			};
		}
		else
			rtValue = errMsg;
		if(async)
			cb(rtValue);
		stop = 1;
	}
	function waitForResult() {
		retry++;
		if(stop == 0)
			setTimeout('waitForResult()', retryInterval);
		else if(retry >= retryTimes)
			return timeoutMsg;
		else
			return rtValue;
	}
	this.conn.run(toJson);
	if(!async)
		return waitForResult();
}

iWork.prototype.getDataArea = function(lib, area, length, cb) {
	var outBuf = [
		[0, "10i0"],
		[0, "10i0"],
		["", "10A"],
		["", "10A"],
		[0, "10i0"],
		[0, "10i0"],
		["", length + "A"]
	];
	var areaPath = [
		[area, "10A"],
		[lib, "10A"]
	];
	var pgm = new xt.iPgm("QWCRDTAA", {"lib":"QSYS"});
	pgm.addParam(outBuf, {"io":"out"});
	pgm.addParam(length + 36, "10i0");
	pgm.addParam(areaPath);
	pgm.addParam(1, "10i0");
	pgm.addParam(length, "10i0");
	pgm.addParam(this.errno, {"io":"both", "len" : "rec2"});

	this.conn.add(pgm.toXML());
	var async = cb && xt.getClass(cb) == "Function";
	var rtValue;
	var stop = 0;
	var retry = 0;
	function toJson(str) {
		var output = xt.xmlToJson(str);
		if(output[0].success) {
			rtValue = {
				"Type_of_value_returned":output[0].data[2].value,
				"Library_name":output[0].data[3].value,
				"Length_of_value_returned":output[0].data[4].value,
				"Number_of_decimal_positions":output[0].data[5].value,
				"Value":output[0].data[6].value
			};
		}
		else
			rtValue = errMsg;
		if(async)
			cb(rtValue);
		stop = 1;
	}
	function waitForResult() {
		retry++;
		if(stop == 0)
			setTimeout('waitForResult()', retryInterval);
		else if(retry >= retryTimes)
			return timeoutMsg;
		else
			return rtValue;
	}
	this.conn.run(toJson);
	if(!async)
		return waitForResult();
}
exports.iWork = iWork;