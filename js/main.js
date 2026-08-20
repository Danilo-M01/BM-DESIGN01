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

    /* ============================================
       LUMINA WEBGL INTERACTIVE STYLES SLIDER
       - Direct Three.js Shader Displacement & Glass Refraction Engine
       - GSAP Kinetic Typography Animations
    ============================================ */
    const initLuminaSlider = async () => {
        const sliderContainer = document.getElementById('styles') || document.querySelector('.slider-wrapper');
        const canvas = document.querySelector('.webgl-canvas');
        if (!sliderContainer || !canvas || typeof THREE === 'undefined') return;

        const SLIDER_CONFIG = {
            settings: {
                transitionDuration: 2.0,
                autoSlideSpeed: 5000,
                currentEffect: "glass",
                currentEffectPreset: "Default",
                globalIntensity: 1.0,
                speedMultiplier: 1.0,
                distortionStrength: 1.0,
                colorEnhancement: 1.0,
                glassRefractionStrength: 1.0,
                glassChromaticAberration: 1.0,
                glassBubbleClarity: 1.0,
                glassEdgeGlow: 1.0,
                glassLiquidFlow: 1.0,
                frostIntensity: 1.5,
                frostCrystalSize: 1.0,
                frostIceCoverage: 1.0,
                frostTemperature: 1.0,
                frostTexture: 1.0,
                rippleFrequency: 25.0,
                rippleAmplitude: 0.08,
                rippleWaveSpeed: 1.0,
                rippleRippleCount: 1.0,
                rippleDecay: 1.0,
                plasmaIntensity: 1.2,
                plasmaSpeed: 0.8,
                plasmaEnergyIntensity: 0.4,
                plasmaContrastBoost: 0.3,
                plasmaTurbulence: 1.0,
                timeshiftDistortion: 1.6,
                timeshiftBlur: 1.5,
                timeshiftFlow: 1.4,
                timeshiftChromatic: 1.5,
                timeshiftTurbulence: 1.4
            }
        };

        const slides = [
            {
                id: 'luxury-minimal',
                titleKey: 'styles.luxury_minimal',
                descKey: 'styles.luxury_minimal_desc',
                defaultTitle: 'Luksuzni Minimalizam',
                defaultDesc: 'Čiste kompozicije inspirisane visokom modom i modnim editorijalima.',
                media: 'images/style_luxury_minimal.png',
                effect: 'glass',
                checkboxValue: 'Luxury Minimal'
            },
            {
                id: 'cinematic-essence',
                titleKey: 'styles.cinematic',
                descKey: 'styles.cinematic_desc',
                defaultTitle: 'Filmska Esencija',
                defaultDesc: 'Storytelling inspirisan filmom sa dramatičnim osvetljenjem i narativom.',
                media: 'images/style_cinematic_essence.png',
                effect: 'timeshift',
                checkboxValue: 'Cinematic Essence'
            },
            {
                id: 'urban-street',
                titleKey: 'styles.urban',
                descKey: 'styles.urban_desc',
                defaultTitle: 'Urbani Ulični',
                defaultDesc: 'Sirova energija i autentična gradska kultura uhvaćena u dinamičnom pokretu.',
                media: 'images/style_urban_street.png',
                effect: 'ripple',
                checkboxValue: 'Urban Street'
            },
            {
                id: 'classic-elegance',
                titleKey: 'styles.classic',
                descKey: 'styles.classic_desc',
                defaultTitle: 'Klasična Elegancija',
                defaultDesc: 'Vanvremenska sofisticiranost sa savršenom ravnotežom svetla i forme.',
                media: 'images/style_classic_elegance.png',
                effect: 'frost',
                checkboxValue: 'Classic Elegance'
            },
            {
                id: 'natural-harmony',
                titleKey: 'styles.natural',
                descKey: 'styles.natural_desc',
                defaultTitle: 'Prirodna Harmonija',
                defaultDesc: 'Organski tonovi, tople teksture i prirodno svetlo u svakom kadru.',
                media: 'images/style_natural_harmony.png',
                effect: 'plasma',
                checkboxValue: 'Natural Harmony'
            },
            {
                id: 'artistic-direction',
                titleKey: 'styles.artistic',
                descKey: 'styles.artistic_desc',
                defaultTitle: 'Umetnička Direkcija',
                defaultDesc: 'Smela kreativna vizija koja ruši konvencije i stvara ikonične vizuale.',
                media: 'images/style_artistic_direction.png',
                effect: 'glass',
                checkboxValue: 'Artistic Direction'
            },
            {
                id: 'hot-bold',
                titleKey: 'styles.hot_bold',
                defaultTitle: 'Vatreno i Smelo',
                defaultDesc: 'Živopisne boje, bogat kontrast i samouvereni vizuelni izrazi.',
                descKey: 'styles.hot_bold_desc',
                media: 'images/style_hot_bold.png',
                effect: 'plasma',
                checkboxValue: 'Hot & Bold'
            },
            {
                id: 'retro-revival',
                titleKey: 'styles.retro',
                descKey: 'styles.retro_desc',
                defaultTitle: 'Retro Povratak',
                defaultDesc: 'Nostalgična analogna estetika ponovo osmišljena za savremene brendove.',
                media: 'images/style_retro_revival.png',
                effect: 'timeshift',
                checkboxValue: 'Retro Revival'
            },
            {
                id: 'futuristic-glow',
                titleKey: 'styles.futuristic',
                descKey: 'styles.futuristic_desc',
                defaultTitle: 'Futuristički Sjaj',
                defaultDesc: 'Neonski vizuali, futurističke distorzije i estetika sutrašnjice.',
                media: 'images/style_futuristic_glow.png',
                effect: 'ripple',
                checkboxValue: 'Futuristic Glow'
            }
        ];

        let currentSlideIndex = 0;
        let isTransitioning = false;
        let shaderMaterial, renderer, scene, camera;
        let slideTextures = [];
        let texturesLoaded = false;
        let autoSlideTimer = null;
        let progressAnimation = null;
        let sliderEnabled = false;

        const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
        const PROGRESS_UPDATE_INTERVAL = 50;
        const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform sampler2D uTexture1, uTexture2;
            uniform float uProgress;
            uniform vec2 uResolution, uTexture1Size, uTexture2Size;
            uniform int uEffectType;
            uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
            uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
            uniform float uFrostIntensity, uFrostCrystalSize, uFrostIceCoverage, uFrostTemperature, uFrostTexture;
            uniform float uRippleFrequency, uRippleAmplitude, uRippleWaveSpeed, uRippleRippleCount, uRippleDecay;
            uniform float uPlasmaIntensity, uPlasmaSpeed, uPlasmaEnergyIntensity, uPlasmaContrastBoost, uPlasmaTurbulence;
            uniform float uTimeshiftDistortion, uTimeshiftBlur, uTimeshiftFlow, uTimeshiftChromatic, uTimeshiftTurbulence;
            varying vec2 vUv;

            vec2 getCoverUV(vec2 uv, vec2 textureSize) {
                vec2 s = uResolution / max(textureSize, vec2(1.0, 1.0));
                float scale = max(s.x, s.y);
                vec2 scaledSize = textureSize * scale;
                vec2 offset = (uResolution - scaledSize) * 0.5;
                return (uv * uResolution - offset) / max(scaledSize, vec2(1.0, 1.0));
            }

            vec4 glassEffect(vec2 uv, float progress) {
                float time = progress * 5.0 * uSpeedMultiplier;
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float maxR = length(uResolution) * 0.85;
                float br = progress * maxR;
                vec2 p = uv * uResolution;
                vec2 c = uResolution * 0.5;
                float d = length(p - c);
                float nd = d / max(br, 0.001);
                float param = smoothstep(br + 3.0, br - 3.0, d);
                vec4 img;
                if (param > 0.0) {
                     float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
                     vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
                     vec2 distUV = uv2 - dir * ro;
                     distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
                     float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
                     img = vec4(
                         texture2D(uTexture2, distUV + dir * ca * 1.2).r,
                         texture2D(uTexture2, distUV + dir * ca * 0.2).g,
                         texture2D(uTexture2, distUV - dir * ca * 0.8).b,
                         1.0
                     );
                     if (uGlassEdgeGlow > 0.0) {
                        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
                        img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
                     }
                } else {
                    img = texture2D(uTexture2, uv2);
                }
                vec4 oldImg = texture2D(uTexture1, uv1);
                if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
                return mix(oldImg, img, param);
            }

            vec4 frostEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float p = smoothstep(0.0, 1.0, progress);
                float n = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
                vec2 blur1 = uv1 + (vec2(n) - 0.5) * 0.02 * (1.0 - p);
                vec2 blur2 = uv2 + (vec2(n) - 0.5) * 0.02 * p;
                return mix(texture2D(uTexture1, blur1), texture2D(uTexture2, blur2), p);
            }

            vec4 rippleEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float p = smoothstep(0.0, 1.0, progress);
                vec2 c = vec2(0.5);
                float d = distance(uv, c);
                float wave = sin(d * uRippleFrequency - progress * 12.0 * uRippleWaveSpeed) * (1.0 - progress) * uRippleAmplitude;
                vec2 warped1 = uv1 + wave * normalize(uv - c + 0.001);
                vec2 warped2 = uv2 - wave * normalize(uv - c + 0.001);
                return mix(texture2D(uTexture1, warped1), texture2D(uTexture2, warped2), p);
            }

            vec4 plasmaEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float p = smoothstep(0.0, 1.0, progress);
                vec2 offset = vec2(sin(uv.y * 10.0 + progress * 6.0), cos(uv.x * 10.0 + progress * 6.0)) * 0.03 * sin(p * 3.14159);
                return mix(texture2D(uTexture1, uv1 + offset), texture2D(uTexture2, uv2 - offset), p);
            }

            vec4 timeshiftEffect(vec2 uv, float progress) {
                vec2 uv1 = getCoverUV(uv, uTexture1Size);
                vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float p = smoothstep(0.0, 1.0, progress);
                vec2 dir = normalize(uv - 0.5);
                vec2 offset = dir * sin(p * 3.14159) * 0.03 * uTimeshiftDistortion;
                vec4 col1 = vec4(
                    texture2D(uTexture1, uv1 + offset * 1.2).r,
                    texture2D(uTexture1, uv1 + offset * 0.5).g,
                    texture2D(uTexture1, uv1).b,
                    1.0
                );
                vec4 col2 = vec4(
                    texture2D(uTexture2, uv2 - offset * 1.2).r,
                    texture2D(uTexture2, uv2 - offset * 0.5).g,
                    texture2D(uTexture2, uv2).b,
                    1.0
                );
                return mix(col1, col2, p);
            }

            void main() {
                if (uEffectType == 0) gl_FragColor = glassEffect(vUv, uProgress);
                else if (uEffectType == 1) gl_FragColor = frostEffect(vUv, uProgress);
                else if (uEffectType == 2) gl_FragColor = rippleEffect(vUv, uProgress);
                else if (uEffectType == 3) gl_FragColor = plasmaEffect(vUv, uProgress);
                else gl_FragColor = timeshiftEffect(vUv, uProgress);
            }
        `;

        const getEffectIndex = (effectName) => {
            const map = { glass: 0, frost: 1, ripple: 2, plasma: 3, timeshift: 4 };
            return map[effectName] !== undefined ? map[effectName] : 0;
        };

        const updateShaderUniforms = () => {
            if (!shaderMaterial) return;
            const s = SLIDER_CONFIG.settings;
            const u = shaderMaterial.uniforms;
            for (const key in s) {
                const uName = 'u' + key.charAt(0).toUpperCase() + key.slice(1);
                if (u[uName]) u[uName].value = s[key];
            }
            const currentEffectName = slides[currentSlideIndex]?.effect || 'glass';
            u.uEffectType.value = getEffectIndex(currentEffectName);
        };

        const splitText = (text) => {
            return text.split('').map(char => `<span style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        };

        const getLocalizedText = (key, fallback) => {
            if (window.BM_i18n && typeof window.BM_i18n.t === 'function') {
                return window.BM_i18n.t(key, window.BM_i18n.getCurrentLang()) || fallback;
            }
            return fallback;
        };

        const btnToggleCurrentStyle = document.getElementById('btnToggleCurrentStyle');
        const updateStyleToggleBtn = (idx) => {
            if (!btnToggleCurrentStyle) return;
            const slide = slides[idx];
            const isSelected = selectedStyles.has(slide.checkboxValue);
            const iconEl = btnToggleCurrentStyle.querySelector('.btn-style-icon');
            const labelEl = btnToggleCurrentStyle.querySelector('.btn-style-label');

            if (isSelected) {
                btnToggleCurrentStyle.classList.add('is-selected');
                if (iconEl) iconEl.textContent = '✓';
                if (labelEl) labelEl.textContent = getLocalizedText('styles.style_selected', 'Izabran stil');
            } else {
                btnToggleCurrentStyle.classList.remove('is-selected');
                if (iconEl) iconEl.textContent = '+';
                if (labelEl) labelEl.textContent = getLocalizedText('styles.select_this_style', 'Izaberi ovaj stil');
            }
        };

        const updateContent = (idx) => {
            const titleEl = document.getElementById('mainTitle');
            const descEl = document.getElementById('mainDesc');
            if (!titleEl || !descEl) return;

            const slide = slides[idx];
            const titleText = getLocalizedText(slide.titleKey, slide.defaultTitle);
            const descText = getLocalizedText(slide.descKey, slide.defaultDesc);

            updateStyleToggleBtn(idx);

            if (typeof gsap !== 'undefined') {
                gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.4, stagger: 0.02, ease: "power2.in" });
                gsap.to(descEl, { y: -10, opacity: 0, duration: 0.3, ease: "power2.in" });

                setTimeout(() => {
                    titleEl.innerHTML = splitText(titleText);
                    descEl.textContent = descText;

                    gsap.set(titleEl.children, { opacity: 0 });
                    gsap.set(descEl, { y: 20, opacity: 0 });

                    const children = titleEl.children;
                    switch (idx % 6) {
                        case 0: // Stagger Up
                            gsap.set(children, { y: 20 });
                            gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                            break;
                        case 1: // Stagger Down
                            gsap.set(children, { y: -20 });
                            gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.7)" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                            break;
                        case 2: // Blur Reveal
                            gsap.set(children, { filter: "blur(10px)", scale: 1.4, y: 0 });
                            gsap.to(children, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 0.9, stagger: { amount: 0.4, from: "random" }, ease: "power2.out" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" });
                            break;
                        case 3: // Scale In
                            gsap.set(children, { scale: 0, y: 0 });
                            gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.04, ease: "back.out(1.5)" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                            break;
                        case 4: // Rotate X (Flip)
                            gsap.set(children, { rotationX: 90, y: 0, transformOrigin: "50% 50%" });
                            gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" });
                            break;
                        case 5: // Side Reveal
                            gsap.set(children, { x: 30, y: 0 });
                            gsap.to(children, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                            break;
                        default:
                            gsap.set(children, { y: 20 });
                            gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                    }
                }, 350);
            } else {
                titleEl.textContent = titleText;
                descEl.textContent = descText;
            }
        };

        const updateCounter = (idx) => {
            const sn = document.getElementById("slideNumber");
            if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
            const st = document.getElementById("slideTotal");
            if (st) st.textContent = String(slides.length).padStart(2, "0");
        };

        const updateNavigationState = (idx) => {
            document.querySelectorAll(".slide-nav-item").forEach((el, i) => {
                el.classList.toggle("active", i === idx);
            });
        };

        const updateSlideProgress = (idx, prog) => {
            const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill");
            if (el) {
                el.style.width = `${prog}%`;
                el.style.opacity = '1';
            }
        };

        const fadeSlideProgress = (idx) => {
            const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill");
            if (el) {
                el.style.opacity = '0';
                setTimeout(() => { el.style.width = "0%"; }, 300);
            }
        };

        const quickResetProgress = (idx) => {
            const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill");
            if (el) {
                el.style.transition = "width 0.2s ease-out";
                el.style.width = "0%";
                setTimeout(() => {
                    el.style.transition = "width 0.1s ease, opacity 0.3s ease";
                }, 200);
            }
        };

        const stopAutoSlideTimer = () => {
            if (progressAnimation) clearInterval(progressAnimation);
            if (autoSlideTimer) clearTimeout(autoSlideTimer);
            progressAnimation = null;
            autoSlideTimer = null;
        };

        const startAutoSlideTimer = () => {
            if (!texturesLoaded || !sliderEnabled) return;
            stopAutoSlideTimer();
            let progress = 0;
            const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;

            progressAnimation = setInterval(() => {
                if (!sliderEnabled) {
                    stopAutoSlideTimer();
                    return;
                }
                progress += increment;
                updateSlideProgress(currentSlideIndex, progress);
                if (progress >= 100) {
                    clearInterval(progressAnimation);
                    progressAnimation = null;
                    fadeSlideProgress(currentSlideIndex);
                    if (!isTransitioning) handleSlideChange();
                }
            }, PROGRESS_UPDATE_INTERVAL);
        };

        const safeStartTimer = (delay = 0) => {
            stopAutoSlideTimer();
            if (sliderEnabled && texturesLoaded) {
                if (delay > 0) {
                    autoSlideTimer = setTimeout(startAutoSlideTimer, delay);
                } else {
                    startAutoSlideTimer();
                }
            }
        };

        const navigateToSlide = (targetIndex) => {
            if (isTransitioning || targetIndex === currentSlideIndex) return;
            stopAutoSlideTimer();
            quickResetProgress(currentSlideIndex);

            const currentTexture = slideTextures[currentSlideIndex];
            const targetTexture = slideTextures[targetIndex];
            if (!currentTexture || !targetTexture) return;

            isTransitioning = true;
            shaderMaterial.uniforms.uTexture1.value = currentTexture;
            shaderMaterial.uniforms.uTexture2.value = targetTexture;
            shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
            shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;
            
            const effectName = slides[targetIndex].effect || 'glass';
            shaderMaterial.uniforms.uEffectType.value = getEffectIndex(effectName);

            updateContent(targetIndex);
            currentSlideIndex = targetIndex;
            updateCounter(currentSlideIndex);
            updateNavigationState(currentSlideIndex);

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(shaderMaterial.uniforms.uProgress,
                    { value: 0 },
                    {
                        value: 1,
                        duration: TRANSITION_DURATION(),
                        ease: "power2.inOut",
                        onComplete: () => {
                            shaderMaterial.uniforms.uProgress.value = 0;
                            shaderMaterial.uniforms.uTexture1.value = targetTexture;
                            shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                            isTransitioning = false;
                            safeStartTimer(100);
                        }
                    }
                );
            } else {
                shaderMaterial.uniforms.uProgress.value = 0;
                shaderMaterial.uniforms.uTexture1.value = targetTexture;
                shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                isTransitioning = false;
                safeStartTimer(100);
            }
        };

        const handleSlideChange = () => {
            if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
            navigateToSlide((currentSlideIndex + 1) % slides.length);
        };

        const createSlidesNavigation = () => {
            const nav = document.getElementById("slidesNav");
            if (!nav) return;
            nav.innerHTML = "";
            slides.forEach((slide, i) => {
                const item = document.createElement("div");
                item.className = `slide-nav-item${i === currentSlideIndex ? " active" : ""}`;
                item.dataset.slideIndex = String(i);
                const title = getLocalizedText(slide.titleKey, slide.defaultTitle);
                item.innerHTML = `
                    <div class="slide-progress-line"><div class="slide-progress-fill"></div></div>
                    <div class="slide-nav-title">${title}</div>
                `;
                item.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (!isTransitioning && i !== currentSlideIndex) {
                        stopAutoSlideTimer();
                        quickResetProgress(currentSlideIndex);
                        navigateToSlide(i);
                    }
                });
                nav.appendChild(item);
            });
        };

        const loadImageTexture = (src) => new Promise((resolve) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                src,
                (t) => {
                    t.minFilter = THREE.LinearFilter;
                    t.magFilter = THREE.LinearFilter;
                    t.generateMipmaps = false;
                    t.userData = { size: new THREE.Vector2(t.image ? t.image.width : 1920, t.image ? t.image.height : 1080) };
                    resolve(t);
                },
                undefined,
                (err) => {
                    console.warn("Failed texture:", src, err);
                    const c = document.createElement('canvas');
                    c.width = 1920;
                    c.height = 1080;
                    const ctx = c.getContext('2d');
                    ctx.fillStyle = '#11100f';
                    ctx.fillRect(0, 0, 1920, 1080);
                    const t = new THREE.CanvasTexture(c);
                    t.userData = { size: new THREE.Vector2(1920, 1080) };
                    resolve(t);
                }
            );
        });

        const initRenderer = async () => {
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
            
            const w = sliderContainer.clientWidth || window.innerWidth;
            const h = sliderContainer.clientHeight || window.innerHeight;
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTexture1: { value: null },
                    uTexture2: { value: null },
                    uProgress: { value: 0 },
                    uResolution: { value: new THREE.Vector2(w, h) },
                    uTexture1Size: { value: new THREE.Vector2(w, h) },
                    uTexture2Size: { value: new THREE.Vector2(w, h) },
                    uEffectType: { value: 0 },
                    uGlobalIntensity: { value: 1.0 },
                    uSpeedMultiplier: { value: 1.0 },
                    uDistortionStrength: { value: 1.0 },
                    uColorEnhancement: { value: 1.0 },
                    uGlassRefractionStrength: { value: 1.0 },
                    uGlassChromaticAberration: { value: 1.0 },
                    uGlassBubbleClarity: { value: 1.0 },
                    uGlassEdgeGlow: { value: 1.0 },
                    uGlassLiquidFlow: { value: 1.0 },
                    uFrostIntensity: { value: 1.5 },
                    uFrostCrystalSize: { value: 1.0 },
                    uFrostIceCoverage: { value: 1.0 },
                    uFrostTemperature: { value: 1.0 },
                    uFrostTexture: { value: 1.0 },
                    uRippleFrequency: { value: 25.0 },
                    uRippleAmplitude: { value: 0.08 },
                    uRippleWaveSpeed: { value: 1.0 },
                    uRippleRippleCount: { value: 1.0 },
                    uRippleDecay: { value: 1.0 },
                    uPlasmaIntensity: { value: 1.2 },
                    uPlasmaSpeed: { value: 0.8 },
                    uPlasmaEnergyIntensity: { value: 0.4 },
                    uPlasmaContrastBoost: { value: 0.3 },
                    uPlasmaTurbulence: { value: 1.0 },
                    uTimeshiftDistortion: { value: 1.6 },
                    uTimeshiftBlur: { value: 1.5 },
                    uTimeshiftFlow: { value: 1.4 },
                    uTimeshiftChromatic: { value: 1.5 },
                    uTimeshiftTurbulence: { value: 1.4 }
                },
                vertexShader,
                fragmentShader
            });

            scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

            for (const s of slides) {
                const tex = await loadImageTexture(s.media);
                slideTextures.push(tex);
            }

            if (slideTextures.length >= 2) {
                shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
                shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
                shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
                shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
                texturesLoaded = true;
                sliderEnabled = true;
                updateShaderUniforms();
                safeStartTimer(500);
            }

            const render = () => {
                requestAnimationFrame(render);
                if (renderer && scene && camera) {
                    renderer.render(scene, camera);
                }
            };
            render();
        };

        createSlidesNavigation();
        updateCounter(0);

        const tEl = document.getElementById('mainTitle');
        const dEl = document.getElementById('mainDesc');
        if (tEl && dEl) {
            const initTitle = getLocalizedText(slides[0].titleKey, slides[0].defaultTitle);
            const initDesc = getLocalizedText(slides[0].descKey, slides[0].defaultDesc);
            tEl.innerHTML = splitText(initTitle);
            dEl.textContent = initDesc;
            updateStyleToggleBtn(0);

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
                gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
            }
        }

        initRenderer();

        // Style select toggle button hook
        if (btnToggleCurrentStyle) {
            btnToggleCurrentStyle.addEventListener('click', (e) => {
                e.stopPropagation();
                const slide = slides[currentSlideIndex];
                const styleName = slide.checkboxValue;

                if (selectedStyles.has(styleName)) {
                    selectedStyles.delete(styleName);
                } else {
                    selectedStyles.add(styleName);
                }

                updateStyleToggleBtn(currentSlideIndex);

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
        }

        // Window resize and visibility hooks
        window.addEventListener("resize", () => {
            if (renderer && shaderMaterial && sliderContainer) {
                const nw = sliderContainer.clientWidth || window.innerWidth;
                const nh = sliderContainer.clientHeight || window.innerHeight;
                renderer.setSize(nw, nh);
                shaderMaterial.uniforms.uResolution.value.set(nw, nh);
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoSlideTimer();
            } else if (!isTransitioning) {
                safeStartTimer(200);
            }
        });

        window.addEventListener('languageChanged', () => {
            updateContent(currentSlideIndex);
            createSlidesNavigation();
            updateNavigationState(currentSlideIndex);
        });
    };

    initLuminaSlider();

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
