document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.main-header');

    navToggle.addEventListener('click', () => {
        navList.classList.toggle('open');
        navToggle.classList.toggle('open');
        // Adjust header padding/height if needed for open mobile nav
        // Note: This dynamic padding adjustment is basic; for complex headers, consider fixed height or CSS control.
        if (navList.classList.contains('open')) {
            // A simple way to extend header, might need refinement based on exact header structure
            header.style.paddingBottom = navList.offsetHeight + 'px';
        } else {
            header.style.paddingBottom = '';
        }
    });

    // Close nav when a link is clicked (for mobile)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('open');
            navToggle.classList.remove('open');
            header.style.paddingBottom = '';
        });
    });

    // Close nav if clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (!navToggle.contains(event.target) && !navList.contains(event.target) && navList.classList.contains('open')) {
            navList.classList.remove('open');
            navToggle.classList.remove('open');
            header.style.paddingBottom = '';
        }
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    } else {
        // Default to light mode if no theme is saved
        document.body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        let theme = 'light-mode';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => { // Corrected arrow function syntax here
        let scrollTop = document.documentElement.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    // --- Scroll-to-Top Button ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) { // Show button after scrolling 200px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll effect
        });
    });

    // --- Current Year in Footer ---
    const currentYearElements = document.querySelectorAll('[id^="current-year"]');
    currentYearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // --- AOS Initialization ---
    AOS.init({
        duration: 1000,
        once: true, // animations will run only once
        mirror: false, // whether elements should animate out from screen and back in
    });

    // --- Modal System ---
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Create modal elements
    const modalContentWrapper = document.createElement('div');
    modalContentWrapper.classList.add('modal-content-wrapper');

    const modalCloseButton = document.createElement('button');
    modalCloseButton.classList.add('modal-close-button');
    modalCloseButton.innerHTML = '×'; // 'X' symbol
    modalCloseButton.setAttribute('aria-label', 'Close modal');

    const modalTitle = document.createElement('h3');
    const modalImage = document.createElement('img');
    modalImage.classList.add('modal-image');
    modalImage.setAttribute('loading', 'lazy'); // Add lazy loading to modal image

    const modalDescription = document.createElement('p');

    const modalExtraDetails = document.createElement('div');
    modalExtraDetails.classList.add('extra-details');
    const modalExtraDetailsTitle = document.createElement('h4');
    modalExtraDetailsTitle.textContent = 'Additional Details';
    const modalExtraDetailsP = document.createElement('p');
    modalExtraDetails.appendChild(modalExtraDetailsTitle);
    modalExtraDetails.appendChild(modalExtraDetailsP);


    // Assemble the modal structure:
    // Close button is a direct child of overlay for fixed positioning
    modalOverlay.appendChild(modalCloseButton);
    // Content wrapper holds the main scrollable content
    modalContentWrapper.appendChild(modalTitle);
    modalContentWrapper.appendChild(modalImage);
    modalContentWrapper.appendChild(modalDescription);
    modalContentWrapper.appendChild(modalExtraDetails);
    modalOverlay.appendChild(modalContentWrapper);

    // Finally, append the entire modal overlay to the body
    document.body.appendChild(modalOverlay);


    function openModal(title, imageUrl, description, extraDetails) {
        modalTitle.textContent = title;
        modalImage.src = imageUrl;
        modalImage.alt = title; // Use title as alt text for modal image
        modalDescription.textContent = description;
        
        // Update extra details section conditionally
        if (extraDetails && extraDetails !== 'No specific additional details available for this item yet. For more information, please contact us.') {
            modalExtraDetailsP.textContent = extraDetails;
            modalExtraDetails.style.display = 'block'; // Show if content
        } else {
            modalExtraDetailsP.textContent = 'No specific additional details available for this item yet. For more information, please contact us.';
            modalExtraDetails.style.display = 'block'; // Show default message
        }

        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent body scrolling
    }

    function closeModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore body scrolling
    }

    // Event listeners for closing modal
    modalCloseButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        // Close only if clicking directly on the overlay, not on the modal content
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });

    // Attach modal functionality ONLY to project cards
    document.querySelectorAll('.project-card').forEach(card => { // Selector changed to ONLY target .project-card
        card.addEventListener('click', (event) => {
            // Prevent default navigation if the click target or its ancestor is an actual link
            if (event.target.tagName === 'A' || event.target.closest('a')) {
                return;
            }

            const title = card.getAttribute('data-title');
            const imageUrl = card.getAttribute('data-image');
            const description = card.getAttribute('data-description');
            const extraDetails = card.getAttribute('data-extra-details') || 'No specific additional details available for this item yet. For more information, please contact us.';

            if (title && imageUrl && description) {
                openModal(title, imageUrl, description, extraDetails);
            }
        });
    });
});