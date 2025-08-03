class TranslationManager {
    /**
     * Initialize the TranslationManager with the default language set to Arabic.
     * Loads the translation file for the default language and sets up event listeners.
     */
    constructor() {
        this.currentLang = 'ar';
        this.translations = {};
        this.init();
    }

    /**
     * Initialize the TranslationManager with the default language set to Arabic.
     * Loads the translation file for the default language, sets up event listeners,
     * updates the UI with the translated content, and starts the countdown timer.
     */
    async init() {
        // Load initial translations
        await this.loadLanguage(this.currentLang);
        this.setupEventListeners();
        this.updateUI();
        this.startCountdown();
    }

    /**
     * Load the translation file for the given language.
     * @param {string} lang the language code to load
     * @returns {Promise<void>}
     */
    async loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations[lang] = await response.json();
            this.currentLang = lang;
        } catch (error) {
            console.error(`Failed to load language file for ${lang}:`, error);
        }
    }

    /**
     * Set up event listeners for the language selector dropdown,
     * closing the dropdown when clicking outside, language option clicks,
     * and form submission.
     */
    setupEventListeners() {
        // Language selector dropdown
        const langToggle = document.querySelector('.lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelector('.lang-dropdown').classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const langSelector = document.querySelector('.language-selector');
            if (langSelector && !langSelector.contains(event.target)) {
                document.querySelector('.lang-dropdown').classList.remove('show');
            }
        });

        // Language option click
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', async (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                await this.changeLanguage(lang);
            });
        });

        // Form submission
        const emailForm = document.querySelector('.email-form');
        if (emailForm) {
            emailForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.querySelector('.email-form input').value;
                if(email) {
                    alert(`Thank you! We'll notify you at ${email} when Keewepa launches.`);
                    document.querySelector('.email-form input').value = '';
                }
            });
        }

        // Hero button event listeners
        const notifyBtn = document.getElementById('notify-btn');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => {
                document.querySelector('.cta').scrollIntoView({ behavior: 'smooth' });
            });
        }

        const demoBtn = document.getElementById('demo-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                alert('سيتوفر عرض توضيحي قريبًا!');
            });
        }

        // Gallery filtering (if implemented)
        document.querySelectorAll('.control-btn[data-filter]').forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.control-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter gallery items
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
            });
        });

        // Initialize testimonial slider
        this.initTestimonialSlider();
    }

    /**
     * Initialize the testimonial slider.
     *
     * This function sets up the testimonial slider by selecting all the
     * testimonial slides and the previous and next buttons. It then sets up
     * event listeners for the previous and next buttons, and sets up an
     * interval to automatically advance the slides every 5 seconds.
     */
    initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Function to show a specific slide
    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    };
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentSlide + 1) % slideCount;
            showSlide(nextIndex);
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
            showSlide(prevIndex);
        });
    }
    
    // Auto-advance slides
    setInterval(() => {
        const nextIndex = (currentSlide + 1) % slideCount;
        showSlide(nextIndex);
    }, 5000);
}

    /**
     * Change the language of the application.
     * 
     * @param {string} lang Language code (ar, fr, en)
     * 
     * If the language is not already loaded, it will be loaded first.
     * The application UI will then be updated with the new translations.
     * The active language in the dropdown will be updated, and the
     * current language display will be changed to reflect the new language.
     * The text direction of the page will also be updated based on the
     * language.
     */
    async changeLanguage(lang) {
        if (lang !== this.currentLang) {
            // Load translations if not already loaded
            if (!this.translations[lang]) {
                await this.loadLanguage(lang);
            }
            
            this.currentLang = lang;
            this.updateUI();
            
            // Update active language in dropdown
            document.querySelectorAll('.lang-option').forEach(option => {
                option.classList.remove('active');
            });
            const activeOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
            if (activeOption) {
                activeOption.classList.add('active');
            }
            
            // Update current language display
            const langText = document.querySelector('.current-lang');
            if (langText) {
                if (lang === 'ar') langText.textContent = 'العربية';
                if (lang === 'fr') langText.textContent = 'Français';
                if (lang === 'en') langText.textContent = 'English';
            }
            
            // Update text direction
            if (lang === 'ar') {
                document.body.classList.remove('ltr');
                document.body.setAttribute('dir', 'rtl');
            } else {
                document.body.classList.add('ltr');
                document.body.setAttribute('dir', 'ltr');
            }
            
            // Close dropdown
            const dropdown = document.querySelector('.lang-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    }

    /**
     * Updates the UI elements with the current language translations.
     *
     * Retrieves the translation object for the current language and updates
     * various sections of the webpage, including navigation links, hero section,
     * features section, gallery section, testimonials section, CTA section, and
     * footer. Ensures that text content and placeholders reflect the current
     * language settings.
     */
    updateUI() {
        const t = this.translations[this.currentLang];
        if (!t) {
            console.error(`No translations found for language: ${this.currentLang}`);
            return;
        }

        // Update navigation links
        this.updateElement('[data-key="home"]', t.home);
        this.updateElement('[data-key="features"]', t.features);
        this.updateElement('[data-key="about"]', t.about);
        this.updateElement('[data-key="contact"]', t.contact);

        // Update hero section
        this.updateElement('[data-key="hero_title"]', t.hero_title, 'html');
        this.updateElement('[data-key="hero_description"]', t.hero_description);
        this.updateElement('[data-key="hero_cta"]', t.hero_cta);
        this.updateElement('[data-key="hero_demo"]', t.hero_demo);
        this.updateElement('[data-key="launch_countdown"]', t.launch_countdown);
        this.updateElement('[data-key="days_label"]', t.days_label);
        this.updateElement('[data-key="hours_label"]', t.hours_label);
        this.updateElement('[data-key="minutes_label"]', t.minutes_label);
        this.updateElement('[data-key="seconds_label"]', t.seconds_label);

        // Update features section
        this.updateElement('[data-key="features_title"]', t.features_title);
        this.updateElement('[data-key="features_description"]', t.features_description);

        // Update gallery section
        this.updateElement('[data-key="gallery_title"]', t.gallery_title);
        this.updateElement('[data-key="gallery_description"]', t.gallery_description);
        // Gallery controls
        this.updateElement('[data-key="all_gallery"]', t.all_gallery);
        this.updateElement('[data-key="men_gallery"]', t.men_gallery);
        this.updateElement('[data-key="women_gallery"]', t.women_gallery);
        this.updateElement('[data-key="salons_gallery"]', t.salons_gallery);
        // Gallery items
        this.updateElement('[data-key="gallery_caption1"]', t.gallery_caption1);
        this.updateElement('[data-key="gallery_desc1"]', t.gallery_desc1);
        this.updateElement('[data-key="gallery_caption2"]', t.gallery_caption2);
        this.updateElement('[data-key="gallery_desc2"]', t.gallery_desc2);
        this.updateElement('[data-key="gallery_caption3"]', t.gallery_caption3);
        this.updateElement('[data-key="gallery_desc3"]', t.gallery_desc3);
        this.updateElement('[data-key="gallery_caption4"]', t.gallery_caption4);
        this.updateElement('[data-key="gallery_desc4"]', t.gallery_desc4);
        this.updateElement('[data-key="gallery_caption5"]', t.gallery_caption5);
        this.updateElement('[data-key="gallery_desc5"]', t.gallery_desc5);
        this.updateElement('[data-key="gallery_caption6"]', t.gallery_caption6);
        this.updateElement('[data-key="gallery_desc6"]', t.gallery_desc6);
        this.updateElement('[data-key="view_all_gallery"]', t.view_all_gallery);

        // Update testimonials section
        this.updateElement('[data-key="testimonials_title"]', t.testimonials_title);
        this.updateElement('[data-key="testimonials_description"]', t.testimonials_description);
        // Update new testimonial section elements
        this.updateElement('[data-key="verified"]', t.verified);
        // Update testimonial stats
        this.updateElement('.stat-item:nth-child(1) .stat-label', t.customer_rating);
        this.updateElement('.stat-item:nth-child(2) .stat-label', t.happy_customers);
        this.updateElement('.stat-item:nth-child(3) .stat-label', t.recommend_us);

        // Update CTA section
        this.updateElement('[data-key="cta_title"]', t.cta_title);
        this.updateElement('[data-key="cta_description"]', t.cta_description);
        this.updateElement('[data-key="cta_placeholder"]', t.cta_placeholder, 'placeholder');
        this.updateElement('[data-key="cta_button"]', t.cta_button);

        // Update footer
        this.updateElement('[data-key="footer_title"]', t.footer_title);
        this.updateElement('[data-key="footer_description"]', t.footer_description, 'html');
        this.updateElement('[data-key="copyright"]', t.copyright, 'html');
        
        // Update footer column titles
        this.updateElement('[data-key="quick_links"]', t.quick_links);
        this.updateElement('[data-key="services"]', t.services);
        this.updateElement('[data-key="contact_us"]', t.contact_us);

        // Update feature cards
        this.updateElement('[data-key="feature1_title"]', t.feature1_title);
        this.updateElement('[data-key="feature1_desc"]', t.feature1_desc);
        this.updateElement('[data-key="feature2_title"]', t.feature2_title);
        this.updateElement('[data-key="feature2_desc"]', t.feature2_desc);
        this.updateElement('[data-key="feature3_title"]', t.feature3_title);
        this.updateElement('[data-key="feature3_desc"]', t.feature3_desc);
        this.updateElement('[data-key="feature4_title"]', t.feature4_title);
        this.updateElement('[data-key="feature4_desc"]', t.feature4_desc);
        this.updateElement('[data-key="feature5_title"]', t.feature5_title);
        this.updateElement('[data-key="feature5_desc"]', t.feature5_desc);
        this.updateElement('[data-key="feature6_title"]', t.feature6_title);
        this.updateElement('[data-key="feature6_desc"]', t.feature6_desc);

        // Update testimonials
        this.updateElement('[data-key="testimonial1_text"]', t.testimonial1_text);
        this.updateElement('[data-key="testimonial1_name"]', t.testimonial1_name);
        this.updateElement('[data-key="testimonial1_role"]', t.testimonial1_role);
        this.updateElement('[data-key="testimonial2_text"]', t.testimonial2_text);
        this.updateElement('[data-key="testimonial2_name"]', t.testimonial2_name);
        this.updateElement('[data-key="testimonial2_role"]', t.testimonial2_role);
        this.updateElement('[data-key="testimonial3_text"]', t.testimonial3_text);
        this.updateElement('[data-key="testimonial3_name"]', t.testimonial3_name);
        this.updateElement('[data-key="testimonial3_role"]', t.testimonial3_role);

        // Update footer links
        this.updateElement('[data-key="home_footer"]', t.home_footer);
        this.updateElement('[data-key="about_footer"]', t.about_footer);
        this.updateElement('[data-key="features_footer"]', t.features_footer);
        this.updateElement('[data-key="privacy"]', t.privacy);
        this.updateElement('[data-key="terms"]', t.terms);

        // Update services
        this.updateElement('[data-key="service1"]', t.service1);
        this.updateElement('[data-key="service2"]', t.service2);
        this.updateElement('[data-key="service3"]', t.service3);
        this.updateElement('[data-key="service4"]', t.service4);
        this.updateElement('[data-key="service5"]', t.service5);

        // Update contact info
        this.updateElement('[data-key="address"]', t.address);
        this.updateElement('[data-key="phone"]', t.phone);
        this.updateElement('[data-key="email"]', t.email);
    }

    /**
     * Helper method to update an element's text content or other properties
     * @param {string} selector - CSS selector for the element
     * @param {string} content - New content for the element
     * @param {string} type - Type of update (text, html, placeholder)
     */
    updateElement(selector, content, type = 'text') {
        const element = document.querySelector(selector);
        if (element && content) {
            switch (type) {
                case 'html':
                    element.innerHTML = content;
                    break;
                case 'placeholder':
                    element.placeholder = content;
                    break;
                default:
                    element.textContent = content;
            }
        }
    }

    /**
     * Updates the countdown timer to the launch date every second.
     * The launch date is set to 30 days from now.
     */
    startCountdown() {
        function updateCountdown() {
            // Set the launch date (30 days from now)
            const launchDate = new Date();
            launchDate.setDate(launchDate.getDate() + 30);
            
            const now = new Date();
            const diff = launchDate - now;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.innerText = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.innerText = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.innerText = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.innerText = seconds.toString().padStart(2, '0');
        }
        
        // Update countdown every second
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    /**
     * Filter gallery items by category
     * @param {string} category - Category to filter by (all, men, women, salons)
     */
    filterGallery(category) {
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Initialize the translation manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TranslationManager();
});