// ==UserScript==
// @name         YouTube Redirector
// @namespace    http://userscripts.org/
// @version      1.5
// @description  Custom redirects: homepage & shorts URLs with SPA navigation support
// @match        *://*.youtube.com/*
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    
    function handleRedirects() {
        const url = window.location.href;
        const hostname = window.location.hostname;
        const path = window.location.pathname;
        
        // Merged Rule: Redirect m.youtube.com or www.youtube.com homepage to mobile library
        if ((hostname === 'm.youtube.com' || hostname === 'www.youtube.com') && path === '/') {
            if (!url.includes('/feed/library')) {
                location.replace('https://m.youtube.com/feed/library');
                return;
            }
        }
        
        // Rule C: Redirect mobile shorts to normal watch player
        if (hostname === 'm.youtube.com' && path.startsWith('/shorts/')) {
            const videoId = path.split('/')[2];
            if (videoId && videoId.length === 11) {
                const newUrl = `https://m.youtube.com/watch?v=${videoId}`;
                if (url !== newUrl) location.replace(newUrl);
                return;
            }
        }
        
        // Rule D: Redirect desktop shorts to normal watch player
        if (hostname === 'www.youtube.com' && path.startsWith('/shorts/')) {
            const videoId = path.split('/')[2];
            if (videoId && videoId.length === 11) {
                const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
                if (url !== newUrl) location.replace(newUrl);
                return;
            }
        }
    }
    
    // Initial check
    handleRedirects();
    
    // More efficient approach for Greasemonkey
    // Listen for focus events (when user returns to tab)
    window.addEventListener('focus', handleRedirects);
    
    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', function() {
        setTimeout(handleRedirects, 100);
    });
    
    // Listen for hashchange (URL fragment changes)
    window.addEventListener('hashchange', handleRedirects);
    
    // Use MutationObserver to watch for page changes (more efficient than polling)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            // Only check if the URL might have changed
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.target.tagName === 'TITLE') {
                    handleRedirects();
                    break;
                }
            }
        });
        
        // Start observing when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.head, { childList: true, subtree: true });
            });
        } else {
            observer.observe(document.head, { childList: true, subtree: true });
        }
    }
})();