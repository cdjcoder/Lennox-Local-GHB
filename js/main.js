// Gigante Print Media - Enhanced JavaScript

// Loading Screen Control
window.addEventListener('load', function() {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (loaderWrapper) {
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
            }, 500);
        }, 2600); // Show loader for 2.6 seconds after page loads
    }
});

// Smooth scroll function
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Parallax Scrolling and Cursor Movement Effect Handler
class ParallaxController {
    constructor() {
        this.parallaxContainer = document.getElementById('parallax-transition');
        this.parallaxLayers = document.querySelectorAll('.parallax-layer');
        this.isDesktop = window.innerWidth > 768;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.ticking = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.initialPositions = [];
        
        this.init();
    }
    
    init() {
        if (!this.parallaxContainer || this.isReducedMotion) return;
        
        // Store initial positions
        this.parallaxLayers.forEach(layer => {
            const computedStyle = window.getComputedStyle(layer);
            const transform = computedStyle.transform !== 'none' ? computedStyle.transform : 'matrix(1, 0, 0, 1, 0, 0)';
            this.initialPositions.push(transform);
        });
        
        // Bind scroll event with throttling
        window.addEventListener('scroll', () => this.requestTick('scroll'), { passive: true });
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        // Add mouse move event listener for cursor-based parallax
        this.parallaxContainer.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
        this.parallaxContainer.addEventListener('mouseleave', () => this.handleMouseLeave(), { passive: true });
        this.parallaxContainer.addEventListener('mouseenter', () => this.handleMouseEnter(), { passive: true });
        
        // Initial update
        this.updateParallax('scroll');
    }
    
    requestTick(eventType) {
        if (!this.ticking) {
            requestAnimationFrame(() => this.updateParallax(eventType));
            this.ticking = true;
        }
    }
    
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        const rect = this.parallaxContainer.getBoundingClientRect();
        const containerCenterX = rect.left + rect.width / 2;
        const containerCenterY = rect.top + rect.height / 2;
        
        this.centerX = containerCenterX;
        this.centerY = containerCenterY;
        
