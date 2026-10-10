"use strict";
// Bootstrap owns focus trapping, Escape, backdrop and nested Collapse controls.
// Close the mobile drawer if the viewport moves to Bootstrap's desktop breakpoint.
const mobileNavigation = document.getElementById("mobileNavigation");
const desktopNavigationQuery = window.matchMedia("(min-width: 1200px)");
function closeMobileNavigationOnDesktop(event) {
    if (event.matches && mobileNavigation && window.bootstrap) {
        bootstrap.Offcanvas.getInstance(mobileNavigation)?.hide();
    }
}
desktopNavigationQuery.addEventListener("change", closeMobileNavigationOnDesktop);
