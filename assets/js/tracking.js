/*
  Clean measurement layer (GA4)
  - Fires a single, consistent event name: conversion_event_contact
  - Tracks tel: and WhatsApp clicks (wa.me / api.whatsapp.com)
  - No Google Tag Manager, no duplicate tags
*/
(function () {
  function safeGtagEvent(params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion_event_contact', params || {});
      }
    } catch (e) {
      // no-op
    }
  }

  function closestAnchor(el) {
    while (el && el !== document && el.tagName !== 'A') el = el.parentNode;
    return (el && el.tagName === 'A') ? el : null;
  }

  function getHref(a) {
    if (!a || !a.getAttribute) return '';
    return String(a.getAttribute('href') || '').trim();
  }

  function classify(href) {
    var h = href.toLowerCase();
    if (h.indexOf('tel:') === 0) return 'tel';
    if (h.indexOf('https://wa.me/') === 0 || h.indexOf('http://wa.me/') === 0) return 'whatsapp';
    if (h.indexOf('https://api.whatsapp.com/') === 0 || h.indexOf('http://api.whatsapp.com/') === 0) return 'whatsapp';
    if (h.indexOf('whatsapp://') === 0) return 'whatsapp';
    return '';
  }

  document.addEventListener('click', function (ev) {
    var a = closestAnchor(ev.target);
    if (!a) return;

    var href = getHref(a);
    if (!href) return;

    var kind = classify(href);
    if (!kind) return;

    safeGtagEvent({
      contact_method: kind,
      link_url: href
    });
  }, true);
})();
