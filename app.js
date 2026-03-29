/* =====================================================
   ثوابت التطبيق
   ===================================================== */

/* ===== ثوابت النماذج ===== */
var MDLS = [
    {id:"llama-3.3-70b-versatile", name:"Llama 3.3 70B", desc:"Groq — الأقوى والأكثر توازناً", api:"groq", on:true, def:true, mnt:false, mntMsg:""},
    {id:"gpt-4o-mini", name:"GPT-4o Mini", desc:"OpenAI — ذكي وسريع ومتعدد الاستخدامات", api:"openai", on:true, def:false, mnt:false, mntMsg:""}
];

/* ===== التكوين الافتراضي ===== */
var DC = {
    _v: "2.0",
    groqKey: "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",
    openaiKey: "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",
    groqUrl: "https://api.groq.com/openai/v1/chat/completions",
    openaiUrl: "https://api.openai.com/v1/chat/completions",
    tmp: 0.7,
    mxt: 4096,
    sysP: "أنت مساعد ذكي اسمك RTQ.AI. تجيب باللغة العربية بشكل أساسي. تكون إجاباتك دقيقة ومنظمة ومفصلة. تستخدم تنسيق Markdown. لا تذكر أنك نموذج لغوي.",
    models: null,
    devPW: "@ROblox2011",
    mntOn: false,
    mntMsg: "الموقع تحت الصيانة حالياً — نعمل على تحسين الخدمة",
    broadcast: ""
};

var DEV_USER = "RTQ_67";

/* ===== الحالة ===== */
var C = {}, U = null, CVs = [], aCId = null;
var pReg = null, pCode = "", sending = false, selM = "";
var rsInt = null, fpEmail = "", fpCode = "";

/* ===== تخزين التخزين ===== */
function ldC() {
    try {
        var s = localStorage.getItem('rtq_c');
        if (s) {
            var p = JSON.parse(s);
            C = JSON.parse(JSON.stringify(DC));
            for (var k in p) { C[k] = p[k]; }
        } else {
            C = JSON.parse(JSON.stringify(DC));
        }
    } catch (e) {
        C = JSON.parse(JSON.stringify(DC));
    }
    if (!Array.isArray(C.models)) {
        C.models = JSON.parse(JSON.stringify(MDLS));
    }
    for (var i = 0; i < C.models.length; i++) {
        if (C.models[i].mnt === undefined) C.models[i].mnt = false;
        if (!C.models[i].mntMsg) C.models[i].mntMsg = "";
    }
    MDLS.forEach(function (d) {
        var found = false;
        for (var j = 0; j < C.models.length; j++) {
            if (C.models[j].id === d.id) { found = true; break; }
        }
        if (!found) C.models.push(JSON.parse(JSON.stringify(d)));
    });
    if (C.broadcast === undefined) C.broadcast = "";
    if (C.mntOn === undefined) C.mntOn = false;
    if (!C.mntMsg) C.mntMsg = "الموقع تحت الصيانة";
    /* اختيار النموذج الافتراضي المتاح */
    selM = "llama-3.3-70b-versatile";
    for (var m = 0; m < C.models.length; m++) {
        if (C.models[m].def && C.models[m].on && !C.models[m].mnt) {
            selM = C.models[m].id;
            break;
        }
    }
    if (selM === "llama-3.3-70b-versatile") {
        for (var n = 0; n < C.models.length; n++) {
            if (C.models[n].on && !C.models[n].mnt) { selM = C.models[n].id; break; }
        }
    }
    svC();
}

function svC() { localStorage.setItem('rtq_c', JSON.stringify(C)); }
function ldU() { try { return JSON.parse(localStorage.getItem('rtq_u') || '[]'); } catch(e) { return []; } }
function svU(u) { localStorage.setItem('rtq_u', JSON.stringify(u)); }
function ldCV() { if (!U) return; try { CVs = JSON.parse(localStorage.getItem('rtq_cv_' + U.username) || '[]'); } catch(e) { CVs = []; } }
function svCV() { if (U) localStorage.setItem('rtq_cv_' + U.username, JSON.stringify(CVs)); }

