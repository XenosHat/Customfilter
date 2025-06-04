// ==UserScript==
// @name         Website Blocker
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
// @match        *://*.searx.space/*
// @match        *://*.spankbang.com/*
// @grant        none
// ==/UserScript==
(function() {
  'use strict';

  const whitelist = {
    "www.facebook.com": [
      "^/@selectionadda/.*",
      "^/photo$", // 😱According to Aman --- Exact match on string (string is not a path)
      "^/photo/.*", // 😱According to Aman --- Exact match on path [as of my knowledge we use .* for path {capture everything after that complete path (/path/) } and $ at the end of string so that the string would exactly matches anywhere in the URL]
      "^/selectionadda/.*" // 😱According to Aman --- We use ^ as a path starter eg.  ^/path01/
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

      // 😱According to Aman --- [Mutation Observer listener has two types the first one is <title> based and the second one is the whole html <body> based
      // Since Histoty state[Monkey-Patch{Pushstate,Replacestate and Popstate}] listeners don't work in greasmonkey Script(Due to hard sandboxing) thats why there is only two approch to listen for the URL internal path change(Without reloading the Full page) also know SPA and Dynamic URL Update
      // The First method is URL Polling (A time Interval in which the Script checks for URL change and If the URL changes it executes the Script)
      // The Second method is Mutation Observer wether <title> or <body> based since <body> based listner could be robust on system resources because of the continues changes in the HTML page.
      // Whereas the <title> based could save some resurces sine tiles doesn't change much as <body>
      // But the case it some site navigate throgh its URL paths without changing its <title> so there is only two listeners left to Identify the URL change
      // 1st is Mutation Observation <body> based (high Resources consumption on some sites)
      // 2nd is URL Polling [it could be better if use less frequent.
  
  // MutationObserver to detect dynamic SPA URL changes
  let lastPath = location.pathname;
  const observer = new MutationObserver(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      blockIfNeeded();
    }
  });

  const observeDOM = () => {
    const target = document.querySelector('body');
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    } else {
      requestAnimationFrame(observeDOM);
    }
  };

  observeDOM();
})();
