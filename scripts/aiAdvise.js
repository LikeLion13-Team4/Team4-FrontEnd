window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("getAdviceButton");
  if (!button) {
    console.warn("버튼 못 찾음");
    return;
  }

  button.addEventListener("click", async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const body = { startDate: today, endDate: today };

      const response = await AccessAPI.apiFetch("/api/v1/report/feedback", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.isSuccess) {
        console.error(`AI 피드백 실패: ${response.message}`);
        return;
      }

      document.getElementById("feedbackText").innerHTML = response.result;
    } catch (err) {
      console.error("AI 영양사 API 호출 중 오류:", err);
    }
  });
});
