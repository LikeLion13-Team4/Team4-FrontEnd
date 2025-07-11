// report_api_integration.js
// Frontend integration: fetch report data through AccessAPI and update DOM elements matching JSON keys

// Ensure AccessAPI is loaded before this script

async function loadReport() {
  try {
    const data = await AccessAPI.apiFetch("/api/v1/report", {
      method: "GET",
    });

    if (!data.isSuccess) {
      console.error(`API Error (${data.code}): ${data.message}`);
      return;
    }

    const {
      totalCalories,
      averageCalories,
      carbsRatio,
      proteinRatio,
      fatRatio,
      feedbackText,
    } = data.result;

    // DOM 반영
    document.getElementById("totalCalories").textContent = totalCalories;
    document.getElementById("averageCalories").textContent = averageCalories;
    document.getElementById("carbsRatio").textContent = `${carbsRatio}%`;
    document.getElementById("proteinRatio").textContent = `${proteinRatio}%`;
    document.getElementById("fatRatio").textContent = `${fatRatio}%`;
    document.getElementById("feedbackText").textContent = feedbackText;

    // 숫자 변환 후 도넛 반영
    const carbs = parseFloat(carbsRatio);
    const protein = parseFloat(proteinRatio);
    const fat = parseFloat(fatRatio);

    updateDonutGraph(carbs, protein, fat);
  } catch (error) {
    if (error.message === "Unauthorized") return;
    console.error("Failed to load report:", error);
  }
}

// 초기 실행
window.addEventListener("DOMContentLoaded", () => {
  loadReport();
  updateMonthDisplay(); // 월 표시 등 다른 UI 초기화
});

function updateDonutGraph(carbs, protein, fat) {
  const total = carbs + protein + fat;
  const carbPercent = (carbs / total) * 100;
  const proteinPercent = (protein / total) * 100;
  const fatPercent = 100 - carbPercent - proteinPercent;

  const donut = document.getElementById("donut");
  const outerRadius = 135;
  const innerRadius = 90 / 2;
  const labelRadius = (outerRadius + innerRadius) / 2;
  const centerX = outerRadius;
  const centerY = outerRadius;

  // 도넛 배경 설정 (문자열로!)
  donut.style.background = `conic-gradient(
    #5c5452 0% ${carbPercent}%,
    #bba9a5 ${carbPercent}% ${carbPercent + proteinPercent}%,
    #dbd0cd ${carbPercent + proteinPercent}% 100%
  )`;

  function setLabelPosition(selector, startPercent, segmentPercent) {
    const angle = (startPercent + segmentPercent / 2) * 3.6;
    const rad = (angle - 90) * (Math.PI / 180);
    const x = centerX + labelRadius * Math.cos(rad);
    const y = centerY + labelRadius * Math.sin(rad);
    const label = donut.querySelector(selector);
    if (label) {
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
    }
  }

  setLabelPosition(".label-carb", 0, carbPercent);
  setLabelPosition(".label-protein", carbPercent, proteinPercent);
  setLabelPosition(".label-fat", carbPercent + proteinPercent, fatPercent);
}

// report_api_integration.js

// 0) 회원 정보(닉네임) 불러와서 report-name 업데이트
async function loadMember() {
  try {
    const res = await AccessAPI.apiFetch("/api/v1/members", { method: "GET" });
    if (res.isSuccess && res.result) {
      const { nickname } = res.result;
      const el = document.getElementById("report-name");
      if (el && nickname) {
        el.textContent = nickname;
      }
    } else {
      console.error(`멤버 조회 실패 (${res.code}): ${res.message}`);
    }
  } catch (err) {
    console.error("멤버 조회 중 오류:", err);
  }
}

// 1) 화면에 리포트 결과를 반영하는 공통 함수
function renderReport(result) {
  /* ... 기존 renderReport 그대로 ... */
}

// 2) 기존 리포트 불러오기 (GET)
async function loadReport() {
  /* ... 기존 loadReport 그대로 ... */
}

// 3) 새 리포트 생성 (POST)
async function createReport() {
  /* ... 기존 createReport 그대로 ... */
}

// 4) 도넛 그래프 그리는 함수
function updateDonutGraph(carbs, protein, fat) {
  /* ... 기존 updateDonutGraph 그대로 ... */
}

// 5) 초기 실행 및 버튼 바인딩
window.addEventListener("DOMContentLoaded", () => {
  // 5-1) 닉네임 먼저 가져와서 반영
  loadMember();

  // 5-2) 리포트 로드
  loadReport();
  updateMonthDisplay();

  // 5-3) 리포트 만들기 버튼
  const createBtn = document.querySelector(".generate-report");
  if (createBtn) {
    createBtn.addEventListener("click", createReport);
  }
});