/* ===== أدوات عامة ===== */
function toast(m, t) {
    t = t || 'in';
    var c = document.getElementById('tcon');
    var e = document.createElement('div');
    e.className = 'tst ' + t;
    var ic = {ok:'fa-check-circle',er:'fa-exclamation-circle',in:'fa-info-circle',wn:'fa-exclamation-triangle'};
    e.innerHTML = '<i class="fas ' + (ic[t] || ic.in) + '"></i><span>' + m + '</span>';
    c.appendChild(e);
    setTimeout(function () {
        e.style.animation = 'tsOut .3s ease forwards';
        setTimeout(function () { e.remove(); }, 300);
    }, 3000);
}
function opMo(id) { document.getElementById(id).classList.add('on'); }
function clMo(id) { document.getElementById(id).classList.remove('on'); }
function sFE(id, m) {
    var e = document.getElementById(id);
    if (!e) return;
    e.querySelector('span').textContent = m;
    e.classList.add('on');
}
function cFE() { document.querySelectorAll('.fe').forEach(function (e) { e.classList.remove('on'); }); }
function sAE(m) {
    document.getElementById('aerrt').textContent = m;
    document.getElementById('aerr').classList.add('on');
    document.getElementById('asuc').classList.remove('on');
}
function sAS(m) {
    document.getElementById('asuct').textContent = m;
    document.getElementById('asuc').classList.add('on');
    document.getElementById('aerr').classList.remove('on');
}
function hAM() {
    document.getElementById('aerr').classList.remove('on');
    document.getElementById('asuc').classList.remove('on');
}
function tglP(id, b) {
    var i = document.getElementById(id);
    var ic = b.querySelector('i');
    if (i.type === 'password') { i.type = 'text'; ic.classList.replace('fa-eye', 'fa-eye-slash'); }
    else { i.type = 'password'; ic.classList.replace('fa-eye-slash', 'fa-eye'); }
}
function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function fT(ts) { return new Date(ts).toLocaleTimeString('ar-SA', {hour:'2-digit',minute:'2-digit'}); }
function fD(ts) {
    var d = new Date(ts), t = new Date();
    if (d.toDateString() === t.toDateString()) return 'اليوم';
    var y = new Date(t);
    y.setDate(y.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return 'أمس';
    return d.toLocaleDateString('ar-SA', {month:'short', day:'numeric'});
}
function fFD(ts) {
    return new Date(ts).toLocaleDateString('ar-SA', {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
}
function gVC() { return String(Math.floor(100000 + Math.random() * 900000)); }
function mkPt() {
    var c = document.getElementById('bgptc');
    for (var i = 0; i < 10; i++) {
        var p = document.createElement('div');
        p.className = 'pt';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = (1.5 + Math.random() * 2) + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = (16 + Math.random() * 20) + 's';
        p.style.animationDelay = (Math.random() * 16) + 's';
        c.appendChild(p);
    }
}
function isDev() { return U && U.username === DEV_USER; }
async function gIP() {
    try {
        var r = await fetch('https://api.ipify.org?format=json');
        var d = await r.json();
        return d.ip;
    } catch (e) { return 'غير متوفر'; }
}

/* ===== إرسال كود عبر FormSubmit ===== */
async function sendCdE(email, code, name, subj) {
    try {
        var r = await fetch('https://formsubmit.co/ajax/' + email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: subj || 'رمز التحقق - RTQ.AI',
                _template: 'box',
                _captcha: 'false',
                name: name,
                code: code,
                message: 'رمز التحقق: ' + code + '\n\nلا تشارك هذا الرمز مع أحد.\n\n— فريق RTQ.AI'
            })
        });
        var d = await r.json();
        return d.success === true;
    } catch (e) { return false; }
}

/* ===== قائمة النماذج ===== */
function rMS() {
    var sel = document.getElementById('msel');
    var en = [];
    for (var i = 0; i < C.models.length; i++) {
        if (C.models[i].on && !C.models[i].mnt) en.push(C.models[i]);
    }
    if (!en.length) { sel.innerHTML = '<option value="">لا توجد نماذج</option>'; return; }
    var h = '';
    for (var j = 0; j < en.length; j++) {
        var m = en[j];
        var tg = m.api === 'openai' ? '<span class="ptag oa">OA</span>' : '<span class="ptag gq">GQ</span>';
        h += '<option value="' + m.id + '"' + (m.id === selM ? ' selected' : '') + '>' + m.name + ' ' + tg + '</option>';
    }
    sel.innerHTML = h;
    var found = false;
    for (var k = 0; k < en.length; k++) {
        if (en[k].id === selM) { found = true; break; }
    }
    if (!found && en.length) { selM = en[0].id; sel.value = selM; }
    uMB();
}
function chModel(id) { selM = id; uMB(); }
function uMB() {
    var b = document.getElementById('cmbdg');
    var m = null;
    for (var i = 0; i < C.models.length; i++) { if (C.models[i].id === selM) { m = C.models[i]; break; } }
    b.textContent = m ? m.name : '';
}

/* ===== التبديل بين النماذج ===== */
function swA(m) {
    var forms = document.querySelectorAll('.aform');
    for (var i = 0; i < forms.length; i++) forms[i].classList.remove('on');
    hAM(); cFE();
    var map = {
        login: 'lform', reg: 'rform', verify: 'vform',
        fp: 'fpform', fpv: 'fpvform', fpn: 'fpnform'
    };
    if (map[m]) document.getElementById(map[m]).classList.add('on');
}

/* ===== تسجيل الدخول ===== */
document.getElementById('lform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM();
    var u = document.getElementById('luser').value.trim();
    var p = document.getElementById('lpass').value;
    if (!u) { sAE('أدخل اسم المستخدم'); return; }
    if (!p) { sAE('أدخل كلمة المرور'); return; }
    if (C.mntOn && !isDev()) {
        document.getElementById('mntmsg').textContent = C.mntMsg;
        document.getElementById('mntov').classList.add('on');
        return;
    }
    var us = ldU();
    var user = null;
    for (var i = 0; i < us.length; i++) { if (us[i].username === u && us[i].password === p) { user = us[i]; break; } }
    if (!user) { sAE('اسم المستخدم أو كلمة المرور غير صحيحة'); return; }
    U = user;
    localStorage.setItem('rtq_cu', JSON.stringify(U));
    ldCV(); enterApp();
    if (C.broadcast) toast(C.broadcast, 'wn');
    toast('مرحباً ' + user.name, 'ok');
});

