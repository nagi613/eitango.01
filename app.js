const KEY = "vocab_words_v1";
let words = JSON.parse(localStorage.getItem(KEY) || "[]");
let wrongWords = JSON.parse(localStorage.getItem(KEY+"_wrong") || "[]");

const $ = s => document.querySelector(s);
const view = $("#view");
const cursor = document.getElementById('cursor');

// ===== カーソル追従 =====
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ===== 初回ロード =====
if (words.length === 0) {
  fetch("words.json")
    .then(r => r.json())
    .then(d => { words = d; save(); renderLearn(); });
} else {
  renderLearn();
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(words));
  localStorage.setItem(KEY+"_wrong", JSON.stringify(wrongWords));
}

// ===== ボタン設定 =====
$("#modeLearn").onclick = renderLearn;
$("#modeList").onclick = renderList;
$("#modeAdd").onclick = renderAdd;

// ===== 学習モード =====
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
    const ok = q.ja.some(j => j.toLowerCase() === ans);
    $("#result").textContent = ok ? "✅ 正解" : `❌ 正解は ${q.ja.join(", ")}`;

    if (!ok) {
      let w = wrongWords.find(w => w.en === q.en);
      if (!w) wrongWords.push({ ...q, count: 0 });
    } else {
      // 正解ならカウント増やす
      let w = wrongWords.find(w => w.en === q.en);
      if (w) {
        w.count = (w.count || 0) + 1;
        if (w.count >= 3) wrongWords = wrongWords.filter(ww => ww.en !== w.en);
      }
    }
    save();
  };
}

// ===== リスト表示 =====
function renderList() {
  if (words.length === 0) return view.innerHTML = "<p>単語がありません</p>";

  view.innerHTML = "<ul>" + words.map((w, i) => `
    <li>
      <span>${w.en} - ${w.ja.join(", ")}</span>
      <span>
        <button class="editBtn" data-id="${i}">編集</button>
        <button class="deleteBtn" data-id="${i}">削除</button>
      </span>
    </li>
  `).join("") + "</ul>";

  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.id;
      const w = words[i];
      view.innerHTML = `
        <input id="en" value="${w.en}" />
        <input id="ja" value="${w.ja.join(",")}" />
        <button id="saveEdit">保存</button>
        <button id="cancelEdit">キャンセル</button>
      `;
      $("#saveEdit").onclick = () => {
        w.en = $("#en").value.trim();
        w.ja = $("#ja").value.split(",").map(s => s.trim());
        save();
        renderList();
      };
      $("#cancelEdit").onclick = renderList;
    };
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.id;
      if(confirm("本当に削除しますか？")) {
        words.splice(i, 1);
        save();
        renderList();
      }
    };
  });
}

// ===== 追加モード =====
function renderAdd() {
  view.innerHTML = `
    <input id="en" placeholder="英語" />
    <input id="ja" placeholder="日本語（カンマ区切りで複数）" />
    <button id="add">追加</button>
  `;
  $("#add").onclick = () => {
    const en = $("#en").value.trim();
    const ja = $("#ja").value.split(",").map(s => s.trim());
    words.push({ en, ja });
    save();
    alert("追加しました");
    renderList();
  };
}
