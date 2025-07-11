const infoCard = document.querySelector(".info-card");
const btnEdit = infoCard.querySelector(".btn-edit");
const btnSave = infoCard.querySelector(".btn-save");
const viewMode = infoCard.querySelector(".view-mode");
const editMode = infoCard.querySelector(".edit-mode");

btnEdit.addEventListener("click", () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
});

btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  // 1) 서버에 저장하는 AJAX 호출 등 처리
  // 2) 저장 완료 시 다시 조회 모드로
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");

  // (선택) view-mode 내부 텍스트 갱신
});

const editBtn = document.querySelector(".pic-edit-btn");
const overlay = document.getElementById("modal-overlay");
const editModal = document.getElementById("edit-modal");
const closeModal = editModal.querySelector(".modal-close");
const cancelBtn = document.getElementById("cancel-btn");
const fileInput = document.getElementById("profile-file-input");
const uploadBtn = editModal.querySelector(".file-upload-btn");
const previewImage = document.getElementById("preview-image");
const deleteBtn = document.getElementById("delete-current");

// 모달 열기
function openModal() {
  overlay.classList.remove("hidden");
  editModal.classList.remove("hidden");
}

// 모달 닫기
function closeModalFn() {
  overlay.classList.add("hidden");
  editModal.classList.add("hidden");
  previewImage.src = ""; // 미리보기 리셋
}
editBtn.addEventListener("click", openModal);
overlay.addEventListener("click", closeModalFn);
closeModal.addEventListener("click", closeModalFn);
cancelBtn.addEventListener("click", closeModalFn);

// 파일 선택 트리거
uploadBtn.addEventListener("click", () => fileInput.click());

// 파일 미리보기
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => (previewImage.src = reader.result);
  reader.readAsDataURL(file);
});

// 현재 사진 삭제
deleteBtn.addEventListener("click", () => {
  previewImage.src = "";
  fileInput.value = null;
});

