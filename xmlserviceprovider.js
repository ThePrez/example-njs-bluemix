// xmlservice - REST connection (IBM node.js toolkit PTF)
/*globals XmlServiceProvider */
/*eslint-env node */
var xt = require('./lib/itoolkit');
var conf = require('./lib/config');

XmlServiceProvider = function() {
  this.conn = new xt.iConn(conf.Database, conf.User, conf.Password,
    { host : conf.Host, port : conf.Port, path : conf.Path });
  // create chat file (do not care if already there)
  var sql = new xt.iSql();
  this.conn.add(xt.iCmd("CHGLIBL LIBL("+conf.DemoLib+") CURLIB("+conf.DemoLib+")"));
  sql.addQuery("CREATE TABLE CHAT(PROD INTEGER NOT NULL, CHAT VARCHAR(64) NOT NULL)");
  sql.free();
  this.conn.add(sql.toXML());
  this.conn.run(function (str) {});
};


XmlServiceProvider.prototype.HatsCat = function(callback, cmd) {
  // prepare iSql Class
  var sql = new xt.iSql();
  this.conn.add(xt.iCmd("CHGLIBL LIBL("+conf.DemoLib+") CURLIB("+conf.DemoLib+")"));
  sql.addQuery("SELECT DISTINCT CAT FROM PRODUCTS");
  sql.fetch();
  sql.free();
  this.conn.add(sql.toXML());
  // run (call xmlservice)
  this.conn.run(function (str) {
    var jobj = xt.xmlToJson(str);
    var list = [];
    jobj[1].result.forEach(function(row){
      var cat = '';
      var pic = 'http://' + conf.Host + ':' + conf.Port + conf.DemoAsset;
      var dsc = '';
      switch (row[0].value) {
        case '1':
	      cat = row[0].value;
	      pic += 'pic_baby_soft.png';
	      dsc = 'baby';
	      break;
        case '2':
	      cat = row[0].value;
	      pic += 'pic_young_style.png';
	      dsc = 'youth';
	      break;
        case '3':
	      cat = row[0].value;
	      pic += 'pic_adult_best.png';
	      dsc = 'adult';
	      break;
        case '4':
	      cat = row[0].value;
	      pic += 'pic_animal_dog.png';
	      dsc = 'animal';
	      break;
        default:
	      cat = row[0].value;
	      pic += 'pic_adult_ufo.png';
	      dsc = 'other';
	      break;
      }
      list.push([cat,dsc,pic]);
    });
    callback(list);
  });
}

XmlServiceProvider.prototype.HatsDetail = function(callback, p1, p2) {
  // change libl
  this.conn.add(xt.iCmd("CHGLIBL LIBL("+conf.DemoLib+") CURLIB("+conf.DemoLib+")"));
  var sql = new xt.iSql();
  // add chat ?
  if (p2) {
    sql.addQuery("INSERT INTO CHAT (PROD, CHAT) VALUES("+p1+",'"+p2+"')");
    sql.free();
  }
  // chat back?
  sql.addQuery("SELECT CHAT FROM CHAT WHERE PROD = "+p1);
  sql.fetch({'error':'fast'});
  sql.free();
  // select product
  sql.addQuery("SELECT * FROM PRODUCTS WHERE PROD = "+p1);
  sql.fetch({'error':'fast'});
  sql.free();
  // complete xml document (input/request)
  var xmlIn = sql.toXML();
  this.conn.add(xmlIn);
  // console.log(xmlIn);
  // run (call xmlservice)
  this.conn.run(function (str) {
    var jobj = xt.xmlToJson(str);
    var prod = 0;
    var cat = 0;
    var desc = "";
    var photo = "";
    var price = 0;
    var chatback = "";
    if (jobj && jobj[1] && jobj[1].result) {
      jobj[1].result.forEach(function(row) {
        if (row[0].desc == "CHAT") {
          chatback += "\n: " + row[0].value;
        } else {
          prod = row[0].value;
          cat = row[1].value;
          desc = row[2].value;
          photo = 'http://' + conf.Host + ':' + conf.Port + conf.DemoAsset + row[3].value;
          price = row[4].value;
        }
      });
    }
    // return to screen
    callback([prod,cat,desc,photo,price,chatback]);
  });
}

XmlServiceProvider.prototype.HatsPgmCat = function(callback, p1) {
  // chglibl
  this.conn.add(xt.iCmd("CHGLIBL LIBL("+conf.DemoLib+") CURLIB("+conf.DemoLib+")"));
  // prepare iPgm Class
  var pgm = new xt.iPgm("PRODUCT", {"lib":conf.DemoLib}); 
    pgm.addParam(p1, "10i0");
    pgm.addParam(20, "10i0");
    pgm.addParam(0,  "10i0", {"enddo":"count"});
    pgm.addParam([
      [0, "10i0"],
      [0, "10i0"],
      [0, "64a", {"varying":4}],
      [0, "64a", {"varying":4}],
      [0, "12p2"]
    ], {"dim":999, "dou":"count"});
  this.conn.add(pgm.toXML());
  // run (call xmlservice)
  this.conn.run(function (str) {
    var jobj = xt.xmlToJson(str);
    var list = [];
    var i = 0;
    var j = 0;
    var prod = "";
    var cat = "";
    var desc = "";
    var photo = "";
    var price = "";
    // console.log(jobj[1].data);
    jobj[1].data.forEach(function(row){
      if (i > 2) {
        j++;
        switch(j) {
	      case 1:
	        prod = row.value;
	        break;
	      case 2:
	        cat = row.value;
	        break;
	      case 3:
	        desc = row.value;
	        break;
	      case 4:
	        photo = 'http://' + conf.Host + ':' + conf.Port + conf.DemoAsset + row.value;
	        break;
	      case 5:
	        price = row.value;
	        list.push([prod,cat,desc,photo,price]);
	        j = 0;
	        break;
	      default:
	        j = 0;
	        break;
	    }
      }
      i++;
    });
    callback(list);
  });
}


exports.XmlServiceProvider = XmlServiceProvider;

