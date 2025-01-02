document.addEventListener("DOMContentLoaded", () => {
  function activateNav() {
    const navItems = document.querySelectorAll("ul.nav > li");
    navItems.forEach((item) => {
      item.addEventListener("click", (evt) => {
        if (item.classList.contains("toggle-nav")) return;
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  function addToggle() {
    const toggleButton = document.querySelector("li.toggle-nav");
    const sideNav = document.querySelector(".navbar-nav.side-nav");
    const wrapper = document.getElementById("wrapper");
    const toggleIcon = toggleButton.querySelector("i");

    toggleButton.addEventListener("click", () => {
      toggleIcon.classList.toggle("rotate-180-deg");
      sideNav.classList.toggle("hide-link-text");
      wrapper.classList.toggle("expanded");
    });
  }

  function fixHamburgerUl() {
    const navbarToggle = document.querySelector(".navbar-toggle");
    const sideNav = document.querySelector(".navbar-nav.side-nav");
    const wrapper = document.getElementById("wrapper");
    const arrowIcon = document.querySelector("i.fa-arrow-left");

    navbarToggle.addEventListener("click", () => {
      sideNav.classList.remove("hide-link-text");
      wrapper.classList.remove("expanded");
      arrowIcon.classList.remove("rotate-180-deg");
    });
  }

  function fetchDocs() {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => {
        const docsTable = document.querySelector(".docs-table tbody");
        docsTable.innerHTML = "";
        data.forEach((doc) => {
          const row = `
              <tr>
                <td><i class="fa fa-file-${doc.Type}-o"></i></td>
                <td>${doc.Name}</td>
                <td>${doc.Description}</td>
                <td>${doc.Tags}</td>
                <td>${doc.LastViewed}</td>
                <td>${doc.Expiration}</td>
              </tr>
            `;
          docsTable.insertAdjacentHTML("beforeend", row);
        });
      });
  }

  activateNav();
  addToggle();
  fixHamburgerUl();
  fetchDocs();
});
