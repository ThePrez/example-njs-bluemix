var xt = require('./itoolkit');

xt.newConn("G0488C55", "XUMENG", "PASSW0RD");

// Data Queue
var dataQueue = xt.openDataQueue(string name, array description [,int key]);   //Opens a data queue with optional description.
dataQueue.read([string key]);  //Reads data from the data queue.
dataQueue.send(string key, mixed data);   //Puts data to the data queue.
dataQueue.close();  //Free program resource handle.
// System Value  -- Retrieve Network Attributes (QWCRNETA) API and Retrieve System Values (QWCRSVAL) API - IBM
var value = xt.getSysValue("QDATE");  //Get system value
var valueList = xt.getSysValueList();  //Get the list of all system values
// User Space  -- Create User Space (QUSCRTUS) API
xt.createUserSpace(array properties);  //Creates a new user space object.
var userSpace = xt.openUserSpace(string name, array description);   //Opens a user space and prepares it to be run.
userSpace.setUserSpaceData(array params);  //Add user space data
var userSpaceData = userSpace.getUserSpaceData(array params);  //Retrieve user space data.
// Job Log  -- Open List of Messages (QGYOLMSG) API and Receive Nonprogram Message (QMHRCVM) API
var jobLogList = xt.getJobLog([array elements]);   //Get an array for a job log entry.
var jobLogContents = jobLogList[i].readJobLog();  //Get the job log content.
// Active Job -- Open List of Jobs (QGYOLJOB) API
var jobList = xt.getActJobList([array elements]);  //Get an array for active jobs.
// Data Area
xt.createDataArea(string name, int size);	//Creates data area of given size
var dataAreaContent = xt.readDataArea(string name[, int offset, int length]);	//Reads data from the area
xt.writeDataArea(string name, string content[, int offset, int length]);	//Writes data to the area
xt.deleteDataArea(string name);  // Delete the data area
// Spooled File -- returned by the WRKSPLF command
var spooledFileList = xt.spoolList([array description]);  //Create an spool file lists, of certain output queue or for all queues.
var spFileContent;
while(spFileContent = spooledFileList.read())  //Gets spool file data from the queue. Retrun next spool file data array in the list, or false if queue is empty.
	console.log(spFileContent);
spFileContent = xt.getSpooledFile(string spool_name, string jobname, string username, integer job_number, integer spool_id [,string filename]);  //Gets a specific spool file data
// IBM i Native Objects  -- Open List of Objects (QGYOLOBJ) API
var objList = xt.listObj(string library, [string name, string type]);  //List all the IBM i objects in specific library.

/////////////////////////////  JT400 Only Class //////////////////////////

journal  //work with journal entries  -- Retrieve Journal Entries (QjoRetrieveJournalEntries) API
perf		// work with performance data -- Work with Collector (QPMWKCOL) API
security	//work with users on an IBM i host.  -- Retrieve Authorized Users (QSYRAUTU) API
file	//access IFS files on an IBM i host.

