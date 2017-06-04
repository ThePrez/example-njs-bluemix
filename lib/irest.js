var http = require('http');
var iRestHttp = function(callback,xhost,xport,xpath,xdatabase,xuser,xpassword,xipc,xctl,xml_input_script,xml_output_max_size) {
  var xml_out = "";
  var xml_enc = encodeURI("db2=" + xdatabase
        + "&uid=" + xuser
        + "&pwd=" + xpassword
        + "&ipc=" + xipc
        + "&ctl=" + xctl
        + "&xmlin=" + xml_input_script
        + "&xmlout=" + xml_output_max_size);
  // myibmi/cgi-bin/xmlcgi.pgm?xml
  var options = {
    host: xhost,
	port: xport,
    path: xpath + '?' + xml_enc
  };
  var httpCallback = function(response) {
    var str = '';
    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
    //the whole response has been received, so return
    response.on('end', function () {
      callback(str);
    });
  }
  // make the call
  var req = http.request(options, httpCallback).end();
}

exports.iRestHttp = iRestHttp;

