document.addEventListener('DOMContentLoaded', function() {
    // Update current time in real-time
    function updateCurrentTime() {
        const currentTimeElement = document.getElementById('current-time');
        if (currentTimeElement) {
            const now = new Date();
            
            // Format time with AM/PM
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutesStr = minutes < 10 ? '0' + minutes : minutes;
            
            // Format date
            const monthNames = ["January", "February", "March", "April", "May", "June",
                               "July", "August", "September", "October", "November", "December"];
            const month = monthNames[now.getMonth()];
            const day = now.getDate();
            
            // Update the element
            currentTimeElement.textContent = `${hours}:${minutesStr}${ampm}, ${month} ${day}`;
        }
    }
    
    // Initial call
    updateCurrentTime();
    
    // Update the time every second
    setInterval(updateCurrentTime, 1000);
    
    // Set the width of the title underline to match the title width
    function setUnderlineWidth() {
        const underlines = document.querySelectorAll('.knight-rider-underline[data-title]');
        
        underlines.forEach(function(underline) {
            const titleId = underline.getAttribute('data-title');
            const titleElement = document.getElementById(titleId);
            
            if (titleElement) {
                // Get the computed width of the title text
                const width = titleElement.getBoundingClientRect().width;
                // Set the width with a slight buffer to ensure complete coverage
                underline.style.width = (width + 10) + 'px';
                
                // Make sure the underline track expands to fill the width
                const track = underline.querySelector('.underline-track');
                if (track) {
                    track.style.width = '100%';
                }
                
                console.log('Setting underline width for ' + titleId + ' to ' + (width + 10) + 'px');
            }
        });
        
        // Legacy support for underlines without data-title
        const englishTitle = document.getElementById('benefits-title-en');
        const spanishTitle = document.getElementById('benefits-title-es');
        const allUnderlines = document.querySelectorAll('.knight-rider-underline');
        
        // Only apply to underlines without data-title
        if (allUnderlines.length > underlines.length) {
            if (englishTitle) {
                const width = englishTitle.getBoundingClientRect().width;
                const englishUnderline = document.querySelectorAll('.knight-rider-underline:not([data-title])')[0];
                if (englishUnderline) {
                    englishUnderline.style.width = (width + 10) + 'px';
                }
            }
            
            if (spanishTitle) {
                const width = spanishTitle.getBoundingClientRect().width;
                const spanishUnderline = document.querySelectorAll('.knight-rider-underline:not([data-title])')[1];
                if (spanishUnderline) {
                    spanishUnderline.style.width = (width + 10) + 'px';
                }
            }
        }
    }
    
    // Call function on load and on resize with multiple attempts
    // Initial attempt
    setTimeout(setUnderlineWidth, 500);
    
    // Second attempt after all resources are loaded
    window.addEventListener('load', function() {
        setTimeout(setUnderlineWidth, 100);
        setTimeout(setUnderlineWidth, 500);
        setTimeout(setUnderlineWidth, 1000);
    });
    
    // Update on resize
    window.addEventListener('resize', function() {
        setUnderlineWidth();
        // Re-apply after a short delay to account for any dynamic changes
        setTimeout(setUnderlineWidth, 200);
    });
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Close all other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
    
    // Mobile navigation toggle functionality
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.classList.add('mobile-nav-toggle');
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('nav ul');
    
    // Only proceed if navContainer exists
    if (navContainer && navMenu) {
        navContainer.insertBefore(mobileNavToggle, navMenu);
        
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileNavToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Add mobile nav styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            nav ul {
                display: none;
            }
            
            nav ul.active {
                display: flex;
                flex-direction: column;
                width: 100%;
            }
            
            .mobile-nav-toggle {
                display: block;
                background: transparent;
                border: none;
                color: #333;
                font-size: 1.5rem;
                cursor: pointer;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-nav-toggle {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Highlight current section in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Form validation for contact forms
    const contactForms = document.querySelectorAll('form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.classList.add('error');
                    
                    const errorMsg = document.createElement('div');
                    errorMsg.classList.add('error-message');
                    errorMsg.textContent = 'This field is required';
                    
                    // Remove any existing error messages
                    const existingError = field.parentElement.querySelector('.error-message');
                    if (existingError) {
                        field.parentElement.removeChild(existingError);
                    }
                    
                    field.parentElement.appendChild(errorMsg);
                } else {
                    field.classList.remove('error');
                    const existingError = field.parentElement.querySelector('.error-message');
                    if (existingError) {
                        field.parentElement.removeChild(existingError);
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Add section ID attributes for smooth scrolling
    const sectionElements = {
        'Why Direct-Mail Still Wins': 'why-direct-mail',
        'How It Works': 'how-works',
        'Real-Time Availability': 'availability',
        'Sizes & Investment': 'pricing',
        'Mailing Map & Drop Dates': 'mailing-map',
        'Proof & Results': 'proof-results',
        'Frequently Asked Questions': 'faq'
    };
    
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading && sectionElements[heading.textContent]) {
            section.id = sectionElements[heading.textContent];
        }
    });
    
    // Enable smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });
    
    // Countdown timer functionality
    const countdownElement = document.querySelector('.countdown-timer');
    if (countdownElement) {
        const daysElement = countdownElement.querySelector('.time-block:nth-child(1) .number');
        const hoursElement = countdownElement.querySelector('.time-block:nth-child(3) .number');
        const minutesElement = countdownElement.querySelector('.time-block:nth-child(5) .number');
        
        // Set deadline to 14 days from now
        const now = new Date();
        const deadline = new Date(now);
        deadline.setDate(now.getDate() + 14);
        
        function updateCountdown() {
            const currentTime = new Date();
            const diff = deadline - currentTime;
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                
                daysElement.textContent = days < 10 ? `0${days}` : days;
                hoursElement.textContent = hours < 10 ? `0${hours}` : hours;
                minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
            }
        }
        
        // Update countdown every minute
        updateCountdown();
        setInterval(updateCountdown, 60000);
    }
});