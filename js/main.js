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

            // Visual feedback
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            const successText = window.BM_i18n ? (window.BM_i18n.t('contact.sent', window.BM_i18n.getCurrentLang()) || 'Message Sent ✓') : 'Message Sent ✓';
            submitBtn.innerHTML = successText;
            submitBtn.style.background = 'rgba(215, 210, 200, 0.2)';
            submitBtn.style.color = 'var(--accent)';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
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
    const openBookingModal = (serviceName, goalText, includesHtml, initialStyles = []) => {
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

    // 1. Hook up Collection Cards
    document.querySelectorAll('.collection-card').forEach(card => {
        const ctaBtn = card.querySelector('.collection-card-cta');
        if (!ctaBtn) return;

        // Skip "Describe Your Project" button which navigates to #build
        if (ctaBtn.getAttribute('href') === '#build') return;

        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const title = card.querySelector('.collection-card-title').textContent.trim();
            const goal = card.querySelector('.collection-card-goal').textContent.trim();
            
            const includesEl = card.querySelector('.collection-card-includes ul');
            const includesHtml = includesEl ? includesEl.innerHTML : '';

            // Open modal with this collection details
            openBookingModal(title, goal, includesHtml);
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

    // 3. Interactive Style Cards (Visual Language)
    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            const styleName = card.querySelector('.style-card-name').textContent.trim();
            card.classList.toggle('is-selected');

            if (card.classList.contains('is-selected')) {
                selectedStyles.add(styleName);
            } else {
                selectedStyles.delete(styleName);
            }

            // Update button count and visibility
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

    // 4. Book Selected Styles Button
    if (bookStylesBtn) {
        bookStylesBtn.addEventListener('click', () => {
            const stylesList = Array.from(selectedStyles);
            const includesListHtml = stylesList.map(style => `<li>Selected Style: ${style}</li>`).join('');

            openBookingModal(
                'Custom Style Selection', 
                'Tailored visual direction for your project.', 
                includesListHtml, 
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

            // Submit feedback
            const submitBtn = bookingForm.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            const successText = window.BM_i18n ? (window.BM_i18n.t('modal.booking_requested', window.BM_i18n.getCurrentLang()) || 'Booking Requested ✓') : 'Booking Requested ✓';
            submitBtn.innerHTML = successText;
            submitBtn.style.background = 'rgba(215, 210, 200, 0.2)';
            submitBtn.style.color = 'var(--accent)';
            submitBtn.disabled = true;

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

                closeBookingModal();
            }, 2500);
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
