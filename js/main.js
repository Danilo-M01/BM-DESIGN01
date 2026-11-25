/* ============================================
   BM DESIGN01 — MAIN INTERACTION ENGINE
   Smooth navigation, project showcase, style selection & inquiry modal
============================================ */
(() => {
    'use strict';

    const init = () => {
        const site = window.BM_SITE || { collections: [], projects: [], styles: [] };
        const dictionary = typeof translations === 'object' ? translations : {};

        const $ = id => document.getElementById(id);
        const navbar = $('navbar');
        const hamburger = $('hamburgerBtn');
        const mobileMenu = $('mobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        const scrollProgress = $('scrollProgress');

        const projectDialog = $('projectDialog');
        const inquiryDialog = $('inquiryDialog');
        const inquiryForm = $('inquiryForm');
        const collectionSelect = $('collectionSelect');
        const formResult = $('formResult');

        const selectedStyles = new Set();
        let currentProject = null;
        let currentCollection = null;
        let submitting = false;

        const getLang = () => window.BM_i18n ? window.BM_i18n.getCurrentLang() : (document.documentElement.lang || 'en');

        const fallback = {
            'ui.project_video': { sr: 'Projektni film', en: 'Project film', ru: 'Фильм проекта' },
            'ui.project_gallery': { sr: 'Galerija projekta', en: 'Project gallery', ru: 'Галерея проекта' },
            'ui.project_collection': { sr: 'Istražite povezanu kolekciju', en: 'Explore the related collection', ru: 'Посмотреть связанную коллекцию' },
            'ui.open_image': { sr: 'Otvorite celu sliku', en: 'Open full image', ru: 'Открыть изображение целиком' },
            'ui.style_limit_reached': { sr: 'Ova kolekcija uključuje do 3 stila. Uklonite jedan pre novog izbora.', en: 'This collection includes up to 3 styles. Remove one before choosing another.', ru: 'Эта коллекция включает до 3 стилей. Снимите один выбор, прежде чем добавить другой.' },
            'ui.sending': { sr: 'Slanje upita…', en: 'Sending inquiry…', ru: 'Отправка запроса…' },
            'ui.inquiry_sent': { sr: 'Upit je poslat. Dogovor o detaljima sledi putem emaila.', en: 'Inquiry sent. The details will be discussed by email.', ru: 'Запрос отправлен. Детали будут согласованы по электронной почте.' },
            'ui.inquiry_error': { sr: 'Upit nije poslat. Pokušajte ponovo ili pišite na collab@bmdesign01.com.', en: 'The inquiry was not sent. Please try again or email collab@bmdesign01.com.', ru: 'Запрос не отправлен. Попробуйте ещё раз или напишите на collab@bmdesign01.com.' }
        };

        const t = key => {
            const lang = getLang();
            return dictionary[key]?.[lang] || dictionary[key]?.sr || fallback[key]?.[lang] || fallback[key]?.sr || '';
        };

        const styleBoxes = () => inquiryForm ? [...inquiryForm.querySelectorAll('input[name="styles"]')] : [];
        const collectionName = col => col ? t(`offer.${col.id}.name`) || col.id : '';

        const priceText = col => {
            if (!col || col.price === null || col.price === undefined) return t('offer.on_request');
            const lang = getLang();
            const locale = lang === 'en' ? 'en-GB' : lang === 'ru' ? 'ru-RU' : 'sr-Latn-RS';
            return `${t('offer.from')} ${new Intl.NumberFormat(locale).format(col.price)} €`.trim();
        };

        const setButtonLabel = (button, value) => {
            if (!button) return;
            const label = button.querySelector('[data-i18n], span:not([aria-hidden="true"])');
            if (label) label.textContent = value;
            else button.textContent = value;
        };

        /* ============================================
           SCROLL — rAF throttled, passive
        ============================================ */
        let ticking = false;
        const onScroll = () => {
            const scrollTop = window.scrollY;
            if (navbar) {
                navbar.classList.toggle('scrolled', scrollTop > 40);
            }
            if (scrollProgress) {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight > 0) {
                    scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollTop / docHeight))})`;
                }
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
        onScroll();

        /* ============================================
           MOBILE NAVIGATION
        ============================================ */
        const closeMobileMenu = () => {
            if (!hamburger || !mobileMenu) return;
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflowY = '';
        };

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                const isOpen = hamburger.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', String(isOpen));
                mobileMenu.classList.toggle('active', isOpen);
                mobileMenu.setAttribute('aria-hidden', String(!isOpen));
                document.body.style.overflowY = isOpen ? 'hidden' : '';
            });

            mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
        }

        /* ============================================
           CREATIVE STYLES SELECTION
        ============================================ */
        const updateSelectedStyles = () => {
            document.querySelectorAll('[data-style]').forEach(btn => {
                const selected = selectedStyles.has(btn.dataset.style);
                btn.setAttribute('aria-pressed', String(selected));
                btn.classList.toggle('is-selected', selected);
            });
            const countEl = $('selectedStyleCount');
            if (countEl) countEl.textContent = String(selectedStyles.size);
            const bar = $('selectedStylesBar');
            if (bar) bar.hidden = selectedStyles.size === 0;
        };

        /* ============================================
           MODALS & DIALOGS (MONTÉ / COSMOS & INQUIRY)
        ============================================ */
        const syncDialogScroll = () => {
            document.body.classList.toggle('dialog-open', Boolean(projectDialog?.open || inquiryDialog?.open));
        };

        const openDialog = dialog => {
            if (!dialog || dialog.open) return;
            dialog.showModal();
            syncDialogScroll();
        };

        const closeProject = () => {
            const video = $('projectVideo');
            if (video) video.pause();
            if (projectDialog?.open) projectDialog.close();
        };

        const updateProjectCopy = () => {
            if (!currentProject) return;
            if ($('projectTitle')) $('projectTitle').textContent = currentProject.title || '';
            if ($('projectSubtitle')) $('projectSubtitle').textContent = t(currentProject.subtitleKey);
            const related = site.collections.find(c => c.id === currentProject.collection);
            const btn = $('projectCollectionButton');
            if (btn) {
                btn.dataset.inquire = related?.id || 'custom';
                setButtonLabel(btn, `${t('ui.project_collection')} · ${collectionName(related) || t('offer.custom.name')}`);
            }
            $('projectVideo')?.setAttribute('aria-label', t('ui.project_video'));
            $('projectGallery')?.setAttribute('aria-label', t('ui.project_gallery'));
            $('projectGallery')?.querySelectorAll('figure').forEach(fig => {
                const idx = Number(fig.dataset.galleryIndex);
                const asset = currentProject.gallery?.[idx];
                if (!asset) return;
                const capSpan = fig.querySelector('.gallery-caption-text');
                const openSpan = fig.querySelector('.gallery-open-label');
                if (capSpan && asset.captionKey) capSpan.textContent = t(asset.captionKey) || asset.alt;
                if (openSpan) openSpan.textContent = t('ui.open_image');
            });
        };

        const openProject = id => {
            const project = site.projects.find(item => item.id === id);
            if (!project || !projectDialog) return;
            currentProject = project;

            const video = $('projectVideo');
            if (video) {
                video.pause();
                video.controls = true;
                video.autoplay = false;
                video.preload = 'metadata';
                video.hidden = !project.film;
                video.removeAttribute('src');
                if (project.film) {
                    video.src = project.film;
                    if (project.cover) video.poster = project.cover;
                    else video.removeAttribute('poster');
                }
                video.load();
            }

            const gallery = $('projectGallery');
            if (gallery) {
                gallery.replaceChildren();
                (project.gallery || []).forEach((asset, index) => {
                    if (!asset?.src) return;
                    const figure = document.createElement('figure');
                    figure.dataset.galleryIndex = String(index);

                    const link = document.createElement('a');
                    link.className = 'gallery-image-link';
                    link.href = asset.src;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';

                    const image = document.createElement('img');
                    image.src = asset.src;
                    image.alt = asset.alt || `${project.title} — ${index + 1}`;
                    image.loading = 'lazy';
                    image.decoding = 'async';
                    if (asset.width) image.width = asset.width;
                    if (asset.height) image.height = asset.height;
                    link.append(image);
                    figure.append(link);

                    const caption = document.createElement('figcaption');
                    const label = document.createElement('span');
                    label.className = 'gallery-caption-text';
                    label.textContent = t(asset.captionKey) || asset.alt || project.title;

                    const action = document.createElement('a');
                    action.className = 'gallery-open-label';
                    action.href = asset.src;
                    action.target = '_blank';
                    action.rel = 'noopener noreferrer';
                    action.textContent = t('ui.open_image');

                    caption.append(label, action);
                    figure.append(caption);
                    gallery.append(figure);
                });
            }

            updateProjectCopy();
            openDialog(projectDialog);
            projectDialog.scrollTop = 0;
        };

        const hideResult = () => {
            if (!formResult) return;
            formResult.hidden = true;
            formResult.replaceChildren();
        };

        const setResult = (message, error = false) => {
            if (!formResult) return;
            formResult.replaceChildren();
            const p = document.createElement('p');
            p.textContent = message;
            formResult.append(p);
            formResult.hidden = false;
            formResult.dataset.state = error ? 'error' : 'success';
            formResult.setAttribute('role', 'status');
        };

        const styleLimit = () => Math.max(1, Number(currentCollection?.maxStyles) || 9);

        const updateStyleHint = () => {
            const max = styleLimit();
            const key = max === 1 ? 'offer.styles_one' : max === 3 ? 'offer.styles_three' : 'offer.styles_custom';
            if ($('styleLimitHint')) $('styleLimitHint').textContent = t(key);
        };

        const trimStyles = () => {
            const checked = styleBoxes().filter(box => box.checked);
            checked.slice(styleLimit()).forEach(box => { box.checked = false; });
            updateStyleHint();
        };

        const renderCollection = () => {
            if (!currentCollection) return;
            if ($('inquiryTitle')) $('inquiryTitle').textContent = collectionName(currentCollection);
            if ($('inquiryPrice')) $('inquiryPrice').textContent = priceText(currentCollection);
            if ($('inquiryGoal')) $('inquiryGoal').textContent = t(`offer.${currentCollection.id}.goal`);

            const includes = $('inquiryIncludes');
            if (includes) {
                includes.replaceChildren();
                for (let i = 0; i < 40; i++) {
                    const copy = t(`offer.${currentCollection.id}.item${i}`);
                    if (!copy) break;
                    const li = document.createElement('li');
                    li.textContent = copy;
                    includes.append(li);
                }
            }
            if (collectionSelect) collectionSelect.value = currentCollection.id;
            updateStyleHint();
            if ($('inquiryDeliveryNote')) $('inquiryDeliveryNote').textContent = t('offer.disclaimer');
        };

        const openInquiry = (id = 'custom', carryStyles = true) => {
            const collection = site.collections.find(c => c.id === id) || site.collections.find(c => c.id === 'custom') || site.collections[0];
            if (!collection || !inquiryDialog || !inquiryForm) return;
            const show = () => {
                currentCollection = collection;
                hideResult();
                if (carryStyles) styleBoxes().forEach(box => { box.checked = selectedStyles.has(box.value); });
                trimStyles();
                renderCollection();
                openDialog(inquiryDialog);
                inquiryDialog.scrollTop = 0;
            };
            if (projectDialog?.open) {
                closeProject();
                requestAnimationFrame(show);
            } else show();
        };

        /* ============================================
           EVENT DELEGATION
        ============================================ */
        document.addEventListener('click', event => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;

            if (target.closest('[data-close-project]')) { closeProject(); return; }
            if (target.closest('[data-close-inquiry]')) { inquiryDialog?.close(); return; }

            const projectBtn = target.closest('[data-project]');
            if (projectBtn) {
                event.preventDefault();
                openProject(projectBtn.dataset.project);
                return;
            }

            const inquiryBtn = target.closest('[data-inquire]');
            if (inquiryBtn) {
                event.preventDefault();
                openInquiry(inquiryBtn.dataset.inquire);
                return;
            }

            const styleBtn = target.closest('[data-style]');
            if (styleBtn) {
                const id = styleBtn.dataset.style;
                if (!site.styles.some(s => s.id === id)) return;
                if (selectedStyles.has(id)) selectedStyles.delete(id);
                else selectedStyles.add(id);
                updateSelectedStyles();
            }
        });

        $('styleInquiry')?.addEventListener('click', () => openInquiry('custom'));

        [projectDialog, inquiryDialog].filter(Boolean).forEach(dialog => {
            dialog.addEventListener('close', () => {
                if (dialog === projectDialog) $('projectVideo')?.pause();
                syncDialogScroll();
            });
            dialog.addEventListener('click', event => {
                if (event.target !== dialog) return;
                const bounds = dialog.getBoundingClientRect();
                const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
                if (outside) dialog.close();
            });
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeMobileMenu();
        });

        collectionSelect?.addEventListener('change', () => {
            currentCollection = site.collections.find(c => c.id === collectionSelect.value) || currentCollection;
            trimStyles();
            renderCollection();
            hideResult();
        });

        styleBoxes().forEach(box => box.addEventListener('change', () => {
            const checked = styleBoxes().filter(input => input.checked);
            const limit = styleLimit();
            if (checked.length > limit) {
                if (limit === 1) {
                    checked.filter(input => input !== box).forEach(input => { input.checked = false; });
                } else {
                    box.checked = false;
                    if ($('styleLimitHint')) $('styleLimitHint').textContent = t('ui.style_limit_reached');
                }
            } else {
                updateStyleHint();
            }
            hideResult();
        }));

        const fieldLabel = name => {
            const input = inquiryForm?.elements.namedItem(name);
            const label = input?.id ? inquiryForm.querySelector(`label[for="${input.id}"]`) : null;
            return label?.textContent.trim() || name;
        };

        const sanitize = str => String(str || '').replace(/[<>]/g, '').trim();

        if (inquiryForm) {
            inquiryForm.addEventListener('input', hideResult);
            inquiryForm.addEventListener('change', hideResult);
            inquiryForm.addEventListener('submit', async event => {
                event.preventDefault();
                if (submitting || !currentCollection) return;

                if (!inquiryForm.reportValidity()) return;

                const fields = new FormData(inquiryForm);
                const data = {
                    type: 'booking',
                    service: collectionName(currentCollection),
                    name: sanitize(fields.get('name')),
                    email: sanitize(fields.get('email')),
                    brand: sanitize(fields.get('brand')),
                    social: sanitize(fields.get('social')),
                    styles: fields.getAll('styles').map(id => site.styles.find(s => s.id === id)?.name || id),
                    details: [
                        sanitize(fields.get('details')),
                        `${fieldLabel('location')}: ${sanitize(fields.get('location')) || '—'}`,
                        `${fieldLabel('timeframe')}: ${sanitize(fields.get('timeframe')) || '—'}`
                    ].join('\n\n')
                };

                submitting = true;
                const submitBtn = $('inquirySubmit');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    setButtonLabel(submitBtn, t('ui.sending'));
                }
                hideResult();

                const abort = new AbortController();
                const timeout = setTimeout(() => abort.abort(), 20000);

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                        signal: abort.signal
                    });
                    if (!response.ok) throw new Error('Inquiry delivery failed');
                    setResult(t('ui.inquiry_sent'));
                    inquiryForm.reset();
                    selectedStyles.clear();
                    updateSelectedStyles();
                    if (collectionSelect) collectionSelect.value = currentCollection.id;
                } catch {
                    setResult(t('ui.inquiry_error'), true);
                } finally {
                    clearTimeout(timeout);
                    submitting = false;
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        setButtonLabel(submitBtn, t('offer.cta'));
                    }
                }
            });
        }

        // Sync dynamic modals on language change
        document.addEventListener('bm:langchange', () => {
            updateProjectCopy();
            renderCollection();
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        /* ============================================
           INTERACTIVE STORYTELLING & HOVER FILM PREVIEW
        ============================================ */
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        // 1. Desktop Hover Video Preview on MONTÉ & COSMOS
        if (finePointer && !reducedMotion) {
            document.querySelectorAll('.project-cover[data-preview-video]').forEach(cover => {
                const videoEl = cover.querySelector('.project-preview-video');
                const src = cover.getAttribute('data-preview-video');
                if (!videoEl || !src) return;
                let loaded = false;

                cover.addEventListener('mouseenter', () => {
                    if (!loaded) {
                        videoEl.src = src;
                        loaded = true;
                    }
                    videoEl.play().then(() => {
                        cover.classList.add('is-playing');
                    }).catch(() => {});
                });

                cover.addEventListener('mouseleave', () => {
                    cover.classList.remove('is-playing');
                    videoEl.pause();
                });
            });
        }

        // 2. Scroll Word-Highlight on Studio Statement (Perspektiva)
        const statementEl = document.querySelector('.statement-copy');
        const buildStoryWords = () => {
            if (!statementEl || reducedMotion) return;
            const raw = statementEl.textContent.trim();
            if (!raw) return;
            const words = raw.split(/\s+/);
            statementEl.replaceChildren();
            words.forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'story-word is-lit';
                span.textContent = word + (i < words.length - 1 ? ' ' : '');
                statementEl.append(span);
            });
        };

        const updateStoryWords = () => {
            if (!statementEl || reducedMotion) return;
            const spans = statementEl.querySelectorAll('.story-word');
            if (!spans.length) return;
            const rect = statementEl.getBoundingClientRect();
            const vh = window.innerHeight || 800;
            // Progress from 0 (bottom of viewport) to 1 (upper third of viewport)
            const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.45 + rect.height)));
            const litCount = Math.ceil(progress * spans.length);
            spans.forEach((s, idx) => s.classList.toggle('is-lit', idx < litCount));
        };

        buildStoryWords();
        updateStoryWords();
        let storyTicking = false;
        window.addEventListener('scroll', () => {
            if (!storyTicking) {
                requestAnimationFrame(() => {
                    updateStoryWords();
                    storyTicking = false;
                });
                storyTicking = true;
            }
        }, { passive: true });

        // Re-split words if language changes
        document.addEventListener('bm:langchange', () => {
            buildStoryWords();
            updateStoryWords();
        });

        // 3. Interactive FeatureSteps Process Showcase (Auto-cycle + Click + Pause on hover/offscreen)
        const processGrid = document.querySelector('.process-feature-grid');
        const processSteps = [...document.querySelectorAll('.process-step')];
        const processSlides = [...document.querySelectorAll('.process-slide')];
        const processCounter = $('processCounter');

        if (processGrid && processSteps.length && processSlides.length) {
            let activeStep = 0;
            let stepTimer = null;
            let isInView = false;
            let isPaused = false;
            const INTERVAL_MS = 4000;

            const setStep = index => {
                activeStep = ((index % processSteps.length) + processSteps.length) % processSteps.length;
                processSteps.forEach((btn, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;
                    btn.classList.toggle('is-active', isActive);
                    btn.classList.toggle('is-done', isDone);
                    btn.setAttribute('aria-selected', String(isActive));

                    // Restart progress bar animation cleanly
                    const bar = btn.querySelector('.process-step-bar > span');
                    if (bar) {
                        bar.style.animation = 'none';
                        void bar.offsetWidth;
                        bar.style.animation = '';
                    }
                });

                processSlides.forEach((slide, i) => {
                    slide.classList.toggle('is-active', i === activeStep);
                });

                if (processCounter) {
                    processCounter.textContent = `${String(activeStep + 1).padStart(2, '0')} / 06`;
                }
            };

            const startCycle = () => {
                if (reducedMotion || stepTimer || !isInView || isPaused) return;
                stepTimer = setInterval(() => {
                    setStep(activeStep + 1);
                }, INTERVAL_MS);
            };

            const stopCycle = () => {
                if (stepTimer) {
                    clearInterval(stepTimer);
                    stepTimer = null;
                }
            };

            processSteps.forEach((btn, idx) => {
                btn.addEventListener('click', () => {
                    stopCycle();
                    setStep(idx);
                    startCycle();
                });
            });

            processGrid.addEventListener('mouseenter', () => {
                isPaused = true;
                processGrid.classList.add('is-paused');
                stopCycle();
            });

            processGrid.addEventListener('mouseleave', () => {
                isPaused = false;
                processGrid.classList.remove('is-paused');
                startCycle();
            });

            if ('IntersectionObserver' in window) {
                const pObs = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        isInView = entry.isIntersecting;
                        if (isInView) startCycle();
                        else stopCycle();
                    });
                }, { threshold: 0.15 });
                pObs.observe(processGrid);
            } else {
                isInView = true;
                startCycle();
            }
        }

        updateSelectedStyles();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
