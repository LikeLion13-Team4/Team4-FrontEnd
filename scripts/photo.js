// profile-image-upload using <label> for single file picker trigger

/*
HTML Structure (ensure <input> is not nested inside the label):

<label for="profile-file-input" class="file-upload-btn">
  <img src="../images/upload-icon.svg" alt="" /> 파일 업로드
</label>
<input type="file" id="profile-file-input" accept="image/*" hidden />
*/

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.__profileImageUploadInitialized) return;
    window.__profileImageUploadInitialized = true;

    const overlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("edit-modal");
    const fileInput = document.getElementById("profile-file-input");
    const previewImage = document.getElementById("preview-image");
    const saveBtn = document.getElementById("save-btn");
    const cancelBtns = document.querySelectorAll(".modal-close, #cancel-btn");
    const deleteBtn = document.getElementById("delete-current");
    const editBtn = document.getElementById("edit-profile-btn");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    let selectedFile = null;
    let presignedUrl = "";
    let fileKey = "";

    function openModal() {
      overlay.classList.remove("hidden");
      modal.classList.remove("hidden");
    }

    function closeModal() {
      overlay.classList.add("hidden");
      modal.classList.add("hidden");
      previewImage.src = "";
      selectedFile = null;
      presignedUrl = "";
      fileKey = "";
      fileInput.value = "";
    }

    if (editBtn) editBtn.addEventListener("click", openModal);
    overlay.addEventListener("click", closeModal);
    cancelBtns.forEach((btn) => btn.addEventListener("click", closeModal));

    // 1) File picked → validate type → presign
    // Clicking the <label> opens the file dialog once; no manual fileInput.click() needed.
    fileInput.addEventListener("change", async (e) => {
      if (!e.target.files.length) return;
      selectedFile = e.target.files[0];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("지원하지 않는 파일 형식입니다. JPG, PNG, WEBP만 가능합니다.");
        fileInput.value = "";
        return;
      }
      const extension = selectedFile.name.split(".").pop();
      const contentType = selectedFile.type;

      try {
        const json1 = await AccessAPI.apiFetch(
          "/api/v1/members/profile-image1",
          {
            method: "POST",
            body: JSON.stringify({ fileExtension: extension, contentType }),
          }
        );
        presignedUrl = json1.result.presignedUrl;
        fileKey = json1.result.fileKey;
        previewImage.src = URL.createObjectURL(selectedFile);
      } catch (err) {
        console.error("Presigned URL 요청 실패:", err);
        alert("파일 업로드 준비에 실패했습니다.");
      }
    });

    // 2) Save → Attempt upload, but always close modal
    saveBtn.addEventListener("click", async () => {
      try {
        if (!selectedFile || !presignedUrl || !fileKey) {
          throw new Error("업로드할 이미지가 선택되지 않았습니다.");
        }
        const putRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        if (!putRes.ok) {
          throw new Error(`S3 PUT 실패: ${putRes.status}`);
        }
        const json2 = await AccessAPI.apiFetch(
          "/api/v1/members/profile-image2",
          {
            method: "POST",
            body: JSON.stringify({ fileKey }),
          }
        );
        if (json2.isSuccess) {
          const imgEl = document.getElementById("current-profile-img");
          if (imgEl) imgEl.src = json2.result.profileImageUrl;
        } else {
          throw new Error(json2.message);
        }
      } catch (err) {
        console.error("이미지 저장 중 오류:", err);
        alert("이미지 저장 중 오류가 발생했습니다.");
      } finally {
        closeModal();
      }
    });

    // 3) Delete
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("현재 프로필 사진을 삭제하시겠습니까?")) return;
      try {
        await AccessAPI.apiFetch("/api/v1/members/profile-image", {
          method: "DELETE",
        });
        const imgEl = document.getElementById("current-profile-img");
        if (imgEl) imgEl.src = "";
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("사진 삭제에 실패했습니다.");
      } finally {
        closeModal();
      }
    });
  });
})();
