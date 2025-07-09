document.addEventListener("DOMContentLoaded", () => {
  const profileMode = document.querySelector(".profile-mode");
  const savedMode = document.querySelector(".saved-mode");
  const likedMode = document.querySelector(".liked-mode");
  const activityMode = document.querySelector(".activity-mode");
  const savedBtn = document.getElementById("savedBtn");
  const likedBtn = document.getElementById("likedBtn");
  const myActivityBtn = document.querySelector(".my-activity");
  const commentsMode = document.querySelector(".my-comments-mode");

  // 공통: 모든 모드 숨기기
  function hideAll() {
    [profileMode, savedMode, likedMode, activityMode, commentsMode].forEach(
      (sec) => sec.classList.add("hidden")
    );
  }

  // 저장한 게시물
  savedBtn.addEventListener("click", () => {
    hideAll();
    savedMode.classList.remove("hidden");
  });

  // 좋아요한 게시물
  likedBtn.addEventListener("click", () => {
    hideAll();
    likedMode.classList.remove("hidden");
  });

  // 내 활동
  myActivityBtn.addEventListener("click", () => {
    hideAll();
    activityMode.classList.remove("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const likedContent = document.querySelector(".liked-content");
  const tpl = document.getElementById("liked-card-template");

  // 1) 더미 데이터 예시 (나중에 fetch로 교체)
  const likedItems = [
    {
      title: "○○,○○,○○으로 만들 수 있는 메뉴 추천합니다.",
      body: "이거 저거 이거 저거 이렇게 저렇게 이렇게 저렇게 하면 됩니다.",
      tags: ["#식단 질문", "#식단 추천"],
      imageCount: 3,
    },
    {
      title: "다른 좋아요 글 예시",
      body: "이 글은 예시 텍스트입니다.",
      tags: ["#레시피", "#푸드스타일링"],
      imageCount: 1,
    },
    // ... 원하는 만큼 추가
  ];

  // 2) 렌더 함수
  function renderLiked(items) {
    likedContent.innerHTML = ""; // 기존 내용 초기화
    items.forEach((item) => {
      const clone = tpl.content.cloneNode(true);
      // 텍스트 채우기
      clone.querySelector(".card-title").textContent = item.title;
      clone.querySelector(".card-body").textContent = item.body;
      // 태그 렌더링
      const tagWrap = clone.querySelector(".card-tags");
      item.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagWrap.append(span);
      });
      // 썸네일: 이미지 수가 0보다 크면 +N 표시
      const thumb = clone.querySelector(".thumbnail");
      if (item.imageCount > 0) {
        thumb.textContent = `+${item.imageCount}`;
      }
      likedContent.append(clone);
    });
  }

  // 3) 초기 렌더링
  renderLiked(likedItems);
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".my-posts-content");
  const tpl = document.getElementById("my-post-card-template");

  // 더미 데이터 (나중에 fetch 로 교체)
  const myPosts = [
    {
      title: "첫 번째 내 게시물 제목",
      body: "내 게시물 내용 예시입니다. 자유롭게 수정하세요.",
      tags: ["#내피드", "#자유게시판"],
      imageCount: 2,
      checked: false,
    },
    {
      title: "두 번째 게시물",
      body: "JS를 이용해 자동으로 렌더링 됩니다.",
      tags: ["#업데이트"],
      imageCount: 0,
      checked: true,
    },
    // …원하는 만큼 추가
  ];

  function renderMyPosts(items) {
    container.innerHTML = "";
    items.forEach((item) => {
      const clone = tpl.content.cloneNode(true);
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

      // 체크박스 상태
      const chk = clone.querySelector(".checkbox input");
      if (item.checked) chk.checked = true;

      // 썸네일 개수
      const thumb = clone.querySelector(".thumbnail");
      thumb.textContent = item.imageCount > 0 ? `+${item.imageCount}` : "";

      container.append(clone);
    });
  }

  // 초기 렌더
  renderMyPosts(myPosts);

  // (선택) API 호출시:
  // fetch('/api/my-posts')
  //   .then(res => res.json())
  //   .then(renderMyPosts);
});

