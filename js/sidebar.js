document.querySelectorAll('.sidebar-menu li > a').forEach(item => {
    item.addEventListener('click', function() {
      const parent = this.parentElement;
  
      parent.classList.toggle('active');
  
      document.querySelectorAll('.sidebar-menu li').forEach(li => {
        if (li !== parent) {
          li.classList.remove('active');
        }
      });
    });
  });
  

  document.addEventListener("DOMContentLoaded", function() {
    const hamburgerIcon = document.getElementById("hamburger-icon");
    const sidebar = document.querySelector(".sidebar");
    const closeButton = document.getElementById("close-btn");

    hamburgerIcon.addEventListener("click", () => sidebar.classList.add("active"));
    closeButton.addEventListener("click", () => sidebar.classList.remove("active"));
});