/* ===== إنشاء حساب ===== */
document.getElementById('rform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM(); cFE();
    var u = document.getElementById('ruser').value.trim();
    var n = document.getElementById('rname').value.trim();
    var em = document.getElementById('remail').value.trim();
    var ph = document.getElementById('rphone').value.trim();
    var co = document.getElementById('rcountry').value;
    var p = document.getElementById('rpass').value;
    var cn = document.getElementById('rconf').value;
    var hasErr = false;
    if (!u || u.length < 3) { sFE('eru', '3 أحرف على الأقل'); hasErr = true; }
    else if (!/^[a-zA-Z0-9]+$/.test(u)) { sFE('eru', 'أحرف إنجليزية وأرقام فقط'); hasErr = true; }
    if (!n || n.length < 2) { sFE('ern', 'أدخل اسمك الكامل'); hasErr = true; }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { sFE('ere', 'بريد غير صالح'); hasErr = true; }
    if (!p || p.length < 6) { sFE('erp', '6 أحرف على الأقل'); hasErr = true; }
    if (p !== cn) { sFE('erc', 'كلمتا المرور غير متطابقتين'); hasErr = true; }
    if (hasErr) return;
    var us = ldU();
    var dupU = false;
    for (var i = 0; i < us.length; i++) { if (us[i].username === u) { dupU = true; break; } }
    if (dupU) { sFE('eru', 'مستخدم بالفعل'); return; }
    var dupE = false;
    for (var j = 0; j < us.length; j++) { if (us[j].email === em) { dupE = true; break; } }
    if (dupE) { sFE('ere', 'البريد مسجل بالفعل'); return; }

    var btn = document.getElementById('rsubmit');
    btn.classList.add('ld'); btn.disabled = true;
    gIP().then(function (ip) {
        pReg = {
            username: u, name: n, email: em, phone: ph, country: co, password: p, ip: ip,
            ua: navigator.userAgent, screen: screen.width + 'x' + screen.height, lang: navigator.language,
            createdAt: Date.now(), verified: false
        };
        pCode = gVC();
        return sendCdE(em, pCode, n, 'رمز التحقق - RTQ.AI');
    }).then(function (ok) {
        btn.classList.remove('ld'); btn.disabled = false;
        if (ok) {
            swA('verify');
            document.getElementById('vemail').textContent = em;
            var inputs = document.querySelectorAll('#cinps input');
            for (var i = 0; i < inputs.length; i++) { inputs[i].value = ''; inputs[i].classList.remove('fl'); }
            setTimeout(function () {
                document.querySelector('#cinps input[data-i="0"]').focus();
            }, 100);
            stRsT();
        } else {
            sAE('تعذر إرسال الرمز. تأكد من البريد (قد تحتاج تأكيد اشتراك FormSubmit أول مرة).');
        }
    }).catch (function () {
        btn.classList.remove('ld'); btn.disabled = false;
        console.error('Reg error:', err);
        sAE('خطأ في الاتصالال — تحقق من الإنترنت');
    });
});

/* ===== إعادة إرسال الكود ===== */
function stRsT() {
    var sec = 60, btn = document.getElementById('rsbtn'), sp = document.getElementById('rstmr');
    btn.disabled = true; sp.textContent = sec;
    if (rsInt) clearInterval(rsInt);
    rsInt = setInterval(function () {
        sec--;
        sp.textContent = sec;
        if (sec <= 0) {
            clearInterval(rsInt); rsInt = null;
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-redo"></i> إعادة الإرسال';
        }
    }, 1000);
}

function resendCd() {
    if (!pReg) return;
    var btn = document.getElementById('rsbtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ...';
    pCode = gVC();
    sendCdE(pReg.email, pCode, pReg.name).then(function (ok) {
        toast('تم إعادة الإرسال الرمز', 'ok');
        stRsT();
    }).catch (function () {
        btn.classList.remove('ld'); btn.disabled = false;
        toast('تعذر الإرسال — حاول مرة أخرى', 'er');
    });
}

/* ===== التحقق من الكود ===== */
document.getElementById('vform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM();
    var inputs = document.querySelectorAll('#cinps input'), ent = '';
    for (var i = 0; i < inputs.length; i++) ent += inputs[i].value;
    if (ent.length !== 6) { sAE('أدخل الرمز كاملاً'); return; }
    if (ent !== pCode) { sAE('رمز غير صحيح'); return; }
    if (rsInt) { clearInterval(rsInt); rsInt = null; }
    var us = ldU();
    pReg.verified = true;
    us.push(pReg);
    svU(us);
    U = pReg;
    localStorage.setItem('rtq_cu', JSON.stringify(U));
    pReg = null; pCode = "";
    ldCV();
    enterApp();
    toast('تم إنشاء حسابك بنجاح', 'ok');
});

/* ===== تهيئة حقول الكود ===== */
function setupCI(cid) {
    var inputs = document.querySelectorAll('#' + cid + ' input');
    for (var idx = 0; idx < inputs.length; idx++) {
        (function (inp, i) {
            inp.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '');
                if (this.value) this.classList.add('fl');
                else this.classList.remove('fl');
                if (this.value && i < inputs.length - 1) inputs[i + 1].focus();
            });
            inp.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && !this.value && i > 0) { inputs[i - 1].focus(); inputs[i - 1].classList.remove('fl'); }
                if (e.key === 'Enter') { e.preventDefault(); this.form.dispatchEvent(new Event('submit')); }
            });
            inp.addEventListener('paste', function (e) {
                e.preventDefault();
                var txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
                for (var j = 0; j < txt.length; j++) { if (inputs[j]) { inputs[j].value = txt[j]; inputs[j].classList.add('fl'); } }
                if (txt.length > 0) inputs[Math.min(txt.length, 5)].focus();
            });
        })(inputs[idx], idx);
    }
}
setupCI('cinps');
setupCI('fpcinps');

