document.addEventListener('DOMContentLoaded', () => {
    // Universal elements
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.main-nav .nav-list');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');
    const themeToggle = document.getElementById('theme-toggle');
    const progressBar = document.getElementById('progressBar');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const navOverlay = document.querySelector('.nav-overlay'); // NEW: Get the nav overlay

    // --- Navigation Toggle ---
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navList.classList.toggle('open');
        body.classList.toggle('no-scroll'); // NEW: Toggle no-scroll on body
        navOverlay.classList.toggle('show'); // NEW: Toggle overlay visibility
    });

    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navList.classList.remove('open');
            body.classList.remove('no-scroll'); // NEW: Remove no-scroll
            navOverlay.classList.remove('show'); // NEW: Hide overlay
        });
    });

    // NEW: Close nav when clicking on the overlay
    navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navList.classList.remove('open');
        body.classList.remove('no-scroll');
        navOverlay.classList.remove('show');
    });

    // --- Theme Toggle ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let theme = 'light-mode';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    // --- Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = progress + '%';

        // Show/hide scroll-to-top button
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // --- Scroll to Top Button ---
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- AOS Initialization ---
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
    });

    // --- Dynamic Year for Footer ---
    // This finds all elements whose ID starts with "current-year"
    const currentYearElements = document.querySelectorAll('[id^="current-year"]');
    currentYearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // --- Project Card Modal (Ensure this part is correctly in your script.js if you have it) ---
    const projectCards = document.querySelectorAll('.project-card');
    let modalOverlay = document.getElementById('projectModalOverlay');
    let modalContent = document.getElementById('projectModalContent');
    let modalCloseButton = document.getElementById('projectModalClose');

    // Create modal elements if they don't exist (robustness)
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'projectModalOverlay';
        modalOverlay.className = 'modal-overlay';
        document.body.appendChild(modalOverlay);

        const modalContentWrapper = document.createElement('div');
        modalContentWrapper.className = 'modal-content-wrapper';
        modalOverlay.appendChild(modalContentWrapper);

        modalCloseButton = document.createElement('button');
        modalCloseButton.id = 'projectModalClose';
        modalCloseButton.className = 'modal-close-button';
        modalCloseButton.innerHTML = '&times;';
        modalCloseButton.setAttribute('aria-label', 'Close project details');
        modalOverlay.appendChild(modalCloseButton); // Append to overlay, not content wrapper

        modalContent = document.createElement('div');
        modalContent.id = 'projectModalContent';
        modalContentWrapper.appendChild(modalContent);
    }

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Populate modal content
            const title = this.dataset.title;
            const image = this.dataset.image;
            const description = this.dataset.description;
            const extraDetails = this.dataset.extraDetails;

            modalContent.innerHTML = `
                <h3>${title}</h3>
                <img src="${image}" alt="${title}" class="modal-image" loading="lazy">
                <p>${description}</p>
                ${extraDetails ? `<div class="extra-details"><h4>Further Details:</h4><p>${extraDetails}</p></div>` : ''}
            `;

            // Show modal
            modalOverlay.classList.add('show');
            body.classList.add('no-scroll'); // Prevent scroll behind modal
        });
    });

    // Close modal listeners
    function closeModal() {
        modalOverlay.classList.remove('show');
        body.classList.remove('no-scroll'); // Re-enable scroll
    }

    modalCloseButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) { // Only close if clicked directly on overlay, not content
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });


    // Form submission handling for contact page
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.className = 'form-message error show'; // Add 'show' class to make it visible
                formMessage.style.display = 'block'; // Ensure it's block
            } else {
                // Simulate form submission
                console.log('Form submitted:', { name, email, subject: document.getElementById('subject').value.trim(), message });

                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success show';
                formMessage.style.display = 'block';

                contactForm.reset(); // Clear the form

                // Hide message after a few seconds
                setTimeout(() => {
                    formMessage.classList.remove('show');
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
    }

});
