// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: false,
  mirror: true,
});

// Custom Cursor
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  setTimeout(() => {
    cursorFollower.style.left = e.clientX + "px";
    cursorFollower.style.top = e.clientY + "px";
  }, 100);
});

// Cursor Effects on Hover
const hoverElements = document.querySelectorAll(
  "a, button, .clickable, .portfolio-item, .skill-card, .social-link"
);

hoverElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorFollower.style.width = "60px";
    cursorFollower.style.height = "60px";
    cursorFollower.style.backgroundColor = "rgba(108, 99, 255, 0.3)";
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
  });

  el.addEventListener("mouseleave", () => {
    cursorFollower.style.width = "40px";
    cursorFollower.style.height = "40px";
    cursorFollower.style.backgroundColor = "transparent";
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
  });
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".modern-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Animate Skill Bars When Visible
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    bar.style.width = width;
  });
}

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars();
        skillsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const skillsSection = document.querySelector("#skills");
if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// Form Submission
const contactForm = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("process_contact.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          formResponse.innerHTML = `<div class="alert success">${data.message}</div>`;
          contactForm.reset();

          setTimeout(() => {
            formResponse.innerHTML = "";
          }, 3000);
        } else {
          if (data.errors) {
            let errorHtml = '<div class="alert error"><ul>';
            for (const [field, message] of Object.entries(data.errors)) {
              errorHtml += `<li>${message}</li>`;
            }
            errorHtml += "</ul></div>";
            formResponse.innerHTML = errorHtml;
          } else {
            formResponse.innerHTML = `<div class="alert error">${data.message}</div>`;
          }
        }
      })
      .catch((error) => {
        formResponse.innerHTML = `<div class="alert error">An error occurred. Please try again later.</div>`;
        console.error("Error:", error);
      });
  });
}

// Set current year in footer
document.querySelector(
  ".footer p"
).innerHTML = `&copy; ${new Date().getFullYear()} Razi. All rights reserved.`;

// Pindahkan garis navigasi saat link diklik
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
    updateNavIndicator();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const fullText = "Fahrurrazi";
  const typingElement = document.getElementById("typing-text");

  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 120;

  function typeWriter() {
    const currentText = fullText.substring(0, charIndex);
    typingElement.innerHTML = currentText;

    if (!isDeleting && charIndex < fullText.length) {
      // Mode mengetik
      charIndex++;
      setTimeout(typeWriter, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Mode menghapus
      charIndex--;
      setTimeout(typeWriter, typingSpeed / 2);
    } else {
      // Ganti mode
      isDeleting = !isDeleting;
      setTimeout(typeWriter, isDeleting ? 2000 : 500);
    }
  }

  // Mulai animasi
  setTimeout(typeWriter, 1000);
});

// Update indikator saat scroll
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