        this.requestTick('mouse');
    }
    
    handleMouseLeave() {
        // Smoothly reset positions when mouse leaves container
        this.requestTick('reset');
    }
    
    handleMouseEnter() {
        // Prepare for mouse movement tracking
        this.requestTick('mouse');
    }
    
    updateParallax(eventType) {
        if (!this.isDesktop) {
            this.ticking = false;
            return;
        }
        
        const scrollTop = window.pageYOffset;
        const containerRect = this.parallaxContainer.getBoundingClientRect();
        const containerTop = containerRect.top + scrollTop;
        const containerHeight = containerRect.height;
        const windowHeight = window.innerHeight;
        
        // Check if container is in viewport
        if (containerRect.bottom < 0 || containerRect.top > windowHeight) {
            this.ticking = false;
            return;
        }
        
        // Calculate parallax offset for scroll
        const scrollProgress = (scrollTop - containerTop + windowHeight) / (containerHeight + windowHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        this.parallaxLayers.forEach((layer, index) => {
            const speed = parseFloat(layer.dataset.speed) || 1;
            let xPos = 0;
            let yPos = (clampedProgress - 0.5) * 100 * (1 - speed);
            
            // Add cursor-based parallax effect if event is from mouse movement
            if (eventType === 'mouse') {
                const mouseXFactor = (this.mouseX - this.centerX) / (window.innerWidth / 2);
                const mouseYFactor = (this.mouseY - this.centerY) / (window.innerHeight / 2);
                
                // Different layers move at different speeds and directions
                const layerSpeed = (3 - speed) * 15; // Invert speed for natural feeling
                xPos = mouseXFactor * layerSpeed * -1; // Move opposite to cursor for depth effect
                
                // Add Y movement - less pronounced than X movement
                const yOffset = mouseYFactor * layerSpeed * -0.5;
                yPos += yOffset;
            } else if (eventType === 'reset') {
                // Smoothly reset to scroll-based position
                xPos = 0;
                // yPos already calculated from scroll
            }
            
            // Apply transform with GPU acceleration
            layer.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        });
        
        this.ticking = false;
    }
    
    handleResize() {
        this.isDesktop = window.innerWidth > 768;
        
        // Update center position
        if (this.parallaxContainer) {
            const rect = this.parallaxContainer.getBoundingClientRect();
            this.centerX = rect.left + rect.width / 2;
            this.centerY = rect.top + rect.height / 2;
        }
        
        // Reset transforms on mobile
        if (!this.isDesktop) {
            this.parallaxLayers.forEach(layer => {
                layer.style.transform = 'translate3d(0, 0, 0)';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Parallax Controller
    new ParallaxController();
    
    // Find Out More Button Functionality
    const findOutMoreBtn = document.getElementById('findOutMoreBtn');
    const expandableContent = document.getElementById('expandableContent');
    const findOutMoreIcon = document.getElementById('findOutMoreIcon');
    
    if (findOutMoreBtn && expandableContent) {
        findOutMoreBtn.addEventListener('click', function() {
            const isExpanded = expandableContent.style.maxHeight && expandableContent.style.maxHeight !== '0px';
            
            if (isExpanded) {
                // Collapse
                expandableContent.style.maxHeight = '0';
                expandableContent.style.opacity = '0';
                findOutMoreIcon.style.transform = 'rotate(0deg)';
                if (document.body.classList.contains('spanish')) {
                    findOutMoreBtn.innerHTML = '<i class="fas fa-chevron-down" id="findOutMoreIcon" style="margin-right: 10px; transition: transform 0.3s ease;">Descubre Más</i>';
                } else {
                    findOutMoreBtn.innerHTML = '<i class="fas fa-chevron-down" id="findOutMoreIcon" style="margin-right: 10px; transition: transform 0.3s ease;">Find Out More</i>';
                }
            } else {
                // Expand
                expandableContent.style.maxHeight = expandableContent.scrollHeight + 'px';
                expandableContent.style.opacity = '1';
                findOutMoreIcon.style.transform = 'rotate(180deg)';
                if (document.body.classList.contains('spanish')) {
                    findOutMoreBtn.innerHTML = '<i class="fas fa-chevron-up" id="findOutMoreIcon" style="margin-right: 10px; transition: transform 0.3s ease;">Mostrar Menos</i>';
                } else {
                    findOutMoreBtn.innerHTML = '<i class="fas fa-chevron-up" id="findOutMoreIcon" style="margin-right: 10px; transition: transform 0.3s ease;">Show Less</i>';
                }
            }
        });
    }

    // Mouse Cursor Effect
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorTrail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let sparkleTimer = 0;
    let currentSparkleColors = ['light-sparkle', 'gold-sparkle'];
    
    // Define section color mappings
    const sectionColorMappings = {
        'hero': ['light-sparkle', 'gold-sparkle'],
        'benefits': ['dark-sparkle', 'orange-sparkle'],
        'service-area': ['light-sparkle', 'blue-sparkle'],
        'pricing': ['light-sparkle', 'purple-sparkle'],
        'faq': ['light-sparkle', 'gold-sparkle'],
        'footer': ['light-sparkle', 'blue-sparkle'],
        'default': ['light-sparkle', 'gold-sparkle']
    };
    
    // Function to detect current section
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id], div[id]');
        const scrollY = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop && scrollY <= sectionBottom) {
                return section.id || 'default';
            }
        }
        return 'default';
    }
    
    // Function to get background brightness
    function getBackgroundBrightness(element) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            return getBackgroundBrightness(element.parentElement);
        }
        
        // Parse RGB values
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            
            // Calculate brightness using luminance formula
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness;
        }
        
        return 128; // Default brightness
    }
    
    // Function to update sparkle colors based on current section
    function updateSparkleColors() {
        const currentSection = getCurrentSection();
        const elementAtCursor = document.elementFromPoint(mouseX, mouseY);
        
        if (elementAtCursor) {
            const brightness = getBackgroundBrightness(elementAtCursor);
            
            // Choose contrasting colors based on background brightness
            if (brightness > 180) {
                // Light background - use dark sparkles
                currentSparkleColors = ['dark-sparkle', 'purple-sparkle', 'blue-sparkle'];
            } else if (brightness < 80) {
                // Dark background - use light sparkles
                currentSparkleColors = ['light-sparkle', 'gold-sparkle', 'orange-sparkle'];
            } else {
                // Medium background - use section-specific colors or defaults
                currentSparkleColors = sectionColorMappings[currentSection] || sectionColorMappings.default;
            }
        } else {
            // Fallback to section-based colors
            currentSparkleColors = sectionColorMappings[currentSection] || sectionColorMappings.default;
        }
    }
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update main cursor glow immediately
        if (cursorGlow) {
            cursorGlow.style.left = mouseX - 6 + 'px';
            cursorGlow.style.top = mouseY - 6 + 'px';
        }
        
        // Update sparkle colors based on current position
        updateSparkleColors();
        
        // Create sparkle particles more frequently
        sparkleTimer++;
        if (sparkleTimer % 10 === 0) { // Every 10 mouse moves
            createSparkleParticle(mouseX, mouseY);
        }
    });
    
    // Also update colors on scroll
    window.addEventListener('scroll', () => {
        updateSparkleColors();
    });
    
    // Smooth trail following
    function updateTrail() {
        const dx = mouseX - trailX;
        const dy = mouseY - trailY;
        trailX += dx * 0.1;
        trailY += dy * 0.1;
        
        if (cursorTrail) {
            cursorTrail.style.left = trailX - 3 + 'px';
            cursorTrail.style.top = trailY - 3 + 'px';
        }
        
        requestAnimationFrame(updateTrail);
    }
    updateTrail();
    
    // Create sparkle particles
    function createSparkleParticle(x, y) {
        const particle = document.createElement('div');
        const randomColor = currentSparkleColors[Math.floor(Math.random() * currentSparkleColors.length)];
        particle.className = `sparkle-particle ${randomColor}`;
        particle.style.left = x + (Math.random() - 0.5) * 30 + 'px';
        particle.style.top = y + (Math.random() - 0.5) * 30 + 'px';
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1500);
    }
    
    // Hide cursor effects on mobile
    function isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (isMobile()) {
        if (cursorGlow) cursorGlow.style.display = 'none';
        if (cursorTrail) cursorTrail.style.display = 'none';
    }

    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false,
        offset: 100,
        disable: false,
        startEvent: 'DOMContentLoaded',
        animatedClassName: 'aos-animate',
        disableMutationObserver: false
    });
    
    // Secure Spot Modal Functionality - DISABLED to prevent conflicts with popup form
    // Modal form is now handled in index.html inline JavaScript
    const secureSpotBtn = document.getElementById('secure-spot-btn');
    const modal = document.getElementById('secure-spot-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Find the premium areas target button
    const premiumAreasBtn = document.querySelector('.service-area-cta .btn');
    
    // Direct form URL without embedding or cookies
    const jotFormDirectUrl = "https://form.jotform.com/251776886537173";
    
    // DISABLED: Form handling moved to inline JavaScript to prevent conflicts
    /*
    if (secureSpotBtn) {
        secureSpotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'small');
            
            // Open Google Form in a new tab with cache-busting parameters after 3 seconds
            // This allows user to fully see the celebration effect
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 3000); // 3 second delay to see the full effect
        });
    }
    */
    
    // DISABLED: All button handlers to prevent conflicts with popup modal
    /*
    const reserveSpotBtn = document.getElementById('reserve-spot-btn');
    if (reserveSpotBtn) {
        reserveSpotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (2-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay
        });
    }
    
    const reservePrimeBtn = document.getElementById('reserve-prime-btn');
    if (reservePrimeBtn) {
        reservePrimeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (2-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay
        });
    }
    */
    
    // DISABLED: Reserve Now button handler to prevent conflicts with popup modal
    /*
    const reserveNowBtn = document.getElementById('reserve-now-btn');
    if (reserveNowBtn) {
        reserveNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (2-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay
        });
    }
    */
    
    // DISABLED: All remaining button handlers to prevent conflicts with popup modal
    /*
    const reserveSpotNowBtn = document.getElementById('reserve-spot-now-btn');
    if (reserveSpotNowBtn) {
        reserveSpotNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (2-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay
        });
    }
    
    if (premiumAreasBtn) {
        premiumAreasBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a much bigger star burst effect
            createStarBurst(e, 'large');
            
            // After the animation, open the JotForm (shorter 2-second delay as requested)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay as requested
        });
    }
    */
    
    // DISABLED: Footer button handler
    const footerSpotBtn = document.getElementById('footer-spot-btn');
    /*
    if (footerSpotBtn) {
        footerSpotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (3-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 3000); // 3 second delay to see the full effect
        });
    }
    */

    // DISABLED: All Spanish button handlers to prevent conflicts with popup modal
    /*
    const reserveSpotBtnEs = document.getElementById('reserve-spot-btn-es');
    if (reserveSpotBtnEs) {
        reserveSpotBtnEs.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (2-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay
        });
    }

    const footerSpotBtnEs = document.getElementById('footer-spot-btn-es');
    if (footerSpotBtnEs) {
        footerSpotBtnEs.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (3-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 3000); // 3 second delay to see the full effect
        });
    }

    const secureSpotBtnEs = document.getElementById('secure-spot-btn-es');
    if (secureSpotBtnEs) {
        secureSpotBtnEs.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm in a new tab with cache-busting parameters after 3 seconds
            // This allows user to fully see the celebration effect
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 3000); // 3 second delay to see the full effect
        });
    }
    */

    // DISABLED: Last Spanish button handler to prevent conflicts with popup modal
    /*
    const reserveSpotNowBtnEs = document.getElementById('reserve-spot-now-btn-es');
    if (reserveSpotNowBtnEs) {
        reserveSpotNowBtnEs.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open JotForm after animation (2-second delay)
            setTimeout(() => {
                const uniqueUrl = jotFormDirectUrl + "?" + Date.now(); 
                window.open(uniqueUrl, '_blank');
            }, 2000); // 2 second delay
        });
    }
    */

    // Add star burst effect to profile picture click
    const profilePic = document.getElementById('profilePic');
    if (profilePic) {
        profilePic.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create star burst effect
            createStarBurst(e, 'large');
            
            // Open image modal after a brief delay to show the effect
            setTimeout(() => {
                openImageModal();
            }, 800); // Shorter delay since this is just opening a modal, not a form
        });
    }
    
    // Function to create star burst effect
    function createStarBurst(e, size = 'small') {
        // Get button position
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const buttonX = rect.left + rect.width / 2;
        const buttonY = rect.top + rect.height / 2;
        
        // Create container for stars if it doesn't exist
        let starContainer = document.querySelector('.star-container');
        if (!starContainer) {
            starContainer = document.createElement('div');
            starContainer.classList.add('star-container');
            document.body.appendChild(starContainer);
        }

        // Add an initial bright flash at the button position - bigger for large effect
        const flash = document.createElement('div');
        flash.classList.add('button-flash');
        if (size === 'large') {
            flash.classList.add('large-effect');
        }
        flash.style.left = `${buttonX}px`;
        flash.style.top = `${buttonY}px`;
        starContainer.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, size === 'large' ? 1200 : 700);
        
        // Removing secondary flash for subtler effect
        /* 
        if (size === 'large') {
            setTimeout(() => {
                const secondaryFlash = document.createElement('div');
                secondaryFlash.classList.add('button-flash', 'large-effect');
                secondaryFlash.style.left = `${buttonX}px`;
                secondaryFlash.style.top = `${buttonY}px`;
                starContainer.appendChild(secondaryFlash);
                
                setTimeout(() => {
                    secondaryFlash.remove();
                }, 1000);
            }, 200);
        }
        */
        
        // Generate stars based on effect size
        const starCount = size === 'large' ? 33 : 33;
        
        // Create initial center burst - bigger for large effect
        const centralBurst = document.createElement('div');
        centralBurst.classList.add('central-burst');
        if (size === 'large') {
            centralBurst.classList.add('large-effect');
        }
        centralBurst.style.left = `${buttonX}px`;
        centralBurst.style.top = `${buttonY}px`;
        starContainer.appendChild(centralBurst);
        
        setTimeout(() => {
            centralBurst.remove();
        }, size === 'large' ? 1400 : 800);
        
        // Removing multiple bursts for subtler effect
        /*
        if (size === 'large') {
            setTimeout(() => {
                const secondBurst = document.createElement('div');
                secondBurst.classList.add('central-burst', 'large-effect');
                secondBurst.style.left = `${buttonX}px`;
                secondBurst.style.top = `${buttonY}px`;
                starContainer.appendChild(secondBurst);
                
                setTimeout(() => {
                    secondBurst.remove();
                }, 1200);
            }, 300);
            
            setTimeout(() => {
                const thirdBurst = document.createElement('div');
                thirdBurst.classList.add('central-burst', 'large-effect');
                thirdBurst.style.left = `${buttonX}px`;
                thirdBurst.style.top = `${buttonY}px`;
                starContainer.appendChild(thirdBurst);
                
                setTimeout(() => {
                    thirdBurst.remove();
                }, 1000);
            }, 600);
        }
        */
        
        // Create stars in waves for a dramatic effect - more waves for large effect
        const waveCount = size === 'large' ? 5 : 3;
        for (let wave = 0; wave < waveCount; wave++) {
            // Distribute stars across waves with more in the first waves for large effect
            let starsInWave;
            if (size === 'large') {
                starsInWave = wave === 0 ? 20 : wave === 1 ? 18 : wave === 2 ? 16 : wave === 3 ? 16 : wave === 4 ? 14 : wave === 5 ? 14 : wave === 6 ? 16 : 16;
            } else {
                starsInWave = wave === 0 ? 13 : wave === 1 ? 10 : 10;
            }
            const waveDelay = wave * (size === 'large' ? 150 : 100); // more time between waves for large effect
            
            setTimeout(() => {
                for (let i = 0; i < starsInWave; i++) {
                    // Create star element
                    const star = document.createElement('div');
                    star.classList.add('celebration-star');
                    
                    // Vary size based on wave (closer stars are larger) - scaled down 75%
                    const baseSize = wave === 0 ? 8 : wave === 1 ? 6 : 4;
                    const size = baseSize + Math.floor(Math.random() * 4); 
                    
                    // Longer travel distance for outer waves - reduced by 75%
                    const baseDistance = wave === 0 ? 40 : wave === 1 ? 75 : 110;
                    const maxRandomDistance = wave === 0 ? 40 : wave === 1 ? 50 : 60;
                    const distance = baseDistance + Math.random() * maxRandomDistance;
                    
                    // Faster animation for outer waves
                    const baseSpeed = wave === 0 ? 1.5 : wave === 1 ? 1.9 : 2.3;
                    const duration = baseSpeed + Math.random() * 0.4;
                    
                    // Colors - more bright white/gold for central, more varied for outer
                    let color;
                    if (wave === 0) {
                        // Central wave: bright white/gold
                        color = `hsl(${45 + Math.random() * 15}, ${90 + Math.random() * 10}%, ${90 + Math.random() * 10}%)`;
                    } else if (wave === 1) {
                        // Middle wave: gold/yellow
                        const hue = 40 + Math.random() * 20;
                        color = `hsl(${hue}, 100%, ${75 + Math.random() * 20}%)`;
                    } else {
                        // Outer wave: more varied colors
                        const colorType = Math.floor(Math.random() * 3);
                        if (colorType === 0) {
                            // Gold
                            color = `hsl(${40 + Math.random() * 15}, 100%, ${70 + Math.random() * 25}%)`;
                        } else if (colorType === 1) {
                            // White/bright
                            color = `hsl(60, ${20 + Math.random() * 30}%, ${85 + Math.random() * 15}%)`;
                        } else {
                            // Orange-gold
                            color = `hsl(${30 + Math.random() * 15}, 100%, ${60 + Math.random() * 30}%)`;
                        }
                    }
                    
                    // Star shapes - more circular for central burst, more varied for outer
                    const starType = wave === 0 ? 
                                    Math.floor(Math.random() * 2) + 2 : // Mostly circles and diamonds for center
                                    Math.floor(Math.random() * 4);      // All types for outer waves
                    
                    // Set base star style
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    star.style.backgroundColor = color;
                    star.style.position = 'fixed';
                    star.style.left = `${buttonX}px`;
                    star.style.top = `${buttonY}px`;
                    star.style.zIndex = '9999';
                    
                    // Apply different star shapes with enhanced glows
                    if (starType === 0) {
                        // Four-pointed star
                        star.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                        star.classList.add('star-shape-1');
                        // Extra intense glow for these stars
                        star.style.boxShadow = `0 0 ${size}px ${color}, 0 0 ${size/1.5}px ${color}, 0 0 ${size*2}px white`;
                    } else if (starType === 1) {
                        // Simple 4-point star
                        star.style.clipPath = 'polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)';
                        star.classList.add('star-shape-2');
                        star.style.boxShadow = `0 0 ${size/1.2}px ${color}, 0 0 ${size}px white`;
                    } else if (starType === 2) {
                        // Circle star with intense glow
                        star.style.borderRadius = '50%';
                        star.style.boxShadow = `0 0 ${size/1.5}px ${color}, 0 0 ${size}px ${color}, 0 0 ${size*2}px rgba(255,255,255,0.8)`;
                        star.classList.add('star-shape-3');
                    } else {
                        // Diamond star
                        star.style.transform = 'rotate(45deg)';
                        star.style.boxShadow = `0 0 ${size/1.8}px ${color}, 0 0 ${size}px rgba(255,255,255,0.9)`;
                        star.classList.add('star-shape-4');
                    }
                    
                    // Calculate exact burst direction for perfect radial pattern
                    // Divide the circle evenly based on star count in this wave
                    const angle_rad = ((i * (360 / starsInWave)) + (wave * 15)) * Math.PI / 180;
                    const directionX = Math.cos(angle_rad);
                    const directionY = Math.sin(angle_rad);
                    
                    // Add controlled randomness to make it natural but still radial
                    const angleVariance = (Math.random() * 15 - 7.5) * Math.PI / 180;
                    const finalDirectionX = Math.cos(angle_rad + angleVariance);
                    const finalDirectionY = Math.sin(angle_rad + angleVariance);
                    
                    // Randomize distance slightly while maintaining the burst pattern
                    const distanceVariance = 0.85 + Math.random() * 0.3; // 0.85-1.15
                    
                    // Set animation with easing that starts fast and slows down
                    star.style.animation = `
                        starBurst${starType + 1} ${duration}s cubic-bezier(0.05, 0.9, 0.25, 1.0) forwards,
                        starRotate ${duration * 1.2}s ease-out forwards,
                        starFade ${duration * 0.9}s ease-out forwards,
                        starScale ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1.0) forwards
                    `;
                    
                    // Use transform to move in calculated direction
                    star.style.setProperty('--move-x', `${finalDirectionX * distance * distanceVariance}px`);
                    star.style.setProperty('--move-y', `${finalDirectionY * distance * distanceVariance}px`);
                    star.style.setProperty('--rotate', `${(Math.random() * 2 - 1) * 720}deg`); // -720 to 720 degrees
                    star.style.setProperty('--scale-factor', `${1.5 + Math.random()}`); // 1.5-2.5
                    
                    // Add to container
                    starContainer.appendChild(star);
                    
                    // Remove star after animation completes
                    setTimeout(() => {
                        star.remove();
                    }, duration * 1000 + 100);
                }
            }, waveDelay);
        }
    }
    
    // Helper function to generate points for a star shape
    function generateStarPoints(points) {
        let starPoints = '';
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? 50 : 25; // Outer and inner radius
            const angle = Math.PI * i / points;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            starPoints += `${x}% ${y}%, `;
        }
        return starPoints.slice(0, -2); // Remove trailing comma and space
    }
    
    // The following modal functionality is no longer used but preserved for reference
    // since we're now opening the form in a new tab instead of embedding it
    
    // Close modal when clicking the close button
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(event) {
        if (modal && event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Simple form validation
    const simpleForm = document.getElementById('simple-contact-form');
    if (simpleForm) {
        simpleForm.addEventListener('submit', function(e) {
            const phoneInput = document.getElementById('phone-simple');
            const emailInput = document.getElementById('email-simple');
            
            let isValid = true;
            
            // Simple phone validation
            if (phoneInput && phoneInput.value.trim().length < 10) {
                isValid = false;
                phoneInput.style.borderColor = 'red';
                alert('Please enter a valid phone number (at least 10 digits)');
                e.preventDefault();
                return false;
            }
            
            // Simple email validation
            if (emailInput && !emailInput.value.includes('@')) {
                isValid = false;
                emailInput.style.borderColor = 'red';
                alert('Please enter a valid email address');
                e.preventDefault();
                return false;
            }
            
            if (isValid) {
                alert('Thank you for your submission! Your default email client will open with your information. Please send the email to complete your reservation.');
                // Form will naturally submit and open email client
            }
        });
    }
    
    // Animate section dividers on scroll
    const addDividerAnimations = () => {
        const dividers = document.querySelectorAll('.section-divider');
        
        dividers.forEach(divider => {
            // Check if already processed
            if (divider.dataset.animated === 'true') return;
            
            // Get the SVG element inside divider
            const svg = divider.querySelector('svg');
            if (!svg) return;
            
            // Mark as processed
            divider.dataset.animated = 'true';
            
            // Add entrance animation
            divider.style.opacity = '0';
            divider.style.transform = divider.classList.contains('bottom') 
                ? 'translateY(20px)' 
                : 'translateY(-20px)';
            divider.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            // Create observer for entrance animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        divider.style.opacity = '1';
                        divider.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(divider);
        });
    };
    
    // Run on page load and when scrolling
    addDividerAnimations();
    window.addEventListener('scroll', addDividerAnimations);
    
    // Animate number counters
    function animateCounters() {
        const counterElements = document.querySelectorAll('.counter');
        
        counterElements.forEach(counter => {
            const target = parseInt(counter.innerText.replace(/[^0-9]/g, ''));
            const prefix = counter.innerText.startsWith('$') ? '$' : '';
            let count = 0;
            const duration = 2000; // Animation duration in milliseconds
            const step = Math.ceil(target / (duration / 30)); // Frames per step
            
            // Reset counter to zero for new animation
            counter.innerText = prefix + '0';
            
            function updateCount() {
                if (count < target) {
                    count = Math.min(count + step, target);
                    counter.innerText = prefix + count.toLocaleString();
                    requestAnimationFrame(updateCount);
                }
            }
            
            updateCount();
        });
    }
    
    // Initial counter animation when page loads
    const serviceArea = document.getElementById('service-area');
    if (serviceArea) {
        // Check if in viewport on page load
        const rect = serviceArea.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(animateCounters, 1000);
            serviceArea.classList.add('counter-animated');
        }
    }
    
    // Refresh AOS when scrolling to ensure animations trigger properly
    window.addEventListener('scroll', function() {
        AOS.refresh();

        // Reset counters when service area scrolls in and out of view
        const serviceArea = document.getElementById('service-area');
        if (serviceArea) {
            const rect = serviceArea.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (!serviceArea.classList.contains('counter-animated')) {
                    serviceArea.classList.add('counter-animated');
                    setTimeout(animateCounters, 500);
                }
            } else {
                serviceArea.classList.remove('counter-animated');
            }
        }
        
        // Back to top button functionality
        const backToTopButton = document.querySelector('.back-to-top');
        const pricingSection = document.getElementById('pricing');
        const serviceAreaSection = document.getElementById('service-area');
        const sideMenuButton = document.querySelector('.side-menu-button');
        
        // Show back to top button when user scrolls past the "Sizes & Investment" section
        if (pricingSection && window.pageYOffset >= pricingSection.offsetTop) {
            if (backToTopButton) backToTopButton.classList.add('show');
        } else {
            if (backToTopButton) backToTopButton.classList.remove('show');
        }
        
        // Show side menu button when user scrolls to the "How it works" section (mobile only)
        const howWorksSection = document.getElementById('how-works');
        if (howWorksSection && window.pageYOffset >= howWorksSection.offsetTop) {
            if (sideMenuButton) sideMenuButton.classList.add('show');
        } else {
            if (sideMenuButton) sideMenuButton.classList.remove('show');
        }
    });
    
    // Add click event for back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Side menu functionality
    const sideMenuButton = document.querySelector('.side-menu-button');
    const sideMenu = document.querySelector('.side-menu');
    const sideMenuClose = document.querySelector('.side-menu-close');
    const body = document.body;
    
    // Overlay element removed for cleaner UX - no background overlay needed
    
    // Add phone contact click event
    const phoneContact = document.querySelector('.phone-contact-float');
    if (phoneContact) {
        phoneContact.addEventListener('click', function() {
            window.location.href = 'tel:+15622829498';
        });
    }
    
    // Open side menu
    if (sideMenuButton) {
        sideMenuButton.addEventListener('click', function() {
            sideMenu.classList.add('open');
            body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }
    
    // Close side menu
    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', function() {
            closeSideMenu();
        });
    }
    
    // Overlay click event removed - no overlay needed
    
    // Close side menu when menu item is clicked
    const menuLinks = document.querySelectorAll('.side-menu-content a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeSideMenu();
        });
    });
    
    // Close nav menu when a nav link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(function(link) {
        link.addEventListener('click', function() {
            closeSideMenu();
        });
    });
    
    // Loading Animation
    const loaderWrapper = document.querySelector('.loader-wrapper');
    
    if (loaderWrapper) {
        setTimeout(function() {
            loaderWrapper.classList.add('loaded');
            document.body.classList.add('loaded-body');
            
            // Start animations after page load
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(el => {
                el.style.opacity = 1;
            });
        }, 2600);
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    function updateHeaderClass() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeaderClass);
    updateHeaderClass();
    
    // Mobile Navigation Toggle - Now handled by side menu button
    const navLinks = document.querySelector('.nav-links');
    
    // Connect side menu button to also activate mobile nav links
    if (sideMenuButton) {
        sideMenuButton.addEventListener('click', function() {
            navLinks.classList.add('active');
            
            // Force repaint to ensure visibility
            setTimeout(function() {
                document.body.style.willChange = 'transform';
                setTimeout(function() {
                    document.body.style.willChange = '';
                }, 10);
            }, 0);
            
            // Note: Body overflow is already handled in the side menu click handler
        });
    }
    
    // When side menu is closed, also close the nav links
    function closeSideMenu() {
        if (sideMenu) sideMenu.classList.remove('open');
        if (navLinks) navLinks.classList.remove('active');
        body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Close mobile menu when clicking a nav link
    // Using navLinks elements already defined above to avoid duplicate variable declaration
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                // Since mobileToggle is no longer used, removed reference to it
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
    
    // Side Navigation Highlighting
    const sideNavItems = document.querySelectorAll('.side-nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Highlight side nav item
                sideNavItems.forEach(item => {
                    if (item.dataset.target === sectionId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                // Highlight main nav item
                document.querySelectorAll('.nav-links a').forEach(item => {
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Initialize side navigation click events
    sideNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Accordion Functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            
            // Close all other accordion items
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                if (accItem !== item) {
                    accItem.classList.remove('active');
                }
            });
            
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });
    
    // Language Toggle (English/Spanish)
    const languageToggle = document.querySelector('.language-toggle');
    const mobileLangToggle = document.querySelector('.mobile-language-toggle');
    const englishContent = document.querySelectorAll('.en');
    const spanishContent = document.querySelectorAll('.es');
    
    function toggleLanguage() {
        document.body.classList.toggle('spanish');
        
        if (document.body.classList.contains('spanish')) {
            englishContent.forEach(el => el.style.display = 'none');
            spanishContent.forEach(el => {
                if (el.id === 'footer-spot-btn-es') {
                    el.style.display = 'inline-flex';
                } else if (el.id === 'reserve-spot-btn-es') {
                    el.style.display = 'inline-block';
                } else if (el.classList.contains('industry-item')) {
                    el.style.display = 'inline-flex';
                } else {
                    el.style.display = 'block';
                }
            });
            document.querySelectorAll('.language-toggle span, .mobile-language-toggle span').forEach(el => {
                el.textContent = 'English';
            });
            
            // Check if we should reset the animation first
            if (shouldResetAnimation()) {
                try {
                    // Clear animation completion flag and timestamp
                    sessionStorage.removeItem('typewriterAnimationComplete');
                    sessionStorage.removeItem('typewriterAnimationTimestamp');
                } catch (e) {
                    // Handle errors silently
                }
            }
            
            // Check if animation already completed (after reset check)
            let animationComplete = false;
            try {
                animationComplete = sessionStorage.getItem('typewriterAnimationComplete') === 'true';
            } catch (e) {
                // Handle potential sessionStorage errors silently
            }
            
            // Handle typewriter text based on animation state
            if (animationComplete) {
                setTimeout(() => displayStaticColoredText('typewriter-es', 'Su Anuncio en 10,000 Hogares Locales'), 300);
            } else {
                setTimeout(() => typeWriter('typewriter-es', 'Su Anuncio en 10,000 Hogares Locales', 80), 300);
            }
        } else {
            englishContent.forEach(el => {
                if (el.id === 'footer-spot-btn') {
                    el.style.display = 'inline-flex';
                } else if (el.id === 'reserve-spot-btn') {
                    el.style.display = 'inline-block';
                } else if (el.classList.contains('industry-item')) {
                    el.style.display = 'inline-flex';
                } else {
                    el.style.display = 'block';
                }
            });
            spanishContent.forEach(el => el.style.display = 'none');
            document.querySelectorAll('.language-toggle span, .mobile-language-toggle span').forEach(el => {
                el.textContent = 'Español';
            });
            
            // Check if we should reset the animation first
            if (shouldResetAnimation()) {
                try {
                    // Clear animation completion flag and timestamp
                    sessionStorage.removeItem('typewriterAnimationComplete');
                    sessionStorage.removeItem('typewriterAnimationTimestamp');
                } catch (e) {
                    // Handle errors silently
                }
            }
        }
    }
    
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    if (mobileLangToggle) {
        mobileLangToggle.addEventListener('click', toggleLanguage);
    }
    
    // Initialize with English as default
    if (spanishContent.length > 0) {
        spanishContent.forEach(el => el.style.display = 'none');
    }
    
    // Countdown Timer
    const countdown = document.querySelector('.countdown');
    if (countdown) {
        // Set the deadline date for September 1st, 2025 (Fall 2025 campaign)
        const deadline = new Date();
        deadline.setMonth(8); // September is month 8 (0-indexed)
        deadline.setDate(1); // 1st of September
        deadline.setFullYear(2025);
        
        function updateCountdown() {
            const now = new Date();
            const diff = deadline - now;
            
            if (diff <= 0) {
                // Countdown is over
                document.getElementById('days').textContent = '0';
                document.getElementById('hours').textContent = '0';
                document.getElementById('minutes').textContent = '0';
                return;
            }
            
            // Calculate days, hours, minutes
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            // Display the calculated values
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        }
        
        // Update the countdown every minute
        updateCountdown();
        setInterval(updateCountdown, 60000);
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect
    const parallaxElements = document.querySelectorAll('.parallax');
    
    function updateParallax() {
        parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', updateParallax);
    
    // Particles background (if enabled)
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 15 + 5;
            
            // Random opacity
            const opacity = Math.random() * 0.5 + 0.1;
            
            // Set styles
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            
            // Append to container
            particlesContainer.appendChild(particle);
            
            // Create animation
            animateParticle(particle);
        }
    }
    
    function animateParticle(particle) {
        // Random movement
        const duration = Math.random() * 10 + 5;
        const xMove = Math.random() * 100 - 50;
        const yMove = Math.random() * 100 - 50;
        
        particle.style.transition = `transform ${duration}s linear`;
        particle.style.transform = `translate(${xMove}px, ${yMove}px)`;
        
        // Reset after animation completes
        setTimeout(() => {
            particle.style.transition = 'none';
            particle.style.transform = 'translate(0, 0)';
            
            // Start new animation
            setTimeout(() => {
                animateParticle(particle);
            }, 50);
        }, duration * 1000);
    }
    
    // Initialize any carousels or sliders (if using a library)
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Chatbot Functionality
    const chatbotButton = document.querySelector('.chatbot-button');
    const chatContainer = document.querySelector('.chatbot-container');
    const closeChat = document.querySelector('.close-chat');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.querySelector('.chatbot-messages');
    
    // Predefined responses based on keywords - English and Spanish
    const responses = {
        'hello': 'Hello there! How can I help you with your direct mail campaign?',
        'hi': 'Hello there! How can I help you with your direct mail campaign?',
        'hey': 'Hello there! How can I help you with your direct mail campaign?',
        'price': 'Our standard flyer is $530 for a 3"×4½" size, and our premium option is $935 for a 4½"×6" size. Would you like more details?',
        'pricing': 'Our standard flyer is $530 for a 3"×4½" size, and our premium option is $935 for a 4½"×6" size. Would you like more details?',
        'cost': 'Our standard flyer is $530 for a 3"×4½" size, and our premium option is $935 for a 4½"×6" size. Would you like more details?',
        'service': 'We deliver your ads to nearly 10,000 local households in Lennox and Hawthorne. Our flyers wrap around regular mail for maximum visibility.',
        'contact': 'You can reach us at (562) 282-9498 or email lennoxlocaladsflyer@gmail.com',
        'help': 'I can help with pricing information, explain our services, or connect you with our team. What would you like to know?',
        'area': 'We currently serve Lennox (ZIP 90304) and Hawthorne (ZIP 90250), reaching nearly 10,000 selected homes across premium routes.',
        'design': 'Our service includes free professional design with unlimited revisions!',
        'timeline': 'After you secure your spot, we need about 2 weeks for design approval and production before your mailers are delivered.',
        'thanks': 'You\'re welcome! Let me know if you need anything else.',
        'thank': 'You\'re welcome! Let me know if you need anything else.'
    };
    
    // Spanish responses
    const responsesEs = {
        'hola': '¡Hola! ¿Cómo puedo ayudarte con tu campaña de correo directo?',
        'buenos': '¡Hola! ¿Cómo puedo ayudarte con tu campaña de correo directo?',
        'precio': 'Nuestro volante estándar cuesta $530 para un tamaño de 3"×4½", y nuestra opción premium es $935 para 4½"×6". ¿Te gustaría más detalles?',
        'costo': 'Nuestro volante estándar cuesta $530 para un tamaño de 3"×4½", y nuestra opción premium es $935 para 4½"×6". ¿Te gustaría más detalles?',
        'servicio': 'Entregamos tus anuncios a casi 10,000 hogares locales en Lennox y Hawthorne. Nuestros volantes se envuelven alrededor del correo regular para máxima visibilidad.',
        'contacto': 'Puedes comunicarte con nosotros al (562) 282-9498 o por correo electrónico a lennoxlocaladsflyer@gmail.com',
        'ayuda': 'Puedo ayudarte con información de precios, explicar nuestros servicios o conectarte con nuestro equipo. ¿Qué te gustaría saber?',
        'área': 'Actualmente atendemos a Lennox (ZIP 90304) y Hawthorne (ZIP 90250), llegando a casi 10,000 hogares seleccionados a través de rutas premium.',
        'diseño': '¡Nuestro servicio incluye diseño profesional gratuito con revisiones ilimitadas!',
        'tiempo': 'Después de asegurar tu lugar, necesitamos aproximadamente 2 semanas para la aprobación del diseño y la producción antes de que se entreguen tus correos.',
        'gracias': '¡De nada! Avísame si necesitas algo más.',
        'gracia': '¡De nada! Avísame si necesitas algo más.'
    };
    
    // Toggle chatbot visibility
    if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
            chatContainer.classList.add('active');
        });
    }
    
    // Close chatbot
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            chatContainer.classList.remove('active');
        });
    }
    
    // Variables for Spanish chat
    const chatInputEs = document.getElementById('chat-input-es');
    const sendButtonEs = document.getElementById('send-button-es');
    
    // Send message function
    function sendMessage() {
        const isSpanish = document.body.classList.contains('spanish');
        const message = isSpanish ? chatInputEs.value.trim() : chatInput.value.trim();
        
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user', isSpanish);
        
        // Clear input
        if (isSpanish) {
            chatInputEs.value = '';
        } else {
            chatInput.value = '';
        }
        
        // Get response after a small delay
        setTimeout(() => {
            const response = getBotResponse(message, isSpanish);
            addMessage(response, 'bot', isSpanish);
        }, 600);
    }
    
    // Add message to chat
    function addMessage(text, sender, isSpanish) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender + '-message');
        
        // Add language class
        if (isSpanish) {
            messageDiv.classList.add('es');
        } else {
            messageDiv.classList.add('en');
        }
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        
        messageDiv.appendChild(paragraph);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Get bot response based on user input
    function getBotResponse(userInput, isSpanish) {
        userInput = userInput.toLowerCase();
        
        // Use appropriate response dictionary based on language
        const responseDict = isSpanish ? responsesEs : responses;
        
        // Check for keywords
        for (const [keyword, response] of Object.entries(responseDict)) {
            if (userInput.includes(keyword)) {
                return response;
            }
        }
        
        // Default response if no keyword matches
        return isSpanish 
            ? "Me encantaría ayudarte con eso. Para preguntas específicas sobre nuestros servicios de correo directo, llama al (562) 282-9498 o ¿te gustaría saber sobre nuestros precios o áreas de servicio?" 
            : "I'd be happy to help with that. For specific questions about our direct mail services, please call us at (562) 282-9498 or would you like to know about our pricing or service areas?";
    }
    
    // Send button click event - English
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send button click event - Spanish
    if (sendButtonEs) {
        sendButtonEs.addEventListener('click', sendMessage);
    }
    
    // Enter key press in input field - English
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Enter key press in input field - Spanish
    if (chatInputEs) {
        chatInputEs.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});    // Typewriter Effect
    function typeWriter(elementId, text, speed = 100) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = '';
        element.classList.add('typewriter-cursor');
        
        // Color cycling array
        const colors = ['typewriter-color-white', 'typewriter-color-gold', 'typewriter-color-blue'];
        
        let i = 0;
        let colorIndex = 0;
        let typedText = '';
        let cycleCount = 0;
        const MAX_CYCLES = 2; // Maximum number of type-erase cycles
        
        // Function for typing characters
        function typeNextChar() {
            if (i < text.length) {
                // Remove cursor temporarily
                element.classList.remove('typewriter-cursor');
                
                // Get current character
                const char = text.charAt(i);
                
                // Special handling for spaces and punctuation to keep previous color
                if (char === ' ' || char === '.' || char === ',' || char === '!') {
                    typedText += char;
                } else {
                    // Create a span with color for this character
                    typedText += `<span class="${colors[colorIndex]}">${char}</span>`;
                    
                    // Cycle to next color
                    colorIndex = (colorIndex + 1) % colors.length;
                }
                
                // Update element content
                element.innerHTML = typedText;
                
                // Add cursor back
                element.classList.add('typewriter-cursor');
                
                i++;
                setTimeout(typeNextChar, speed);
            } else {
                // Typing complete, pause before erasing
                setTimeout(eraseText, 2000);
            }
        }
        
        // Function for erasing characters
        function eraseText() {
            // For English text, stop erasing at "Your Ad " (position 7)
            // For Spanish text, stop erasing at "Su " (position 3)
            const permanentTextLength = (elementId === 'typewriter-en') ? 7 : 3;
            
            if (i > permanentTextLength) {
                // Remove cursor temporarily
                element.classList.remove('typewriter-cursor');
                
                // Recreate the text with one less character
                i--;
                
                // Rebuild the typed text from scratch to preserve colored spans
                typedText = '';
                colorIndex = 0; // Reset color index for consistent colors
                
                for (let j = 0; j < i; j++) {
                    const char = text.charAt(j);
                    if (char === ' ' || char === '.' || char === ',' || char === '!') {
                        typedText += char;
                    } else {
                        typedText += `<span class="${colors[colorIndex]}">${char}</span>`;
                        colorIndex = (colorIndex + 1) % colors.length;
                    }
                }
                
                // Update content
                element.innerHTML = typedText;
                
                // Add cursor back
                element.classList.add('typewriter-cursor');
                
                setTimeout(eraseText, speed/1.5); // Erase a bit faster than typing
            } else {
                // Erasing complete (reached permanent text), pause before restarting
                setTimeout(restartTypewriter, 1000);
            }
        }
        
        // Function to restart the whole animation
        function restartTypewriter() {
            cycleCount++; // Increment cycle counter
            
            // Reset to permanent text position instead of 0
            const permanentTextLength = (elementId === 'typewriter-en') ? 7 : 3;
            i = permanentTextLength;
            
            if (cycleCount >= MAX_CYCLES) {
                // We've completed the specified number of cycles
                // Create the final colorful static text
                let finalText = '';
                colorIndex = 0; // Reset color index for consistent colors
                
                for (let j = 0; j < text.length; j++) {
                    const char = text.charAt(j);
                    if (char === ' ' || char === '.' || char === ',' || char === '!') {
                        finalText += char;
                    } else {
                        finalText += `<span class="${colors[colorIndex]}">${char}</span>`;
                        colorIndex = (colorIndex + 1) % colors.length;
                    }
                }
                
                // Display the final text and remove the cursor
                element.innerHTML = finalText;
                element.classList.remove('typewriter-cursor');
                
                // Store in sessionStorage that we've shown the animation, with timestamp
                try {
                    sessionStorage.setItem('typewriterAnimationComplete', 'true');
                    sessionStorage.setItem('typewriterAnimationTimestamp', Date.now().toString());
                } catch (e) {
                    // Handle potential sessionStorage errors silently
                }
            } else {
                // Continue with the next cycle
                i = 0;
                colorIndex = 0; // Reset color index
                typedText = '';
                element.innerHTML = '';
                setTimeout(typeNextChar, 500);
            }
        }
        
        // Start typing with a small delay
        setTimeout(typeNextChar, 500);
    }
    
    // Check if the animation should be reset due to time expiration
    function shouldResetAnimation() {
        try {
            const animationTimestamp = parseInt(sessionStorage.getItem('typewriterAnimationTimestamp'));
            if (!animationTimestamp) return true; // No timestamp, should reset
            
            const currentTime = Date.now();
            const inactivityPeriod = 30 * 60 * 1000; // 30 minutes in milliseconds
            
            // Check if more than the inactivity period has passed
            return (currentTime - animationTimestamp) > inactivityPeriod;
        } catch (e) {
            return true; // On any error, default to reset
        }
    }
    
    // Function to manually reset the animation
    function resetTypewriterAnimation() {
        try {
            sessionStorage.removeItem('typewriterAnimationComplete');
            sessionStorage.removeItem('typewriterAnimationTimestamp');
        } catch (e) {
            // Handle errors silently
        }
    }
    
    // Initialize typewriter effect
    function initTypewriter() {
        const currentLang = document.body.classList.contains('spanish') ? 'es' : 'en';
        
        // Check if we should reset the animation first
        if (shouldResetAnimation()) {
            try {
                // Clear animation completion flag and timestamp
                sessionStorage.removeItem('typewriterAnimationComplete');
                sessionStorage.removeItem('typewriterAnimationTimestamp');
            } catch (e) {
                // Handle errors silently
            }
        }
        
        // Check if we've already completed the animation in this session (after reset check)
        let animationComplete = false;
        try {
            animationComplete = sessionStorage.getItem('typewriterAnimationComplete') === 'true';
        } catch (e) {
            // Handle potential sessionStorage errors silently
        }
        
        if (animationComplete) {
            // Skip animation and show final static text immediately
            displayStaticColoredText(currentLang === 'es' ? 'typewriter-es' : 'typewriter-en', 
                                    currentLang === 'es' ? 'Su Anuncio en 10,000 Hogares Locales' : 'Your Ad in 10,000 Local Homes');
        } else {
            // Run the animation
            if (currentLang === 'es') {
                typeWriter('typewriter-es', 'Su Anuncio en 10,000 Hogares Locales', 80);
            } else {
                typeWriter('typewriter-en', 'Your Ad in 10,000 Local Homes', 80);
            }
        }
    }
    
    // Helper function to display the final static colored text without animation
    function displayStaticColoredText(elementId, text) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const colors = ['typewriter-color-white', 'typewriter-color-gold', 'typewriter-color-blue'];
        let colorIndex = 0;
        let finalText = '';
        
        for (let j = 0; j < text.length; j++) {
            const char = text.charAt(j);
            if (char === ' ' || char === '.' || char === ',' || char === '!') {
                finalText += char;
            } else {
                finalText += `<span class="${colors[colorIndex]}">${char}</span>`;
                colorIndex = (colorIndex + 1) % colors.length;
            }
        }
        
        element.innerHTML = finalText;
        
        // Add click handler to manually restart the animation
        element.style.cursor = 'pointer';
        element.title = 'Click to replay animation';
        element.addEventListener('click', function() {
            // Clear the animation flags
            try {
                sessionStorage.removeItem('typewriterAnimationComplete');
                sessionStorage.removeItem('typewriterAnimationTimestamp');
            } catch (e) {
                // Handle errors silently
            }
            
            // Get the current language
            const currentLang = document.body.classList.contains('spanish') ? 'es' : 'en';
            
            // Restart the animation based on current language
            if (currentLang === 'es') {
                typeWriter('typewriter-es', 'Su Anuncio en 10,000 Hogares Locales', 80);
            } else {
                typeWriter('typewriter-en', 'Your Ad in 10,000 Local Homes', 80);
            }
        });
    }
    
    // Start typewriter effect after page load
    setTimeout(initTypewriter, 1000);

    // Parallax Scrolling Effect Handler for Second Parallax
    class ParallaxController2 {
        constructor() {
            this.parallaxContainer = document.getElementById('parallax-transition-2');
            this.parallaxLayers = document.querySelectorAll('#parallax-transition-2 .parallax-layer');
            this.isDesktop = window.innerWidth > 768;
            this.ticking = false;
            
            if (this.parallaxContainer && this.isDesktop) {
                this.init();
            }
        }
        
        init() {
            // Bind scroll event with throttling
            window.addEventListener('scroll', () => this.requestTick());
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            // Check for reduced motion preference
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return; // Don't initialize parallax if user prefers reduced motion
            }
            
            // Initial parallax update
            this.updateParallax();
        }
        
        requestTick() {
            if (!this.ticking && this.isDesktop) {
                requestAnimationFrame(() => this.updateParallax());
                this.ticking = true;
            }
        }
        
        updateParallax() {
            this.ticking = false;
            
            if (!this.parallaxContainer || !this.isDesktop) return;
            
            const rect = this.parallaxContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if parallax container is in viewport
            if (rect.bottom < 0 || rect.top > windowHeight) {
                return; // Container is not visible, skip calculations
            }
            
            // Calculate scroll progress (0 to 1)
            const containerTop = rect.top;
            const containerHeight = rect.height;
            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - containerTop) / (windowHeight + containerHeight)));
            
            // Update each parallax layer
            this.parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed') || 0.5);
                const yPos = scrollProgress * 100 * speed;
                
                // Apply transform with hardware acceleration
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }
        
        handleResize() {
            this.isDesktop = window.innerWidth > 768;
            
            if (!this.isDesktop) {
                // Reset transforms on mobile
                this.parallaxLayers.forEach(layer => {
                    layer.style.transform = 'none';
                });
            }
        }
    }

    // Initialize Second Parallax Controller
    const parallaxController2 = new ParallaxController2();
    
    // Parallax Scrolling Effect Handler for Third Parallax with Cursor Movement
    class ParallaxController3 {
        constructor() {
            this.parallaxContainer = document.getElementById('parallax-transition-3');
            this.parallaxLayers = document.querySelectorAll('#parallax-transition-3 .parallax-layer');
            this.isDesktop = window.innerWidth > 768;
            this.ticking = false;
            this.mouseX = 0;
            this.mouseY = 0;
            this.centerX = window.innerWidth / 2;
            this.centerY = window.innerHeight / 2;
            this.initialPositions = [];
            this.isHovered = false;
            
            // Add cursor style to indicate interactivity
            if (this.parallaxContainer) {
                this.parallaxContainer.style.cursor = 'default';
            }
            
            if (this.parallaxContainer && this.isDesktop) {
                this.init();
            }
        }
        
        init() {
            // Store initial positions
            this.parallaxLayers.forEach(layer => {
                const computedStyle = window.getComputedStyle(layer);
                const transform = computedStyle.transform !== 'none' ? computedStyle.transform : 'matrix(1, 0, 0, 1, 0, 0)';
                this.initialPositions.push(transform);
            });
            
            // Bind scroll event with throttling
            window.addEventListener('scroll', () => this.requestTick('scroll'));
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            // Add mouse move event listener for cursor-based parallax
            this.parallaxContainer.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
            this.parallaxContainer.addEventListener('mouseleave', () => this.handleMouseLeave(), { passive: true });
            this.parallaxContainer.addEventListener('mouseenter', () => this.handleMouseEnter(), { passive: true });
            
            // Check for reduced motion preference
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return; // Don't initialize parallax if user prefers reduced motion
            }
            
            // Initial parallax update
            this.updateParallax('scroll');
        }
        
        requestTick(eventType) {
            if (!this.ticking && this.isDesktop) {
                requestAnimationFrame(() => this.updateParallax(eventType));
                this.ticking = true;
            }
        }
        
        handleMouseMove(e) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            const rect = this.parallaxContainer.getBoundingClientRect();
            const containerCenterX = rect.left + rect.width / 2;
            const containerCenterY = rect.top + rect.height / 2;
            
            this.centerX = containerCenterX;
            this.centerY = containerCenterY;
            
            this.requestTick('mouse');
        }
        
        handleMouseLeave() {
            // Smoothly reset positions when mouse leaves container
            this.isHovered = false;
            this.requestTick('reset');
        }
        
        handleMouseEnter() {
            // Prepare for mouse movement tracking
            this.isHovered = true;
            this.requestTick('mouse');
        }
        
        updateParallax(eventType) {
            this.ticking = false;
            
            if (!this.parallaxContainer || !this.isDesktop) return;
            
            const rect = this.parallaxContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if parallax container is in viewport
            if (rect.bottom < 0 || rect.top > windowHeight) {
                return; // Container is not visible, skip calculations
            }
            
            // Calculate scroll progress (0 to 1)
            const containerTop = rect.top;
            const containerHeight = rect.height;
            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - containerTop) / (windowHeight + containerHeight)));
            
            // Update each parallax layer
            this.parallaxLayers.forEach((layer, index) => {
                const speed = parseFloat(layer.getAttribute('data-speed') || 0.5);
                let xPos = 0;
                let yPos = scrollProgress * 100 * speed;
                
                // Add cursor-based parallax effect if event is from mouse movement
                if (eventType === 'mouse' && this.isHovered) {
                    const mouseXFactor = (this.mouseX - this.centerX) / (window.innerWidth / 2);
                    const mouseYFactor = (this.mouseY - this.centerY) / (window.innerHeight / 2);
                    
                    // Different layers move at different speeds and directions
                    const layerSpeed = (3 - speed) * 20; // Invert speed for natural feeling
                    xPos = mouseXFactor * layerSpeed * -1; // Move opposite to cursor for depth effect
                    
                    // Space theme - stars move more dramatically
                    if (layer.classList.contains('parallax-bg-layer-3')) {
                        xPos *= 0.5; // More subtle background movement
                        yPos += mouseYFactor * layerSpeed * -0.3;
                    } 
                    // Objects layer - move more dramatically with cursor
                    else if (layer.classList.contains('parallax-mid-layer-3')) {
                        xPos *= 1.2;
                        yPos += mouseYFactor * layerSpeed * -0.6;
                    }
                    // Content layer - subtle movement
                    else if (layer.classList.contains('parallax-front-layer-3')) {
                        xPos *= 0.3;
                        yPos += mouseYFactor * layerSpeed * -0.1;
                    }
                } else if (eventType === 'reset') {
                    // Smoothly reset to scroll-based position
                    xPos = 0;
                    // yPos already calculated from scroll
                }
                
                // Apply transform with hardware acceleration
                layer.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            });
            
            // Additional effects for third parallax
            this.animateConnections(scrollProgress);
            
            // Animate stars when cursor moves
            if (eventType === 'mouse' && this.isHovered) {
                this.animateStars();
            }
        }
        
        // Method to handle window resize
        handleResize() {
            this.isDesktop = window.innerWidth > 768;
            
            // Update center position
            if (this.parallaxContainer) {
                const rect = this.parallaxContainer.getBoundingClientRect();
                this.centerX = rect.left + rect.width / 2;
                this.centerY = rect.top + rect.height / 2;
            }
            
            if (!this.isDesktop) {
                // Reset transforms on mobile
                this.parallaxLayers.forEach(layer => {
                    layer.style.transform = 'none';
                });
                
                // Reset stars
                const stars = document.querySelectorAll('#parallax-transition-3 .star');
                stars.forEach(star => {
                    star.style.transform = '';
                    star.style.opacity = '';
                });
                
                // Reset business icon objects
                const objects = document.querySelectorAll('#parallax-transition-3 .parallax-object');
                objects.forEach(obj => {
                    obj.style.transform = '';
                });
                
                // Reset connection lines
                const connections = document.querySelectorAll('#parallax-transition-3 .connection');
                connections.forEach(connection => {
                    connection.style.transform = '';
                });
            }
        }
        
        // New method to animate stars based on cursor position
        animateStars() {
            const stars = document.querySelectorAll('#parallax-transition-3 .star');
            const mouseXFactor = (this.mouseX - this.centerX) / (window.innerWidth / 2);
            const mouseYFactor = (this.mouseY - this.centerY) / (window.innerHeight / 2);
            
            stars.forEach((star, index) => {
                const speed = 0.3 + (index % 5) * 0.1; // Vary speed based on star index
                const xMove = mouseXFactor * -15 * speed;
                const yMove = mouseYFactor * -10 * speed;
                
                // Make stars twinkle more intensely when cursor moves
                const scale = 1.0 + Math.abs(mouseXFactor * mouseYFactor) * 0.5;
                const opacity = 0.7 + Math.abs(mouseXFactor * mouseYFactor) * 0.3;
                
                star.style.transform = `translate(${xMove}px, ${yMove}px) scale(${scale})`;
                star.style.opacity = opacity;
            });
            
            // Also animate business icon objects
            const objects = document.querySelectorAll('#parallax-transition-3 .parallax-object');
            objects.forEach((obj, index) => {
                const speed = 0.5 + (index % 3) * 0.15;
                const xMove = mouseXFactor * -25 * speed;
                const yMove = mouseYFactor * -15 * speed;
                const rotation = (mouseXFactor * mouseYFactor) * 5; // Small rotation effect
                
                obj.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${rotation}deg)`;
            });
            
            // Animate connection lines
            const connections = document.querySelectorAll('#parallax-transition-3 .connection');
            connections.forEach((connection, index) => {
                const speed = 0.2 + (index % 5) * 0.08;
                const xSkew = mouseXFactor * 3 * speed;
                
                // Preserve the original scaleX from scroll effect
                const currentTransform = connection.style.transform;
                const scaleMatch = currentTransform.match(/scaleX\(([^)]+)\)/);
                const scaleX = scaleMatch ? scaleMatch[1] : '1';
                
                connection.style.transform = `scaleX(${scaleX}) skewX(${xSkew}deg)`;
            });
        }
        
        animateConnections(progress) {
            // Animate the connection lines based on scroll progress
            const connections = document.querySelectorAll('.connection');
            connections.forEach((connection, index) => {
                const delay = index * 0.1;
                const opacity = Math.min(1, progress * 2 - delay);
                connection.style.opacity = Math.max(0.2, opacity);
                
                // Scale connections as user scrolls
                const scale = 0.8 + (progress * 0.4);
                connection.style.transform = `scaleX(${scale}) ${connection.style.transform.split(')')[1] || ''}`;
            });
        }
        
        handleResize() {
            this.isDesktop = window.innerWidth > 768;
            
            if (!this.isDesktop) {
                // Reset transforms on mobile
                this.parallaxLayers.forEach(layer => {
                    layer.style.transform = 'none';
                });
            }
        }
    }

    // Initialize Third Parallax Controller
    const parallaxController3 = new ParallaxController3();
    
    // Simple Parallax Scrolling Effect Handler for Fourth Parallax
    class ParallaxController4 {
        constructor() {
            this.parallaxContainer = document.getElementById('parallax-transition-4');
            this.parallaxLayers = document.querySelectorAll('#parallax-transition-4 .parallax-layer');
            this.isDesktop = window.innerWidth > 768;
            this.ticking = false;
            
            if (this.parallaxContainer && this.isDesktop) {
                this.init();
            }
        }
        
        init() {
            // Bind scroll event with throttling
            window.addEventListener('scroll', () => this.requestTick());
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            // Check for reduced motion preference
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return; // Don't initialize parallax if user prefers reduced motion
            }
            
            // Initial parallax update
            this.updateParallax();
        }
        
        requestTick() {
            if (!this.ticking && this.isDesktop) {
                requestAnimationFrame(() => this.updateParallax());
                this.ticking = true;
            }
        }
        
        updateParallax() {
            this.ticking = false;
            
            if (!this.parallaxContainer || !this.isDesktop) return;
            
            const rect = this.parallaxContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if parallax container is in viewport
            if (rect.bottom < 0 || rect.top > windowHeight) {
                return; // Container is not visible, skip calculations
            }
            
            // Calculate scroll progress (0 to 1)
            const containerTop = rect.top;
            const containerHeight = rect.height;
            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - containerTop) / (windowHeight + containerHeight)));
            
            // Update each parallax layer with simple translation
            this.parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed') || 0.5);
                const yPos = scrollProgress * 100 * speed;
                
                // Apply transform with hardware acceleration
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }
        
        handleResize() {
            this.isDesktop = window.innerWidth > 768;
            
            if (!this.isDesktop) {
                // Reset transforms on mobile
                this.parallaxLayers.forEach(layer => {
                    layer.style.transform = 'none';
                });
            }
        }
    }

    // Initialize Fourth Parallax Controller
    const parallaxController4 = new ParallaxController4();
    
// Podcast Player Functions - Desktop Only with Language Support
function initializePodcastPlayer() {
    const audioEn = document.getElementById('podcast-audio-en');
    const audioEs = document.getElementById('podcast-audio-es');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeSpan = document.querySelector('.current-time');
    const durationSpan = document.querySelector('.duration');
    const volumeSlider = document.getElementById('volume-slider');
    const podcastSection = document.querySelector('.podcast-section');
    
    if (!audioEn || !audioEs || !playPauseBtn) {
        console.error('Podcast audio elements not found');
        return;
    }
    
    // Function to get the current active audio based on language
    function getCurrentAudio() {
        const isSpanish = document.body.classList.contains('spanish');
        return isSpanish ? audioEs : audioEn;
    }
    
    // Function to pause the inactive audio
    function pauseInactiveAudio() {
        const isSpanish = document.body.classList.contains('spanish');
        const inactiveAudio = isSpanish ? audioEn : audioEs;
        if (!inactiveAudio.paused) {
            inactiveAudio.pause();
            inactiveAudio.currentTime = 0;
        }
    }
    
    console.log('Initializing podcast player...');
    console.log('English Audio element:', audioEn);
    console.log('Spanish Audio element:', audioEs);
    
    // Set initial volume for both audio elements
    audioEn.volume = 0.5;
    audioEs.volume = 0.5;
    
    // Format time helper function
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Update duration when metadata loads for both audio elements
    function updateDuration(audio) {
        if (durationSpan && audio === getCurrentAudio()) {
            console.log(`Audio duration detected: ${audio.duration} seconds for ${audio.id}`);
            console.log(`Formatted duration: ${formatTime(audio.duration)}`);
            
            // Check if duration is valid (not NaN or Infinity)
            if (audio.duration && isFinite(audio.duration)) {
                const detectedDuration = audio.duration;
                
                // Known correct duration is 6:28 (388 seconds)
                // If detected duration is significantly different, use the correct one
                if (detectedDuration > 450 || detectedDuration < 380) {
                    console.warn(`Incorrect duration detected: ${detectedDuration}s, using correct duration: 388s (6:28)`);
                    durationSpan.textContent = '6:28';
                } else {
                    durationSpan.textContent = formatTime(audio.duration);
                }
            } else {
                console.warn(`Invalid audio duration: ${audio.duration} for ${audio.id}`);
                durationSpan.textContent = '6:28'; // Fallback to known correct duration
            }
        }
    }
    
    audioEn.addEventListener('loadedmetadata', function() {
        console.log('English audio metadata loaded');
        updateDuration(audioEn);
    });
    
    audioEs.addEventListener('loadedmetadata', function() {
        console.log('Spanish audio metadata loaded');
        updateDuration(audioEs);
    });
    
    // Additional duration check on canplay event as backup
    audioEn.addEventListener('canplay', function() {
        if (!durationSpan.textContent || durationSpan.textContent === '0:00') {
            console.log('Backup duration check for English audio');
            updateDuration(audioEn);
        }
    });
    
    audioEs.addEventListener('canplay', function() {
        if (!durationSpan.textContent || durationSpan.textContent === '0:00') {
            console.log('Backup duration check for Spanish audio');
            updateDuration(audioEs);
        }
    });
    
    // Play/Pause functionality with sparkle explosion and language support
    playPauseBtn.addEventListener('click', function() {
        const audio = getCurrentAudio();
        
        if (audio.paused) {
            console.log('Attempting to play audio...');
            console.log('Current language audio:', audio.id);
            
            // Pause the inactive audio first
            pauseInactiveAudio();
            
            // Create sparkle explosion when play button is first clicked
            createSparkleExplosion(playPauseBtn);
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log('Audio started playing successfully');
                }).catch(function(error) {
                    console.error('Error playing audio:', error);
                    console.error('Error details:', {
                        name: error.name,
                        message: error.message,
                        code: error.code
                    });
                    
                    // Show user-friendly error
                    playPauseBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    
                    // Try to reload and play again after a brief delay
                    setTimeout(function() {
                        audio.load();
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                        playPauseBtn.disabled = false;
                    }, 2000);
                });
            }
        } else {
            audio.pause();
        }
    });
    
    // Function to add event listeners to both audio elements
    function addAudioEventListeners(audio) {
        // Update play button and add playing class
        audio.addEventListener('play', function() {
            // Only update UI if this is the current active audio
            if (audio === getCurrentAudio()) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.classList.add('playing');
                if (podcastSection) {
                    podcastSection.classList.add('playing');
                }
                
                // Pause background music when podcast starts playing
                const backgroundMusic = document.getElementById('background-music');
                if (backgroundMusic && !backgroundMusic.paused) {
                    backgroundMusic.pause();
                    console.log('Background music paused - podcast is now playing');
                    
                    // Store that we paused the background music on both audio elements
                    audioEn.backgroundMusicWasPaused = true;
                    audioEs.backgroundMusicWasPaused = true;
                }
            }
        });
    
        audio.addEventListener('pause', function() {
            // Only update UI if this is the current active audio
            if (audio === getCurrentAudio()) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                if (podcastSection) {
                    podcastSection.classList.remove('playing');
                }
                
                // Optionally resume background music when podcast is paused
                const backgroundMusic = document.getElementById('background-music');
                if (backgroundMusic && (audioEn.backgroundMusicWasPaused || audioEs.backgroundMusicWasPaused)) {
                    // Small delay to avoid audio conflicts
                    setTimeout(() => {
                        const playPromise = backgroundMusic.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                console.log('Background music resumed after podcast pause');
                                audioEn.backgroundMusicWasPaused = false;
                                audioEs.backgroundMusicWasPaused = false;
                            }).catch(error => {
                                console.log('Could not resume background music:', error);
                            });
                        }
                    }, 500);
                }
            }
        });
    
        audio.addEventListener('ended', function() {
            // Only update UI if this is the current active audio
            if (audio === getCurrentAudio()) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                if (podcastSection) {
                    podcastSection.classList.remove('playing');
                }
                if (progressFill) {
                    progressFill.style.width = '0%';
                }
                if (currentTimeSpan) {
                    currentTimeSpan.textContent = '0:00';
                }
                
                // Resume background music when podcast ends
                const backgroundMusic = document.getElementById('background-music');
                if (backgroundMusic && (audioEn.backgroundMusicWasPaused || audioEs.backgroundMusicWasPaused)) {
                    // Small delay to avoid audio conflicts
                    setTimeout(() => {
                        const playPromise = backgroundMusic.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                console.log('Background music resumed after podcast ended');
                                audioEn.backgroundMusicWasPaused = false;
                                audioEs.backgroundMusicWasPaused = false;
                            }).catch(error => {
                                console.log('Could not resume background music:', error);
                            });
                        }
                    }, 500);
                }
            }
        });
    }
    
    // Add event listeners to both audio elements
    addAudioEventListeners(audioEn);
    addAudioEventListeners(audioEs);
    
    // Update progress bar and time - for current active audio only
    function updateProgress() {
        const audio = getCurrentAudio();
        if (audio.duration && progressFill && currentTimeSpan) {
            // Use correct duration (6:28 = 388 seconds) if detected duration is wrong
            let correctDuration = audio.duration;
            if (audio.duration > 450 || audio.duration < 380) {
                correctDuration = 388; // 6:28 in seconds
            }
            
            const progress = (audio.currentTime / correctDuration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
    }
    
    audioEn.addEventListener('timeupdate', function() {
        if (audioEn === getCurrentAudio()) {
            updateProgress();
        }
    });
    
    audioEs.addEventListener('timeupdate', function() {
        if (audioEs === getCurrentAudio()) {
            updateProgress();
        }
    });
    
    // Click on progress bar to seek
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const audio = getCurrentAudio();
            if (audio.duration) {
                // Use correct duration (6:28 = 388 seconds) if detected duration is wrong
                let correctDuration = audio.duration;
                if (audio.duration > 450 || audio.duration < 380) {
                    correctDuration = 388; // 6:28 in seconds
                }
                
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const clickTime = (clickX / width) * correctDuration;
                
                // Make sure we don't seek beyond the actual audio duration
                audio.currentTime = Math.min(clickTime, audio.duration);
            }
        });
    }
    
    // Volume control - affects both audio elements
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const volume = this.value / 100;
            audioEn.volume = volume;
            audioEs.volume = volume;
            
            // Update volume icon based on level
            const volumeIcon = document.querySelector('.volume-control i');
            if (volumeIcon) {
                if (volume === 0) {
                    volumeIcon.className = 'fas fa-volume-mute';
                } else if (volume < 0.5) {
                    volumeIcon.className = 'fas fa-volume-down';
                } else {
                    volumeIcon.className = 'fas fa-volume-up';
                }
            }
        });
    }
    
    // Enhanced 3D tilt effect and rainbow iridescent edge shift on mouse move
    const podcastCard = document.querySelector('.podcast-card');
    const cardContainer = document.querySelector('.podcast-card-container');
    
    if (podcastCard && cardContainer) {
        cardContainer.addEventListener('mousemove', function(e) {
            if (window.innerWidth >= 768) { // Desktop only
                const rect = cardContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                // Calculate mouse position as percentage
                const mouseXPercent = (x / rect.width) * 100;
                const mouseYPercent = (y / rect.height) * 100;
                
                // Create stardust trail that follows mouse cursor (throttled for performance)
                if (Math.random() < 0.3) { // Only create stardust 30% of the time
                    createStardust(e.clientX, e.clientY);
                }
                
                // Apply enhanced tilt during interaction
                podcastCard.style.transform = `
                    perspective(1500px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale(1.03)
                    translateZ(20px)
                `;
                podcastCard.style.transition = 'transform 0.1s ease';
                
                // Dynamically shift rainbow iridescent edges based on mouse position
                const cardBefore = podcastCard.querySelector('::before');
                if (cardBefore) {
                    cardBefore.style.backgroundPosition = `${mouseXPercent}% ${mouseYPercent}%, ${100 - mouseXPercent}% ${100 - mouseYPercent}%`;
                }
                
                // Create dynamic CSS for pseudo-element
                const dynamicStyle = document.getElementById('dynamic-podcast-style') || document.createElement('style');
                dynamicStyle.id = 'dynamic-podcast-style';
                dynamicStyle.textContent = `
                    .podcast-card::before {
                        background-position: ${mouseXPercent}% ${mouseYPercent}%, ${100 - mouseXPercent}% ${100 - mouseYPercent}% !important;
                        transform: rotate(${(mouseXPercent - 50) * 0.5}deg) scale(${1 + (mouseYPercent - 50) * 0.002}) !important;
                        opacity: ${0.8 + (mouseYPercent / 100) * 0.2} !important;
                    }
                `;
                if (!document.getElementById('dynamic-podcast-style')) {
                    document.head.appendChild(dynamicStyle);
                }
            }
        });
        
        cardContainer.addEventListener('mouseleave', function() {
            // Reset to default animation
            podcastCard.style.transform = '';
            podcastCard.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Remove dynamic styling
            const dynamicStyle = document.getElementById('dynamic-podcast-style');
            if (dynamicStyle) {
                dynamicStyle.remove();
            }
        });
    }
    
    // Error handling for both audio elements
    function addErrorHandling(audio) {
        audio.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            console.error('Audio error details:', {
                error: audio.error,
                networkState: audio.networkState,
                readyState: audio.readyState,
                currentSrc: audio.currentSrc
            });
            
            // Only show error if this is the current active audio
            if (audio === getCurrentAudio()) {
                playPauseBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                playPauseBtn.disabled = true;
                
                // Resume background music if podcast fails to load
                const backgroundMusic = document.getElementById('background-music');
                if (backgroundMusic && (audioEn.backgroundMusicWasPaused || audioEs.backgroundMusicWasPaused)) {
                    setTimeout(() => {
                        const playPromise = backgroundMusic.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                console.log('Background music resumed after podcast error');
                                audioEn.backgroundMusicWasPaused = false;
                                audioEs.backgroundMusicWasPaused = false;
                            }).catch(error => {
                                console.log('Could not resume background music after error:', error);
                            });
                        }
                    }, 500);
                }
            }
        });
    }
    
    addErrorHandling(audioEn);
    addErrorHandling(audioEs);
    
    // Loading state and debugging for both audio elements
    function addLoadingHandlers(audio) {
        audio.addEventListener('loadstart', function() {
            console.log('Audio load started:', audio.id);
            if (audio === getCurrentAudio()) {
                playPauseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                playPauseBtn.disabled = true;
            }
        });
        
        audio.addEventListener('loadeddata', function() {
            console.log('Audio data loaded:', audio.id);
        });
        
        audio.addEventListener('canplay', function() {
            console.log('Audio can start playing:', audio.id);
            if (audio === getCurrentAudio()) {
                if (audio.paused) {
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                playPauseBtn.disabled = false;
            }
        });
    }
    
    addLoadingHandlers(audioEn);
    addLoadingHandlers(audioEs);
    
    // Force load both audio files
    audioEn.load();
    audioEs.load();
    
    // Stardust Trail Function
    function createStardust(x, y) {
        const stardust = document.createElement('div');
        stardust.className = 'stardust-particle';
        stardust.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 1) 0%, 
                rgba(255, 215, 0, 0.8) 30%, 
                rgba(0, 255, 255, 0.6) 60%, 
                transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: stardustFade 2s ease-out forwards;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        `;
        
        document.body.appendChild(stardust);
        
        // Remove element after animation
        setTimeout(() => {
            if (stardust.parentNode) {
                stardust.parentNode.removeChild(stardust);
            }
        }, 2000);
    }
    
    // Sparkle Explosion Function
    function createSparkleExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create multiple sparkle particles (reduced for performance)
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-particle';
            
            const angle = (Math.PI * 2 * i) / 20;
            const distance = Math.random() * 100 + 50;
            const size = Math.random() * 6 + 3;
            
            sparkle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%, 
                    rgba(255, 215, 0, 0.9) 25%, 
                    rgba(255, 0, 255, 0.7) 50%, 
                    rgba(0, 255, 255, 0.5) 75%, 
                    transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: sparkleExplosion 1.5s ease-out forwards;
                transform-origin: center;
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
            `;
            
            sparkle.style.setProperty('--angle', angle + 'rad');
            sparkle.style.setProperty('--distance', distance + 'px');
            
            document.body.appendChild(sparkle);
            
            // Remove element after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
    }
    
    // Add CSS animations for stardust and sparkles
    const particleStyles = document.createElement('style');
    particleStyles.textContent = `
        @keyframes stardustFade {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0px);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.2) translateY(-20px);
            }
            100% {
                opacity: 0;
                transform: scale(0.5) translateY(-40px);
            }
        }
        
        @keyframes sparkleExplosion {
            0% {
                opacity: 1;
                transform: scale(1) translate(0px, 0px) rotate(0deg);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.5) translate(
                    calc(cos(var(--angle)) * var(--distance) * 0.5),
                    calc(sin(var(--angle)) * var(--distance) * 0.5)
                ) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0.2) translate(
                    calc(cos(var(--angle)) * var(--distance)),
                    calc(sin(var(--angle)) * var(--distance))
                ) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(particleStyles);
}

