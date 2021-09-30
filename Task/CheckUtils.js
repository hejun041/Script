
function checkStatus(context, name, thread) {
  try {
    var $ = context, days = new Date().getDay(), hours = new Date().getHours();
    //v2p重启执行可能会不按照cron操作
    if (hours < 6) {
      $.msg($.name, "太早啦~");
      return false;
    }
    if (hours > 22) {
      $.msg($.name, "太晚啦~");
      return false;
    }
    var readStatus = $.getdata('ReadStatus') || '{}';
    var CYCLE = $.getdata('CYCLE') || `{"youth_kkz":false,"youth_read":true,"jc_kkz":false,"jc_read":true}`;
    var statusObj = { "isfinished": false, "day": 0, "running": false, "index": 0, "timeStamp": 0, "times": 0 };
    const INDEX = {
      "youth_kkz": JSON.parse($.getdata('youth_kkz_indexs')),
      "youth_read": $.getdata('zqbody_index'),
      "jc_kkz": $.getdata('jckkz_index'),
      "jc_read": $.getdata('jcbody_index')
    };
    var currentIndex = INDEX[name], originIndex;//实时index
    originIndex = INDEX[name];
    if (name == 'youth_kkz') {
      currentIndex = currentIndex[thread];
    }
    readStatus = JSON.parse(readStatus);
    CYCLE = JSON.parse(CYCLE);
    var obj = readStatus[name];
    if (!isNull(obj)) {
      statusObj = obj;
      if (statusObj.day != days) {
        statusObj.times = 0;
      }
      //当前日期当前脚本执行完，并且不需要循环执行
      if (statusObj.day == days && statusObj.isfinished && !CYCLE[name]) {
        $.msg($.name, "今天已经看完啦🎇~");
        return false;
      }
      var preIndex = statusObj.index || 0;//脚本执行时的index
      if (name == 'youth_kkz') {
        preIndex = JSON.parse(preIndex)[thread];
      }
      var preTimeStamp = statusObj.timeStamp;//最后执行的时间戳
      var timeStamp = new Date().getTime();//时间戳
      //当前脚本运行 并且 当前index大于脚本执行时的index
      if (statusObj.running && parseInt(currentIndex) > parseInt(preIndex) &&
        parseInt(timeStamp) - parseInt(preTimeStamp) < 2 * 60 * 1000
      ) {
        $.msg($.name, "脚本正在运行中，本次退出🎇~");
        statusObj.running = true;
        statusObj.isfinished = false;
        statusObj.day = days;
        if (name == 'youth_kkz') {
          originIndex[thread] = currentIndex;
          currentIndex = originIndex;
        }
        statusObj.index = currentIndex;//更新index
        statusObj.timeStamp = timeStamp;//更新时间戳
        readStatus[name] = statusObj;
        $.setdata(JSON.stringify(readStatus), 'ReadStatus');
        return false;
      }
    }
    statusObj.running = true;
    statusObj.isfinished = false;
    statusObj.day = days;
    statusObj.index = originIndex;
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

//拆分数组
function splitArr(arr, threads) {
  var newArr = [];
  var num = parseInt(arr.length / threads);
  for (var i = 0; i < arr.length; i += num) {
    if (i > arr.length - num) {
      break;
    }
    let lastIndex = i + num;
    if (lastIndex > arr.length - num) {
      lastIndex = arr.length;
    }

    newArr.push(arr.slice(i, lastIndex));
  }
  return newArr;
}

module.exports = {
  checkStatus,
  setStatus,
  setRunTime
}