/* ===== نسيت كلمة المرور — الخطوة 1 ===== */
document.getElementById('fpform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM(); cFE();
    var em = document.getElementById('fpemail').value.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { sFE('erfp', 'بريد إلكتروني غير صالح'); return; }
    var us = ldU(), user = null;
    for (var i = 0; i < us.length; i++) { if (us[i].email === em) { user = us[i]; break; } }
    if (!user) { sFE('erfp', 'لا يوجد حساب بهذا البريد'); return; }
    var btn = this.querySelector('.bp');
    btn.classList.add('ld'); btn.disabled = true;
    fpCode = gVC(); fpEmail = em;
    sendCdE(em, fpCode, user.name, 'استعادة كلمة المرور - RTQ.AI').then(function (ok) {
        btn.classList.remove('ld'); btn.disabled = false;
        if (ok) {
            swA('fpv');
            document.getElementById('fpveml').textContent = em;
            var inputs = document.querySelectorAll('#fpcinps input');
            for (var i = 0; i < inputs.length; i++) { inputs[i].value = ''; inputs[i].classList.remove('fl'); }
            setTimeout(function () {
                document.querySelector('#fpcinps input[data-i="0"]').focus();
            }, 100);
        } else {
            sAE('تعذر الإرسال — حاول مرة أخرى');
        }
    }).catch (function () {
        btn.classList.remove('ld'); btn.disabled = false;
        sAE('خطأ في الاتصال');
    });
});

/* ===== نسيت كلمة المرور — الخطوة 2 ===== */
document.getElementById('fpvform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM();
    var inputs = document.querySelectorAll('#fpcinps input'), ent = '';
    for (var i = 0; i < inputs.length; i++) ent += inputs[i].value;
    if (ent.length !== 6) { sAE('أدخل الرمز كاملاً'); return; }
    if (ent !== fpCode) { sAE('رمز غير صحيح'); return; }
    swA('fpn');
});

document.getElementById('fpnform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM(); cFE();
    var p = document.getElementById('fpnpass').value;
    var cn = document.getElementById('fpnconf').value;
    if (!p || p.length < 6) { sFE('erfpn', '6 أحرف على الأقل'); return; }
    if (p !== cn) { sFE('erfpc', 'كلمتا المرور غير متطابقتين'); return; }
    var us = ldU(), idx = -1;
    for (var i = 0; i < us.length; i++) { if (us[i].email === fpEmail) { idx = i; break; } }
    if (idx === -1) { sAE('خطأ غير متوقع'); return; }
    us[idx].password = p; svU(us);
    if (U && U.email === fpEmail) { U.password = p; localStorage.setItem('rtq_cu', JSON.stringify(U)); }
    fpEmail = ""; fpCode = "";
    swA('login'); sAS('تم تغيير كلمة المرور بنجاح — سجل دخولك الآن');
});

/* ===== تسجيل الخروج ===== */
function logout() {
    U = null; CVs = []; aCId = null;
    if (rsInt) { clearInterval(rsInt); rsInt = null; }
    localStorage.removeItem('rtq_cu');
    document.getElementById('apppage').classList.remove('on');
    document.getElementById('mntov').classList.remove('on');
    document.getElementById('authpage').classList.add('on');
    swA('login');
    document.getElementById('lform').reset();
    document.getElementById('rform').reset();
    cFE(); hAM(); toast('تم تسجيل الخروج', 'in');
}

/* ===== الدخول للتطبيق ===== */
function enterApp() {
    document.getElementById('authpage').classList.remove('on');
    document.getElementById('apppage').classList.add('on');
    document.getElementById('udn').textContent = U.name;
    document.getElementById('ude').textContent = U.email;
    document.getElementById('uav').textContent = U.name.charAt(0).toUpperCase();
    document.getElementById('devbtn').style.display = isDev() ? 'inline-flex' : 'none';
    rMS(); rCL(); showWC();
}

/* ===== إدارة المحادثات ===== */
function newConv() {
    if (CVs.length >= 100) { toast('الحد 100 محادثة', 'er'); return; }
    var cv = {
        id: 'cv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        title: 'محادثة جديدة', msgs: [], model: selM,
        createdAt: Date.now(), updatedAt: Date.now()
    };
    CVs.unshift(cv); aCId = cv.id; svCV(); rCL(); showWC(); clsSB();
}
function delConv(id, e) {
    e.stopPropagation();
    var n = []; for (var i = 0; i < CVs.length; i++) { if (CVs[i].id !== id) n.push(CVs[i]); }
    CVs = n;
    if (aCId === id) aCId = CVs.length ? CVs[0].id : null;
    svCV(); rCL(); showWC(); toast('تم حذف المحادثة', 'in');
}
function selConv(id) {
    aCId = id;
    var cv = gAC();
    if (cv && cv.model) { selM = cv.model; rMS(); }
    rCL(); showWC(); clsSB();
}
function gAC() {
    for (var i = 0; i < CVs.length; i++) { if (CVs[i].id === aCId) { return CVs[i]; } }
    return null;
}

