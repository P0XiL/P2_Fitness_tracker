
// The function which enables tab switching
document.addEventListener('DOMContentLoaded', function () {
    // Assigns all tabs to an array called links
    const links = document.querySelectorAll('nav a');
    // Get all navigation links
    const navLinks = document.querySelectorAll('#side-nav a');

    // Add click event listener to all buttons for tabs
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            // Disables the hyperref linking from the tab itself since we arent redirecting, but instead showing and hiding specific pages
            e.preventDefault();

            // Remove 'active' class from all tabs
            document.querySelectorAll('.page').forEach(function (page) {
                page.classList.remove('active');
            });

            // Get the id for the tab which has been clicked
            const targetId = this.getAttribute('href').substring(1);

            // Add 'active' class to tab which has been clicked
            document.getElementById(targetId).classList.add('active');
            highlightNavLink(targetId);
        });
    });

    //Function which highlights the link of the currently selected tab
    function highlightNavLink(pageId) {
        // Remove 'active' class from all navigation links
        var navLinks = document.querySelectorAll('#side-nav a');
        navLinks.forEach(function(link) {
          link.classList.remove('active');
        });
      
        // Add 'active' class to the corresponding navigation link
        var activeLink = document.querySelector('#side-nav a[href="#' + pageId + '"]');
        activeLink.classList.add('active');
      }
    
    // Handle login link separately
    const loginLink = document.querySelector('#top-nav a[href="C:/Users/Jacob/OneDrive/Uni/2. semester/P2/Database/PublicResources/html/Login.html"]');
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            // Allow default behavior for login link
            return true;
        });
    }
});

