// ==UserScript==
// @name         Google SafeSearch Enforcer
// @namespace    Aman
// @version      1.2
// @description  Enforces SafeSearch on Google
// @match        *://*.google.com/search*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    const url = new URL(location.href);
    if (url.searchParams.get("safe") !== "active") {
        url.searchParams.set("safe", "active");
        location.replace(url);
    }
})();