document.addEventListener("DOMContentLoaded", () => {
  const viewMode = document.querySelector(".mode.view-mode");
  const editMode = document.querySelector(".mode.edit-mode");
  const accountMode = document.querySelector(".mode.account-mode");

  // 뷰 → 계정 설정
  document
    .querySelector(".view-mode .right-btn")
    .addEventListener("click", () => {
      viewMode.classList.add("hidden");
      accountMode.classList.remove("hidden");
    });

  // (선택) 계정 설정 → 다시 뷰로 돌아가기
  document
    .querySelector(".account-mode .bodyInfoIcon h2")
    .addEventListener("click", () => {
      accountMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
    });

  // (기존) 뷰 → 프로필 수정
  document
    .querySelector(".view-mode .btn-edit")
    .addEventListener("click", () => {
      viewMode.classList.add("hidden");
      editMode.classList.remove("hidden");
    });

  // (선택) 수정 모드 → 뷰 복귀
  document
    .querySelector(".edit-mode .btn-save")
    .addEventListener("click", (e) => {
      e.preventDefault();
      editMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const viewMode = document.querySelector(".mode.view-mode");
  const editMode = document.querySelector(".mode.edit-mode");
  const accountMode = document.querySelector(".mode.account-mode");
  const backBtn = document.querySelector(".account-arrow-btn");

  backBtn.addEventListener("click", () => {
    // 조회 모드 보이기
    viewMode.classList.remove("hidden");
    // 다른 모드 숨기기
    editMode.classList.add("hidden");
    accountMode.classList.add("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const viewSection = document.querySelector(".account-view");
  const editSection = document.querySelector(".account-edit");
  const editBtn = viewSection.querySelector(".btn-edit");
  const backBtn = document.querySelector(".account-arrow-btn");

  // ① 조회 → 수정
  editBtn.addEventListener("click", () => {
    viewSection.classList.add("hidden");
    editSection.classList.remove("hidden");
  });

  // ② 수정 → 조회 (뒤로가기 or 저장 후)
  backBtn.addEventListener("click", () => {
    editSection.classList.add("hidden");
    viewSection.classList.remove("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.querySelector(".delete-account");
  const overlay = document.getElementById("confirm-overlay");
  const modal = document.getElementById("confirm-modal");
  const cancelBtn = document.getElementById("confirm-cancel");
  const confirmBtn = document.getElementById("confirm-delete");

  // 모달 열기
  deleteBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  });

  // 모달 닫기 (취소)
  cancelBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  });

  // 실제 삭제 처리 (예시: form 제출 등)
  confirmBtn.addEventListener("click", () => {
    // TODO: 여기서 서버에 삭제 요청을 보내거나
    //       form.submit(), AJAX 호출 등을 실행하세요.

    // 일단 모달 닫기
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  });

  // 오버레이 클릭해도 모달 닫히게 (선택)
  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  });
});
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await AccessAPI.apiFetch("/api/v1/members");
    console.log("API 응답 전체:", data);

    if (data.isSuccess && data.result) {
      const { nickname, email, gender, birthday, height, weight, imageUrl } =
        data.result;

      // 🔹 프로필 카드 영역 채우기
      document.getElementById("nick-name").textContent = nickname;
      document.getElementById("gender").textContent =
        gender === "MALE" ? "남" : "여";
      document.getElementById("height").textContent = `${height} cm`;
      document.getElementById("weight").textContent = `${weight} kg`;

      // 🔹 나이 계산
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      document.getElementById("age").textContent = `만 ${age}세`;

      // 🔹 프로필 이미지 설정
      const profilePic = document.querySelector(".profile-pic");
      if (imageUrl && profilePic) {
        profilePic.style.backgroundImage = `url(${imageUrl})`;
        profilePic.style.backgroundSize = "cover";
        profilePic.style.backgroundPosition = "center";
      }

      // ✅ account-view 영역 채우기
      document.getElementById("account-nickname").value = nickname;
      document.getElementById("account-email").value = email;
      document.getElementById("account-password").value = "************";
    } else {
      alert("회원 정보를 불러오지 못했습니다.");
      console.error("API 실패 응답:", data);
    }
  } catch (err) {
    alert("서버와 통신 중 오류가 발생했습니다.");
    console.error("회원 정보 요청 실패:", err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("confirm-overlay");
  const confirmModal = document.getElementById("confirm-modal");
  const deletedModal = document.getElementById("deleted-modal");
  const cancelBtn = document.getElementById("confirm-cancel");
  const deleteBtn = document.getElementById("confirm-delete");

  // (기존) 취소
  cancelBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmModal.classList.add("hidden");
  });

  // 삭제 확정
  deleteBtn.addEventListener("click", () => {
    // 1) 확인 모달 숨기기
    confirmModal.classList.add("hidden");

    // 2) 성공 모달 표시
    deletedModal.classList.remove("hidden");

    // 3) 약간의 딜레이 후 오버레이·성공 모달 모두 닫기 (예: 2초 뒤)
    setTimeout(() => {
      overlay.classList.add("hidden");
      deletedModal.classList.add("hidden");
      // (선택) 이곳에 추가 동작: 예를 들어 로그아웃, 리다이렉트 등
    }, 2000);
  });

  // 오버레이 클릭해도 모든 모달 닫기
  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmModal.classList.add("hidden");
    deletedModal.classList.add("hidden");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // “계정 설정” 버튼만 잡기 (클래스, 텍스트, id 등 원하는 방식)
  const accountTabBtn = document.querySelector(
    ".panel-group-detail .tab:first-child"
  );
  // .profile-mode 내의 각 모드 선택
  const viewMode = document.querySelector(".profile-mode .view-mode");
  const editMode = document.querySelector(".profile-mode .edit-mode");
  const accountMode = document.querySelector(".profile-mode .account-mode");

  accountTabBtn.addEventListener("click", function () {
    // 계정설정만 보이고 나머지는 숨김
    viewMode.classList.add("hidden");
    editMode.classList.add("hidden");
    accountMode.classList.remove("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("edit-scroll");
  const viewMode = document.querySelector(".account-view");
  const editMode = document.querySelector(".account-edit");

  editButton.addEventListener("click", () => {
    viewMode.classList.add("hidden"); // 조회 화면 숨기기
    editMode.classList.remove("hidden"); // 편집 화면 보이기

    // 편집 화면으로 스크롤 이동하고 싶다면 추가
    editMode.scrollIntoView({ behavior: "smooth" });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const deleteAccountBtn = document.querySelector(".delete-account");
  const overlay = document.getElementById("confirm-overlay");
  const confirmModal = document.getElementById("confirm-modal");
  const deletedModal = document.getElementById("deleted-modal");
  const cancelBtn = document.getElementById("confirm-cancel");
  const confirmDeleteBtn = document.getElementById("confirm-delete");

  // 1. 계정 삭제 버튼 클릭 시 모달 열기
  deleteAccountBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    confirmModal.classList.remove("hidden");
  });

  // 2. 취소 버튼 클릭 시 모달 닫기
  cancelBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmModal.classList.add("hidden");
  });

  // 3. 삭제 확정 버튼 클릭 시 DELETE API 요청
  confirmDeleteBtn.addEventListener("click", async () => {
    try {
      const res = await AccessAPI.apiFetch("/api/v1/members", {
        method: "DELETE",
      });

      if (res.isSuccess) {
        // 모달 전환
        confirmModal.classList.add("hidden");
        deletedModal.classList.remove("hidden");

        // 2초 후 닫고 리디렉션 또는 로그아웃 처리
        setTimeout(() => {
          overlay.classList.add("hidden");
          deletedModal.classList.add("hidden");
          // 👉 예: 로그아웃 처리 후 메인 페이지로 이동
          AccessAPI.clearToken();
          window.location.href = "/pages/index.html";
        }, 2000);
      } else {
        alert("계정 삭제 실패: " + res.message);
      }
    } catch (err) {
      console.error("계정 삭제 오류:", err);
      alert("서버 오류로 계정 삭제에 실패했습니다.");
    }
  });

  // 4. 오버레이 클릭 시 모달 모두 닫기
  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmModal.classList.add("hidden");
    deletedModal.classList.add("hidden");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const bodyInfoTab = document.querySelector(".body-info-tab");
  const viewMode = document.querySelector(".mode.view-mode");
  const editMode = document.querySelector(".mode.edit-mode");
  const accountMode = document.querySelector(".mode.account-mode");

  bodyInfoTab.addEventListener("click", () => {
    editMode?.classList.add("hidden");
    accountMode?.classList.add("hidden");
    viewMode?.classList.remove("hidden");
  });
});
