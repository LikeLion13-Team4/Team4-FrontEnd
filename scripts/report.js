const monthNames = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

let currentDate = new Date();

// 요소 참조
const monthNameEl = document.getElementById("monthName");
const yearEl = document.getElementById("year");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

// 월 이름 & 연도 표시 업데이트
function updateMonthDisplay() {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  monthNameEl.textContent = monthNames[month];
  yearEl.textContent = year;
  renderCalendar();
}

// 이전/다음 버튼 이벤트
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthDisplay();
});
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthDisplay();
});

// 달력 렌더링 함수
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 일~토: 0~6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarBody = document.getElementById("calendar-body");
  calendarBody.innerHTML = ""; // 초기화

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay) {
        cell.innerHTML = ""; // 빈 칸
      } else if (date <= daysInMonth) {
        const span = document.createElement("div");
        span.classList.add("day");
        span.innerText = date;
        cell.appendChild(span);
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

// 초기 실행
updateMonthDisplay();
function updateDonutGraph(carbs, protein, fat) {
  const total = carbs + protein + fat;
  const carbPercent = (carbs / total) * 100;
  const proteinPercent = (protein / total) * 100;
  const fatPercent = 100 - carbPercent - proteinPercent;

  const donut = document.getElementById("donut");
  const outerRadius = 135;
  const innerRadius = 90 / 2; // .donut::before 의 중심 반지름
  const labelRadius = (outerRadius + innerRadius) / 2;
  const centerX = outerRadius;
  const centerY = outerRadius;

  // 배경 업데이트
  donut.style.background = `conic-gradient(
    #5c5452 0% ${carbPercent}%,
    #bba9a5 ${carbPercent}% ${carbPercent + proteinPercent}%,
    #dbd0cd ${carbPercent + proteinPercent}% 100%
  )`;

  function setLabelPosition(selector, startPercent, segmentPercent) {
    const angle = (startPercent + segmentPercent / 2) * 3.6;
    const rad = (angle - 90) * (Math.PI / 180); // 위쪽(12시) 기준 보정

    const x = centerX + labelRadius * Math.cos(rad);
    const y = centerY + labelRadius * Math.sin(rad);

    const label = donut.querySelector(selector);
    label.style.left = `${x}px`;
    label.style.top = `${y}px`;
  }

  setLabelPosition(".label-carb", 0, carbPercent);
  setLabelPosition(".label-protein", carbPercent, proteinPercent);
  setLabelPosition(".label-fat", carbPercent + proteinPercent, fatPercent);
}
