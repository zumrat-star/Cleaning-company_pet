// Плавная прокрутка к якорям
document.addEventListener("DOMContentLoaded", function () {
  // Плавная прокрутка при клике на ссылки
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      // Пропускаем ссылки без якоря
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Обновляем URL без перезагрузки страницы
        history.pushState(null, null, targetId);
      }
    });
  });

  // Плавное открытие/закрытие мобильного меню
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;
  const overlay = document.querySelector(".overlay");

  if (navToggle && navMenu && overlay) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation(); // Предотвращаем всплытие
      const isOpening = !navMenu.classList.contains("active");

      if (isOpening) {
        // Открываем меню
        openMobileMenu();
      } else {
        // Закрываем меню
        closeMobileMenu();
      }
    });

    // Закрытие меню при клике на оверлей
    overlay.addEventListener("click", function () {
      closeMobileMenu();
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });

    // Закрытие меню при клике вне его области (резервный вариант)
    document.addEventListener("click", function (e) {
      if (
        window.innerWidth <= 768 &&
        navMenu.classList.contains("active") &&
        !navToggle.contains(e.target) &&
        !navMenu.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Закрытие меню при изменении размера окна (если перешли на десктоп)
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add("active");
    navToggle.classList.add("active");
    overlay.classList.add("active");
    body.style.overflow = "hidden";

    // Плавное появление пунктов меню
    const menuItems = navMenu.querySelectorAll("li");
    menuItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-30px)";
      setTimeout(() => {
        item.style.transition = `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${
          index * 0.08
        }s`;
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, 50);
    });
  }

  function closeMobileMenu() {
    const menuItems = navMenu.querySelectorAll("li");
    const totalItems = menuItems.length;

    // Скрываем оверлей
    overlay.classList.remove("active");

    menuItems.forEach((item, index) => {
      const reverseIndex = totalItems - 1 - index;
      item.style.transition = `all 0.3s ease ${reverseIndex * 0.05}s`;
      item.style.opacity = "0";
      item.style.transform = "translateX(-30px)";
    });

    setTimeout(() => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
      body.style.overflow = "";

      // Сбрасываем стили после анимации
      setTimeout(() => {
        menuItems.forEach((item) => {
          item.style.transition = "";
          item.style.opacity = "";
          item.style.transform = "";
        });
      }, 300);
    }, 300);
  }

  // Изменение стиля хедера при скролле 
  const header = document.querySelector(".header");

  function updateScrollStyles() {
    const currentScrollY = window.scrollY;

    // Изменение фона хедера при скролле
    if (currentScrollY > 50) {
      header.style.background = "rgba(44, 62, 80, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(44, 62, 80, 0.95)";
      header.style.boxShadow = "none";
    }
  }

  // Оптимизация производительности скролла
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollStyles();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Активация пунктов меню при скролле
  function updateActiveMenuLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;
    const headerHeight = header.offsetHeight;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerHeight - 50;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Убираем активный класс у всех ссылок
        document.querySelectorAll(".nav-menu a").forEach((link) => {
          link.classList.remove("active");
        });
        // Добавляем активный класс к текущей ссылке
        document
          .querySelector(`.nav-menu a[href="#${sectionId}"]`)
          ?.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveMenuLink);

  // Инициализация при загрузке
  updateScrollStyles();
  updateActiveMenuLink();

  // Обработка клавиши Escape для закрытия меню
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Предзагрузка важных изображений (опционально)
  function preloadImages() {
    const images = [
      "image/mainCover/bg.jpg",
      "image/mainCover/about.jpg",
      "image/mainCover/clients.jpeg",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  // Запускаем предзагрузку после загрузки основного контента
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", preloadImages);
  } else {
    preloadImages();
  }
});

// Добавляем класс для анимаций после загрузки страницы
window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");
});
