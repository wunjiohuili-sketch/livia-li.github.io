// 移动端导航开关：点击按钮时展开或收起菜单
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // 点击导航链接后收起菜单，手机浏览时更顺手
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// 页面内锚点平滑滚动：用于导航、View Works 和 Contact Me 按钮
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId && document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// 图片加载管理：缺图时显示 IMAGE PENDING，占位框不会出现浏览器破图标
const managedImages = document.querySelectorAll(".managed-image");

function markImageLoaded(image) {
  const frame = image.closest(".work-image-frame, .detail-image-frame, .qr-frame");
  const placeholder = frame?.querySelector("span");

  image.classList.add("is-loaded");
  frame?.classList.add("has-image");

  if (placeholder) {
    placeholder.hidden = true;
  }
}

function markImagePending(image) {
  const frame = image.closest(".work-image-frame, .detail-image-frame, .qr-frame");
  const placeholder = frame?.querySelector("span");

  image.classList.remove("is-loaded");
  frame?.classList.remove("has-image");

  if (placeholder) {
    placeholder.hidden = false;
  }
}

managedImages.forEach((image) => {
  image.addEventListener("load", () => markImageLoaded(image));
  image.addEventListener("error", () => markImagePending(image));

  if (image.complete && image.naturalWidth > 0) {
    markImageLoaded(image);
  } else if (image.complete) {
    markImagePending(image);
  }
});

// Contact 二维码弹窗：WeChat / QQ 共用一个弹窗容器
const qrModal = document.querySelector("#qr-modal");
const qrModalTitle = document.querySelector("#qr-modal-title");
const qrModalImage = document.querySelector("[data-qr-image]");
const qrFrame = document.querySelector("[data-qr-frame]");
const qrTriggers = document.querySelectorAll("[data-qr-open]");
const qrCloseButtons = document.querySelectorAll("[data-qr-close]");

const qrMap = {
  wechat: {
    title: "WeChat",
    src: "assets/images/wechat-qr.jpg",
    alt: "WeChat 二维码",
  },
  qq: {
    title: "QQ",
    src: "assets/images/qq-qr.jpg",
    alt: "QQ 二维码",
  },
};

function openQrModal(type) {
  const qrData = qrMap[type];

  if (!qrModal || !qrData || !qrModalTitle || !qrModalImage) {
    return;
  }

  qrModalTitle.textContent = qrData.title;
  qrModalImage.alt = qrData.alt;
  qrModalImage.classList.remove("is-loaded");
  qrFrame?.classList.remove("has-image");

  const placeholder = qrFrame?.querySelector("span");
  if (placeholder) {
    placeholder.hidden = false;
  }

  qrModalImage.src = qrData.src;
  qrModal.classList.add("is-open");
  qrModal.setAttribute("aria-hidden", "false");
}

function closeQrModal() {
  if (!qrModal) {
    return;
  }

  qrModal.classList.remove("is-open");
  qrModal.setAttribute("aria-hidden", "true");
}

qrTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openQrModal(trigger.dataset.qrOpen);
  });
});

qrCloseButtons.forEach((button) => {
  button.addEventListener("click", closeQrModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && qrModal?.classList.contains("is-open")) {
    closeQrModal();
  }
});

// 后续板块进入视口时轻微出现，保持作品集页面的安静节奏
const revealItems = document.querySelectorAll(".content-section");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal-item");
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
