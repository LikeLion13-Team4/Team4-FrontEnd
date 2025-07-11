document
  .getElementById("getAdviceButton")
  .addEventListener("click", async () => {
    // 1) Date 객체 준비
    const today = new Date();

    // 2) startDate = today - 6일
    const start = new Date(today);
    start.setDate(start.getDate() - 7);

    // 3) endDate = today + 1일
    const end = new Date(today);
    end.setDate(end.getDate());

    // 4) YYYY-MM-DD 형식으로 자르기
    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    try {
      const res = await AccessAPI.apiFetch("/api/v1/report/feedback", {
        method: "POST",
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!res.isSuccess) {
        console.error("AI 피드백 요청 실패:", res);
        alert(`피드백 요청 실패: ${res.message}`);
        return;
      }

      document.getElementById("feedbackText").innerHTML = res.message;
    } catch (err) {
      console.error("AI 피드백 호출 중 오류:", err);
      alert("피드백 요청 중 오류가 발생했습니다.");
    }
  });
