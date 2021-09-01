/*
更新时间: 2021-09-1 10:00

中青看点看看赚任务，手动完成任务，获取请求体，支持boxjs及Github Actions，多请求用"&"分开，点击任务，支持自动获取请求

https:\/\/kandian\.wkandian\.com\/v5\/task\/browse_start\.json url script-request-body youth_gain.js

https:\/\/kandian\.wkandian\.com\/v5\/nameless\/adlickstart\.json url script-request-body youth_gain.js

多个请求体时用'&'号或者换行隔开"，本脚本可自动删除失效请求，请须知 ‼️

*/

const $ = new Env("中青看点看看赚")
//const notify = $.isNode() ? require('./sendNotify') : '';
let lookArr = [];
let lookscore = 0;
let LookBody = [];
let lookbodys = $.getdata('youth_look')
let indexLast = $.getdata('youth_start_index') || 0;
let status = $.getdata('youth_kkz_status') || `{ "isfinished": true, "day": 3 }`;
let zq_cookie = $.isNode() ? (process.env.zq_cookie ? process.env.zq_cookie : "") : ($.getdata('zq_cookie') ? $.getdata('zq_cookie') : "")
let zq_cookieArr = []
let zq_cookies = ""
let statusObj = { "isfinished": false, "day": 1 }

if (!$.isNode() && !lookbodys) {
    $.msg($.name, "您未获取看看赚请求，请先获取");
}
if (!$.isNode() && !lookbodys.indexOf("&") == -1) {
    lookArr.push(lookbodys)
} else {
    if (!$.isNode() && !lookbodys.indexOf("&") > -1) {
        LookBody = lookbodys.split('&');
    }
    if ($.isNode()) {
        if (process.env.YOUTH_LOOK && process.env.YOUTH_LOOK.indexOf('&') > -1) {
            LookBody = process.env.YOUTH_LOOK.split('&');
        } else {
            LookBody = [process.env.YOUTH_LOOK]
        }
    }
    Object.keys(LookBody).forEach((item) => {
        if (LookBody[item]) {
            lookArr.push(LookBody[item])
        }
    })
}

if (!zq_cookie) {
    $.done()
}
else if (zq_cookie.indexOf("@") == -1 && zq_cookie.indexOf("@") == -1) {
    zq_cookieArr.push(zq_cookie)
}
else if (zq_cookie.indexOf("@") > -1) {
    zq_cookies = zq_cookie.split("@")
}
else if (process.env.zq_cookie && process.env.zq_cookie.indexOf('@') > -1) {
    zq_cookieArr = process.env.zq_cookie.split('@');
    console.log(`您选择的是用"@"隔开\n`)
}
else {
    zq_cookies = [process.env.zq_cookie]
};
Object.keys(zq_cookies).forEach((item) => {
    if (zq_cookies[item]) {
        zq_cookieArr.push(zq_cookies[item])
    }
})

