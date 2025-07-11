document.addEventListener('DOMContentLoaded', function() {
    // --- Global Elements ---
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navOverlay = document.querySelector('.nav-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const progressBar = document.getElementById('progressBar');

    // --- Header & Navigation Toggle ---
    function toggleNav() {
        navList.classList.toggle('open');
        navToggle.classList.toggle('open');
        navOverlay.classList.toggle('show');
        body.classList.toggle('no-scroll'); // Prevent scroll when nav is open
    }

    navToggle.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', toggleNav); // Close nav when overlay is clicked

    // Close nav when a link is clicked (for single-page sites or smooth UX)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('open')) {
                toggleNav();
            }
        });
    });

    // --- Theme Toggle ---
    function applyTheme(theme) {
        body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        // Update header logo filter immediately for correct display
        const headerLogo = document.querySelector('.logo-image.header-logo');
        if (headerLogo) {
            if (theme === 'dark') {
                headerLogo.style.filter = 'brightness(0) invert(1)';
            } else {
                headerLogo.style.filter = ''; // Reset to default
            }
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- Scroll to Top Button ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll to top
        });
    });

    // --- Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // --- Initialize AOS ---
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true,    // whether animation should happen only once - while scrolling down
    });


    // --- Custom Modal System for Project Details ---
    const projectCards = document.querySelectorAll('.project-card');
    let modalOverlay = document.querySelector('.modal-overlay');

    // Create modal elements if they don't exist
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modal-overlay');
        document.body.appendChild(modalOverlay);

        const modalContentWrapper = document.createElement('div');
        modalContentWrapper.classList.add('modal-content-wrapper');
        modalOverlay.appendChild(modalContentWrapper);

        const modalCloseButton = document.createElement('button');
        modalCloseButton.classList.add('modal-close-button');
        modalCloseButton.innerHTML = '×'; // 'x' icon
        modalOverlay.appendChild(modalCloseButton); // Append to overlay, not content wrapper

        // Add event listener for close button
        modalCloseButton.addEventListener('click', closeModal);
        // Close modal when clicking outside content (on overlay)
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalOverlay.classList.contains('show')) {
                closeModal();
            }
        });
    }

    const modalContentWrapper = modalOverlay.querySelector('.modal-content-wrapper');

    function openModal(card) {
        const title = card.dataset.title;
        const image = card.dataset.image;
        const fullDescription = card.dataset.fullDescription;
        const tools = card.dataset.tools;
        const date = card.dataset.date;
        const role = card.dataset.role;
        // githubLink and demoLink exist as data attributes, but we won't display them here
        // const githubLink = card.dataset.githubLink;
        // const demoLink = card.dataset.demoLink;

        let modalHtml = `
            <h3 class="modal-title">${title}</h3>
            ${image ? `<img src="${image}" alt="${title}" class="modal-image">` : ''}
            <p class="modal-description">${fullDescription}</p>
            <div class="modal-info-section">
                <h4>Project Details</h4>
                <div class="modal-info-grid">
                    <div class="modal-info-item">
                        <span class="modal-info-label">Tools/Technologies:</span>
                        <span class="modal-info-value">${tools || 'N/A'}</span>
                    </div>
                    <div class="modal-info-item">
                        <span class="modal-info-label">Date:</span>
                        <span class="modal-info-value">${date || 'N/A'}</span>
                    </div>
                    <div class="modal-info-item">
                        <span class="modal-info-label">Our Role:</span>
                        <span class="modal-info-value">${role || 'N/A'}</span>
                    </div>
                </div>
            </div>
            `;
        
        // Removed the "Relevant Links" section from here
        // let linksHtml = '';
        // if (githubLink || demoLink) {
        //     linksHtml += '<div class="modal-links">';
        //     linksHtml += '<h4>Relevant Links</h4>';
        //     if (githubLink) {
        //         linksHtml += `<a href="${githubLink}" target="_blank" class="modal-link">GitHub Repo</a>`;
        //     }
        //     if (demoLink) {
        //         linksHtml += `<a href="${demoLink}" target="_blank" class="modal-link">Live Demo</a>`;
        //     }
        //     linksHtml += '</div>';
        // }
        // modalHtml += linksHtml; // Do not append linksHtml anymore

        modalContentWrapper.innerHTML = modalHtml;
        modalOverlay.classList.add('show');
        body.classList.add('no-scroll'); // Prevent page scroll when modal is open
    }

    function closeModal() {
        modalOverlay.classList.remove('show');
        body.classList.remove('no-scroll'); // Allow page scroll
        modalContentWrapper.scrollTop = 0; // Reset scroll position for next open
    }

    // Add click listener to each project card to open modal
    projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    // --- Footer Year ---
    const currentYearElements = document.querySelectorAll('[id^="current-year"]');
    currentYearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // --- Contact Form Submission (Example - no actual backend) ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulate form submission
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                // Simulate success
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.classList.remove('error');
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                contactForm.reset();
            } else {
                // Simulate error
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.classList.remove('success');
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
            }

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000); // Hide message after 5 seconds
        });
    }

}); // End DOMContentLoaded
