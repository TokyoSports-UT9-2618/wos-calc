// --- 定数 ---
const CONSTANTS = {
    FIXED_FOOTER: "\n\n※UT9@2618: The ultimate alliance for your WOS life!",
    MAX_LEADER_NAME_LEN: 3,
    STORAGE_KEYS: {
        LEADERS: 'wos_leaders',
        LANG: 'wos_lang',
        CUSTOM_MSG: 'wos_custom_message'
    },
    DEFAULT_LEADER_COUNT: 5
};

// --- 翻訳データ ---
const translations = {
    ja: {
        title: "集結時間計算機",
        addReader: "＋ リーダー追加",
        rallyTime: "集結時間",
        rallySolo: "単騎",
        rally1m: "1分集結",
        rally5m: "5分集結",
        rally10m: "10分集結",
        calcFromTarget: "① 着弾時間から計算",
        calcAndCopy: "計算＆コピー",
        calcFromDelay: "② ○秒後スタートで計算",
        delay30s: "30秒後",
        delay60s: "60秒後",
        delay90s: "90秒後",
        customMsgLabel: "カスタムメッセージ（任意）",
        tapToCopy: "タップしてコピー",
        resultPlaceholder: "計算結果がここに表示されます",
        toastCopy: "コピーしました！",
        leaderNamePlaceholder: "リーダー名",
        timeRemaining: "残り時間",
        secUnit: "秒"
    },
    en: {
        title: "Rally Time Calculator",
        addReader: "+ Add Leader",
        rallyTime: "Rally Time",
        rallySolo: "Solo",
        rally1m: "1m Rally",
        rally5m: "5m Rally",
        rally10m: "10m Rally",
        calcFromTarget: "① Calc from Landing Time",
        calcAndCopy: "Calculate & Copy",
        calcFromDelay: "② Calc from Delay Start",
        delay30s: "30s After",
        delay60s: "60s After",
        delay90s: "90s After",
        customMsgLabel: "Custom Message",
        tapToCopy: "Tap to Copy",
        resultPlaceholder: "Calculation result will be shown here",
        toastCopy: "Copied to clipboard!",
        leaderNamePlaceholder: "Leader Name",
        timeRemaining: "Time Remaining",
        secUnit: "sec"
    }
};

// --- 状態変数 ---
let leaders = [];
let selectedRallyMin = 1;
let currentLang = 'ja';

// --- データ操作 (Leaders) ---
function loadLeaders() {
    const saved = localStorage.getItem(CONSTANTS.STORAGE_KEYS.LEADERS);
    if (saved) {
        try {
            leaders = JSON.parse(saved);
        } catch (e) {
            leaders = [];
        }
    }

    if (!leaders || leaders.length === 0) {
        leaders = [];
        for (let i = 0; i < CONSTANTS.DEFAULT_LEADER_COUNT; i++) {
            leaders.push({ name: "", sec: "" });
        }
    }
}

function saveLeaders() {
    const rows = document.querySelectorAll('.leader-row');
    leaders = [];
    rows.forEach(row => {
        const name = row.querySelector('.name-input').value;
        const sec = row.querySelector('.sec-input').value;
        leaders.push({ name: name, sec: sec });
    });
    localStorage.setItem(CONSTANTS.STORAGE_KEYS.LEADERS, JSON.stringify(leaders));
}

function addLeaderRow() {
    saveLeaders();
    leaders.push({ name: "", sec: "" });
    localStorage.setItem(CONSTANTS.STORAGE_KEYS.LEADERS, JSON.stringify(leaders));
    renderLeaders();
}

function deleteLeader(btn) {
    saveLeaders();

    const row = btn.closest('.leader-row');
    const container = document.getElementById('leaders-container');
    const index = Array.from(container.children).indexOf(row);

    if (index > -1) {
        leaders.splice(index, 1);
    }

    while (leaders.length < CONSTANTS.DEFAULT_LEADER_COUNT) {
        leaders.push({ name: "", sec: "" });
    }

    localStorage.setItem(CONSTANTS.STORAGE_KEYS.LEADERS, JSON.stringify(leaders));
    renderLeaders();
}

function getActiveLeaders() {
    return leaders.filter(l => l.name.trim() !== "" && l.sec !== "");
}

// --- データ操作 (Custom Message) ---
function saveCustomMessage() {
    const msg = document.getElementById('customMessage').value;
    localStorage.setItem(CONSTANTS.STORAGE_KEYS.CUSTOM_MSG, msg);
}

function loadCustomMessage() {
    const msg = localStorage.getItem(CONSTANTS.STORAGE_KEYS.CUSTOM_MSG);
    if (msg) {
        document.getElementById('customMessage').value = msg;
    }
}

// --- 言語関連 ---
function t(key) {
    return translations[currentLang][key] || key;
}

function initLanguage() {
    const savedLang = localStorage.getItem(CONSTANTS.STORAGE_KEYS.LANG);
    if (savedLang) {
        currentLang = savedLang;
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        currentLang = browserLang.startsWith('en') ? 'en' : 'ja';
    }
    updateLanguageUI();
}

function toggleLang() {
    currentLang = (currentLang === 'ja') ? 'en' : 'ja';
    localStorage.setItem(CONSTANTS.STORAGE_KEYS.LANG, currentLang);
    updateLanguageUI();
    renderLeaders();
}

function updateLanguageUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    const targetTimeInput = document.getElementById('targetTime');
    if (currentLang === 'en') {
        targetTimeInput.placeholder = "Ex. 18:45:00";
        document.getElementById('customMessage').placeholder = "Additional message (Optional, Max 100 chars)";
    } else {
        targetTimeInput.placeholder = "例 18:45:00";
        document.getElementById('customMessage').placeholder = "追加メッセージ（任意・最大100文字）";
    }
}

