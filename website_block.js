// ==UserScript==
// @name         Website Blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Blocks unwanted sites with centered bold "Access Denied" message. Uses regex whitelist.
// @author       Aman
// @match        *://*.instagram.com/*
// @match        *://*.mat6tube.com/*
// @match        *://*.wow.xxx/*
// @match        *://*.redtube.net/*
// @match        *://*.pornhat.com/*
// @match        *://*.vixen.com/*
// @match        *://*.blacked.com/*
// @match        *://*.yandex.net/*
// @match        *://*.yandex.ru/*
// @match        *://*.yandex.com/*
// @match        *://*.startpage.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = {
        "www.example.com": ["^/path01/.*", "^/path02/.*"]
    };

    function isWhitelisted(host, path) {
        const patterns = whitelist[host];
        if (!patterns) return false;
        return patterns.some(regexStr => new RegExp(regexStr).test(path));
    }

    function showBlockScreen() {
        document.open();
        document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Access Denied</title>
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        background-color: black;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .message {
                        color: white;
                        font-size: 48px;
                        font-weight: bold;
                        font-family: Arial, sans-serif;
                        text-align: center;
                    }

                    @media (max-width: 1080px) {
                        .message {
                            font-size: 36px;
                        }
                    }

                    @media (max-height: 800px) {
                        .message {
                            font-size: 32px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="message">Access Denied</div>
            </body>
            </html>
        `);
        document.close();
        window.stop();
    }

    function blockIfNeeded() {
        const host = window.location.hostname;
        const path = window.location.pathname;
        if (!isWhitelisted(host, path)) {
            showBlockScreen();
        }
    }

    blockIfNeeded();

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        blockIfNeeded();
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        blockIfNeeded();
    };
})();
