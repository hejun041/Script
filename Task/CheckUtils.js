
function checkStatus(context, name) {
  try {
    var $ = context, days = new Date().getDay();
    let readStatus = $.getdata('ReadStatus') || '{}';
    let statusObj = { "isfinished": false, "day": 0, "running": false };
    readStatus = JSON.parse(readStatus);
    let obj = readStatus[name];
    if (!isNull(obj)) {
      statusObj = obj;
      if (statusObj.day == days && statusObj.isfinished && !CYCLE[name]) {
        $.msg("今天已经看完啦🎇~");
        return false;
      }
      if (statusObj.running) {
        $.msg("脚本正在运行中，本次退出🎇~");
        return false;
      }
    }
    statusObj.running = true;
    statusObj.day = days;
    readStatus[name] = statusObj;
    $.setdata(JSON.stringify(readStatus), 'ReadStatus');
    return true;
  } catch (error) {
    console.log('checkStatus===>', error);
    return false;
  }
}

function setStatus(context, name) {
  var $ = context, days = new Date().getDay();
  let statusObj = {}, readStatus = {};
  statusObj.running = false;
  statusObj.day = days;
  statusObj.isfinished = true;
  let obj = $.getdata('ReadStatus');
  readStatus = JSON.parse(obj);
  readStatus[name] = statusObj;
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

//是否可循环执行
const CYCLE = {
  'youth_kkz': false,
  'youth_read': true,
  'jc_kkz': false,
  'jc_read': true,
}

module.exports = {
  checkStatus,
  setStatus
}