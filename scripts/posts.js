document.addEventListener("DOMContentLoaded", () => {
  // ──────────────────────────────────────────────────────────────
  // [1] 모드 탭 전환
  // ──────────────────────────────────────────────────────────────
  const profileMode = document.querySelector(".profile-mode");
  const savedMode = document.querySelector(".saved-mode");
  const likedMode = document.querySelector(".liked-mode");
  const activityMode = document.querySelector(".activity-mode");
  const commentsMode = document.querySelector(".my-comments-mode");

  const savedBtn = document.getElementById("savedBtn");
  const likedBtn = document.getElementById("likedBtn");
  const myActivityBtn = document.querySelector(".my-activity");
  const commentsLink = document.getElementById("my-comments");
  const myPostsBtn = document.getElementById("my-posts");

  function hideAll() {
    [profileMode, savedMode, likedMode, activityMode, commentsMode].forEach(
      (sec) => sec && sec.classList.add("hidden")
    );
  }

  savedBtn.addEventListener("click", () => {
    hideAll();
    savedMode.classList.remove("hidden");
  });
  likedBtn.addEventListener("click", () => {
    hideAll();
    likedMode.classList.remove("hidden");
  });
  myActivityBtn.addEventListener("click", () => {
    hideAll();
    activityMode.classList.remove("hidden");
  });
  commentsLink.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    commentsMode.classList.remove("hidden");
    renderCommentsPage(commentsData, commentsCurrentPage);
  });
  myPostsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    activityMode.classList.remove("hidden");
    renderMyPostsPage(myPostsData, myPostsCurrentPage);
  });

  // ──────────────────────────────────────────────────────────────
  // [2] 팝업 관련 요소 & 함수
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
  const detailCommentsList = document.getElementById("detail-comments-list"); // ← 반드시 선언!

  // 팝업 닫기
  popupCloseBtn.addEventListener("click", () =>
    popupOverlay.classList.add("hidden")
  );
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.classList.add("hidden");
  });

  // 공통: 상세 팝업 열기
  function openDetailPopup(item) {
    // 1) 태그
    detailTags.innerHTML = "";
    item.tags.forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      detailTags.append(span);
    });

    // 2) 제목 + 본문
    detailTitle.textContent = item.title;
    detailBody.textContent = item.body;

    // 3) 이미지
    detailImages.innerHTML = "";
    for (let i = 0; i < (item.imageCount || item.images.length || 0); i++) {
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

    // 4) 통계 (더미)
    detailLike.textContent = "♥ 4";
    detailComment.textContent = "💬 7";
    detailSave.textContent = "☆ 0";

    // 5) 댓글 리스트 초기화 + 예시
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

    // 6) 팝업 보이기
    popupOverlay.classList.remove("hidden");
  }

  // ──────────────────────────────────────────────────────────────
  // [3] 저장한 게시글: API 호출 + 렌더링
  // ──────────────────────────────────────────────────────────────
  const savedContent = document.querySelector(".saved-content");
  const savedTpl = document.getElementById("card-template");
  const pagePrevSaved = document.querySelector(".saved-mode .page-prev");
  const pageNextSaved = document.querySelector(".saved-mode .page-next");
  let savedCurrentPage = 1;
  const savedPerPage = 10; // API에 넘길 size

  // 1) API 호출해서 받아오기
  async function loadSavedPage(page) {
    try {
      // AccessAPI.apiFetch(path, options) 사용
      const json = await AccessAPI.apiFetch(
        `/api/v1/posts/scraps?page=${page}&size=${savedPerPage}`
      );
      const { posts, currentPage, totalElements } = json.result;

      // 받아온 posts 배열과 페이징 메타를 renderSaved 에 넘긴다
      renderSaved(posts, currentPage, totalElements);
      savedCurrentPage = currentPage;
    } catch (err) {
      console.error("저장한 게시글 로드 실패:", err);
      // TODO: UI에 에러 표시
    }
  }

  // 2) renderSaved 함수 수정 (3번째 인자로 totalElements 받음)
  function renderSaved(items, page = 1, totalElements = 0) {
    savedContent.innerHTML = "";

    items.forEach((item) => {
      const clone = savedTpl.content.cloneNode(true);
      // 서버에서 온 필드명을 그대로 사용
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.content;

      // 태그 렌더링
      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      (item.tags || []).forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });

      // 썸네일 이미지 (있으면)
      const imgWrap = clone.querySelector(".card-images");
      imgWrap.innerHTML = "";
      if (item.thumbnailImageUrl) {
        const img = document.createElement("img");
        img.src = item.thumbnailImageUrl;
        img.alt = item.title;
        imgWrap.append(img);
      }

      // 클릭 시 팝업 열기
      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));

      savedContent.append(clone);
    });

    // 버튼 토글: 총 요소 개수(totalElements) 기준
    pagePrevSaved.style.display = page > 1 ? "" : "none";
    pageNextSaved.style.display =
      page * savedPerPage < totalElements ? "" : "none";
  }

  // 3) 버튼에 페이지 로드 로직 연결
  pagePrevSaved.addEventListener("click", () => {
    if (savedCurrentPage > 1) loadSavedPage(savedCurrentPage - 1);
  });
  pageNextSaved.addEventListener("click", () => {
    loadSavedPage(savedCurrentPage + 1);
  });

  // 4) 초기 로드
  loadSavedPage(savedCurrentPage);
  // ──────────────────────────────────────────────────────────────
  // [4] 좋아요 게시물: renderLikedPage & 페이징
  // ──────────────────────────────────────────────────────────────
  const likedContent = document.querySelector(".liked-content");
  const likedTpl = document.getElementById("liked-card-template");
  const pagePrevLikedBtn = document.querySelector(".page-prev-liked");
  const pageNextLikedBtn = document.querySelector(".page-next-liked");
  const likedData = Array.from({ length: 24 }, (_, i) => ({
    title: `좋아요 게시글 ${i + 1}`,
    body: `이건 내가 좋아요한 게시물입니다. (${i + 1})`,
    tags: [`#좋아요${i + 1}`, "#맛집"],
    imageCount: (i % 5) + 1,
  }));
  let likedCurrentPage = 1;
  const likedPerPage = 10;

  function renderLikedPage(items, page = 1) {
    likedContent.innerHTML = "";
    const start = (page - 1) * likedPerPage;
    items.slice(start, start + likedPerPage).forEach((item) => {
      const clone = likedTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;

      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      item.tags.forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });

      const thumb = clone.querySelector(".thumbnail");
      thumb.textContent = item.imageCount > 0 ? `+${item.imageCount}` : "";

      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));

      likedContent.append(clone);
    });

    pagePrevLikedBtn.style.display = page > 1 ? "" : "none";
    pageNextLikedBtn.style.display =
      page * likedPerPage < items.length ? "" : "none";
  }
  pagePrevLikedBtn.addEventListener("click", () => {
    if (likedCurrentPage > 1) renderLikedPage(likedData, --likedCurrentPage);
  });
  pageNextLikedBtn.addEventListener("click", () => {
    if (likedCurrentPage * likedPerPage < likedData.length)
      renderLikedPage(likedData, ++likedCurrentPage);
  });
  renderLikedPage(likedData, likedCurrentPage);

  // ──────────────────────────────────────────────────────────────
  // [5] 내 게시글: renderMyPostsPage & 페이징
  // ──────────────────────────────────────────────────────────────
  const myPostsContent = document.querySelector(".my-posts-content");
  const myPostTpl = document.getElementById("my-post-card-template");
  const pagePrevMyBtn = document.getElementById("page-prev-my");
  const pageNextMyBtn = document.getElementById("page-next-my");
  const myPostsData = Array.from({ length: 17 }, (_, i) => ({
    title: `내 게시글 ${i + 1}`,
    body: `내가 쓴 게시글 내용${i + 1}`,
    tags: [`#내글${i + 1}`, "#작성"],
    imageCount: (i % 3) + 1,
  }));
  let myPostsCurrentPage = 1;
  const myPostsPerPage = 10;

  function renderMyPostsPage(items, page = 1) {
    myPostsContent.innerHTML = "";
    const start = (page - 1) * myPostsPerPage;
    items.slice(start, start + myPostsPerPage).forEach((item) => {
      const clone = myPostTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;

      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      item.tags.forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });

      const thumb = clone.querySelector(".thumbnail");
      thumb.textContent = item.imageCount > 0 ? `+${item.imageCount}` : "";

      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));

      myPostsContent.append(clone);
    });

    pagePrevMyBtn.style.display = page > 1 ? "" : "none";
    pageNextMyBtn.style.display =
      page * myPostsPerPage < items.length ? "" : "none";
  }
  pagePrevMyBtn.addEventListener("click", () => {
    if (myPostsCurrentPage > 1)
      renderMyPostsPage(myPostsData, --myPostsCurrentPage);
  });
  pageNextMyBtn.addEventListener("click", () => {
    if (myPostsCurrentPage * myPostsPerPage < myPostsData.length)
      renderMyPostsPage(myPostsData, ++myPostsCurrentPage);
  });
  renderMyPostsPage(myPostsData, myPostsCurrentPage);

  // ──────────────────────────────────────────────────────────────
  // [6] 내가 쓴 댓글: renderCommentsPage & 페이징
  // ──────────────────────────────────────────────────────────────
  const commentsContent = document.querySelector(".my-comments-content");
  const commentsTpl = document.getElementById("comment-card-template");
  const pagePrevComments = document.querySelector(".page-prev-comments");
  const pageNextComments = document.querySelector(".page-next-comments");
  const commentsData = Array.from({ length: 15 }, (_, i) => ({
    title: `댓글 대상 게시글 ${i + 1}`,
    body: `내가 쓴 댓글 내용 ${i + 1}`,
    tags: [`#댓글${i + 1}`, "#소통"],
    images: Array.from({ length: i % 4 }, () => `../images/img.jpg`),
  }));
  let commentsCurrentPage = 1;
  const commentsPerPage = 10;

  function renderCommentsPage(items, page = 1) {
    commentsContent.innerHTML = "";
    const start = (page - 1) * commentsPerPage;
    items.slice(start, start + commentsPerPage).forEach((item) => {
      const clone = commentsTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;

      const tagWrap = clone.querySelector(".card-tags");
      tagWrap.innerHTML = "";
      item.tags.forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tagWrap.append(s);
      });

      const thumb = clone.querySelector(".thumbnail");
      thumb.textContent = item.images.length ? `+${item.images.length}` : "";

      clone
        .querySelector(".item-card")
        .addEventListener("click", () => openDetailPopup(item));

      commentsContent.append(clone);
    });

    pagePrevComments.style.display = page > 1 ? "" : "none";
    pageNextComments.style.display =
      page * commentsPerPage < items.length ? "" : "none";
  }
  pagePrevComments.addEventListener("click", () => {
    if (commentsCurrentPage > 1)
      renderCommentsPage(commentsData, --commentsCurrentPage);
  });
  pageNextComments.addEventListener("click", () => {
    if (commentsCurrentPage * commentsPerPage < commentsData.length)
      renderCommentsPage(commentsData, ++commentsCurrentPage);
  });
  renderCommentsPage(commentsData, commentsCurrentPage);
});
