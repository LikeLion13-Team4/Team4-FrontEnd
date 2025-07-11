// community.js

// 전역 변수
const postsPerPage = 10;
let currentPage = 1;
let totalPages = 1;
let currentPost = null;

// 1) 게시글 목록 불러오기 (page, size)
async function loadPosts(page = 1) {
  try {
    const data = await AccessAPI.apiFetch(
      `/api/v1/posts?page=${page}&size=${postsPerPage}`
    );
    if (!data.isSuccess) {
      return alert("게시글 조회 실패: " + data.message);
    }

    // 응답 구조 분해
    const { posts: postList, currentPage: cp, totalPages: tp } = data.result;
    currentPage = cp;
    totalPages = tp;

    renderPosts(postList);
    renderPagination();
  } catch (err) {
    console.error("게시글 로드 중 오류:", err);
    alert("서버 오류로 게시글을 불러올 수 없습니다.");
  }
}

// 2) 게시글 렌더링
function renderPosts(postList) {
  const container = document.getElementById("post-container");
  container.innerHTML = "";

  postList.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    const time = new Date(post.createdAt).toLocaleString();

    card.innerHTML = `
      <div class="post-header">
        <div class="profile-circle"></div>
        <div class="post-info">
          <div class="post-author">${post.authorNickname}</div>
          <div class="post-time">${time}</div>
        </div>
      </div>
      <div class="post-content">
        <p class="post-title">${post.title}</p>
        <p class="post-text">${post.content}</p>
      </div>
      <div class="post-footer">
        <div class="tags">
          ${post.tags.map((t) => `<span class="tag"># ${t}</span>`).join("")}
        </div>
        ${
          post.thumbnailImageUrl
            ? `<div class="images"><img src="${post.thumbnailImageUrl}" class="thumbnail"/></div>`
            : ""
        }
      </div>
      <div class="post-actions">
        <span>❤️ ${post.likeCount}</span>
        <span>💬 ${post.commentCount}</span>
        <span>⭐ ${post.scrapCount}</span>
      </div>
    `;

    card.addEventListener("click", () => openDetailPopup(post));
    container.appendChild(card);
  });
}

// 3) 페이지네이션 UI
function renderPagination() {
  document.getElementById(
    "page-info"
  ).textContent = `${currentPage} / ${totalPages}`;
  const prev = document.getElementById("prev-page");
  const next = document.getElementById("next-page");

  prev.disabled = currentPage === 1;
  next.disabled = currentPage === totalPages;

  prev.onclick = () => {
    if (currentPage > 1) loadPosts(currentPage - 1);
  };
  next.onclick = () => {
    if (currentPage < totalPages) loadPosts(currentPage + 1);
  };
}

// 4) 특정 포스트의 댓글 목록 조회
async function fetchComments(postId) {
  try {
    const data = await AccessAPI.apiFetch(`/api/v1/posts/${postId}/comments`);
    if (!data.isSuccess) {
      console.warn("댓글 조회 실패:", data.message);
      return [];
    }
    return data.result.map((c) => ({
      id: c.commentId,
      user: c.memberNickname,
      text: c.comment,
      time: new Date(c.createdAt).toLocaleString(),
      replies: [], // hierarchy/orders 로 처리 가능
    }));
  } catch (err) {
    console.error("댓글 로드 중 오류:", err);
    return [];
  }
}

// 5) 댓글 렌더 함수 (기존 renderComments 재사용)
// 5) 댓글 렌더 함수 (구현 추가)
function renderComments(comments, container, depth = 0) {
  container.innerHTML = ""; // 기존 내용 초기화

  comments.forEach((comment) => {
    // 1) 댓글 박스 생성
    const commentBox = document.createElement("div");
    commentBox.className = depth === 0 ? "comment-box" : "reply-box";

    // 2) 댓글 HTML 채우기
    commentBox.innerHTML = `
      <div class="comment-header">
        <div class="comment-header-left">
          <div class="profile-circle small"></div>
          <div class="comment-meta">
            <span class="comment-author">${comment.user}</span>
            <span class="comment-time">${comment.time}</span>
          </div>
        </div>
        <div class="comment-actions">
          <button class="like-btn">공감 (${comment.likes || 0})</button>
          ${depth === 0 ? '<button class="reply-btn">대댓글</button>' : ""}
        </div>
      </div>
      <div class="comment-content">${comment.text}</div>
      <div class="reply-input-container" style="display: none;"></div>
    `;

    // 3) 대댓글 버튼 토글 (선택)
    const replyBtn = commentBox.querySelector(".reply-btn");
    const replyContainer = commentBox.querySelector(".reply-input-container");
    if (replyBtn) {
      replyBtn.addEventListener("click", () => {
        if (replyContainer.style.display === "block") {
          replyContainer.innerHTML = "";
          replyContainer.style.display = "none";
        } else {
          replyContainer.innerHTML = `
            <input type="text" class="reply-input" placeholder="답글을 입력하세요." />
            <button class="submit-reply">등록</button>
          `;
          replyContainer.style.display = "block";

          // (여기서 실제 대댓글 API 호출 로직 추가 가능)
          replyContainer
            .querySelector(".submit-reply")
            .addEventListener("click", async () => {
              const text = replyContainer
                .querySelector(".reply-input")
                .value.trim();
              if (!text) return;
              // TODO: POST /comments/{commentId}/replies API 호출 후, 댓글 다시 로드
            });
        }
      });
    }

    // 4) DOM에 추가
    container.appendChild(commentBox);

    // 5) 재귀 렌더: 대댓글이 있으면
    if (comment.replies && comment.replies.length) {
      const replyWrapper = document.createElement("div");
      replyWrapper.className = "reply-wrapper";
      commentBox.appendChild(replyWrapper);
      renderComments(comment.replies, replyWrapper, depth + 1);
    }
  });
}

// 6) 상세 팝업 열기 + 댓글 조회·작성 바인딩
async function openDetailPopup(post) {
  currentPost = post;
  // 기본 정보
  document.getElementById("detail-author").textContent = post.authorNickname;
  document.getElementById("detail-time").textContent = new Date(
    post.createdAt
  ).toLocaleString();
  document.getElementById("detail-title").textContent = post.title;
  document.getElementById("detail-body").textContent = post.content;
  document.getElementById("detail-tags").innerHTML = post.tags
    .map((t) => `<span class="tag"># ${t}</span>`)
    .join("");
  document.getElementById("detail-likes-count").textContent = post.likeCount;
  document.getElementById("detail-comments-count").textContent =
    post.commentCount;
  document.getElementById("detail-saves-count").textContent = post.scrapCount;

  // 이미지
  const imgCt = document.getElementById("detail-images");
  imgCt.innerHTML = post.thumbnailImageUrl
    ? `<img src="${post.thumbnailImageUrl}" class="detail-img"/>`
    : "";

  // 댓글 불러와서 렌더
  const comments = await fetchComments(post.postId);
  renderComments(comments, document.getElementById("detail-comments"));

  // 팝업 보이기
  document.querySelector(".detail-overlay").classList.remove("hidden");

  // 댓글 등록 버튼 바인딩
  document.getElementById("submit-main-comment").onclick = async () => {
    const inp = document.getElementById("main-comment-input");
    const txt = inp.value.trim();
    if (!txt) return;
    const res = await AccessAPI.apiFetch(
      `/api/v1/posts/${post.postId}/comments`,
      { method: "POST", body: JSON.stringify({ comment: txt }) }
    );
    if (!res.isSuccess) return alert("댓글 등록 실패: " + res.message);
    inp.value = "";
    const updated = await fetchComments(post.postId);
    renderComments(updated, document.getElementById("detail-comments"));
    document.getElementById("detail-comments-count").textContent =
      updated.length;
  };

  // 닫기 바인딩
  document.querySelector(".close-detail").onclick = () => {
    document.querySelector(".detail-overlay").classList.add("hidden");
  };
}

