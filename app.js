const KEY = "vocab_words_v1";
let words = JSON.parse(localStorage.getItem(KEY) || "[]");
let wrongWords = JSON.parse(localStorage.getItem(KEY+"_wrong") || "{}");

const $ = (s) => document.querySelector(s);
const view = $("#view");

// 初回ロード時
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

$("#modeLearn").onclick = renderLearn;
$("#modeList").onclick = renderList;
$("#modeAdd").onclick = renderAdd;

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
    if(ok){
      $("#result").textContent = "✅ 正解";
      if(wrongWords[q.en]){
        wrongWords[q.en]++;
        if(wrongWords[q.en]>=3) delete wrongWords[q.en];
      }
      save();
      setTimeout(renderLearn,800);
    } else {
      $("#result").textContent = `❌ 正解は ${q.ja.join(", ")}`;
      wrongWords[q.en] = wrongWords[q.en] || 0;
      wrongWords[q.en]++;
      save();
    }
  };
}

function renderList() {
  if(words.length===0) return view.innerHTML="<p>単語がありません</p>";
  view.innerHTML = "<ul>" + words.map((w,i)=>`
    <li>
      ${w.en} - ${w.ja.join(", ")}
      <div>
        <button class="editBtn" data-i="${i}">編集</button>
        <button class="deleteBtn" data-i="${i}">削除</button>
      </div>
    </li>
  `).join("") + "</ul>";

  document.querySelectorAll(".deleteBtn").forEach(b=>{
    b.onclick=()=>{
      const i= b.dataset.i;
      if(confirm("削除しますか？")) words.splice(i,1);
      save(); renderList();
    };
  });

  document.querySelectorAll(".editBtn").forEach(b=>{
    b.onclick=()=>{
      const i=b.dataset.i;
      const w=words[i];
      view.innerHTML=`
        <input id="en" value="${w.en}" />
        <input id="ja" value="${w.ja.join(",")}" />
        <button id="saveEdit">保存</button>
        <button id="cancelEdit">キャンセル</button>
      `;
      $("#saveEdit").onclick=()=>{
        words[i]={en: $("#en").value, ja: $("#ja").value.split(",").map(s=>s.trim())};
        save(); renderList();
      };
      $("#cancelEdit").onclick=renderList;
    };
  });
}

function renderAdd() {
  view.innerHTML=`
    <input id="en" placeholder="英語" />
    <input id="ja" placeholder="日本語（複数はカンマ区切り）" />
    <button id="add">追加</button>
  `;
  $("#add").onclick=()=>{
    words.push({en: $("#en").value, ja: $("#ja").value.split(",").map(s=>s.trim())});
    save(); alert("追加しました"); renderList();
  };
}

// ===== カーソル追従 =====
const cursor = document.getElementById('cursor');
