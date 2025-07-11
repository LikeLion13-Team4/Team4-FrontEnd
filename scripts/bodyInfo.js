document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("birth-year");
  const monthSelect = document.getElementById("birth-month");
  const daySelect = document.getElementById("birth-day");

  // 1) 연도 옵션 채우기 (1900 ~ 올해)
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.text = `${y}년`;
    yearSelect.append(opt);
  }

  // 2) 월 옵션 채우기 (1 ~ 12)
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.text = `${m}월`;
    monthSelect.append(opt);
  }

  // 3) 일 옵션 채우기 함수
  function populateDays() {
    const year = parseInt(yearSelect.value, 10);
    const month = parseInt(monthSelect.value, 10);
    // JS 월은 0-11, 일 수 계산 위해 다음 달 0일로
    const daysInMonth = new Date(year, month, 0).getDate();
    daySelect.innerHTML = ""; // 초기화
    for (let d = 1; d <= daysInMonth; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.text = `${d}일`;
      daySelect.append(opt);
    }
  }

  // 4) 연·월 변경 시 일 갱신
  yearSelect.addEventListener("change", populateDays);
  monthSelect.addEventListener("change", populateDays);

  // 초기값 세팅: 현재 연·월로 일 채우기
  yearSelect.value = currentYear;
  monthSelect.value = new Date().getMonth() + 1;
  populateDays();
});
