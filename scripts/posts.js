document.addEventListener("DOMContentLoaded", () => {
  // ========== [모드 & 버튼 요소들] ==========
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
    renderComments(commentsData); // 다시 렌더 (선택)
  });
  myPostsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    activityMode.classList.remove("hidden");
    renderMyPosts(myPostsData);
  });

  // ========== 저장한 게시글 (saved-content) ==========
  // ----- 저장한 게시물 -----
  const savedContent = document.querySelector(".saved-content");
  const savedTpl = document.getElementById("card-template");
  const pagePrevBtn = document.querySelector(".saved-mode .page-prev");
  const pageNextBtn = document.querySelector(".saved-mode .page-next");

  const savedData = Array.from({ length: 22 }, (_, i) => ({
    title: `저장된 카드 ${i + 1}`,
    body: `저장된 카드 본문입니다 (${i + 1})`,
    tags: [`#저장${i + 1}`, "#추천"],
    images: [],
  }));

  let savedCurrentPage = 1;
  const savedPerPage = 10;

  function renderSaved(items, page = 1) {
    savedContent.innerHTML = "";
    const startIdx = (page - 1) * savedPerPage;
    const endIdx = startIdx + savedPerPage;
    const viewItems = items.slice(startIdx, endIdx);

    viewItems.forEach((item) => {
      const clone = savedTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      item.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagWrap.append(span);
      });
      // 이미지
      const imgWrap = clone.querySelector(".card-images");
      item.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = item.title;
        imgWrap.append(img);
      });
      // +N
      const thumb = clone.querySelector(".thumbnail");
      if (item.images.length > 3) {
        thumb.textContent = `+${item.images.length - 3}`;
      }
      savedContent.append(clone);
    });

    // 페이지네이션 버튼 처리
    pagePrevBtn.style.display = page > 1 ? "" : "none";
    pageNextBtn.style.display = endIdx < items.length ? "" : "none";
  }

  // 버튼 이벤트
  pagePrevBtn.addEventListener("click", () => {
    if (savedCurrentPage > 1) {
      savedCurrentPage--;
      renderSaved(savedData, savedCurrentPage);
    }
  });
  pageNextBtn.addEventListener("click", () => {
    if (savedCurrentPage * savedPerPage < savedData.length) {
      savedCurrentPage++;
      renderSaved(savedData, savedCurrentPage);
    }
  });

  // 최초 렌더
  renderSaved(savedData, savedCurrentPage);

  // ========== 좋아요 게시글 (liked-content) ==========
  // ========== 좋아요한 게시물: 페이지네이션 ==========

  const likedContent = document.querySelector(".liked-content");
  const likedTpl = document.getElementById("liked-card-template");
  const pagePrevLiked = document.querySelector(".page-prev-liked");
  const pageNextLiked = document.querySelector(".page-next-liked");

  // 예시 더미 데이터 24개
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
    const startIdx = (page - 1) * likedPerPage;
    const endIdx = startIdx + likedPerPage;
    const viewItems = items.slice(startIdx, endIdx);

    viewItems.forEach((item) => {
      const clone = likedTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      item.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagWrap.append(span);
      });
      // +N 썸네일
      const thumb = clone.querySelector(".thumbnail");
      thumb.textContent = item.imageCount > 0 ? `+${item.imageCount}` : "";
      likedContent.append(clone);
    });

    // 페이지 버튼 보이기/숨기기
    pagePrevLiked.style.display = page > 1 ? "" : "none";
    pageNextLiked.style.display = endIdx < items.length ? "" : "none";
  }

  // 버튼 이벤트
  pagePrevLiked.addEventListener("click", () => {
    if (likedCurrentPage > 1) {
      likedCurrentPage--;
      renderLikedPage(likedData, likedCurrentPage);
    }
  });
  pageNextLiked.addEventListener("click", () => {
    if (likedCurrentPage * likedPerPage < likedData.length) {
      likedCurrentPage++;
      renderLikedPage(likedData, likedCurrentPage);
    }
  });

  // 최초 렌더링
  renderLikedPage(likedData, likedCurrentPage);

  // ========== 내 게시글 (my-posts-content) ==========
  // 1) 데이터 정의
  // ========== 내 게시글 페이지네이션 ==========

  // (1) 팝업 관련 엘리먼트
  const postDetailOverlay = document.getElementById(
    "post-detail-popup-overlay"
  );
  const postDetailPopup = document.getElementById("post-detail-popup");
  const detailTags = document.getElementById("detail-tags");
  const detailTitle = document.getElementById("detail-title");
  const detailBody = document.getElementById("detail-body");
  const detailImages = document.getElementById("detail-images");
  const detailLike = document.getElementById("detail-like");
  const detailComment = document.getElementById("detail-comment");
  const detailSave = document.getElementById("detail-save");
  const popupCloseBtn = postDetailPopup.querySelector(".popup-close-btn");
  popupCloseBtn.addEventListener("click", () =>
    postDetailOverlay.classList.add("hidden")
  );
  postDetailOverlay.addEventListener("click", (e) => {
    if (e.target === postDetailOverlay)
      postDetailOverlay.classList.add("hidden");
  });

  // (2) 데이터 & 페이지네이션
  const myPostsData = Array.from({ length: 17 }, (_, i) => ({
    title: `내 게시글 ${i + 1}`,
    body: `내가 쓴 게시글 내용${i + 1}`,
    tags: [`#내글${i + 1}`, "#작성"],
    imageCount: (i % 3) + 1,
  }));

  let myPostsCurrentPage = 1;
  const myPostsPerPage = 10;

  // myPostsContent, myPostTpl, pagePrevMy, pageNextMy는 기존과 동일하게 querySelector로 가져와야 함
  const myPostsContent = document.querySelector(".my-posts-content");
  const myPostTpl = document.getElementById("my-post-card-template");
  const pagePrevMy = document.getElementById("page-prev-my"); // < 버튼
  const pageNextMy = document.getElementById("page-next-my"); // > 버튼

  function renderMyPostsPage(items, page = 1) {
    myPostsContent.innerHTML = "";
    const startIdx = (page - 1) * myPostsPerPage;
    const endIdx = startIdx + myPostsPerPage;
    const viewItems = items.slice(startIdx, endIdx);

    viewItems.forEach((item) => {
      const clone = myPostTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      item.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagWrap.append(span);
      });
      // 썸네일 +N
      const thumb = clone.querySelector(".thumbnail");
      thumb.textContent = item.imageCount > 0 ? `+${item.imageCount}` : "";
      // ⭐️ 카드 클릭시 팝업 띄우기
      clone.querySelector(".item-card").addEventListener("click", (e) => {
        // 체크박스 클릭시 무시(카드 전체 클릭시만)
        if (e.target.classList.contains("checkbox")) return;

        detailTitle.textContent = item.title;
        detailBody.textContent = item.body;
        detailTags.innerHTML = "";
        item.tags.forEach((tag) => {
          const t = document.createElement("span");
          t.className = "tag";
          t.textContent = tag;
          detailTags.appendChild(t);
        });
        detailImages.innerHTML = "";
        for (let i = 0; i < item.imageCount; i++) {
          const img = document.createElement("div");
          img.textContent = "IMG";
          img.style.background = "#ececec";
          img.style.width = "96px";
          img.style.height = "96px";
          img.style.display = "flex";
          img.style.alignItems = "center";
          img.style.justifyContent = "center";
          img.style.borderRadius = "10px";
          img.style.fontWeight = "bold";
          detailImages.appendChild(img);
        }
        detailLike.textContent = "♥ 4";
        detailComment.textContent = "💬 7";
        detailSave.textContent = "☆ 0";
        postDetailOverlay.classList.remove("hidden");
      });
      myPostsContent.append(clone);
    });

    // 버튼 show/hide
    if (pagePrevMy) pagePrevMy.style.display = page > 1 ? "" : "none";
    if (pageNextMy)
      pageNextMy.style.display = endIdx < items.length ? "" : "none";
  }

  // 페이지 이동 버튼 이벤트
  if (pagePrevMy)
    pagePrevMy.addEventListener("click", () => {
      if (myPostsCurrentPage > 1) {
        myPostsCurrentPage--;
        renderMyPostsPage(myPostsData, myPostsCurrentPage);
      }
    });
  if (pageNextMy)
    pageNextMy.addEventListener("click", () => {
      if (myPostsCurrentPage * myPostsPerPage < myPostsData.length) {
        myPostsCurrentPage++;
        renderMyPostsPage(myPostsData, myPostsCurrentPage);
      }
    });

  // 초기 렌더
  renderMyPostsPage(myPostsData, myPostsCurrentPage);

  // ========== 내가 쓴 댓글 (my-comments-content) ==========
  // ========== 내가 쓴 댓글 페이지네이션 ==========

  const commentsContent = document.querySelector(".my-comments-content");
  const commentsTpl = document.getElementById("comment-card-template");
  const pagePrevComments = document.querySelector(".page-prev-comments");
  const pageNextComments = document.querySelector(".page-next-comments");

  // 예시 데이터(15개)
  const commentsData = Array.from({ length: 15 }, (_, i) => ({
    title: `댓글 게시글 ${i + 1}`,
    body: `내가 쓴 댓글 내용${i + 1}`,
    tags: [`#댓글${i + 1}`, "#소통"],
    images: Array.from(
      { length: i % 4 },
      (__, j) => `../images/img${j + 1}.jpg`
    ),
  }));

  let commentsCurrentPage = 1;
  const commentsPerPage = 10;

  function renderCommentsPage(items, page = 1) {
    commentsContent.innerHTML = "";
    const startIdx = (page - 1) * commentsPerPage;
    const endIdx = startIdx + commentsPerPage;
    const viewItems = items.slice(startIdx, endIdx);

    viewItems.forEach((item) => {
      const clone = commentsTpl.content.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;
      // 태그
      const tagWrap = clone.querySelector(".card-tags");
      item.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagWrap.append(span);
      });
      // 썸네일: 이미지 배열 기준
      const thumb = clone.querySelector(".thumbnail");
      if (item.images && item.images.length > 0) {
        thumb.textContent = `+${item.images.length}`;
      } else {
        thumb.textContent = "";
      }
      commentsContent.append(clone);
    });

    // 버튼 show/hide
    pagePrevComments.style.display = page > 1 ? "" : "none";
    pageNextComments.style.display = endIdx < items.length ? "" : "none";
  }

  pagePrevComments.addEventListener("click", () => {
    if (commentsCurrentPage > 1) {
      commentsCurrentPage--;
      renderCommentsPage(commentsData, commentsCurrentPage);
    }
  });
  pageNextComments.addEventListener("click", () => {
    if (commentsCurrentPage * commentsPerPage < commentsData.length) {
      commentsCurrentPage++;
      renderCommentsPage(commentsData, commentsCurrentPage);
    }
  });

  // **초기 렌더 (모드 진입시 이 함수 호출!)**
  renderCommentsPage(commentsData, commentsCurrentPage);
});
