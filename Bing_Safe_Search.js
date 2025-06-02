// ==UserScript==
// @name         Bing SafeSearch Enforcer
// @namespace    Aman
// @version      1.1
// @description  Enforces SafeSearch on Bing
// @match        *://*.bing.com/search*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    const url = new URL(location.href);
    if (url.pathname === "/search" && url.searchParams.get("adlt") !== "strict") {
        url.searchParams.set("adlt", "strict");
        location.replace(url);
    }
})();