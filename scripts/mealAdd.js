document.addEventListener("DOMContentLoaded", () => {
  // — 더미 GET 데이터 (나중에 fetch로 교체) —
  const savedItems = [
    {
      mealId: 1,
      date: "2025-07-08",
      menu: "양념 치킨 2마리",
      description: "치킨만 먹음",
      calories: 1200,
      carbs: 30,
      protein: 80,
      fat: 70,
    },
    {
      mealId: 2,
      date: "2025-07-09",
      menu: "샐러드",
      description: "",
      calories: 350,
      carbs: 20,
      protein: 15,
      fat: 10,
    },
    {
      mealId: 3,
      date: "2025-07-05",
      menu: "샐러드",
      description: "",
      calories: 350,
      carbs: 20,
      protein: 15,
      fat: 10,
    },
    // …추가 더미 데이터…
  ];

  // 1) AttendanceCalendar 초기화
  new AttendanceCalendar("attendance-calendar", [
    "2025-06-01",
    "2025-06-02",
    "2025-06-03",
    /*…*/ "2025-06-29",
  ]);

  // 2) 위쪽 주간 네비게이션 & 식단 렌더링
  const header = document.querySelector(".mp-weekdays");
  const cols = document.querySelectorAll(".mp-col");
  const prevBtn = document.querySelector(".calendar-side-nav.nav-prev");
  const nextBtn = document.querySelector(".calendar-side-nav.nav-next");
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  let weekOffset = 0; // today 기준 이동일수

  function renderWeek() {
    header.innerHTML = "";
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 2 + weekOffset);

    // A) 헤더 요일 렌더
    for (let i = 0; i < cols.length; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const div = document.createElement("div");
      div.classList.add("day");
      if (weekOffset === 0 && d.toDateString() === today.toDateString()) {
        div.classList.add("active");
      }
      div.textContent = `${weekdays[d.getDay()]} ${d.getDate()}`;
      header.appendChild(div);
    }

    // B) 각 컬럼에 날짜, 저장된 식단, + 버튼 렌더
    cols.forEach((col, idx) => {
      // (1) 날짜 계산 & dataset 설정
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + idx);
      const iso = d.toISOString().slice(0, 10);
      col.dataset.date = iso;
      col.innerHTML = "";

      // (2) savedItems 렌더
      savedItems
        .filter((item) => item.date === iso)
        .forEach((item) => {
          const slot = document.createElement("div");
          slot.className = "slot item";
          slot.innerHTML = `
            <div class="food">${item.menu}</div>
            ${
              item.description
                ? `<div class="note">${item.description}</div>`
                : ""
            }
          `;
          col.appendChild(slot);
        });

      // (3) + 버튼 추가
      const plus = document.createElement("div");
      plus.className = "slot empty";
      plus.textContent = "+";
      col.appendChild(plus);
    });
  }

  // — nav 버튼: “한 윈도우(컬럼 개수)씩” 이동하도록 변경 —
  prevBtn.addEventListener("click", () => {
    weekOffset -= cols.length; // cols.length === 6 이므로, 6일씩 뒤로
    renderWeek();
  });
  nextBtn.addEventListener("click", () => {
    weekOffset += cols.length;
    renderWeek();
  });
  renderWeek();

  // 3) 모달 열기/닫기 & POST 로직
  const modal = document.getElementById("modal");
  const foodInput = document.getElementById("foodInput");
  const noteInput = document.getElementById("noteInput");
  const calorieInput = document.getElementById("calorieInput");
  const carbInput = document.getElementById("carbInput");
  const proteinInput = document.getElementById("proteinInput");
  const fatInput = document.getElementById("fatInput");
  const cancelBtn = modal.querySelector(".cancel");
  const addBtn = modal.querySelector(".add");
  let activeCol = null;

  // + 버튼 클릭 → 모달 열기
  document.body.addEventListener("click", (e) => {
    const slot = e.target.closest(".slot.empty");
    if (!slot) return;
    activeCol = slot.closest(".mp-col");
    openModal();
  });

  // 모달 닫기
  cancelBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  // 추가 버튼 클릭 → 화면 삽입 + POST
  addBtn.onclick = async () => {
    const food = foodInput.value.trim();
    if (!food) {
      foodInput.focus();
      return;
    }
    const note = noteInput.value.trim();
    const calories = parseInt(calorieInput.value) || 0;
    const carbs = parseInt(carbInput.value) || 0;
    const protein = parseInt(proteinInput.value) || 0;
    const fat = parseInt(fatInput.value) || 0;
    const date = activeCol.dataset.date;

    // 화면에 슬롯 추가
    const slotDiv = document.createElement("div");
    slotDiv.className = "slot item";
    slotDiv.innerHTML = `
      <div class="food">${food}</div>
      ${note ? `<div class="note">${note}</div>` : ""}
    `;
    const plus = activeCol.querySelector(".slot.empty");
    activeCol.insertBefore(slotDiv, plus);

    // POST 요청
    try {
      const payload = {
        date,
        menu: food,
        description: note,
        calories,
        carbs,
        protein,
        fat,
      };
      const res = await fetch("https://localhost8080.com/api/v1/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      console.log("식단 저장 성공:", payload);
    } catch (err) {
      console.error("식단 저장 실패:", err);
      // TODO: 사용자에게 오류 UI 표시
    }

    closeModal();
  };

  function openModal() {
    modal.style.display = "flex";
    [
      foodInput,
      noteInput,
      calorieInput,
      carbInput,
      proteinInput,
      fatInput,
    ].forEach((i) => (i.value = ""));
    foodInput.focus();
  }
  function closeModal() {
    modal.style.display = "none";
  }

  // 4) FullCalendar 초기화 (기존 그대로)
  const el = document.getElementById("attendance-calendar");
  const calendar = new FullCalendar.Calendar(el, {
    plugins: [FullCalendar.DayGridPlugin],
    initialView: "dayGridMonth",
    headerToolbar: false,
    showNonCurrentDates: false,
    height: "auto",
    events: [
      {
        start: "2025-06-22",
        display: "background",
        backgroundColor: "#5c5452",
      },
      {
        start: "2025-06-23",
        display: "background",
        backgroundColor: "#5c5452",
      },
      // …실제 출석일 데이터로 교체…
    ],
  });
  calendar.render();
});
