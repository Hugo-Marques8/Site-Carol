document.getElementById("buguer").addEventListener("click", function () {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('div');
  sections.forEach(section => {
      section.addEventListener('scroll', (e) => {
          e.currentTarget.scrollIntoView({ behavior: 'smooth' });
      });
  });
});
