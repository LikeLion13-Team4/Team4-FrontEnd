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