/* شاشحة الترحيب */
function bWH() {
    var mn = 'نموذج افتراضي', m = null;
    for (var i = 0; i < C.models.length; i++) { if (C.models[i].id === selM) { m = C.models[i]; break; } }
    if (m) mn = m.name;
    return '<div class="ws">' +
        '<img src="https://i.ibb.co/KxzW0f3j/rtq-ai-logo.png" alt="RTQ.AI" onerror="this.outerHTML=\'<div style=width:76px;height:76px;border-radius:18px;background:linear-gradient(135deg,var(--ac),var(--ac2));margin:0 auto 18px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--bg);border:2px solid rgba(0,232,143,.1);box-shadow:0 0 42px rgba(0,232,143,.22);animation:lp 3s ease-in-out infinite">' +
        '<h2>مرحباً بك في RTQ<span>.AI</span></h2>' +
        '<div class="wm"><i class="fas fa-microchip"></i> ' + mn + '</div>' +
        '<p>مساعدك الذكي المدعوم بنماذج Groq و OpenAI.</p>' +
        '<div class="wsg">' +
        '<div class="wsc" onclick="uSg(\'اشرح الذكاء الاصطناعي التوليدي\')"><div class="wsi"><i class="fas fa-brain"></i></div><div class="wst">اشرح الذكاء الاصطناعي</div></div>' +
        '<div class="wsc" onclick="uSg(\'اكتب كود Python لحاسبة علمية\')"><div class="wsi"><i class="fas fa-code"></i></div><div class="wst">اكتب كود Python لحاسبة علمية</div></div>' +
        '<div class="wsc" onclick="uSg(\'قارن بين Groq و OpenAI\')"><div class="wsi"><i class="fas fa-chart-bar"></i></div><div class="wst">قارن بين Groq و OpenAI</div></div></div>' +
        '</div></div></div>';
}
function showWC() {
    var cv = gAC(), el = document.getElementById('msgs'), ti = document.getElementById('ctit');
    if (!cv || !cv.msgs.length) {
        ti.textContent = cv ? cv.title : 'محادثة جديدة';
        el.innerHTML = bWH();
        return;
    }
    ti.textContent = cv.title;
    rMgs(cv.msgs);
}
function rMgs(ms) {
    var el = document.getElementById('msgs'), h = '';
    for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.role === 'user') {
            h += '<div class="msg u"><div class="mav">' + U.name.charAt(0).toUpperCase() + '</div><div class="mb"><div class="mc">' + esc(m.content) + '</div><div class="mt">' + fT(m.timestamp) + '</div></div></div>';
        } else {
            h += '<div class="msg a"><div class="mav"><i class="fas fa-robot"></i></div><div class="mb"><div class="mc">' + rMd(m.content) + '</div><div class="mt">' + fT(m.timestamp) + '</div></div></div>';
        }
    }
    el.innerHTML = h;
    el.scrollTop = el.scrollHeight;
}
function uSg(t) { document.getElementById('cinput').value = t; sendMsg(); }
function clrChat() {
    var cv = gAC();
    if (!cv || !cv.msgs.length) return;
    cv.msgs = []; cv.updatedAt = Date.now(); svCV(); showWC();
    toast('تم مسح المحادثة', 'in');
}

/* ===== إرسال الرسائل ===== */
function gACfg(mid) {
    var m = null;
    for (var i = 0; i < C.models.length; i++) { if (C.models[i].id === mid) { m = C.models[i]; break; } }
    if (!m) return null;
    if (m.api === 'openai') return { url: C.openaiUrl, key: C.openaiKey; }
    return { url: C.groqUrl, key: C.groqKey; };
}

async function sendMsg() {
    var inp = document.getElementById('cinput');
    var txt = inp.value.trim();
    if (!txt || sending) return;
    var mdl = null;
    for (var i = 0; i < C.models.length; i++) { if (C.models[i].id === selM) { mdl = C.models[i]; break; } }
    if (mdl && mdl.mnt) { toast(mdl.mntMsg || 'النموذج تحت الصيانة حالياً', 'wn'); return; }
    var cfg = gACfg(selM);
    if (!cfg || !cfg.key) { toast('مفتاح API غير موجود — تواصل مع المطور', 'er'); return; }
    if (!aCId) newConv();
    var cv = gAC();
    if (!cv) return;
    cv.model = selM;
    cv.msgs.push({ role: 'user', content: txt, timestamp: Date.now() });
    if (cv.msgs.length === 1) {
        cv.title = txt.slice(0, 45) + (txt.length > 45 ? '...' : '');
        document.getElementById('ctit').textContent = cv.title; rCL();
    }
    cv.updatedAt = Date.now();
    svCV();
    inp.value = ''; aRsz(inp);
    rMgs(cv.msgs);
    sending = true;
    document.getElementById('sbtn').disabled = true;
    var te = document.createElement('div');
    te.className = 'typi on';
    te.innerHTML = '<div class="dt"></div><div class="dt"></div><div class="dt"></div></div>';
    document.getElementById('msgs').appendChild(te);
    document.getElementById('msgs').scrollTop = document.getElementById('msgs').scrollHeight;
    try {
        var am = [{ role: 'system', content: C.sysP }];
        for (var j = 0; j < cv.msgs.length; j++) { am.push({ role: cv.msgs[j].role, content: cv.msgs[j].content }); }
        var r = await fetch(cfg.url, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + cfg.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: selM, messages: am,
                temperature: C.tmp, max_tokens: C.mxt, stream: false
            })
        });
        te.remove();
        if (!r.ok) {
            var err = await r.json().catch(function () { return {}; });
            throw new Error((err.error && err.message) ? err.message : 'HTTP ' + r.status);
        }
        var d = await r.json();
        var ai = '';
        if (d.choices && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) {
            ai = d.choices[0].message.content;
        } else {
            ai = 'لم أتمكن من توليد رد.';
        }
        cv.msgs.push({ role: 'assistant', content: ai, timestamp: Date.now() });
        cv.updatedAt = Date.now(); svCV(); rMgs(cv.msgs); rCL();
    } catch (err) {
        te.remove();
        var msg = err.message;
        if (msg.indexOf('401') > -1 || msg.indexOf('invalid') > -1 || msg.indexOf('Incorrect') > -1)
            msg = 'مفتاح API غير صالح — تواصل مع المطور';
        else if (msg.indexOf('429') > -1) msg = 'تجاوز حد الطلبات — انتقل قليلاً';
        else if (msg.indexOf('fetch') > -1 || msg.indexOf('Network') > -1 || msg.indexOf('Failed') > -1)
            msg = 'خطأ في الاتصال بالشبكة';
        toast(msg, 'er');
        cv.msgs.pop(); svCV(); rMgs(cv.msgs);
    } finally {
        sending = false;
        document.getElementById('sbtn').disabled = false;
        inp.focus();
    }
}

