
function checkStatus(context, name) {
  try {
    var $ = context, days = new Date().getDay();
    var readStatus = $.getdata('ReadStatus') || '{}';
    var CYCLE = $.getdata('CYCLE') || `{"youth_kkz":false,"youth_read":true,"jc_kkz":false,"jc_read":true}`;
    var statusObj = { "isfinished": false, "day": 0, "running": false, "index": 0, "timeStamp": 0 };
    const INDEX = {
      "youth_kkz": $.getdata('youth_start_index'),
      "youth_read": $.getdata('zqbody_index'),
      "jc_kkz": $.getdata('jckkz_index'),
      "jc_read": $.getdata('jcbody_index')
    };
    var currentIndex = INDEX[name];//实时index
    readStatus = JSON.parse(readStatus);
    CYCLE = JSON.parse(CYCLE);
    var obj = readStatus[name];
    if (!isNull(obj)) {
      statusObj = obj;
      //当前日期当前脚本执行完，并且不需要循环执行
      if (statusObj.day == days && statusObj.isfinished && !CYCLE[name]) {
        $.msg("今天已经看完啦🎇~");
        return false;
      }
      var preIndex = statusObj.index;//脚本执行时的index
      var preTimeStamp = statusObj.timeStamp;//最后执行的时间戳
      var timeStamp = new Date().getTime();//时间戳
      //当前脚本运行 并且 当前index大于脚本执行时的index
      if (statusObj.running && parseInt(currentIndex) > parseInt(preIndex) &&
        parseInt(timeStamp) - parseInt(preTimeStamp) < 2 * 60 * 1000
      ) {
        $.msg("脚本正在运行中，本次退出🎇~");
        statusObj.running = true;
        statusObj.isfinished = false;
        statusObj.day = days;
        statusObj.index = currentIndex;//更新index
        readStatus[name] = statusObj;
        $.setdata(JSON.stringify(readStatus), 'ReadStatus');
        return false;
      }
    }
    statusObj.running = true;
    statusObj.isfinished = false;
    statusObj.day = days;
    statusObj.index = currentIndex;
    readStatus[name] = statusObj;
    $.setdata(JSON.stringify(readStatus), 'ReadStatus');
    return true;
  } catch (error) {
    console.log('checkStatus===>', error);
    return false;
  }
}

function setStatus(context, name) {
  var $ = context;
  var days = new Date().getDay();
  var readStatus = {};
  var statusObj = {
    "running": false,
    "day": days,
    "isfinished": true,
    "index": 0,
    "times": 0
  };
  var obj = $.getdata('ReadStatus');
  readStatus = JSON.parse(obj);
  var preStatus = readStatus[name];
  var times = preStatus.times || 0;
  statusObj.times = parseInt(times) + 1;
  readStatus[name] = statusObj;
  $.setdata(JSON.stringify(readStatus), 'ReadStatus');
}

function setRunTime(context, name) {
  var $ = context;
  var timeStamp = new Date().getTime();
  var readStatus = {};
  var obj = $.getdata('ReadStatus');
  readStatus = JSON.parse(obj);
  var preStatus = readStatus[name];
  preStatus.timeStamp = timeStamp;
  readStatus[name] = preStatus;
  $.setdata(JSON.stringify(readStatus), 'ReadStatus');
}

function isNull(obj) {
  if (!obj) {
    return true;
  }
  if (typeof obj == 'object') {
    if (JSON.stringify(obj) == '{}' || obj.length == 0) {
      return true;
    }
  }
  if (typeof obj == 'string') {
    if (obj == '{}') {
      return true;
    }
  }
  return false;
}

module.exports = {
  checkStatus,
  setStatus,
  setRunTime
}