// ==UserScript==
// @name         YouTube Mobile: Double‑Tap New Tab for Videos & Shorts
// @namespace    http://userscripts.org/
// @version      0.4
// @description  Single vs. double‑tap opens YouTube videos (watch) and Shorts in new tabs on m.youtube.com
// @match        https://m.youtube.com/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    const DOUBLE_TAP_DELAY = 350; // ms
    let lastClickTime = 0;
    let lastLink = null;
    let singleTapTimer = null;
    
    function initializeScript() {
        // Remove any existing listeners first
        document.removeEventListener('click', handleClick, true);
        
        // Add our click handler with capture phase to beat YT's own listener
        document.addEventListener('click', handleClick, true);
    }
    
    function handleClick(e) {
        // Match either /watch?v= or /shorts/ URLs
        const link = e.target.closest('a[href*="watch?v="], a[href*="/shorts/"]');
        if (!link) return;
        
        e.preventDefault();
        e.stopImmediatePropagation();
        
        const now = Date.now();
        
        // Double‑tap?
        if (lastLink === link && (now - lastClickTime) < DOUBLE_TAP_DELAY) {
            clearTimeout(singleTapTimer);
            window.open(link.href, '_blank');
            lastLink = null;
            lastClickTime = 0;
            return;
        }
        
        // Schedule single‑tap navigation
        lastLink = link;
        lastClickTime = now;
        clearTimeout(singleTapTimer);
        singleTapTimer = setTimeout(function() {
            // Let YouTube handle the original click for proper functionality
            const newEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 1
            });
            
            // Temporarily remove our listener to avoid recursion
            document.removeEventListener('click', handleClick, true);
            
            // Trigger YouTube's original click handling
            link.dispatchEvent(newEvent);
            
            // Re-add our listener after a brief delay
            setTimeout(function() {
                document.addEventListener('click', handleClick, true);
            }, 50);
            
            lastLink = null;
            lastClickTime = 0;
        }, DOUBLE_TAP_DELAY);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
    
})();