// --- UI レンダリング ---
function renderLeaders() {
    const container = document.getElementById('leaders-container');
    container.innerHTML = '';
    leaders.forEach((leader) => {
        const div = document.createElement('div');
        div.className = 'leader-row';
        div.innerHTML = `
            <div class="drag-handle">≡</div>
            <input type="text" class="name-input" placeholder="${t('leaderNamePlaceholder')}" value="${leader.name}" oninput="saveLeaders()">
            <div class="unit">${t('timeRemaining')}</div>
            <input type="tel" class="sec-input" placeholder="${t('secUnit')}" value="${leader.sec}" oninput="saveLeaders()">
            <div class="unit">${t('secUnit')}</div>
            <button class="delete-btn" onclick="deleteLeader(this)">×</button>
        `;
        container.appendChild(div);
    });
}

function selectRally(min, btn) {
    selectedRallyMin = min;
    document.querySelectorAll('.rally-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function showResult(text) {
    document.getElementById('result-box').innerText = text;
    copyResult();
}

function copyResult() {
    const text = document.getElementById('result-box').innerText;
    if (!text || text === "計算結果がここに表示されます") return;

    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }).catch(err => {
        alert("コピーに失敗しました。手動でコピーしてください。");
    });
}

// --- ユーティリティ ---
function formatName(name) {
    const trimmed = name.trim();
    return trimmed.length > CONSTANTS.MAX_LEADER_NAME_LEN
        ? trimmed.substring(0, CONSTANTS.MAX_LEADER_NAME_LEN)
        : trimmed;
}

function formatTime(date) {
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return (currentLang === 'en') ? `${m}m${s}s` : `${m}分${s}秒`;
}

function formatLandingTime(date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function parseTimeInput(str) {
    str = str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));

    const parts = str.split(/[^0-9]+/).filter(s => s !== "").map(Number);

    if (parts.length === 0) return null;

    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (parts.length >= 3) {
        d.setHours(parts[0], parts[1], parts[2]);
    } else if (parts.length === 2) {
        d.setHours(0, parts[0], parts[1]);
    } else if (parts.length === 1) {
        const numStr = parts[0].toString();
        if (numStr.length === 6) {
            d.setHours(parseInt(numStr.substring(0, 2)), parseInt(numStr.substring(2, 4)), parseInt(numStr.substring(4, 6)));
        } else if (numStr.length === 4) {
            d.setHours(0, parseInt(numStr.substring(0, 2)), parseInt(numStr.substring(2, 4)));
        } else {
            return null;
        }
    } else {
        return null;
    }
    return d;
}

// --- 出力生成ロジック ---
function generateOutputText(activeLeaders, rallyMin, landingTime, resultItems) {
    let output;
    if (rallyMin === 0) {
        output = (currentLang === 'en') ? "Solo\n" : "単騎\n";
    } else {
        output = (currentLang === 'en') ? `${rallyMin}m Rally\n` : `${rallyMin}分集結\n`;
    }

    const secUnit = (currentLang === 'en') ? 's' : '秒';
    resultItems.forEach(item => {
        output += `${formatName(item.name)}（${item.sec}${secUnit}）　${formatTime(item.startTime)}\n`;
    });

    const landingLabel = (currentLang === 'en') ? "Landing Time" : "着弾時間";
    output += `\n${landingLabel} ${formatLandingTime(landingTime)}`;

    const customMsg = document.getElementById('customMessage').value;
    if (customMsg) {
        output += `\n\n${customMsg}`;
    }

    output += CONSTANTS.FIXED_FOOTER;

    return output;
}

// --- 計算処理 ---
function calcFromTarget() {
    saveLeaders();
    const inputStr = document.getElementById('targetTime').value;
    const targetDate = parseTimeInput(inputStr);

    if (!targetDate) {
        alert("時間は HH:mm:ss 形式で入力してください\n例：18:45:00");
        return;
    }

    const active = getActiveLeaders();
    if (active.length === 0) {
        alert("リーダー名と秒数を入力してください");
        return;
    }

    const rallySec = selectedRallyMin * 60;
    const resultItems = active.map(l => {
        const dist = parseInt(l.sec);
        const startTimestamp = targetDate.getTime() - (dist * 1000) - (rallySec * 1000);
        return {
            name: l.name,
            sec: l.sec,
            startTime: new Date(startTimestamp)
        };
    });

    const output = generateOutputText(active, selectedRallyMin, targetDate, resultItems);
    showResult(output);
}

function calcFromDelay(delaySec) {
    saveLeaders();
    const active = getActiveLeaders();
    if (active.length === 0) {
        alert("リーダー名と秒数を入力してください");
        return;
    }

    const distances = active.map(l => parseInt(l.sec));
    const minDist = Math.min(...distances);

    const now = new Date();
    const baseStartTime = new Date(now.getTime() + delaySec * 1000);
    const rallySec = selectedRallyMin * 60;
    const landingTime = new Date(baseStartTime.getTime() + (rallySec * 1000) + (minDist * 1000));

    const resultItems = active.map(l => {
        const dist = parseInt(l.sec);
        const diff = dist - minDist;
        const myStart = new Date(baseStartTime.getTime() - (diff * 1000));
        return {
            name: l.name,
            sec: l.sec,
            startTime: myStart
        };
    });

    const output = generateOutputText(active, selectedRallyMin, landingTime, resultItems);
    showResult(output);
}

// --- 初期化 ---
window.onload = function () {
    initLanguage();
    loadLeaders();
    renderLeaders();
    loadCustomMessage();

    Sortable.create(document.getElementById('leaders-container'), {
        handle: '.drag-handle',
        animation: 150,
        onEnd: function () {
            saveLeaders();
        }
    });
};
