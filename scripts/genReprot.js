// report_api_integration.js
// Frontend integration: fetch report data through AccessAPI and update DOM elements matching JSON keys
// 1) 화면에 리포트 결과를 반영하는 공통 함수
function renderReport(result) {
  const {
    totalCalories,
    averageCalories,
    carbsRatio,
    proteinRatio,
    fatRatio,
    feedbackText,
  } = result;

  document.getElementById("totalCalories").textContent = totalCalories;
  document.getElementById("averageCalories").textContent = averageCalories;
  document.getElementById("carbsRatio").textContent = `${carbsRatio}%`;
  document.getElementById("proteinRatio").textContent = `${proteinRatio}%`;
  document.getElementById("fatRatio").textContent = `${fatRatio}%`;
  document.getElementById("feedbackText").textContent = feedbackText;

  // 도넛 그래프 업데이트
  const carbs = parseFloat(carbsRatio);
  const protein = parseFloat(proteinRatio);
  const fat = parseFloat(fatRatio);
  updateDonutGraph(carbs, protein, fat);
}

// 2) 기존 리포트 불러오기 (GET)
async function loadReport() {
  try {
    const data = await AccessAPI.apiFetch("/api/v1/report", { method: "GET" });
    if (!data.isSuccess) {
      console.error(`API Error (${data.code}): ${data.message}`);
      return;
    }
    renderReport(data.result);
  } catch (error) {
    if (error.message === "Unauthorized") return;
    console.error("Failed to load report:", error);
  }
}

// 2) 기존 리포트 불러오기 (GET)
async function loadReport() {
  try {
    const data = await AccessAPI.apiFetch("/api/v1/report", { method: "GET" });
    if (!data.isSuccess) {
      console.error(`API Error (${data.code}): ${data.message}`);
      return;
    }
    renderReport(data.result);
  } catch (error) {
    if (error.message === "Unauthorized") return;
    console.error("Failed to load report:", error);
  }
}

// 3) 새 리포트 생성 (POST)
async function createReport() {
  // today 객체(오늘)
  const today = new Date();

  // endDate = 오늘 (YYYY-MM-DD)
  const endDate = today.toISOString().slice(0, 10);

  // startDate = today - 7일
  const startObj = new Date(today);
  startObj.setDate(startObj.getDate() - 7);
  const startDate = startObj.toISOString().slice(0, 10);

  console.log(
    "📅 createReport 요청 - startDate:",
    startDate,
    "endDate:",
    endDate
  );

  try {
    const data = await AccessAPI.apiFetch("/api/v1/report", {
      method: "POST",
      body: JSON.stringify({ startDate, endDate }),
    });

    console.log("◀ POST /report 응답:", data);
    if (!data.isSuccess) {
      console.error(`Create Error (${data.code}): ${data.message}`);
      alert("리포트 생성에 실패했습니다.");
      return;
    }
    renderReport(data.result);
  } catch (error) {
    console.error("Failed to create report:", error);
    alert("리포트 생성 중 오류가 발생했습니다.");
  }
}

// 4) 도넛 그래프 그리는 함수 (기존 그대로)
function updateDonutGraph(carbs, protein, fat) {
  const total = carbs + protein + fat;
  const carbPercent = (carbs / total) * 100;
  const proteinPercent = (protein / total) * 100;
  const fatPercent = 100 - carbPercent - proteinPercent;

  const donut = document.getElementById("donut");
  const outerRadius = 135;
  const innerRadius = 45; // 90/2
  const labelRadius = (outerRadius + innerRadius) / 2;
  const centerX = outerRadius;
  const centerY = outerRadius;

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

// 5) 초기 실행 및 버튼 바인딩
window.addEventListener("DOMContentLoaded", () => {
  loadReport();
  updateMonthDisplay();

  const createBtn = document.querySelector(".generate-report");
  console.log("🔎 createBtn 요소:", createBtn); // 버튼이 제대로 선택되는지
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      console.log("🎛️ ‘리포트 만들기’ 버튼 클릭됨");
      createReport();
    });
  } else {
    console.error("🚨 .generate-report 버튼을 찾을 수 없습니다!");
  }
});
