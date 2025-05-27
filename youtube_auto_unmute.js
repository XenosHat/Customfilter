// ==UserScript==
// @name         YouTube Auto-Unmute Minimal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto unmute and play YouTube videos with minimal battery impact
// @match        *://m.youtube.com/*
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    requestIdleCallback(() => {
        const video = document.querySelector('video');
        if (video) {
            video.muted = false;
            video.volume = 1.0;
            video.autoplay = true;
            video.play().catch(() => {
                const overlay = document.querySelector('.ytp-large-play-button, .player-controls-container');
                if (overlay) overlay.click();
            });
        }
    });
})();