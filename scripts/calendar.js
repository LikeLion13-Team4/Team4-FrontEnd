class AttendanceCalendar {
  constructor(elId) {
    this.container = document.getElementById(elId);
    this.current = new Date(); // 현재 보고 있는 달
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.build();
    this.render();
  }

  build() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar-header">
          <h2 class="calendar-title">
            출석 잔디밭
          </h2>
          <select class="month-select">
            ${this.monthNames
              .map((name, i) => `<option value="${i}">${name}</option>`)
              .join("")}
          </select>
        </div>
        <div class="weekdays">
          ${["S", "M", "T", "W", "T", "F", "S"]
            .map((d) => `<div>${d}</div>`)
            .join("")}
        </div>
        <div class="days"></div>
      </div>
    `;

    this.monthSelect = this.container.querySelector(".month-select");
    this.daysGrid = this.container.querySelector(".days");

    // select 박스 초기값 세팅
    this.monthSelect.value = this.current.getMonth();
    this.monthSelect.addEventListener("change", (e) => {
      this.current.setMonth(+e.target.value);
      // 헤더 타이틀도 갱신
      this.container.querySelector(
        ".calendar-title"
      ).textContent = `출석 잔디밭`;
      this.render();
    });
  }

  // ▶ 더미 API 호출 함수 (Promise 반환)
  // 실제 API 준비되면 이 부분만 fetch 로 교체하세요.
  simulateApiCheck(dateString) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const day = +dateString.split("-")[2];
        resolve({
          isSuccess: true,
          result: day % 3 !== 0, // 예시: 3일마다 false
        });
      }, 30);
    });
  }

  async render() {
    const year = this.current.getFullYear();
    const month = this.current.getMonth();
    const mm = String(month + 1).padStart(2, "0");
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 1) 빈칸 + 날짜 수 만큼 더미 API 호출 모으기
    this.daysGrid.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      this.daysGrid.appendChild(document.createElement("div"));
    }

    const checks = [];
    for (let d = 1; d <= lastDate; d++) {
      const dd = String(d).padStart(2, "0");
      const dateStr = `${year}-${mm}-${dd}`;
      checks.push(
        this.simulateApiCheck(dateStr).then((res) => ({
          day: d,
          attended: res.isSuccess && res.result,
        }))
      );
    }

    // 2) 응답 받고 렌더
    const results = await Promise.all(checks);
    const today = new Date();
    results.forEach(({ day, attended }) => {
      const cell = document.createElement("div");
      cell.textContent = day;
      cell.classList.add("day");

      // 오늘 강조
      if (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
      ) {
        cell.classList.add("today");
      }

      // 출석된 날만 어두운 배경
      if (attended) {
        cell.classList.add("attended");
      }

      this.daysGrid.appendChild(cell);
    });
  }
}

// DOM ready 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  new AttendanceCalendar("attendance-calendar");
});
//
//
//
//
///
//
//
//
//
//
//
//
//d
//식단 등록 부분