// 7) 최초 로드
document.addEventListener("DOMContentLoaded", () => {
  loadPosts(1);
  // 태그 필터, 글쓰기 팝업 등 나머지 이벤트도 여기에 바인딩
});
document.getElementById("search-btn").addEventListener("click", () => {
  const keyword = document.getElementById("search-input").value.trim();
  if (!keyword) {
    alert("검색어를 입력해주세요.");
    return;
  }
  searchPosts(keyword, 1);
});

async function searchPosts(keyword, page = 1) {
  try {
    const params = new URLSearchParams({
      page,
      size: postsPerPage,
      keyword,
    });

    const data = await AccessAPI.apiFetch(`/api/v1/posts/search?${params}`);

    if (!data.isSuccess) {
      return alert("검색 실패: " + data.message);
    }

    const {
      posts: searchResults,
      currentPage: cp,
      totalPages: tp,
    } = data.result;

    currentPage = cp;
    totalPages = tp;

    renderPosts(searchResults);
    renderPagination(); // 필요 시 재활용
    document.getElementById("tag-title").textContent = `"${keyword}" 검색 결과`;
  } catch (err) {
    console.error("검색 중 오류:", err);
    alert("검색 중 서버 오류가 발생했습니다.");
  }
}
document.getElementById("view-scrap-posts").addEventListener("click", () => {
  loadScrapPosts(1); // 첫 페이지부터 조회
});

async function loadScrapPosts(page = 1) {
  try {
    const params = new URLSearchParams({
      page,
      size: postsPerPage,
    });

    const data = await AccessAPI.apiFetch(`/api/v1/posts/scraps?${params}`);

    if (!data.isSuccess) {
      alert("스크랩 게시글 조회 실패: " + data.message);
      return;
    }

    const { posts: scrapPosts, currentPage: cp, totalPages: tp } = data.result;

    currentPage = cp;
    totalPages = tp;

    renderPosts(scrapPosts); // 기존 함수 재활용
    renderPagination(); // 페이지네이션 유지

    document.getElementById("tag-title").textContent = "⭐ 저장한 게시물";
  } catch (err) {
    console.error("스크랩 게시글 로딩 오류:", err);
    alert("스크랩 게시글 불러오는 중 오류가 발생했습니다.");
  }
}
