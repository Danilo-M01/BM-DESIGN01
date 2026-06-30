/**
 * BM DESIGN01 — Internationalization (i18n) Engine
 * Handles language switching with smooth transitions
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'bmdesign01_lang';
    const DEFAULT_LANG = 'sr';
    const SUPPORTED_LANGS = ['sr', 'ru', 'en'];

    const FLAG_EMOJIS = {
        sr: '🇷🇸',
        ru: '🇷🇺',
        en: '🇬🇧'
    };

    const LANG_LABELS = {
        sr: 'Srpski',
        ru: 'Русский',
        en: 'English'
    };

    /**
     * Get stored language or default
     */
    function getStoredLang() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
        } catch (e) { /* localStorage not available */ }
        return DEFAULT_LANG;
    }

    /**
     * Save language preference
     */
    function storeLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* ignore */ }
    }

    /**
     * Translate a key to the target language
     */
    function t(key, lang) {
        if (translations && translations[key] && translations[key][lang]) {
            return translations[key][lang];
        }
        return null;
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    function applyTranslations(lang) {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = t(key, lang);
            if (!translated) return;

            // Check if we need to set innerHTML (for <br> tags etc.) or textContent
            const target = el.getAttribute('data-i18n-target');

            if (target === 'html') {
                el.innerHTML = translated;
            } else if (target === 'placeholder') {
                el.setAttribute('placeholder', translated);
            } else {
                el.textContent = translated;
            }
        });

        // Update the html lang attribute
        document.documentElement.lang = lang === 'sr' ? 'sr' : lang === 'ru' ? 'ru' : 'en';

        // Update the active language display
        updateLangSelectorDisplay(lang);
    }

    /**
     * Update language selector button display
     */
    function updateLangSelectorDisplay(lang) {
        const currentFlag = document.getElementById('currentLangFlag');
        const currentLabel = document.getElementById('currentLangLabel');

        if (currentFlag) currentFlag.textContent = FLAG_EMOJIS[lang];
        if (currentLabel) currentLabel.textContent = LANG_LABELS[lang];

        // Update active state in dropdown
        const dropdownItems = document.querySelectorAll('.lang-dropdown-item');
        dropdownItems.forEach(item => {
            if (item.getAttribute('data-lang') === lang) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Switch language with fade animation
     */
    function switchLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;

        const body = document.body;

        // Quick fade out/in for smooth transition
        body.style.transition = 'opacity 0.2s ease';
        body.style.opacity = '0.85';

        setTimeout(() => {
            applyTranslations(lang);
            storeLang(lang);

            body.style.opacity = '1';

            setTimeout(() => {
                body.style.transition = '';
            }, 200);
        }, 150);
    }

    /**
     * Build and inject the language selector into the nav
     */
    function createLangSelector() {
        const currentLang = getStoredLang();

        // Create the language selector container
        const langSelector = document.createElement('div');
        langSelector.className = 'lang-selector';
        langSelector.id = 'langSelector';

        // Current language button
        langSelector.innerHTML = `
            <button class="lang-current" id="langToggleBtn" aria-label="Select language" aria-expanded="false">
                <span class="lang-flag" id="currentLangFlag">${FLAG_EMOJIS[currentLang]}</span>
                <span class="lang-label" id="currentLangLabel">${LANG_LABELS[currentLang]}</span>
                <svg class="lang-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="lang-dropdown" id="langDropdown">
                <button class="lang-dropdown-item ${currentLang === 'sr' ? 'active' : ''}" data-lang="sr">
                    <span class="lang-flag">${FLAG_EMOJIS.sr}</span>
                    <span>${LANG_LABELS.sr}</span>
                </button>
                <button class="lang-dropdown-item ${currentLang === 'ru' ? 'active' : ''}" data-lang="ru">
                    <span class="lang-flag">${FLAG_EMOJIS.ru}</span>
                    <span>${LANG_LABELS.ru}</span>
                </button>
                <button class="lang-dropdown-item ${currentLang === 'en' ? 'active' : ''}" data-lang="en">
                    <span class="lang-flag">${FLAG_EMOJIS.en}</span>
                    <span>${LANG_LABELS.en}</span>
                </button>
            </div>
        `;

        // Insert into the nav before hamburger
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburgerBtn');

        if (navbar && hamburger) {
            navbar.insertBefore(langSelector, hamburger);
        } else if (navbar) {
            navbar.appendChild(langSelector);
        }

        // Toggle dropdown
        const toggleBtn = document.getElementById('langToggleBtn');
        const dropdown = document.getElementById('langDropdown');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langSelector.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
        });

        // Language selection
        const items = document.querySelectorAll('.lang-dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = item.getAttribute('data-lang');
                switchLanguage(lang);
                langSelector.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close dropdown on click outside
        document.addEventListener('click', () => {
            langSelector.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                langSelector.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Also add lang selector to mobile menu
        createMobileLangSelector(currentLang);
    }

    /**
     * Create language selector for mobile menu
     */
    function createMobileLangSelector(currentLang) {
        const mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu) return;

        const mobileLangSelector = document.createElement('div');
        mobileLangSelector.className = 'mobile-lang-selector';

        SUPPORTED_LANGS.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = `mobile-lang-btn ${lang === currentLang ? 'active' : ''}`;
            btn.setAttribute('data-lang', lang);
            btn.innerHTML = `<span class="lang-flag">${FLAG_EMOJIS[lang]}</span><span>${LANG_LABELS[lang]}</span>`;

            btn.addEventListener('click', () => {
                switchLanguage(lang);
                // Update mobile active state
                document.querySelectorAll('.mobile-lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });

            mobileLangSelector.appendChild(btn);
        });

        mobileMenu.appendChild(mobileLangSelector);
    }

    /**
     * Initialize i18n
     */
    function init() {
        const currentLang = getStoredLang();

        // Create the UI selector
        createLangSelector();

        // Apply initial translations
        applyTranslations(currentLang);
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for use in main.js if needed
    window.BM_i18n = {
        switchLanguage,
        getCurrentLang: getStoredLang,
        t
    };

})();
