// utils/smoothScroll.js
// Smooth scroll with easing + acceleration
// Usage: import initSmoothScroll from './utils/smoothScroll';
// const destroy = initSmoothScroll(); // later call destroy() to remove

export default function initSmoothScroll(userOptions = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {}; // SSR safety
  }

  const defaults = {
    frameRate: 150,
    animationTime: 600, // ms
    stepSize: 150,
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,
    accelerationDelta: 50,
    accelerationMax: 2,
    keyboardSupport: true,
    arrowScroll: 50,
    touchpadSupport: true,
    fixedBackground: true,
    excludedSelector: ""
  };

  const opts = Object.assign({}, defaults, userOptions);

  let root = document.scrollingElement || document.documentElement;
  let queue = [];
  let isRunning = false;
  let lastScrollTime = 0;
  let lastAccelTime = 0;

  const KEY = {
    left: 37, up: 38, right: 39, down: 40,
    space: 32, pageUp: 33, pageDown: 34, end: 35, home: 36
  };

  const wheelOptions = { passive: false };

  // ---------------- Helpers ----------------
  function isNodeName(el, names) {
    if (!el || !el.nodeName) return false;
    return names.split(",").includes(el.nodeName.toLowerCase());
  }

  function shouldIgnoreTarget(target) {
    if (!target) return true;
    if (opts.excludedSelector && target.closest && target.closest(opts.excludedSelector)) return true;
    if (isNodeName(target, "embed,object,input,textarea,select,button")) return true;
    if (target.isContentEditable) return true;
    return false;
  }

  // Basic (non-directional) finder kept for potential reuse
  function findScrollableContainer(el) {
    if (!el) return root;
    for (let cur = el; cur; cur = cur.parentElement) {
      if (cur === document.body) break;
      const style = getComputedStyle(cur);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && cur.scrollHeight > cur.clientHeight) {
        return cur;
      }
    }
    return document.scrollingElement || document.documentElement;
  }

  // ---------------- Direction-aware scroll picking (FIX) ----------------
  function canScrollInDirection(el, dx, dy) {
    if (!el) return false;

    // Horizontal
    if (dx) {
      const maxX = el.scrollWidth - el.clientWidth;
      if (dx < 0 && el.scrollLeft > 0) return true;                 // left
      if (dx > 0 && el.scrollLeft < maxX - 1) return true;           // right
    }

    // Vertical
    if (dy) {
      const maxY = el.scrollHeight - el.clientHeight;
      if (dy < 0 && el.scrollTop > 0) return true;                   // up
      if (dy > 0 && el.scrollTop < maxY - 1) return true;            // down
    }

    return false;
  }

  function findScrollableContainerDirectional(startEl, dx, dy) {
    const rootEl = document.scrollingElement || document.documentElement;

    for (let cur = startEl; cur; cur = cur.parentElement) {
      if (cur === document.body || cur === document.documentElement) break;
      const style = getComputedStyle(cur);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;

      const mayScrollY = (overflowY === "auto" || overflowY === "scroll") && cur.scrollHeight > cur.clientHeight;
      const mayScrollX = (overflowX === "auto" || overflowX === "scroll") && cur.scrollWidth > cur.clientWidth;

      if ((mayScrollY || mayScrollX) && canScrollInDirection(cur, dx, dy)) {
        return cur;
      }
    }

    return rootEl;
  }

  // ---------------- Wheel normalization ----------------
  function normalizeWheel(event) {
    let pX = event.deltaX || 0;
    let pY = event.deltaY || 0;

    if (event.deltaMode === 1) { // lines
      pX *= 16;
      pY *= 16;
    } else if (event.deltaMode === 2) { // pages
      pX *= window.innerWidth;
      pY *= window.innerHeight;
    }

    if ("wheelDelta" in event && !pY) {
      pY = -event.wheelDelta;
    }
    if ("wheelDeltaX" in event && !pX) {
      pX = -event.wheelDeltaX;
    }

    return { pixelX: pX, pixelY: pY };
  }

  // ---------------- Pulse easing ----------------
  function C(e) {
    let t;
    e *= opts.pulseScale;
    if (e < 1) {
      t = e - (1 - Math.exp(-e));
    } else {
      e -= 1;
      const r = Math.exp(-1);
      t = r + (1 - Math.exp(-e)) * (1 - r);
    }
    return t * opts.pulseNormalize;
  }

  function pulse(e) {
    if (e >= 1) return 1;
    if (e <= 0) return 0;
    if (opts.pulseNormalize === 1) opts.pulseNormalize /= C(1);
    return C(e);
  }

  // ---------------- Core Scroll ----------------
  function scheduleScroll(el, deltaX, deltaY) {
    const now = performance.now();

    // acceleration
    if (opts.accelerationMax !== 1) {
      const dt = now - lastAccelTime;
      if (dt < opts.accelerationDelta) {
        const factor = Math.min(
          opts.accelerationMax,
          1 + (opts.accelerationDelta - dt) / opts.accelerationDelta
        );
        deltaX *= factor;
        deltaY *= factor;
      }
      lastAccelTime = now;
    }

    queue.push({
      el,
      x: deltaX,
      y: deltaY,
      start: now,
      lastX: 0,
      lastY: 0
    });

    if (!isRunning) requestAnimationFrame(step);
  }

  function step() {
    isRunning = true;
    const now = performance.now();

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const elapsed = now - item.start;
      const progress = Math.min(1, elapsed / opts.animationTime);
      const ease = opts.pulseAlgorithm ? pulse(progress) : progress;

      const moveX = Math.round(item.x * ease - item.lastX);
      const moveY = Math.round(item.y * ease - item.lastY);

      item.lastX += moveX;
      item.lastY += moveY;

      const rootEl = document.scrollingElement || document.documentElement;

      if (
        item.el === document.body ||
        item.el === document.documentElement ||
        item.el === rootEl
      ) {
        rootEl.scrollTop += moveY;
        rootEl.scrollLeft += moveX;
      } else {
        item.el.scrollTop += moveY;
        item.el.scrollLeft += moveX;
      }

      if (progress === 1) {
        queue.splice(i, 1);
        i--;
      }
    }

    if (queue.length) {
      requestAnimationFrame(step);
    } else {
      isRunning = false;
    }
  }

  // ---------------- Event Handlers ----------------
  function onWheel(e) {
    if (e.defaultPrevented) return;

    if (Date.now() - lastScrollTime < 8) {
      lastScrollTime = Date.now();
      return;
    }

    const target = e.target;
    if (shouldIgnoreTarget(target)) return;

    const { pixelX, pixelY } = normalizeWheel(e);
    let deltaX = pixelX;
    let deltaY = pixelY;

    if (!opts.touchpadSupport && Math.abs(deltaY) < 1 && Math.abs(deltaX) < 1) {
      return;
    }

    // Direction-aware: choose an ancestor that has room to scroll in this direction
    const scrollEl = findScrollableContainerDirectional(target, deltaX, deltaY) || root;

    scheduleScroll(scrollEl, deltaX, deltaY);

    e.preventDefault();
    lastScrollTime = Date.now();
  }

  function onKeyDown(e) {
    if (!opts.keyboardSupport || e.defaultPrevented) return;

    const target = e.target;
    if (shouldIgnoreTarget(target)) return;

    let x = 0, y = 0;
    switch (e.keyCode) {
      case KEY.up: y = -opts.arrowScroll; break;
      case KEY.down: y = opts.arrowScroll; break;
      case KEY.left: x = -opts.arrowScroll; break;
      case KEY.right: x = opts.arrowScroll; break;
      case KEY.space: y = window.innerHeight * (e.shiftKey ? -0.9 : 0.9); break;
      case KEY.pageUp: y = -window.innerHeight * 0.9; break;
      case KEY.pageDown: y = window.innerHeight * 0.9; break;
      case KEY.home: y = -root.scrollTop; break;
      case KEY.end: y = root.scrollHeight - root.scrollTop; break;
      default: return;
    }

    scheduleScroll(root, x, y);
    e.preventDefault();
  }

  // ---------------- Enable / Disable ----------------
  function enable() {
    root = document.scrollingElement || document.documentElement;

    if (!opts.fixedBackground) {
      try {
        document.body.style.backgroundAttachment = "scroll";
        document.documentElement.style.backgroundAttachment = "scroll";
      } catch {}
    }

    window.addEventListener("wheel", onWheel, wheelOptions);
    window.addEventListener("mousewheel", onWheel, wheelOptions);
    if (opts.keyboardSupport) window.addEventListener("keydown", onKeyDown, false);
  }

  function disable() {
    window.removeEventListener("wheel", onWheel, wheelOptions);
    window.removeEventListener("mousewheel", onWheel, wheelOptions);
    if (opts.keyboardSupport) window.removeEventListener("keydown", onKeyDown, false);
    queue = [];
    isRunning = false;
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    enable();
  } else {
    window.addEventListener("DOMContentLoaded", enable, { once: true });
  }

  return disable;
}