timeZone = new Date().getTimezoneOffset() / 60;
timestamp = Date.now() + (8 + timeZone) * 60 * 60 * 1000;
bjTime = new Date(timestamp).toLocaleString('zh', {
    hour12: false,
    timeZoneName: 'long'
});
hours = new Date().getHours();
days = new Date().getDay();
console.log(`\n === 脚本执行 ${bjTime} ===\n`);
!(async () => {
    statusObj = JSON.parse(status)
    if (statusObj.day == days && statusObj.isfinished) {
        $.msg("今天已经看完啦🎇~");
        return
    }
    $.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n您共提供${lookArr.length}次看看赚任务\n`)
    if (lookArr.length !== 0) {
        $.begin = indexLast ? parseInt(indexLast) : 1;
        if ($.begin + 1 < lookArr.length) {
            $.log("\n上次运行到第" + $.begin + "次终止，本次从" + (parseInt($.begin) + 1) + "次开始");
        } else {
            $.log("由于上次缩减剩余请求数已小于总请求数，本次从头开始");
            indexLast = 0, $.begin = 0
        }
        $.index = 0
        for (let k = indexLast; k < lookArr.length; k++) {
            if (lookArr[k]) {
                lookbody = lookArr[k];
                $.index = k + 1;
                $.log(`-------------------------\n\n开始中青看点看看赚第${$.index}次任务`)
            }
            await lookStart();
        }
        console.log(`-------------------------\n\n中青看点共完成${$.index}次任务，共计获得${lookscore}个青豆，看看赚任务全部结束`);
        $.msg("中青看点看看赚", '共完成' + (lookArr.length) + '次任务，共计获得' + parseInt(lookscore) + '个青豆');
        statusObj.isfinished = true
        statusObj.day = days
        $.setdata(JSON.stringify(statusObj), 'youth_kkz_status');
    }
    if ($.isNode()) {
        //await notify.sendNotify($.name，`共完成${$.index}次任务，\n共计获得${gainscore}个青豆`
    }
    if (hours == 16) {
        console.log(`共${zq_cookieArr.length}个cookie`)
        for (let k = 0; k < zq_cookieArr.length; k++) {
            bodyVal = zq_cookieArr[k].split('&uid=')[0];
            var time1 = Date.parse(new Date()).toString();
            time1 = time1.substr(0, 10);

            cookie = bodyVal.replace(/zqkey=/, "cookie=")
            cookie_id = cookie.replace(/zqkey_id=/, "cookie_id=")
            zq_cookie1 = cookie_id + '&device_brand=xfdg&device_id=cc7dgdsgfsz83e&device_model=1gx&device_platform=android&device_type=android&inner_version=202107261526&mi=0&openudid=cc7dgdsgfsz83e&os_api=27&os_version=bdftgsdfga&phone_network=WIFI&phone_sim=1' + '&request_time=' + time1 + '&time=' + time1 + '&' + bodyVal
            //console.log(`${zq_cookie1}`)
            console.log(`--------第 ${k + 1} 个账号看看赚上方宝箱奖励执行中--------\n`)
            for (let k = 0; k < 3; k++) {
                id = k.toString()
                await openbox(id, zq_cookie1)
                await $.wait(30000);

            }
            console.log("\n\n")
        }


        function openbox(id, zq_cookie1, timeout = 0) {
            return new Promise((resolve) => {
                let url = {
                    url: 'https://kandian.wkandian.com/WebApi/Nameless/getBoxReward?id=' + id + '&' + zq_cookie1,
                    headers: {
                        'Host': 'kandian.wkandian.com',
                        //'Referer': 'https://kandian.wkandian.com/h5/20190527watchMoney/?' +zq_cookie1
                        'Referer': 'https://kandian.wkandian.com/h5/20190527watchMoney/?keyword_wyq=woyaoq.com&access=WIFI&app-version=8.1.2&app_version=8.1.2&carrier=%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8&channel=c1005&' + zq_cookie1
                    },
                }
                $.get(url, async (err, resp, data) => {
                    try {
                        const result = JSON.parse(data)
                        if (result.status == 1) {
                            console.log(result.data)
                        } else {
                            console.log(result)
                        }
                    } catch (e) {
                    } finally {
                        resolve()
                    }
                }, timeout)
            })
        }
    }

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function lookStart() {
    return new Promise((resolve, reject) => {
        $.post(gainHost('nameless/adlickstart.json', lookbody), async (error, resp, data) => {
            if (error) {
                reject()
            }
            try {
                $.begin = $.begin + 1;
                let res = $.begin % lookArr.length;
                $.setdata(res + "", 'youth_start_index');
                startlk = JSON.parse(data);
                if (startlk.success == false) {
                    smbody = $.getdata('youth_look').replace(lookbody + "&", "");
                    $.setdata(smbody, 'youth_look');
                    $.log(startlk.message + "已自动删除")
                } else {
                    comstate = startlk.items.comtele_state;
                    if (comstate == 0) {
                        $.log("任务开始，" + startlk.items.banner_id + startlk.message);
                        for (let j = 0; j < startlk.items.see_num - startlk.items.read_num; j++) {
                            $.log("任务执行第" + parseInt(j + 1) + "次")
                            await $.wait(8000);
                            await lookstatus()
                        }
                        await $.wait(10000);
                        await lookEnd()
                    } else if (comstate == 1) {
                        $.log("任务:" + startlk.items.banner_id + "已完成，本次跳过");
                    }
                }
            } catch (e) {
                $.log('lookStart:' + e)
            } finally {
                resolve()
            }
        })
    })
}

function lookstatus() {
    return new Promise((resolve, reject) => {
        $.post(gainHost('nameless/bannerstatus.json', lookbody), (error, resp, data) => {
            if (error) {
                reject()
            }
            try {
                let endres = JSON.parse(data);
                if (endres.success == true) {
                    $.log("任务" + endres.items.banner_id + endres.message);
                } else {
                    $.log(endres.message)
                }
            } catch (e) {
                $.log('lookstatus:' + e)
            } finally {
                resolve()
            }
        })
    })
}

function lookEnd() {
    return new Promise((resolve, reject) => {
        $.post(gainHost('nameless/adlickend.json', lookbody), (error, resp, data) => {
            if (error) {
                reject()
            }
            try {
                let endres = JSON.parse(data);
                if (endres.success == true) {
                    $.log("任务" + endres.items.banner_id + endres.message + "，" + endres.items.desc)
                    lookscore += parseInt(endres.items.score)
                } else {
                    $.log(endres.message)
                }
            } catch (e) {
                $.log('lookEnd:' + e)
            } finally {
                resolve()
            }
        })
    })
}

function gainHost(api, body) {
    return {
        url: 'https://kandian.wkandian.com/v5/' + api,
        headers: {
            'User-Agent': 'okhttp/3.12.2',
            'Host': 'kandian.wkandian.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'device-platform': 'android',
            'os-api': '26',
            'device-model': 'V1986A',
            'os-version': 'RP1A.200720.012+release-keys',
            'request_time': new Date().getTime(),
            'app-version': '3.5.5',
            'phone-sim': 1,
            'carrier': '%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8'
        },
        body: body
    }
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