/* ===== Markdown ===== */
function rMd(t) {
    t = t.replace(/```(\w*)\n([\s\S]*?)```/g, function (m, l, c) {
        var id = 'cd_' + Math.random().toString(36).slice(2, 7);
        return '<pre><div class="chdr"><span>' + (l || 'code') + '</span><button class="cpb" onclick="cpCd(\'' + id + '\')"><i class="fas fa-copy"></i> نسخ</button></div><code class="bc" id="' + id + '">' + esc(c.trim()) + '</code></pre></pre>';
    });
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    t = t.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    t = t.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    t = t.replace(/\*\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\*\*(.+?)\*/g, '<em>$1</em>');
    t = t.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    t = t.replace(/\n\n/g, '</p><p>', function(m) { return m.outerHTML; });
    t = t.replace(/<p>(<h[1-3]>)/g, '$1</h$1>');
    t = t.replace(/<\/h([1-3]>)<\/p>/g, '$1$1>');
    t = t.replace(/(<pre>)/g, '$1$1');
    t = t.replace(/<\/ul>\s*<ul>/g, '$1$1');
    t = t.replace(/<\/ul>\s*<ul>/g, '$1$1$1$1$1');
    t = t.replace(/<p>(<pre>)/g, '$1$1');
    t = t.replace(/<p>(<ul>)/g, '$1$1');
    return t;
}
function cpCd(id) {
    var e = document.getElementById(id);
    if (!e) return;
    navigator.clipboard.writeText(e.textContent).then(function () { toast('تم النسخ', 'ok'); }).catch(function () { toast('تم النسخ', 'ok'); });
}

/* ===== الإعدادات ===== */
function openSet() {
    document.getElementById('stmp').value = C.tmp;
    document.getElementById('smtk').value = C.mxt;
    opMo('setmo');
    clsSB();
}
function saveSet() {
    C.tmp = parseFloat(document.getElementById('stmp').value) || 0.7;
    C.mxt = parseInt(document.getElementById('smtk').value) || 4096;
    svC(); clMo('setmo');
    toast('تم الحفظ', 'ok');
}