function renderCards(items, container) {
  const tpl = document.getElementById("card-template");

  container.innerHTML = ""; // 초기화
  items.forEach((item) => {
    const clone = tpl.content.cloneNode(true);

    // 1) 제목·본문
    clone.querySelector(".card-title").textContent = item.title;
    clone.querySelector(".card-body").textContent = item.body;

    // 2) 사진 썸네일
    const imgWrap = clone.querySelector(".card-images");
    item.images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = item.title;
      imgWrap.append(img);
    });

    // 3) 해시태그
    const tagWrap = clone.querySelector(".card-tags");
    item.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagWrap.append(span);
    });

    // 4) +N 썸네일 (옵션)
    const thumb = clone.querySelector(".thumbnail");
    if (item.images.length > 3) {
      thumb.textContent = `+${item.images.length - 3}`;
    } else {
      thumb.textContent = "";
    }

    container.append(clone);
  });
}

// 예시 호출
const demoData = [
  {
    title: "○○,○○,○○로 만들 수 있는 메뉴 추천합니다.",
    body: "이거 저거 이렇게 저렇게 하면 됩니다.",
    images: [
      "../images/img1.jpg",
      "../images/img2.jpg",
      "../images/img3.jpg",
      "../images/img4.jpg", // 4장째부터 +N 로 표시
    ],
    tags: ["#식단질문", "#식단추천"],
  },
  // …다른 카드들…
];

renderCards(demoData, document.querySelector(".saved-content"));
renderCards(demoData, document.querySelector(".liked-content"));
renderCards(demoData, document.querySelector(".my-posts-content"));

document.addEventListener("DOMContentLoaded", () => {
  const commentsLink = document.getElementById("my-comments");
  const allSections = document.querySelectorAll(".info-card"); // 모든 모드 섹션
  const commentsSection = document.querySelector(".my-comments-mode"); // 댓글 모드

  commentsLink.addEventListener("click", (e) => {
    e.preventDefault();

    // 1) 모든 섹션 숨기기
    allSections.forEach((sec) => sec.classList.add("hidden"));

    // 2) 내가 쓴 댓글 모드 보이기
    commentsSection.classList.remove("hidden");

    // 3) (필요하다면) 댓글 리스트 렌더링 호출
    // renderComments(myComments);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const commentsLink = document.getElementById("my-comments");
  const allSections = document.querySelectorAll(".info-card"); // 모든 모드 섹션
  const commentsSection = document.querySelector(".my-comments-mode"); // 댓글 모드

  commentsLink.addEventListener("click", (e) => {
    e.preventDefault();

    // 1) 모든 섹션 숨기기
    allSections.forEach((sec) => sec.classList.add("hidden"));

    // 2) 내가 쓴 댓글 모드 보이기
    commentsSection.classList.remove("hidden");

    // 3) (필요하다면) 댓글 리스트 렌더링 호출
    // renderComments(myComments);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tpl = document.getElementById("comment-card-template");
  const container = document.querySelector(".my-comments-content");

  // 더미 데이터 예시
  const myComments = [
    {
      title: "○○,○○,○○으로 만들 수 있는 메뉴 추천합니다.",
      body: "이거 저거 이렇게 저렇게 하면 맛있어요!",
      tags: ["#식단질문", "#건강식"],
      images: [
        // 실제 URL로 교체
        "../images/img1.jpg",
        "../images/img2.jpg",
        "../images/img3.jpg",
        "../images/img4.jpg",
      ],
    },
    {
      title: "오늘의 샐러드 레시피",
      body: "간단하게 드레싱만 뿌려서 냠냠~",
      tags: ["#레시피", "#채식"],
      images: ["../images/salad.jpg"],
    },
    // …더미를 원하는 만큼…
  ];

  function renderComments(comments) {
    container.innerHTML = "";
    comments.forEach((c) => {
      const clone = tpl.content.cloneNode(true);

      // 1) 제목 · 본문
      clone.querySelector(".card-title").textContent = c.title;
      clone.querySelector(".card-body").textContent = c.body;

      // 2) 해시태그 렌더
      const tagWrap = clone.querySelector(".card-tags");
      c.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagWrap.append(span);
      });

      // 3) 사진 썸네일
      const imgWrap = clone.querySelector(".card-images");
      c.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = c.title;
        imgWrap.append(img);
      });

      // 4) +N 표시 (네 장 이상이면 뒤에 +N)
      const thumb = clone.querySelector(".thumbnail");
      if (c.images.length > 3) {
        thumb.textContent = `+${c.images.length - 3}`;
      }

      container.append(clone);
    });
  }

  // 첫 렌더
  renderComments(myComments);
});
