/**
 * Scroll Animation Handler
 * Handles scroll-triggered animations for elements with [data-scroll] attribute
 */

(function () {
    'use strict';

    function initScrollAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const parent = entry.target.closest('.section');

                        if (parent) {
                            parent.classList.add('visible');

                            const siblings = parent.querySelectorAll('[data-scroll]');
                            const index = Array.from(siblings).indexOf(entry.target);
                            const delay = index * 0.1;
                            entry.target.style.transitionDelay = `${delay}s`;
                        }

                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible');

                        const parent = entry.target.closest('.section');
                        if (parent) {
                            parent.classList.remove('visible');
                        }

                        entry.target.style.transitionDelay = '0s';
                    }
                });
            },
            { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
        );

        scrollElements.forEach((el) => observer.observe(el));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();
