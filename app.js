const KEY = "vocab_words_v2";
let words = [];
const $ = (s) => document.querySelector(s);
const view = $("#view");

// JSON 読み込み
fetch("words.json")
  .then(r => r.json())
  .then(d => {
    words = d;
    save();
    renderLearn();
  }).catch(() => {
    words = JSON.parse(localStorage.getItem(KEY) || "[]");
    renderLearn();
  });

function save() { localStorage.setItem(KEY, JSON.stringify(words)); }

$("#modeLearn").onclick = renderLearn;
$("#modeList").onclick = renderList;
$("#modeAdd").onclick = renderAdd;

// 学習モード（複数意味対応）
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
    const jaList = q.ja.split(",").map(s => s.trim().toLowerCase());
    const ok = jaList.includes(ans);
    $("#result").textContent = ok ? "✅ 正解" : `❌ 正解は ${q.ja}`;
  };
}

// リストモード（編集・削除ボタン付き）
function renderList() {
  if (words.length === 0) return view.innerHTML = "<p>単語がありません</p>";
  view.innerHTML = "<ul>" +
    words.map((w, i) => 
      `<li>${w.en} - ${w.ja} 
        <button data-index="${i}" class="editBtn">編集</button>
        <button data-index="${i}" class="deleteBtn">削除</button>
      </li>`).join("") +
    "</ul>";

  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.onclick = (e) => renderEdit(e.target.dataset.index);
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = (e) => {
      if(confirm("本当に削除しますか？")) {
        words.splice(e.target.dataset.index, 1);
        save();
        renderList();
      }
    };
  });
}

// 単語追加モード
function renderAdd() {
  view.innerHTML = `
    <input id="en" placeholder="英語" />
    <input id="ja" placeholder="日本語（複数ならカンマ区切り）" />
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

// 単語編集モード
function renderEdit(index) {
  const word = words[index];
  view.innerHTML = `
    <input id="en" value="${word.en}" placeholder="英語" />
    <input id="ja" value="${word.ja}" placeholder="日本語（複数ならカンマ区切り）" />
    <button id="saveEdit">保存</button>
    <button id="cancelEdit">キャンセル</button>
  `;
  $("#saveEdit").onclick = () => {
    const en = $("#en").value.trim();
    const ja = $("#ja").value.trim();
    if (!en || !ja) { alert("両方入力してください"); return; }
    words[index] = { en, ja };
    save();
    alert("更新しました");
    renderList();
  };
  $("#cancelEdit").onclick = renderList;
}
