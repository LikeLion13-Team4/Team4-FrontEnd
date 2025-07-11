// posts.js
document.addEventListener("DOMContentLoaded", () => {
  // ──────────────────────────────────────────────────────────────
  // [1] 모드 & 버튼 요소
  // ──────────────────────────────────────────────────────────────
  const profileMode = document.querySelector(".profile-mode");
  const savedMode = document.querySelector(".saved-mode");
  const likedMode = document.querySelector(".liked-mode");
  const activityMode = document.querySelector(".activity-mode");
  const commentsMode = document.querySelector(".my-comments-mode");

  const savedBtn = document.getElementById("savedBtn");
  const likedBtn = document.getElementById("likedBtn");
  const myPostsBtn = document.getElementById("my-posts");
  const myActivityBtn = document.querySelector(".my-activity");
  const commentsLink = document.getElementById("my-comments");
  function hideAll() {
    [profileMode, savedMode, likedMode, activityMode, commentsMode].forEach(
      (sec) => sec?.classList.add("hidden")
    );
  }

  savedBtn.addEventListener("click", () => {
    hideAll();
    savedMode.classList.remove("hidden");
    loadSavedPage(1);
  });

  likedBtn.addEventListener("click", () => {
    hideAll();
    likedMode.classList.remove("hidden");
    loadLikedPage(1);
  });

  myPostsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    activityMode.classList.remove("hidden");
    loadMyPostsPage(1);
  });

  commentsLink.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    commentsMode.classList.remove("hidden");
    loadCommentsPage(1);
  });

  // ──────────────────────────────────────────────────────────────
  // [2] 팝업 관련 요소 & 공통 함수
  // ──────────────────────────────────────────────────────────────
  const popupOverlay = document.getElementById("post-detail-popup-overlay");
  const popupCloseBtn = document.querySelector(".popup-close-btn");
  const detailTags = document.getElementById("detail-tags");
  const detailTitle = document.getElementById("detail-title");
  const detailBody = document.getElementById("detail-body");
  const detailImages = document.getElementById("detail-images");
  const detailLike = document.getElementById("detail-like");
  const detailComment = document.getElementById("detail-comment");
  const detailSave = document.getElementById("detail-save");
  const detailCommentsList = document.getElementById("detail-comments-list");

  popupCloseBtn.addEventListener("click", () =>
    popupOverlay.classList.add("hidden")
  );
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.classList.add("hidden");
  });

  function openDetailPopup(item) {
    // 태그
    detailTags.innerHTML = "";
    (item.tags || []).forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      detailTags.append(span);
    });
    // 제목/본문
    detailTitle.textContent = item.title;
    detailBody.textContent = item.content || item.body;
    // 이미지 (더미)
    detailImages.innerHTML = "";
    const count = item.imageCount || 0;
    for (let i = 0; i < count; i++) {
      const d = document.createElement("div");
      d.textContent = "IMG";
      Object.assign(d.style, {
        background: "#ececec",
        width: "96px",
        height: "96px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        fontWeight: "bold",
      });
      detailImages.append(d);
    }
    // 통계 더미
    detailLike.textContent = "♥ 4";
    detailComment.textContent = "💬 7";
    detailSave.textContent = "☆ 0";
    // 댓글 리스트 예시
    detailCommentsList.innerHTML = `
      <div class="comment-item">
        <span class="comment-user">유저A</span>
        <p class="comment-text">댓글 예시1</p>
      </div>
      <div class="comment-item">
        <span class="comment-user">유저B</span>
        <p class="comment-text">댓글 예시2</p>
      </div>
    `;
    popupOverlay.classList.remove("hidden");
  }

  // ──────────────────────────────────────────────────────────────
  // [3] 저장한 게시글: API + 렌더링
  // ──────────────────────────────────────────────────────────────
  const savedContent = document.querySelector(".saved-content");
  const savedTpl = document.getElementById("card-template");
  const pagePrevSaved = document.querySelector(".saved-mode .page-prev");
  const pageNextSaved = document.querySelector(".saved-mode .page-next");
  let savedCurrent = 1;
  const savedSize = 10;

  async function loadSavedPage(page) {
    try {
      const json = await AccessAPI.apiFetch(
        `/api/v1/posts/scraps?page=${page}&size=${savedSize}`
      );
      const { posts, currentPage, totalElements } = json.result;
      renderSaved(posts, currentPage, totalElements);
      savedCurrent = currentPage;
    } catch (err) {
      console.error("저장한 게시글 로드 실패:", err);
    }
  }

  function renderSaved(items, page = 1, total = 0) {
    savedContent.innerHTML = "";
    items.forEach((item) => {
      const clone = savedTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.content;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      (item.tags || []).forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });
      // 썸네일
      const imgWrap = clone.querySelector(".card-images");
      imgWrap.innerHTML = "";
      if (item.thumbnailImageUrl) {
        const img = document.createElement("img");
        img.src = item.thumbnailImageUrl;
        img.alt = item.title;
        imgWrap.append(img);
      }
      // 클릭
      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));
      savedContent.append(clone);
    });
    // 버튼 토글
    pagePrevSaved.style.display = page > 1 ? "" : "none";
    pageNextSaved.style.display = page * savedSize < total ? "" : "none";
  }

  pagePrevSaved.addEventListener("click", () => {
    if (savedCurrent > 1) loadSavedPage(savedCurrent - 1);
  });
  pageNextSaved.addEventListener("click", () => {
    loadSavedPage(savedCurrent + 1);
  });

  // 초기 로드
  loadSavedPage(1);

  // ──────────────────────────────────────────────────────────────
  // [4] 좋아요 게시글: API + 렌더링
  // ──────────────────────────────────────────────────────────────
  const likedContent = document.querySelector(".liked-content");
  const likedTpl = document.getElementById("liked-card-template");
  const pagePrevLikedBtn = document.querySelector(".page-prev-liked");
  const pageNextLikedBtn = document.querySelector(".page-next-liked");
  let likedCurrent = 1;
  const likedSize = 10;

  async function loadLikedPage(page) {
    try {
      const json = await AccessAPI.apiFetch(
        `/api/v1/posts/liked?page=${page}&size=${likedSize}`
      );
      const { posts, currentPage, totalElements } = json.result;
      renderLikedPage(posts, currentPage, totalElements);
      likedCurrent = currentPage;
    } catch (err) {
      console.error("좋아요한 게시글 로드 실패:", err);
    }
  }

  function renderLikedPage(items, page = 1, total = 0) {
    likedContent.innerHTML = "";
    items.forEach((item) => {
      const clone = likedTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.content;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      (item.tags || []).forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });
      // 클릭
      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));
      likedContent.append(clone);
    });
    pagePrevLikedBtn.style.display = page > 1 ? "" : "none";
    pageNextLikedBtn.style.display = page * likedSize < total ? "" : "none";
  }

  pagePrevLikedBtn.addEventListener("click", () => {
    if (likedCurrent > 1) loadLikedPage(likedCurrent - 1);
  });
  pageNextLikedBtn.addEventListener("click", () => {
    loadLikedPage(likedCurrent + 1);
  });

  // 초기 로드
  loadLikedPage(1);

  // ──────────────────────────────────────────────────────────────
  // [5] 내 게시글: API + 렌더링
  // ──────────────────────────────────────────────────────────────
  const myPostsContent = document.querySelector(".my-posts-content");
  const myPostTpl = document.getElementById("my-post-card-template");
  const pagePrevMyBtn = document.getElementById("page-prev-my");
  const pageNextMyBtn = document.getElementById("page-next-my");
  let myPostsCurrent = 1;
  const myPostsSize = 10;

  async function loadMyPostsPage(page) {
    try {
      const json = await AccessAPI.apiFetch(
        `/api/v1/posts/my?page=${page}&size=${myPostsSize}`
      );
      const { posts, currentPage, totalElements } = json.result;
      renderMyPostsPage(posts, currentPage, totalElements);
      myPostsCurrent = currentPage;
    } catch (err) {
      console.error("내 게시글 로드 실패:", err);
    }
  }

  function renderMyPostsPage(items, page = 1, total = 0) {
    myPostsContent.innerHTML = "";
    items.forEach((item) => {
      const clone = myPostTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.content;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      (item.tags || []).forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });
      // 클릭
      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));
      myPostsContent.append(clone);
    });
    pagePrevMyBtn.style.display = page > 1 ? "" : "none";
    pageNextMyBtn.style.display = page * myPostsSize < total ? "" : "none";
  }

  pagePrevMyBtn.addEventListener("click", () => {
    if (myPostsCurrent > 1) loadMyPostsPage(myPostsCurrent - 1);
  });
  pageNextMyBtn.addEventListener("click", () => {
    loadMyPostsPage(myPostsCurrent + 1);
  });

  // 초기 로드
  loadMyPostsPage(1);

  // ──────────────────────────────────────────────────────────────
  // ──────────────────────────────────────────────────────────────
  // [6] 내가 쓴 댓글: API 호출 + 렌더링
  // ──────────────────────────────────────────────────────────────
  const commentsContent = document.querySelector(".my-comments-content");
  const commentsTpl = document.getElementById("comment-card-template");
  const pagePrevCommentsBtn = document.querySelector(".page-prev-comments");
  const pageNextCommentsBtn = document.querySelector(".page-next-comments");

  let commentsCurrent = 1;
  const commentsSize = 10; // API에 넘길 size

  // (1) API 호출 함수
  async function loadCommentsPage(page) {
    try {
      const json = await AccessAPI.apiFetch(
        `/api/v1/posts/my-comments?page=${page}&size=${commentsSize}`
      );
      const { posts, currentPage, totalElements } = json.result;
      renderCommentsPage(posts, currentPage, totalElements);
      commentsCurrent = currentPage;
    } catch (err) {
      console.error("내가 쓴 댓글 로드 실패:", err);
      // TODO: 사용자에게 에러 표시
    }
  }

  // (2) 렌더링 함수
  function renderCommentsPage(items, page = 1, total = 0) {
    commentsContent.innerHTML = "";
    items.forEach((item) => {
      const clone = commentsTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.content;

      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      (item.tags || []).forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });

      // 카드 클릭 시 상세 팝업 열기
      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));

      commentsContent.append(clone);
    });

    // 페이징 버튼 토글
    pagePrevCommentsBtn.style.display = page > 1 ? "" : "none";
    pageNextCommentsBtn.style.display =
      page * commentsSize < total ? "" : "none";
  }

  // (3) 버튼에 이벤트 연결
  pagePrevCommentsBtn.addEventListener("click", () => {
    if (commentsCurrent > 1) loadCommentsPage(commentsCurrent - 1);
  });
  pageNextCommentsBtn.addEventListener("click", () => {
    loadCommentsPage(commentsCurrent + 1);
  });

  // (4) 초기 한 번만 호출
  loadCommentsPage(1);
});
