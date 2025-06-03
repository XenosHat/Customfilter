// ==UserScript==
// @name         Cowards will disable it 💪🫵✊
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Minimalist URL-based site blocker with whitelist support.
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
// @match        *://*.blocksite.co/*
// @match        *://*.facebook.com/*
// @grant        none
// ==/UserScript==
(function() {
  'use strict';

  const whitelist = {
    "www.facebook.com": [
      "^/@selectionadda/.*",
      "^/photo$",
      "^/photo/.*",
      "^/selectionadda/.*"
    ]
  };

  const isWhitelisted = (host, path) =>
    whitelist[host]?.some(p => new RegExp(p).test(path)) || false;

  const showBlockScreen = () => {
    document.body.innerHTML = `
      <div style="
        margin:0;padding:0;width:100vw;height:100vh;
        background:black;color:white;font:bold 48px Arial;
        display:flex;justify-content:center;align-items:center;
        text-align:center;">Access Denied</div>`;
    window.stop();
  };

  const blockIfNeeded = () => {
    if (!isWhitelisted(location.hostname, location.pathname)) {
      showBlockScreen();
    }
  };

  // Initial check
  blockIfNeeded();

  // Patch pushState/replaceState
  ['pushState', 'replaceState'].forEach(fn => {
    const orig = history[fn];
    history[fn] = function (...args) {
      const result = orig.apply(this, args);
      blockIfNeeded();
      return result;
    };
  });
    // Fallback: check URL change every 5s
  let last = location.href;
  setInterval(() => {
    if (location.href !== last) {
      last = location.href;
      blockIfNeeded();
    }
  }, 5000);
})();
