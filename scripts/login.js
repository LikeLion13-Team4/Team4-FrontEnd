window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  if (!form) {
    console.error("❌ .login-form 요소를 찾을 수 없습니다.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      return alert("이메일과 비밀번호를 모두 입력해주세요.");
    }

    fetch("http://3.39.89.75:8080/api/v1/auths/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          alert("로그인 성공!");
          localStorage.setItem("accessToken", data.result.accessToken);
          window.location.href = "/pages/report.html";
        } else {
          alert("로그인 실패: " + data.message);
        }
      })
      .catch((err) => {
        console.error("로그인 오류:", err);
        alert("로그인 요청 중 오류 발생");
      });
  });
});
