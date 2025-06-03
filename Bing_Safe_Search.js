// ==UserScript==
// @name          Bing safe search enforcer
// @namespace    Aman
// @version      2.0
// @description  Enforces SafeSearch on all Bing sections
// @match        *://*.bing.com/*search*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    const url = new URL(location.href);
    const safePaths = [
        "/search",
        "/images/search",
        "/videos/search",
        "/news/search",        
        "/shop"
    ];

    if (safePaths.some(p => url.pathname.startsWith(p))) {
        const current = url.searchParams.get("adlt");
        if (current !== "strict") {
            url.searchParams.set("adlt", "strict");
            location.replace(url);
        }
    }
})();
