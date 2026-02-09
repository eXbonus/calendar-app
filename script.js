const calendar = document.getElementById("calendar");
const monthSel = document.getElementById("month");
const yearSel = document.getElementById("year");
const popup = document.getElementById("popup");
const notePreview = document.getElementById("notePreview");

let currentKey = "";
let currentMark = null;

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ---------- Populate selectors ---------- */

months.forEach((m, i) => {
let o = document.createElement("option");
o.value = i;
o.textContent = m;
monthSel.appendChild(o);
});

for (let y = 2020; y <= 2035; y++) {
let o = document.createElement("option");
o.value = y;
o.textContent = y;
yearSel.appendChild(o);
}

monthSel.value = new Date().getMonth();
yearSel.value = new Date().getFullYear();

/* ---------- Calendar renderer ---------- */

function loadCalendar() {
calendar.innerHTML = "";

let m = Number(monthSel.value);
let y = Number(yearSel.value);
let daysInMonth = new Date(y, m + 1, 0).getDate();

for (let d = 1; d <= daysInMonth; d++) {
let dateObj = new Date(y, m, d);
let dayName = days[dateObj.getDay()];

let box = document.createElement("div");
box.className = "day";

/* Highlight today */
let today = new Date();
if (
  d === today.getDate() &&
  m === today.getMonth() &&
  y === today.getFullYear()
) {
  box.classList.add("today");
}  

let dayLabel = document.createElement("div");  
dayLabel.className = "day-name";  
dayLabel.textContent = dayName;  
if (dayName === "Sun") dayLabel.classList.add("sunday");  

let num = document.createElement("div");  
num.className = "day-number";  
num.textContent = d;  

let mark = document.createElement("div");  
mark.className = "mark";  

let key = `${y}_${m}_${d}`;  
let saved = localStorage.getItem(key);  

if (saved === "✔" || saved === "✖") {  
  mark.textContent = saved;  
  mark.style.color = saved === "✔" ? "green" : "red";  
}  

// note indicator on calendar  
if (localStorage.getItem(key + "_note")) {  
  box.style.border = "2px solid #7aa7ff";  
}  

box.onclick = () => {  
  currentKey = key;  
  currentMark = mark;  

  // show note preview if exists  
    let note = localStorage.getItem(currentKey + "_note");

if (note) {
notePreview.textContent = note;
notePreview.style.display = "block";
} else {
notePreview.textContent = "";
notePreview.style.display = "none";
}

popup.style.display = "flex";  
};  

box.append(dayLabel, num, mark);  
calendar.appendChild(box);

}
}

/* ---------- Mark handling ---------- */

function setMark(val) {
if (!currentKey || !currentMark) return;

if (val === "") {
currentMark.textContent = "";
localStorage.removeItem(currentKey);
} else {
currentMark.textContent = val;
currentMark.style.color = val === "✔" ? "green" : "red";
localStorage.setItem(currentKey, val);
}

closePopup();
}

function closePopup() {
popup.style.display = "none";
}

/* ---------- Notes ---------- */

function openNote() {
if (!currentKey) return;

let existing = localStorage.getItem(currentKey + "_note") || "";
let text = prompt("Add note for this date:", existing);

if (text !== null) {
if (text.trim() === "") {
localStorage.removeItem(currentKey + "_note");
} else {
localStorage.setItem(currentKey + "_note", text.trim());
}
}

closePopup();
loadCalendar();
}

/* ---------- Export to Excel ---------- */

function exportExcel() {
let rows = ["Year,Month,Date,Mark,Note"];

for (let i = 0; i < localStorage.length; i++) {
let key = localStorage.key(i);
let val = localStorage.getItem(key);

if (val === "✔" || val === "✖") {  
  let [y, m, d] = key.split("_");  
  let note = localStorage.getItem(key + "_note") || "";  
  rows.push(  
    `${y},${Number(m) + 1},${d},${val},"${note.replace(/"/g, '""')}"`  
  );  
}

}

let blob = new Blob([rows.join("\n")], { type: "text/csv" });
let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "calendar_data.csv";
a.click();
}

/* ---------- Events ---------- */

monthSel.onchange = loadCalendar;
yearSel.onchange = loadCalendar;

/* ---------- Init ---------- */

loadCalendar();