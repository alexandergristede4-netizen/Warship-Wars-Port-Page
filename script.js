 // ---------- 1. THE COUNTER ----------
  // Lives OUTSIDE the handler so it keeps its value between errors.
  // `let` (not `const`) because the number changes.
  let errorCount = 0;

  // ---------- 2. A HELPER FOR THE TIMESTAMP ----------
  // A small function so we write the time logic once, not in every message.
  function now() {
    return new Date().toISOString(); // e.g. "2026-11-17T04:32:10.123Z"
  }

  // ---------- 3. THE ERROR HANDLER ----------
  // The `true` at the end means "listen during the capture phase".
  // That's what lets us hear failed <link> tags, which don't bubble.
  window.addEventListener('error', function (event) {
    errorCount++; // add 1 every time anything goes wrong

    if (event.target === window) {
      // CASE A: a JavaScript error. These fire directly on `window`,
      // so event.target IS window. The event object already carries
      // the message, file, line, and column for us.
      console.error(
        `[${now()}] JavaScript error: ${event.message}\n` +
        `  File: ${event.filename}\n` +
        `  Line ${event.lineno}, column ${event.colno}`
      );
    } else {
      // CASE B: a resource failed to load (your CSS file, an image, etc).
      // Here event.target is the HTML element that failed.
      // <link> tags store their address in .href, while <img> and
      // <script> tags use .src, so we check for either one.
      const file = event.target.href || event.target.src;

      console.error(
        `[${now()}] Failed to load <${event.target.tagName.toLowerCase()}>\n` +
        `  File: ${file}\n` +
        `  Tag: ${event.target.outerHTML}` // the exact tag as written in your HTML
      );
    }
  }, true);

  // ---------- 4. THE "NO ERRORS" CHECK ----------
  // `load` fires on window once everything has finished loading
  // (or failed). By then every load-time error has already been counted,
  // so the tally is final. Note: it can't see errors that happen later,
  // like a button click that breaks five seconds after loading.
  window.addEventListener('load', function () {
    if (errorCount === 0) {            // === compares; a single = would assign
      console.log(`[${now()}] Page loaded with no errors.`);
    }
  });
