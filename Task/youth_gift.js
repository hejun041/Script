/*
更新时间: 2021-07-9 22:10

多个请求体时用'&'号或者换行隔开" ‼️
cron 37 0-20/1 * * * 直接重放20次也可以
rewrite https:\/\/kandian\.wkandian\.com\/v5\/article\/red_packet_188\.json https://raw.githubusercontent.com/hejun041/Script/master/Task/youth_gift.js
*/

const $ = new Env("中青看文章红包")
//const notify = $.isNode() ? require('./sendNotify') : '';
let ReadArr = [];
let YouthBody = $.getdata('youth_gift');
let youth_gift_cut = $.getdata('youth_gift_cut');
let indexLast = $.getdata('zqbody_gift_index');
let giftscore = 0;
let delbody = 0;
if (isGetbody = typeof $request !== `undefined`) {
    Getbody();
    $.done()
}
if (!$.isNode() && !YouthBody == true) {
    $.log("您未获取红包请求，点击文章底部红包后获取")
    $.msg($.name, "您未获取红包请求，点击文章底部红包后获取")
    $.done()
} else if (!$.isNode() && YouthBody.indexOf("&") == -1) {
    ReadArr.push(YouthBody)
} else {
    if (!$.isNode() && YouthBody.indexOf("&") > -1) {
        YouthBodys = YouthBody.split("&")
    } else {
        YouthBodys = []
    }
    Object.keys(YouthBodys).forEach((item) => {
        if (YouthBodys[item]) {
            ReadArr.push(YouthBodys[item])
        }
    })
}
timeZone = new Date().getTimezoneOffset() / 60;
timestamp = Date.now() + (8 + timeZone) * 60 * 60 * 1000;
bjTime = new Date(timestamp).toLocaleString('zh', {
    hour12: false,
    timeZoneName: 'long'
});
console.log(`\n === 脚本执行 ${bjTime} ===\n`);
$.log("******** 您共获取" + ReadArr.length + "次红包请求，任务开始 *******")

!(async () => {
    if (!ReadArr[0]) {
        console.log($.name, '【提示】请把抓包的请求体填入Github 的 Secrets 中，请以&隔开')
        return;
    }
    if (!$.isNode()) {
        $.begin = indexLast ? parseInt(indexLast) : 1;
        if ($.begin + 1 == 20) {//一个账号只有20次红包
            $.log("\n今天红包🧧已领完");
            $.msg("\n今天红包🧧已领完");
            $.done()
        }
        if ($.begin + 1 < ReadArr.length) {
            $.log("\n上次运行到第" + $.begin + "次终止，本次从" + (parseInt($.begin) + 1) + "次开始");
        } else {
            $.log("由于上次缩减剩余请求数已小于总请求数，本次从头开始");
            indexLast = 0,
                $.begin = 0
        }
    } else {
        indexLast = 0,
            $.begin = 0
    }
    if (youth_gift_cut == "true") {
        $.log("     请注意缩减请求开关已打开‼️\n     如不需要    请强制停止\n     关闭Boxjs缩减请求开关")
    };
    $.index = 0;
    for (var i = indexLast ? indexLast : 0; i < ReadArr.length; i++) {
        if (ReadArr[i]) {
            articlebody = ReadArr[i];
            $.index = $.index + 1;
            $.log(`-------------------------\n开始中青看点第${$.index}次红包\n`);
            await AutoGain();
        }
    };
    $.log("\n……………………………………………………………………\n\n本次共删除" + delbody + "个请求，剩余" + (ReadArr.length - delbody) + "个请求");
    $.msg($.name, `本次运行共完成${$.index}次红包，共计获得${giftscore}个青豆`, "删除" + delbody + "个请求")
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function AutoGain() {
    return new Promise((resolve, reject) => {
        $.post(batHost('article/red_packet_188.json?', articlebody), async (error, resp, data) => {
            let giftres = JSON.parse(data);
            $.log(data + "\n" + error + "\n" + resp)
            if (giftres.error_code == '0' && giftres.items.score > 0) {
                console.log(`${giftres.items.alert}\n`);
                giftscore += parseInt(giftres.items.score);
                if ($.index == ReadArr.length) {
                    $.log($.index + "次任务已全部完成，即将结束")
                } else {
                    await $.wait(20000);
                }
            } else if (giftres.error_code == '0' && data.indexOf('"score":0') > -1 && giftres.items.score == 0) {
                $.log(`\n本次红包获得0个青豆，等待10s即将开始下次红包\n`);
                if (youth_gift_cut == "true") {
                    await removebody();
                    $.log("已删除第" + ($.begin) + "个请求，如无需删除请及时提前关掉boxjs内的开关，使用后即关闭")
                    delbody += 1
                }
            } else if (giftres.success == false) {
                console.log(`第${$.index}次红包请求有误，请删除此请求`);
                if (youth_gift_cut == "true") {
                    await removebody();
                    $.log("已删除第" + ($.begin) + "个请求，如无需删除请及时提前关掉boxjs内的开关，使用后即关闭");
                    delbody += 1
                }
            } else {
                $.log("未知错误");
            }
            resolve()
        })
    })
}

function removebody() {
    if (articlebody !== ReadArr[0]) {
        smallbody = $.getdata('youth_gift').replace("&" + articlebody, "");
    } else {
        smallbody = $.getdata('youth_gift').replace(articlebody + "&", "")
    }
    $.setdata(smallbody, 'youth_gift')
}

function batHost(api, body) {
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

function Getbody() {
    //https://kandian.wkandian.com/v5/article/red_packet_188.json
    if ($request && ($request.url.match(/\/article\/red_packet_188/))) {
        bodyVal = $request.body
        if (YouthBody) {
            if (YouthBody.indexOf(bodyVal) > -1) {
                $.log("此红包请求已存在，本次跳过")
            } else if (YouthBody.indexOf(bodyVal) == -1) {
                YouthBodys = YouthBody + "&" + bodyVal;
                $.setdata(YouthBodys, 'youth_gift');
                $.log(`${$.name}获取红包: 成功, YouthBodys: ${bodyVal}`);
                bodys = YouthBodys.split("&")
                $.msg($.name, "获取第" + bodys.length + "个红包请求: 成功🎉", ``)
            }
        } else {
            $.setdata(bodyVal, 'youth_gift');
            $.log(`${$.name}获取红包: 成功, YouthBodys: ${bodyVal}`);
            $.msg($.name, `获取第一个红包请求: 成功🎉`, ``)
        }
    }
}


function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
