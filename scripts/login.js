// scripts/login.js
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  if (!form) {
    console.error("❌ .login-form 요소를 찾을 수 없습니다.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      return alert("이메일과 비밀번호를 모두 입력해주세요.");
    }

    try {
      // AccessAPI.apiFetch 사용
      const data = await AccessAPI.apiFetch("/api/v1/auths/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.isSuccess) {
        alert("로그인 성공!");
        AccessAPI.setToken(data.result.accessToken);

        // isTemp를 세션 스토리지에 저장
        sessionStorage.setItem("isTemp", data.result.isTemp);

        // isTemp 체크
        if (data.result.isTemp === "IS_TEMP_PASSWORD") {
          // 임시 비밀번호 발급 상태라면 myPage로 이동 후 폼 노출 플래그 전달
          window.location.href = "myPage.html?temp=true";
          alert("즉시 비밀번호를 변경해주세요.");
        } else {
          // 일반 로그인
          window.location.href = "report.html";
        }
      } else {
        alert("로그인 실패: " + data.message);
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("로그인 요청 중 오류 발생");
    }
  });
});
