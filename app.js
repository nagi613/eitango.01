const KEY = "vocab_words_v1";

// 高校基礎単語50語を直接配列に組み込み
let words = [
  { "en": "apple",      "ja": "りんご" },
  { "en": "book",       "ja": "本" },
  { "en": "school",     "ja": "学校" },
  { "en": "teacher",    "ja": "先生" },
  { "en": "student",    "ja": "生徒" },
  { "en": "class",      "ja": "授業" },
  { "en": "friend",     "ja": "友達" },
  { "en": "family",     "ja": "家族" },
  { "en": "mother",     "ja": "母" },
  { "en": "father",     "ja": "父" },
  { "en": "brother",    "ja": "兄／弟" },
  { "en": "sister",     "ja": "姉／妹" },
  { "en": "eat",        "ja": "食べる" },
  { "en": "drink",      "ja": "飲む" },
  { "en": "play",       "ja": "遊ぶ／演奏する／試合する" },
  { "en": "study",      "ja": "勉強する" },
  { "en": "read",       "ja": "読む" },
  { "en": "write",      "ja": "書く" },
  { "en": "speak",      "ja": "話す" },
  { "en": "listen",     "ja": "聞く" },
  { "en": "go",         "ja": "行く" },
  { "en": "come",       "ja": "来る" },
  { "en": "see",        "ja": "見る" },
  { "en": "look",       "ja": "見る／見つめる" },
  { "en": "know",       "ja": "知っている" },
  { "en": "think",      "ja": "考える" },
  { "en": "beautiful",  "ja": "美しい" },
  { "en": "difficult",  "ja": "難しい" },
  { "en": "important",  "ja": "重要な" },
  { "en": "future",     "ja": "未来" },
  { "en": "world",      "ja": "世界" },
  { "en": "morning",    "ja": "朝" },
  { "en": "night",      "ja": "夜" },
  { "en": "day",        "ja": "日／昼" },
  { "en": "week",       "ja": "週" },
  { "en": "month",      "ja": "月" },
  { "en": "year",       "ja": "年" },
  { "en": "time",       "ja": "時間" },
  { "en": "money",      "ja": "お金" },
  { "en": "car",        "ja": "車" },
  { "en": "train",      "ja": "電車" },
  { "en": "bus",        "ja": "バス" },
  { "en": "airplane",   "ja": "飛行機" },
  { "en": "dog",        "ja": "犬" },
  { "en": "cat",        "ja": "猫" },
  { "en": "bird",       "ja": "鳥" },
  { "en": "fish",       "ja": "魚" },
  { "en": "rain",       "ja": "雨" },
  { "en": "snow",       "ja": "雪" },
  { "en": "sun",        "ja": "太陽" },
  { "en": "moon",       "ja": "月" },
  { "en": "star",       "ja": "星" },
  { "en": "water",      "ja": "水" },
  { "en": "fire",       "ja": "火" }
];

const $ = (s) => document.querySelector(s);
const view = $("#view");

function save() { localStorage.setItem(KEY, JSON.stringify(words)); }

// 初回ロード
renderLearn();

// モード切り替え
$("#modeLearn").onclick = renderLearn;
$("#modeList").onclick = renderList;
$("#modeAdd").onclick = renderAdd;

// 学習モード
function renderLearn() {
  if (words.length === 0) return view.innerHTML = "<p>単語がありません</p>";
  const q = words[Math.floor(Math.random() * words.length)];
  view.innerHTML = `
    <h2>${q.en}</h2>
    <input id="answer" placeholder="答えは？" />
    <button id="check">答え合わせ</button>
    <p id="result"></p>
  `;
  $("#check").onclick = () => {
    const ans = $("#answer").value.trim().toLowerCase();
    const ok = ans === q.ja.toLowerCase();
    $("#result").textContent = ok ? "✅ 正解" : `❌ 正解は ${q.ja}`;
  };
}

// リスト表示モード
function renderList() {
  view.innerHTML = "<ul>" +
    words.map(w => `<li>${w.en} - ${w.ja}</li>`).join("") +
    "</ul>";
}

// 単語追加モード
function renderAdd() {
  view.innerHTML = `
    <input id="en" placeholder="英語" />
    <input id="ja" placeholder="日本語" />
    <button id="add">追加</button>
  `;
  $("#add").onclick = () => {
    const en = $("#en").value.trim();
    const ja = $("#ja").value.trim();
    if (!en || !ja) { alert("両方入力してください"); return; }
    words.push({ en, ja });
    save();
    alert("追加しました");
    renderList();
  };
}
