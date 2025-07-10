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