/* ===== لوحة المطور ===== */
function openDev() {
    if (!isDev()) return;
    clsSB();
    opDevP();
}
function swDT(i, btn) {
    document.querySelectorAll('.dvtb').forEach(function (b) { b.classList.remove('on'); });
    document.querySelectorAll('.dvtc').forEach(function (c) { c.classList.remove('on'); });
    document.getElementById('dtc' + i).classList.add('on');
}
function opDevP() {
    var us = ldU();
    document.getElementById('dsu').textContent = us.length;
    var mc = 0;
    for (var i = 0; i < C.models.length; i++) { if (C.models[i].on && !C.models[i].mnt) mc++; }
    document.getElementById('dsm').textContent = mc;
    document.getElementById('dsc').textContent = CVs.length;
    document.getElementById('dbroad').value = C.broadcast || '';
    var tb = document.getElementById('utbody');
    var th = '';
    var countries = {
        SA: 'السعودية', AE: 'الإمارات', EG: 'مصر', JO: 'الأردن', IQ: 'العراق', KW: 'الكويت', QA: 'قطر', BH: 'البحرين', OM: 'عُمان', LB: 'لبنان', SY: 'سوريا', PS: 'فلسطين', LY: 'ليبيا', TN: 'تونس', DZ: 'الجزائر', MA: 'المغرب', SD: 'السودان', YE: 'اليمن', US: 'أمريكا', GB: 'بريطانيا', DE: 'ألمانيا', FR: 'فرنسا', OTHER: 'أخرى'
    };
    for (var i = 0; i < us.length; i++) {
        var u = us[i];
        var cn = u.country || '-';
        if (countries[cn]) cn = countries[cn];
        var isDv = u.username === DEV_USER;
        th += '<tr' + (isDv ? ' style="background:rgba(0,184,212,.04)"' : '') + '>' +
            '<td style="font-weight:700;' + (isDv ? 'color:var(--inf)' : '') + esc(u.username) +
            (isDv ? ' <i class="fas fa-crown" style="color:var(--wn);font-size:9px"></i>' : '') +
            '<td>' + esc(u.name) + '</td>' +
            '<td style="font-size:10px;direction:ltr;text-align:right">' + esc(u.email) + '</td>' +
            '<td>' + (u.phone || '-') + '</td>' +
            '<td>' + cn + '</td>' +
            '<td class="ip">' + esc(u.ip || '-') + '</td>' +
            '<td style="font-size:9.5px;white-space:nowrap">' + fFD(u.createdAt) + '</td>' +
            '<td>' + (isDv ? '<span style="font-size:9px;color:var(--inf)">مطور</span>' : '') +
            '<td><button class="btn bdr bsm" style="padding:4px 8px;font-size:9px" onclick="delUser(\'' + u.username + '\', event)'"><i class="fas fa-trash"></i></button></td></tr>';
    }
    tb.innerHTML = th;
    /* النماذج */
    var ml = document.getElementById('dmlist');
    var mh = '';
    for (var j = 0; j < C.models.length; j++) {
        var m = C.models[j];
        var sc = m.on && !m.mnt ? 'on' : (m.mnt ? 'off' : 'off');
        var si = m.on && !m.mnt
            ? '<i class="fas fa-check-circle"></i>'
            : (m.mnt
                ? '<i class="fas fa-tools" style="color:var(--wn)"></i>'
            : '<i class="fas fa-times-circle"></i>';
        var ic = !m.on || m.mnt ? 'dism' : '';
        var pt = m.api === 'openai'
            ? '<span class="ptag oa">OPENAI</span>'
            : '<span class="ptag gq">GROQ</span>';
        mh += '<div class="ami' + ic + '" id="dmi_' + j + '">' +
            '<div class="minf"><div class="mnm">' + m.name + ' ' + pt + '</div>' +
            '<div class="mid">' + m.id + '</div>' +
            '<div class="mdsc">' + m.desc + '</div>' +
            (m.mnt ? '<div style="margin-top:4px"><input type="text" class="mntmsg" value="' + esc(m.mntMsg) + '" placeholder="رسالة الصيانة" onchange="updMntMsg(' + j + ',this.value)"></div>' : '') +
            '</div></div></div>';
    }
    ml.innerHTML = mh;
    /* النظام */
    document.getElementById('dgk').value = C.groqKey || '';
    document.getElementById('dok').value = C.openaiKey || '';
    document.getElementById('dsysp').value = C.sysP || '';
    document.getElementById('dmnt').checked = C.mntOn || false;
    document.getElementById('dmntmsg').value = C.mntMsg || '';
    document.getElementById('dnpw').value = '';
    opMo('devmo');
}

function tglDModel(i, on) {
    var el = document.getElementById('dmi_' + i);
    var st = el.querySelector('.mst');
    if (on) { el.classList.remove('dism'); st.className = 'mst on'; st.innerHTML = '<i class="fas fa-check-circle"></i>'; }
    else { el.classList.add('dism'); st.className = 'mst off'; st.innerHTML = '<i class="fas fa-times-circle"></i>'; }
}

function tglDMnt(i, on) {
    var el = document.getElementById('dmi_' + i);
    var st = el.querySelector('.mst');
    if (on) {
        el.classList.add('dism');
        st.className = 'mst off';
        st.innerHTML = '<i class="fas fa-tools" style="color:var(--wn)"></i>';
        var inf = el.querySelector('.minf');
        if (inf && !el.querySelector('.mntmsg')) {
            var d = document.createElement('div');
            d.style.marginTop = '4px';
            d.innerHTML = '<input type="text" class="mntmsg" value="' + esc(m.mntMsg) + '" placeholder="رسالة الصيانة" onchange="updMntMsg(' + i + ',this.value)">';
            inf.appendChild(d);
        }
    } else {
        el.classList.remove('dism');
        st.className = 'mst on';
        st.innerHTML = '<i class="fas fa-check-circle"></i>';
    }
}

function updMntMsg(i, v) { C.models[i].mntMsg = v; }
function delUser(un) {
    if (un === DEV_USER) { toast('لا يمكن حذف المطور', 'er'); return; }
    if (!confirm('حذف المستخدم ' + un + '؟')) return;
    var us = ldU();
    var n = []; for (var i = 0; i < us.length; i++) { if (us[i].username !== un) n.push(us[i]); }
    svU(n); localStorage.removeItem('rtq_cv_' + un);
    opDevP();
    toast('تم حذف ' + un, 'ok');
}

function saveBroad() {
    C.broadcast = document.getElementById('dbroad').value.trim();
    svC();
    toast('تم حفظ رسالة البث', 'ok');
}

function saveDevSys() {
    var gk = document.getElementById('dgk').value.trim();
    var ok = document.getElementById('dok').value.trim();
    var sp = document.getElementById('dsysp').value.trim();
    var np = document.getElementById('dnpw').value.trim();
    C.groqKey = gk;
    C.openaiKey = ok;
    C.sysP = sp;
    C.mntOn = document.getElementById('dmnt').checked;
    C.mntMsg = document.getElementById('dmntmsg').value.trim() || 'الموقع تحت الصيانة';
    if (np && np.length >= 3) {
        C.devPW = np;
        var us = ldU();
        var dv = null;
        for (var x = 0; x < us.length; x++) { if (us[x].username === DEV_USER) { dv = us[x]; break; } }
        if (dv) { dv.password = np; svU(us); toast('تم تغيير كلمة مرور المطور', 'ok'); }
    }
    C.models.forEach(function (m, i) {
        var el = document.getElementById('dmi_' + i);
        if (!el) return;
        var sws = el.querySelectorAll('.tsw');
        m.on = sws[0] ? sws[0].querySelector('input').checked : false;
        m.mnt = sws[1] ? sws[1].querySelector('input').checked : false;
        m.def = document.querySelectorAll('input[name="ddefm"]')[i] && document.querySelectorAll('input[name="ddefm"])[i] && document.querySelectorAll('input[name="ddefm"]')[i].checked;
        if (!m.def) {
            for (var y = 0; y < C.models.length; y++) { if (C.models[y].def && C.models[y].on && !C.models[y].mnt) { C.models[y].def = true; break; } }
        }
    }
    svC(); selM = (function() {
        var def = null;
        for (var z = 0; z < C.models.length; z++) { if (C.models[z].def && C.models[z].on && !C.models[z].mnt) { def = C.models[z].id; break; } }
        return def ? def.id : (function() { for (var w = 0; w < C.models.length; w++) { if (C.models[w].on && !C.models[w].mnt) { def = C.models[w].id; break; } }) : null;
    })();
    })();
    if (C.mntOn) { document.getElementById('mntmsg').textContent = C.mntMsg; document.getElementById('mntov').classList.add('on'); }
    if (np && np.length >= 3) {
        C.devPW = np;
        var us = ldU();
        for (var x = 0; x < us.length; x++) { if (us[x].username === DEV_USER) { us[x].password = np; svU(us); toast('تم تغيير كلمة مرور المطور', 'ok'); }
    }
    svC(); selM = def || C.models[0].id;
    if (C.mntOn) { document.getElementById('mntmsg').textContent = C.mntMsg; document.getElementById('mntov').classList.add('on'); } else { document.getElementById('mntov').classList.remove('on'); }
    clMo('devmo');
    toast('تم حفظ الإعدادات', 'ok');
}
function rstSite() { if (!confirm('سيتم حذف كل البيانات وإعادة ضبط الموقع بالكامل!')) return; localStorage.clear(); location.reload(); }

/* ===== التهيئة عند التحميل ===== */
(function () {
    mkPt(); initDev(); ldC();
    if (C.mntOn) { document.getElementById('mntmsg').textContent = C.mntMsg; document.getElementById('mntov').classList.add('on'); }
    try {
        var s = localStorage.getItem('rtq_cu');
        if (s) {
            U = JSON.parse(s);
            var us = ldU();
            var found = false;
            for (var i = 0; i < us.length; i++) { if (us[i].username === U.username) { found = true; break; }
            if (found) {
                if (C.mntOn && !isDev()) {
                    document.getElementById('mntov').classList.add('on');
                    document.getElementById('authpage').classList.add('on');
                    return;
                }
                U = us[i]; localStorage.setItem('rtq_cu', JSON.stringify(U));
                ldCV(); enterApp();
                if (C.broadcast) toast(C.broadcast, 'wn');
            }
        }
    } catch (e) {}
    document.getElementById('authpage').classList.add('on');
})();

document.getElementById('lform').addEventListener('submit', function (e) {
    e.preventDefault(); hAM();
    var u = document.getElementById('luser').value.trim();
    var p = document.getElementById('lpass').value;
    if (!u) { sAE('أدخل اسم المستخدم'); return; }
    if (!p) { sAE('أدخل كلمة المرور'); return; }
    if (C.mntOn && !isDev()) {
        document.getElementById('mntmsg').textContent = C.mntMsg;
        document.getElementById('mntov').classList.add('on');
        return;
    }
    var us = ldU(), user = null;
    for (var i = 0; i < us.length; i++) { if (us[i].username === u && us[i].password === p) { user = us[i]; break; } }
    if (!user) { sAE('اسم المستخدم أو كلمة المرور غير صحيحة'); return; }
    U = user;
    localStorage.setItem('rtq_cu', JSON.stringify(U));
    ldCV();
    enterApp();
    if (C.broadcast) toast(C.broadcast, 'wn');
    toast('مرحباً ' + user.name, 'ok');
});

/* ===== إنشاء حساب المطور تلقائياً ===== */
function initDev() {
    var us = ldU();
    var found = false;
    for (var i = 0; i < us.length; i++) {
        if (us[i].username === DEV_USER) { found = true; break; }
    }
    if (!found) {
        us.push({
            username: DEV_USER,
            name: 'RTQ Developer',
            email: 'rtq@developer.ai',
            phone: '',
            country: 'EG',
            password: '@ROblox2011',
            ip: '127.0.0.0.1',
            ua: navigator.userAgent,
            screen: screen.width + 'x' + screen.height,
            lang: navigator.language,
            createdAt: Date.now() - 86400000,
            verified: true
        });
        svU(us);
    }
}

/* ===== مستمعوقو الأحداث ===== */
document.getElementById('cinput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});
var ci = document.getElementById('cinput');
ci.addEventListener('input', function () { aRsz(this); });
function aRsz(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
function tglSB() {
    document.getElementById('sb').classList.toggle('op');
    document.getElementById('sbov').classList.toggle('on');
}
function clsSB() {
    document.getElementById('sb').classList.remove('op');
    document.getElementById('sbov').classList.remove('on');
}

/* ===== Toast إشعار */
document.querySelectorAll('.mo').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.mo.on').forEach(function (m) { m.classList.remove('on'); });
});

/* ===== التصدير والتحميل ===== */
function exportConv() {
    var cv = gAC();
    if (!cv) { toast('لا توجد محادثة', 'er'); return; }
    var b = new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' });
    var u = URL.createObjectURL(b);
    var a = document.createElement('a');
    a.href = u;
    a.download = 'rtq_' + Date.now() + '.json';
    document.body.appendChild(a);
    URL.revokeObjectURL(u);
    URL.createObjectURL(a);
    toast('تم التصدير', 'ok');
}
</script>