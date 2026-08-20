document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       SELECTORS
    ============================================ */
    const loader = document.getElementById('pageLoader');
    const loaderNum = document.getElementById('loaderNumber');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const scrollProgress = document.getElementById('scrollProgress');
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    /* ============================================
       PRELOADER
    ============================================ */
    let progress = 0;
    document.body.style.overflowY = 'hidden';

    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.style.overflowY = '';
                revealHero();
            }, 400);
        }
        loaderNum.textContent = `${String(progress).padStart(2, '0')}%`;
    }, 40);

    /* ============================================
       HERO REVEAL
    ============================================ */
    const revealHero = () => {
        const headlineInners = document.querySelectorAll('.hero-headline .line-inner');
        headlineInners.forEach((line, i) => {
            setTimeout(() => {
                line.style.transform = 'translateY(0)';
            }, i * 150);
        });

        const fadeUps = document.querySelectorAll('.hero .fade-up');
        fadeUps.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, 400 + i * 100);
        });
    };

    /* ============================================
       SCROLL — rAF throttled, passive
    ============================================ */
    let ticking = false;

    const onScroll = () => {
        const scrollTop = window.scrollY;

        // Navbar
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            scrollProgress.style.transform = `scaleX(${scrollTop / docHeight})`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    /* ============================================
       MOBILE NAVIGATION
    ============================================ */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflowY = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflowY = '';
        });
    });

    /* ============================================
       INTERSECTION OBSERVER — scroll reveals
    ============================================ */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            if (el.classList.contains('fade-up') || el.classList.contains('fade-in')) {
                el.classList.add('revealed');
            }

            if (el.classList.contains('reveal-text')) {
                const inner = el.querySelector('.reveal-text-inner');
                if (inner) inner.classList.add('revealed');
            }

            if (el.classList.contains('hero-stat-number')) {
                animateNumber(el);
            }

            observer.unobserve(el);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    });

    // Register elements (skip hero — handled by preloader)
    document.querySelectorAll('.fade-up, .fade-in, .reveal-text').forEach(el => {
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    document.querySelectorAll('.hero-stat-number').forEach(el => {
        revealObserver.observe(el);
    });

    /* ============================================
       WHAT WE BUILD — staggered reveals
    ============================================ */
    const wwbSection = document.getElementById('whatWeBuild');
    if (wwbSection) {
        const wwbHeader = wwbSection.querySelector('.wwb-header');
        const wwbRows = wwbSection.querySelectorAll('.wwb-row');
        const wwbCta = wwbSection.querySelector('.wwb-cta');

        const wwbObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Reveal header first
                if (wwbHeader) {
                    wwbHeader.classList.add('wwb-revealed');
                }

                // Stagger rows: 150ms apart
                wwbRows.forEach((row, i) => {
                    setTimeout(() => {
                        row.classList.add('wwb-revealed');
                    }, 150 + i * 150);
                });

                // CTA after rows finish
                if (wwbCta) {
                    setTimeout(() => {
                        wwbCta.classList.add('wwb-revealed');
                    }, 150 + wwbRows.length * 150 + 200);
                }

                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        wwbObserver.observe(wwbSection);
    }

    /* ============================================
       NUMBER COUNTER
    ============================================ */
    const animateNumber = (el) => {
        const raw = el.textContent.trim();
        const match = raw.match(/\d+/);
        if (!match) return;

        const target = parseInt(match[0]);
        const suffix = raw.replace(match[0], '');
        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const current = Math.floor(ease * target);

            el.textContent = `${current}${suffix}`;

            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = `${target}${suffix}`;
            }
        };

        requestAnimationFrame(step);
    };

    /* ============================================
       TESTIMONIALS SLIDER
    ============================================ */
    if (testimonialsTrack && prevBtn && nextBtn) {
        const getOffset = () => {
            const card = testimonialsTrack.querySelector('.testimonial-card');
            return card ? card.getBoundingClientRect().width + 24 : 0;
        };

        nextBtn.addEventListener('click', () => {
            testimonialsTrack.scrollBy({ left: getOffset(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            testimonialsTrack.scrollBy({ left: -getOffset(), behavior: 'smooth' });
        });
    }

    /* ============================================
       PORTFOLIO CATEGORY FILTERS
    ============================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    const workGrid = document.getElementById('workGrid');

    if (filterBtns.length && workItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                workItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('filtered-out');
                        item.style.display = '';
                    } else {
                        item.classList.add('filtered-out');
                        // Delay hiding to allow animation
                        setTimeout(() => {
                            if (item.classList.contains('filtered-out')) {
                                item.style.display = 'none';
                            }
                        }, 400);
                    }
                });

                // Reset grid layout when filtering
                if (filter !== 'all' && workGrid) {
                    workGrid.style.gridTemplateColumns = '1fr 1fr';
                    workItems.forEach(item => {
                        if (!item.classList.contains('filtered-out')) {
                            item.style.gridColumn = 'auto';
                            item.style.gridRow = 'auto';
                            item.style.aspectRatio = '4/3';
                        }
                    });
                } else if (workGrid) {
                    // Restore editorial layout
                    workGrid.style.gridTemplateColumns = '';
                    workItems.forEach(item => {
                        item.style.gridColumn = '';
                        item.style.gridRow = '';
                        item.style.aspectRatio = '';
                    });
                }
            });
        });
    }

    /* ============================================
       FAQ ACCORDION
    ============================================ */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });

    /* ============================================
       CONTACT FORM
    ============================================ */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Visual feedback - loading
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            const sendingText = window.BM_i18n ? (window.BM_i18n.t('contact.sending', window.BM_i18n.getCurrentLang()) || 'Sending...') : 'Sending...';
            submitBtn.innerHTML = sendingText;
            submitBtn.disabled = true;

            // Add type parameter for server-side routing
            data.type = 'contact';

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    const successText = window.BM_i18n ? (window.BM_i18n.t('contact.sent', window.BM_i18n.getCurrentLang()) || 'Message Sent ✓') : 'Message Sent ✓';
                    submitBtn.innerHTML = successText;
                    submitBtn.style.background = 'rgba(215, 210, 200, 0.2)';
                    submitBtn.style.color = 'var(--accent)';

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                } else {
                    throw new Error('Failed to send');
                }
            })
            .catch(error => {
                console.error('Error submitting contact form:', error);
                const errorText = window.BM_i18n ? (window.BM_i18n.t('contact.error', window.BM_i18n.getCurrentLang()) || 'Error! Try again.') : 'Error! Try again.';
                submitBtn.innerHTML = errorText;
                submitBtn.style.background = 'rgba(239, 68, 68, 0.1)';
                submitBtn.style.color = '#ef4444';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    /* ============================================
       BOOKING SYSTEM (MODAL & STYLES SELECTION)
    ============================================ */
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const closeBookingBtn = document.getElementById('closeBookingBtn');
    const modalOverlay = bookingModal ? bookingModal.querySelector('.booking-modal-overlay') : null;
    const modalServiceTitle = document.getElementById('modalServiceTitle');
    const modalServiceGoal = document.getElementById('modalServiceGoal');
    const modalServiceIncludes = document.getElementById('modalServiceIncludes');
    const modalServiceIncludesContainer = document.getElementById('modalServiceIncludesContainer');
    const modalServiceInput = document.getElementById('modalServiceInput');

    const bookStylesBtn = document.getElementById('bookStylesBtn');
    const selectedStylesCount = document.getElementById('selectedStylesCount');
    const floatingBookStylesBtn = document.getElementById('floatingBookStylesBtn');
    const floatingSelectedStylesCount = document.getElementById('floatingSelectedStylesCount');
    const styleCards = document.querySelectorAll('.creative-styles .style-card');

    let selectedStyles = new Set();

    // Open booking modal
    const openBookingModal = (serviceName, goalText, includesHtml, priceText = '', initialStyles = []) => {
        if (!bookingModal) return;

        // Reset form and styles checkboxes
        if (bookingForm) {
            bookingForm.reset();
            const checkBoxes = bookingForm.querySelectorAll('input[type="checkbox"][name="styles"]');
            checkBoxes.forEach(cb => {
                cb.checked = initialStyles.includes(cb.value);
            });
        }

        // Set service info
        modalServiceTitle.textContent = serviceName;
        modalServiceGoal.textContent = goalText || 'Custom project design';
        modalServiceInput.value = serviceName;

        const modalPriceEl = document.getElementById('modalServicePrice');
        if (modalPriceEl) {
            modalPriceEl.textContent = priceText;
            modalPriceEl.style.display = priceText ? 'block' : 'none';
        }

        if (includesHtml) {
            modalServiceIncludes.innerHTML = includesHtml;
            modalServiceIncludesContainer.style.display = 'block';
        } else {
            modalServiceIncludesContainer.style.display = 'none';
        }

        // Open
        bookingModal.classList.add('active');
        bookingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflowY = 'hidden';
    };

    // Close booking modal
    const closeBookingModal = () => {
        if (!bookingModal) return;
        bookingModal.classList.remove('active');
        bookingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflowY = '';
    };

    // 1. Hook up Collection Cards (Clicking anywhere on the card opens the booking form)
    document.querySelectorAll('.collection-card').forEach(card => {
        const ctaBtn = card.querySelector('.collection-card-cta');
        if (!ctaBtn) return;

        card.addEventListener('click', (e) => {
            const href = ctaBtn.getAttribute('href');
            if (href === '#build') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                e.preventDefault();

                const title = card.querySelector('.collection-card-title').textContent.trim();
                const priceEl = card.querySelector('.collection-card-price');
                const price = priceEl ? priceEl.textContent.trim() : '';
                const goal = card.querySelector('.collection-card-goal').textContent.trim();
                
                const includesEl = card.querySelector('.collection-card-includes ul');
                const includesHtml = includesEl ? includesEl.innerHTML : '';

                // Open modal with this collection details
                openBookingModal(title, goal, includesHtml, price);
            }
        });
    });

    // 2. Hook up Close actions
    if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBookingModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeBookingModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });

    // 3. Style Cards Click Selection for #styles Section
    const styleCardsSelection = document.querySelectorAll('.creative-styles .style-card');
    if (styleCardsSelection.length > 0) {
        styleCardsSelection.forEach(card => {
            card.addEventListener('click', () => {
                const nameEl = card.querySelector('.style-card-name');
                const styleName = nameEl ? nameEl.textContent.trim() : '';

                if (card.classList.contains('is-selected')) {
                    card.classList.remove('is-selected');
                    selectedStyles.delete(styleName);
                } else {
                    card.classList.add('is-selected');
                    selectedStyles.add(styleName);
                }

                const count = selectedStyles.size;
                if (selectedStylesCount) selectedStylesCount.textContent = `(${count})`;
                if (floatingSelectedStylesCount) floatingSelectedStylesCount.textContent = `(${count})`;

                if (count > 0) {
                    if (bookStylesBtn) bookStylesBtn.classList.add('visible');
                    if (floatingBookStylesBtn) floatingBookStylesBtn.classList.add('visible');
                } else {
                    if (bookStylesBtn) bookStylesBtn.classList.remove('visible');
                    if (floatingBookStylesBtn) floatingBookStylesBtn.classList.remove('visible');
                }
            });
        });
    }

    /* ============================================
       LUMINA WEBGL INTERACTIVE SELECTED WORK SLIDER
       - Applied to #work Section ("Izabrani Radovi / Izabrane Priče")
       - Three.js Shader Displacement & Glass Refraction Engine
       - GSAP Kinetic Typography Animations
       - Performance Optimized: 0% CPU/GPU overhead when off-screen
    ============================================ */
    const workSection = document.getElementById('work') || document.querySelector('.slider-wrapper');
    const workWrapper = workSection;
    const workCanvas = workSection ? workSection.querySelector('.webgl-canvas') : document.querySelector('.webgl-canvas');
    const workTitleEl = document.getElementById('mainTitle');
    const workDescEl = document.getElementById('mainDesc');
    const workTagEl = document.getElementById('slideTag');
    const workNumEl = document.getElementById('slideNumber');
    const workTotalEl = document.getElementById('slideTotal');
    const workNav = document.getElementById('slidesNav');

    const workSlides = [
        {
            id: 'personal-brands',
            titleKey: 'work.personal_name',
            descKey: 'work.personal_milan',
            tag: '01 · LIČNI BRENDOVI · MILANO',
            media: 'images/project-personal.png',
            effectType: 0
        },
        {
            id: 'fashion',
            titleKey: 'work.fashion_editorial',
            descKey: 'work.fashion_milan',
            tag: '02 · MODA · MILANO',
            media: 'images/project-fashion.png',
            effectType: 1
        },
        {
            id: 'beauty',
            titleKey: 'work.beauty_campaign',
            descKey: 'work.beauty_ny',
            tag: '03 · LEPOTA · NJUJORK',
            media: 'images/project-beauty.png',
            effectType: 2
        },
        {
            id: 'jewelry',
            titleKey: 'work.jewelry_name',
            descKey: 'work.jewelry_paris',
            tag: '04 · NAKIT · PARIZ',
            media: 'images/project-jewelry.png',
            effectType: 0
        },
        {
            id: 'hospitality-como',
            titleKey: 'work.hospitality_como_name',
            descKey: 'work.hospitality_como',
            tag: '05 · UGOSTITELJSTVO · JEZERO KOMO',
            media: 'images/project-hospitality1.png',
            effectType: 1
        },
        {
            id: 'luxury-mobility',
            titleKey: 'work.mobility_name',
            descKey: 'work.mobility_monaco',
            tag: '06 · LUKSUZNA MOBILNOST · MONAKO',
            media: 'images/project-mobility.png',
            effectType: 2
        },
        {
            id: 'interior-design',
            titleKey: 'work.interior_name',
            descKey: 'work.interior_london',
            tag: '07 · DIZAJN ENTERIJERA · LONDON',
            media: 'images/project-interior.png',
            effectType: 0
        },
        {
            id: 'architecture',
            titleKey: 'work.architecture_name',
            descKey: 'work.architecture_dubai',
            tag: '08 · ARHITEKTURA · DUBAI',
            media: 'images/project-architecture.png',
            effectType: 1
        },
        {
            id: 'sport-dining',
            titleKey: 'work.restaurant_name',
            descKey: 'work.restaurant_rome',
            tag: '09 · SPORT & DINING · RIM',
            media: 'images/project-restaurant.png',
            effectType: 2
        },
        {
            id: 'technology',
            titleKey: 'work.tech_name',
            descKey: 'work.tech_sf',
            tag: '10 · TEHNOLOGIJA · SAN FRANCISKO',
            media: 'images/project-technology.png',
            effectType: 0
        }
    ];

    if (workWrapper && workCanvas && typeof THREE !== 'undefined') {
        const SLIDE_SPEED = 5000;
        const PROGRESS_INTERVAL = 40;
        const TRANSITION_DURATION = 1.4;

        let currentSlideIdx = 0;
        let isTransitioning = false;
        let isWorkVisible = false;
        let isHovered = false;
        let texturesLoaded = false;
        let slideTextures = [];
        let autoSlideTimer = null;
        let progressAnimation = null;
        let currentProgress = 0;
        let animFrameId = null;

        let scene, camera, renderer, shaderMaterial;

        // GLSL Shaders
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform sampler2D uTexture1;
            uniform sampler2D uTexture2;
            uniform float uProgress;
            uniform vec2 uResolution;
            uniform vec2 uTexture1Size;
            uniform vec2 uTexture2Size;
            uniform int uEffectType;
            uniform float uDistortionStrength;
            varying vec2 vUv;

            vec2 getCoverUV(vec2 uv, vec2 textureSize) {
                vec2 s = uResolution / textureSize;
                float scale = max(s.x, s.y);
                vec2 scaledSize = textureSize * scale;
                vec2 offset = (uResolution - scaledSize) * 0.5;
                return (uv * uResolution - offset) / scaledSize;
            }

            vec4 glassEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float p = smoothstep(0.0, 1.0, progress);
                vec2 offset = vec2(sin(p * 3.14159) * 0.05 * uDistortionStrength);
                return mix(texture2D(uTexture1, uv1 + offset), texture2D(uTexture2, uv2 - offset), p);
            }

            vec4 timeshiftEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float p = smoothstep(0.0, 1.0, progress);
                vec2 dir = normalize(uv - 0.5);
                vec2 offset = dir * sin(p * 3.14159) * 0.035 * uDistortionStrength;
                
                vec4 col1 = vec4(
                    texture2D(uTexture1, uv1 + offset * 1.2).r,
                    texture2D(uTexture1, uv1 + offset * 0.4).g,
                    texture2D(uTexture1, uv1 - offset * 0.8).b,
                    1.0
                );
                vec4 col2 = vec4(
                    texture2D(uTexture2, uv2 - offset * 1.2).r,
                    texture2D(uTexture2, uv2 - offset * 0.4).g,
                    texture2D(uTexture2, uv2 + offset * 0.8).b,
                    1.0
                );
                return mix(col1, col2, p);
            }

            vec4 rippleEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                vec2 p = uv - 0.5;
                float d = length(p);
                float wave = sin(d * 30.0 - progress * 15.0) * 0.02 * (1.0 - progress) * uDistortionStrength;
                vec2 dist1 = uv1 + p * wave;
                vec2 dist2 = uv2 - p * wave;
                return mix(texture2D(uTexture1, dist1), texture2D(uTexture2, dist2), smoothstep(0.0, 1.0, progress));
            }

            void main() {
                if (uEffectType == 0) {
                    gl_FragColor = glassEffect(vUv, uProgress);
                } else if (uEffectType == 1) {
                    gl_FragColor = timeshiftEffect(vUv, uProgress);
                } else {
                    gl_FragColor = rippleEffect(vUv, uProgress);
                }
            }
        `;

        // Helper for splitting characters for kinetic text
        const splitText = (text) => {
            return text.split('').map(char => {
                if (char === ' ') return '<span style="display:inline-block;">&nbsp;</span>';
                return `<span style="display:inline-block;opacity:0;">${char}</span>`;
            }).join('');
        };

        const getLocalizedText = (key, fallback) => {
            if (window.BM_i18n && typeof window.BM_i18n.t === 'function') {
                return window.BM_i18n.t(key, window.BM_i18n.getCurrentLang()) || fallback;
            }
            return fallback;
        };

        // Update Slide Content with Kinetic Typography Animations
        const updateContent = (idx) => {
            if (!workTitleEl || !workDescEl) return;
            const slide = workSlides[idx];
            if (!slide) return;

            const titleText = getLocalizedText(slide.titleKey, slide.id);
            const descText = getLocalizedText(slide.descKey, '');

            if (workTagEl) workTagEl.textContent = slide.tag;
            if (workNumEl) workNumEl.textContent = String(idx + 1).padStart(2, '0');
            if (workTotalEl) workTotalEl.textContent = String(workSlides.length).padStart(2, '0');

            if (typeof gsap !== 'undefined') {
                gsap.to(workTitleEl.children, { y: -16, opacity: 0, duration: 0.35, stagger: 0.015, ease: 'power2.in' });
                gsap.to(workDescEl, { y: -8, opacity: 0, duration: 0.3, ease: 'power2.in' });

                setTimeout(() => {
                    workTitleEl.innerHTML = splitText(titleText);
                    workDescEl.textContent = descText;

                    const children = workTitleEl.children;
                    const animType = idx % 6;

                    switch (animType) {
                        case 0: // Stagger Up
                            gsap.set(children, { y: 22, opacity: 0 });
                            gsap.to(children, { y: 0, opacity: 1, duration: 0.7, stagger: 0.025, ease: 'power3.out' });
                            gsap.fromTo(workDescEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power3.out' });
                            break;
                        case 1: // Stagger Down with Back ease
                            gsap.set(children, { y: -20, opacity: 0 });
                            gsap.to(children, { y: 0, opacity: 1, duration: 0.7, stagger: 0.025, ease: 'back.out(1.5)' });
                            gsap.fromTo(workDescEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power3.out' });
                            break;
                        case 2: // Blur Reveal
                            gsap.set(children, { filter: 'blur(8px)', scale: 1.2, opacity: 0, y: 0 });
                            gsap.to(children, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 0.8, stagger: { amount: 0.4, from: 'random' }, ease: 'power2.out' });
                            gsap.fromTo(workDescEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
                            break;
                        case 3: // Scale In
                            gsap.set(children, { scale: 0.3, opacity: 0, y: 0 });
                            gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'back.out(1.6)' });
                            gsap.fromTo(workDescEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power3.out' });
                            break;
                        case 4: // 3D Flip (Rotate X)
                            gsap.set(children, { rotationX: 80, y: 0, opacity: 0, transformOrigin: '50% 50%' });
                            gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: 'power2.out' });
                            gsap.fromTo(workDescEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power2.out' });
                            break;
                        case 5: // Side Slide In
                            gsap.set(children, { x: 24, opacity: 0, y: 0 });
                            gsap.to(children, { x: 0, opacity: 1, duration: 0.7, stagger: 0.025, ease: 'power3.out' });
                            gsap.fromTo(workDescEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power3.out' });
                            break;
                    }
                }, 320);
            } else {
                workTitleEl.textContent = titleText;
                workDescEl.textContent = descText;
            }
        };

        const renderFrame = () => {
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        };

        const renderLoop = () => {
            if (!isWorkVisible) {
                animFrameId = null;
                return;
            }
            renderFrame();
            animFrameId = requestAnimationFrame(renderLoop);
        };

        const startRenderLoop = () => {
            if (!animFrameId && isWorkVisible) {
                animFrameId = requestAnimationFrame(renderLoop);
            }
        };

        const stopRenderLoop = () => {
            if (animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
        };

        const navigateToSlide = (targetIdx) => {
            if (isTransitioning || targetIdx === currentSlideIdx || !texturesLoaded) return;
            stopAutoSlideTimer();
            resetProgressLine(currentSlideIdx);

            const curTex = slideTextures[currentSlideIdx];
            const targetTex = slideTextures[targetIdx];
            if (!curTex || !targetTex) return;

            isTransitioning = true;
            shaderMaterial.uniforms.uTexture1.value = curTex;
            shaderMaterial.uniforms.uTexture2.value = targetTex;
            shaderMaterial.uniforms.uTexture1Size.value = curTex.userData.size;
            shaderMaterial.uniforms.uTexture2Size.value = targetTex.userData.size;
            shaderMaterial.uniforms.uEffectType.value = workSlides[targetIdx].effectType;

            currentSlideIdx = targetIdx;
            updateContent(currentSlideIdx);
            updateNavigationState(currentSlideIdx);

            startRenderLoop();

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(shaderMaterial.uniforms.uProgress,
                    { value: 0 },
                    {
                        value: 1,
                        duration: TRANSITION_DURATION,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            shaderMaterial.uniforms.uProgress.value = 0;
                            shaderMaterial.uniforms.uTexture1.value = targetTex;
                            shaderMaterial.uniforms.uTexture1Size.value = targetTex.userData.size;
                            isTransitioning = false;
                            renderFrame();
                            safeStartTimer(200);
                        }
                    }
                );
            } else {
                shaderMaterial.uniforms.uTexture1.value = targetTex;
                shaderMaterial.uniforms.uTexture1Size.value = targetTex.userData.size;
                isTransitioning = false;
                renderFrame();
                safeStartTimer(200);
            }
        };

        const createSlidesNavigation = () => {
            if (!workNav) return;
            workNav.innerHTML = '';
            workSlides.forEach((slide, i) => {
                const item = document.createElement('div');
                item.className = `slide-nav-item${i === 0 ? ' active' : ''}`;
                item.dataset.slideIndex = String(i);
                const title = getLocalizedText(slide.titleKey, slide.id);
                item.innerHTML = `
                    <div class="slide-progress-line"><div class="slide-progress-fill"></div></div>
                    <div class="slide-nav-title" data-i18n="${slide.titleKey}">${title}</div>
                `;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!isTransitioning && i !== currentSlideIdx) {
                        navigateToSlide(i);
                    }
                });
                workNav.appendChild(item);
            });
        };

        const updateNavigationState = (idx) => {
            document.querySelectorAll('.slide-nav-item').forEach((el, i) => {
                el.classList.toggle('active', i === idx);
            });
        };

        const updateSlideProgress = (idx, prog) => {
            const el = document.querySelectorAll('.slide-nav-item')[idx]?.querySelector('.slide-progress-fill');
            if (el) {
                el.style.width = `${prog}%`;
                el.style.opacity = '1';
            }
        };

        const resetProgressLine = (idx) => {
            const el = document.querySelectorAll('.slide-nav-item')[idx]?.querySelector('.slide-progress-fill');
            if (el) {
                el.style.width = '0%';
            }
        };

        const startAutoSlideTimer = () => {
            if (!texturesLoaded || isHovered || !isWorkVisible) return;
            stopAutoSlideTimer();
            currentProgress = 0;
            const increment = (100 / SLIDE_SPEED) * PROGRESS_INTERVAL;

            progressAnimation = setInterval(() => {
                if (isHovered || !isWorkVisible) return;
                currentProgress += increment;
                updateSlideProgress(currentSlideIdx, currentProgress);
                if (currentProgress >= 100) {
                    clearInterval(progressAnimation);
                    progressAnimation = null;
                    resetProgressLine(currentSlideIdx);
                    if (!isTransitioning) {
                        const nextIdx = (currentSlideIdx + 1) % workSlides.length;
                        navigateToSlide(nextIdx);
                    }
                }
            }, PROGRESS_INTERVAL);
        };

        const stopAutoSlideTimer = () => {
            if (progressAnimation) {
                clearInterval(progressAnimation);
                progressAnimation = null;
            }
            if (autoSlideTimer) {
                clearTimeout(autoSlideTimer);
                autoSlideTimer = null;
            }
        };

        const safeStartTimer = (delay = 0) => {
            stopAutoSlideTimer();
            if (isWorkVisible && texturesLoaded && !isHovered) {
                if (delay > 0) {
                    autoSlideTimer = setTimeout(startAutoSlideTimer, delay);
                } else {
                    startAutoSlideTimer();
                }
            }
        };

        // Texture Loader
        const loadTexture = (src) => new Promise((resolve) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                src,
                (tex) => {
                    tex.minFilter = THREE.LinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    tex.generateMipmaps = false;
                    tex.userData = { size: new THREE.Vector2(tex.image.width || 1920, tex.image.height || 1080) };
                    resolve(tex);
                },
                undefined,
                () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1920;
                    canvas.height = 1080;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#141312';
                    ctx.fillRect(0, 0, 1920, 1080);
                    const tex = new THREE.CanvasTexture(canvas);
                    tex.userData = { size: new THREE.Vector2(1920, 1080) };
                    resolve(tex);
                }
            );
        });

        // Initialize WebGL Scene
        const initWebGL = async () => {
            const rect = workWrapper.getBoundingClientRect();
            const width = rect.width || window.innerWidth;
            const height = rect.height || window.innerHeight;

            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            renderer = new THREE.WebGLRenderer({
                canvas: workCanvas,
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance'
            });

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

            shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTexture1: { value: null },
                    uTexture2: { value: null },
                    uProgress: { value: 0 },
                    uResolution: { value: new THREE.Vector2(width, height) },
                    uTexture1Size: { value: new THREE.Vector2(1920, 1080) },
                    uTexture2Size: { value: new THREE.Vector2(1920, 1080) },
                    uEffectType: { value: 0 },
                    uDistortionStrength: { value: 1.0 }
                },
                vertexShader,
                fragmentShader,
                depthTest: false,
                depthWrite: false
            });

            scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

            // Preload all textures
            for (const s of workSlides) {
                const tex = await loadTexture(s.media);
                slideTextures.push(tex);
            }

            if (slideTextures.length >= 2) {
                shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
                shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
                shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
                shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
                texturesLoaded = true;
                renderFrame();
                if (isWorkVisible) safeStartTimer(400);
            }
        };

        // Resize handler
        let resizeTimeout;
        const handleResize = () => {
            if (!renderer || !workWrapper) return;
            const rect = workWrapper.getBoundingClientRect();
            const width = rect.width || window.innerWidth;
            const height = rect.height || window.innerHeight;

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
            if (shaderMaterial) {
                shaderMaterial.uniforms.uResolution.value.set(width, height);
            }
            renderFrame();
        };

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150);
        }, { passive: true });

        // Pause auto-slide on hover for optimal user control
        workWrapper.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoSlideTimer();
        });

        workWrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            safeStartTimer(200);
        });

        // Touch Swipe Gestures
        let touchStartX = 0;
        let touchEndX = 0;

        workWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        workWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 45 && !isTransitioning) {
                if (diff > 0) {
                    navigateToSlide((currentSlideIdx + 1) % workSlides.length);
                } else {
                    navigateToSlide((currentSlideIdx - 1 + workSlides.length) % workSlides.length);
                }
            }
        }, { passive: true });

        // Visibility Intersection Observer — ZERO CPU/GPU wasted when scrolled away
        const workObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isWorkVisible = entry.isIntersecting;
                if (isWorkVisible) {
                    startRenderLoop();
                    safeStartTimer(300);
                } else {
                    stopRenderLoop();
                    stopAutoSlideTimer();
                }
            });
        }, { threshold: 0.1 });

        if (workSection) {
            workObserver.observe(workSection);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopRenderLoop();
                stopAutoSlideTimer();
            } else if (isWorkVisible) {
                startRenderLoop();
                safeStartTimer(200);
            }
        });

        // Language change event hook
        window.addEventListener('languageChanged', () => {
            updateContent(currentSlideIdx);
            createSlidesNavigation();
            updateNavigationState(currentSlideIdx);
        });

        // Init UI and WebGL
        createSlidesNavigation();
        updateContent(0);
        initWebGL();
    }

    // 4. Book Selected Styles Button
    if (bookStylesBtn) {
        bookStylesBtn.addEventListener('click', () => {
            const stylesList = Array.from(selectedStyles);
            const includesListHtml = stylesList.map(style => `<li>Selected Style: ${style}</li>`).join('');

            openBookingModal(
                'Custom Style Selection', 
                'Tailored visual direction for your project.', 
                includesListHtml, 
                '', 
                stylesList
            );
        });
    }

    if (floatingBookStylesBtn) {
        floatingBookStylesBtn.addEventListener('click', () => {
            const stylesList = Array.from(selectedStyles);
            const includesListHtml = stylesList.map(style => `<li>Selected Style: ${style}</li>`).join('');

            openBookingModal(
                'Custom Style Selection', 
                'Tailored visual direction for your project.', 
                includesListHtml, 
                '', 
                stylesList
            );
        });
    }

    // 5. Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate
            const nameInput = document.getElementById('bookingName');
            const emailInput = document.getElementById('bookingEmail');

            if (!nameInput.value.trim() || !emailInput.value.trim()) {
                const alertMsg = window.BM_i18n ? (window.BM_i18n.t('modal.fill_fields', window.BM_i18n.getCurrentLang()) || 'Please fill out Name and Email.') : 'Please fill out Name and Email.';
                alert(alertMsg);
                return;
            }

            // Submit feedback - loading
            const submitBtn = bookingForm.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            const sendingText = window.BM_i18n ? (window.BM_i18n.t('modal.booking_sending', window.BM_i18n.getCurrentLang()) || 'Sending...') : 'Sending...';
            submitBtn.innerHTML = sendingText;
            submitBtn.disabled = true;

            // Gather booking form data
            const selectedStyleList = [];
            bookingForm.querySelectorAll('input[name="styles"]:checked').forEach(cb => {
                selectedStyleList.push(cb.value);
            });

            const data = {
                type: 'booking',
                service: document.getElementById('modalServiceInput').value,
                name: nameInput.value,
                email: emailInput.value,
                brand: document.getElementById('bookingBrand').value,
                social: document.getElementById('bookingSocial').value,
                styles: selectedStyleList,
                details: document.getElementById('bookingDetails').value
            };

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    const successText = window.BM_i18n ? (window.BM_i18n.t('modal.booking_requested', window.BM_i18n.getCurrentLang()) || 'Booking Requested ✓') : 'Booking Requested ✓';
                    submitBtn.innerHTML = successText;
                    submitBtn.style.background = 'rgba(215, 210, 200, 0.2)';
                    submitBtn.style.color = 'var(--accent)';

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                        submitBtn.disabled = false;
                        
                        // Clear selected style cards visual state & reset set
                        styleCards.forEach(c => c.classList.remove('is-selected'));
                        selectedStyles.clear();
                        if (selectedStylesCount) selectedStylesCount.textContent = '(0)';
                        if (floatingSelectedStylesCount) floatingSelectedStylesCount.textContent = '(0)';
                        if (bookStylesBtn) bookStylesBtn.classList.remove('visible');
                        if (floatingBookStylesBtn) floatingBookStylesBtn.classList.remove('visible');

                        bookingForm.reset();
                        closeBookingModal();
                    }, 2500);
                } else {
                    throw new Error('Failed to send booking request');
                }
            })
            .catch(error => {
                console.error('Error submitting booking form:', error);
                const errorText = window.BM_i18n ? (window.BM_i18n.t('modal.booking_error', window.BM_i18n.getCurrentLang()) || 'Error! Try again.') : 'Error! Try again.';
                submitBtn.innerHTML = errorText;
                submitBtn.style.background = 'rgba(239, 68, 68, 0.1)';
                submitBtn.style.color = '#ef4444';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    /* ============================================
       SMOOTH SCROLL FOR ANCHOR LINKS
    ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || this.classList.contains('collection-card-cta')) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