// Global function to pause podcast and resume background music
window.pausePodcastAndResumeBackgroundMusic = function() {
    const podcastAudioEn = document.getElementById('podcast-audio-en');
    const podcastAudioEs = document.getElementById('podcast-audio-es');
    const backgroundMusic = document.getElementById('background-music');
    
    // Pause both audio elements
    let audioPaused = false;
    if (podcastAudioEn && !podcastAudioEn.paused) {
        podcastAudioEn.pause();
        audioPaused = true;
        console.log('English podcast paused by global function');
    }
    if (podcastAudioEs && !podcastAudioEs.paused) {
        podcastAudioEs.pause();
        audioPaused = true;
        console.log('Spanish podcast paused by global function');
    }
    
    // Resume background music if any podcast was paused
    if (audioPaused && backgroundMusic && (podcastAudioEn?.backgroundMusicWasPaused || podcastAudioEs?.backgroundMusicWasPaused)) {
        setTimeout(() => {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Background music resumed by global function');
                    if (podcastAudioEn) podcastAudioEn.backgroundMusicWasPaused = false;
                    if (podcastAudioEs) podcastAudioEs.backgroundMusicWasPaused = false;
                }).catch(error => {
                    console.log('Could not resume background music via global function:', error);
                });
            }
        }, 300);
    }
};

// Initialize podcast player for desktop only
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth >= 768) {
        initializePodcastPlayer();
    }
});
    