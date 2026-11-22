const modeToggle = document.getElementById('modeToggle');

function setMode(mode) {
  if (document.documentElement.dataset.mode === mode) return;

  document.documentElement.dataset.mode = mode;
  localStorage.setItem('mode', mode);

  if (modeToggle) {
    modeToggle.textContent = mode === 'yang' ? 'Yang' : 'Ying';
  }
}

if (modeToggle) {
  modeToggle.addEventListener('click', function () {
    const nextMode = document.documentElement.dataset.mode === 'yang' ? 'ying' : 'yang';
    const loaderEl = document.getElementById('loader');

    if (!loaderEl) {
      setMode(nextMode);
      resetAnimations();
      return;
    }

    loaderEl.style.display = 'flex';
    void loaderEl.offsetWidth;
    loaderEl.style.opacity = '1';

    setTimeout(function () {
      setMode(nextMode);

      setTimeout(function () {
        loaderEl.style.opacity = '0';
        resetAnimations();

        setTimeout(function () {
          loaderEl.style.display = 'none';
        }, 500);
      }, 600);
    }, 500);
  });
}

setMode(localStorage.getItem('mode') === 'yang' ? 'yang' : 'ying');

let planeHideTimer;
let planeRestartTimer;
let carLoopTimer;

function startAnimations() {
  const carContainer = document.getElementById('carContainer');

  if(carContainer) {
    const isMobile = window.innerWidth <= 992;
    const carAnimationDuration = isMobile ? '3s' : '5s';
    carContainer.style.animation = 'none';
    void carContainer.offsetWidth;
    carContainer.style.animation = `fadeInUp 1s ease 0s forwards, carRace ${carAnimationDuration} linear 0.5s forwards`;
    const carGif = document.querySelector('.car-gif');
    if(carGif) {
      carGif.style.animation = 'none';
      void carGif.offsetWidth;
      carGif.style.animation = 'vibrate 0.2s linear infinite';
    }
    setupCarAnimationLoop();
  }

  setTimeout(setupPlaneAnimationLoop, 0); // this number decides when the plane animation starts
}

function setupPlaneAnimationLoop() {
  const plane = document.getElementById('planeGif');
  if(!plane) return;

  function restartPlaneAnimation() {
    plane.style.display = '';
    plane.style.opacity = '1';
    plane.style.animation = 'none';

    void plane.offsetWidth;

    plane.style.animation = 'flyPlane 8s ease-in-out forwards';

    planeHideTimer = setTimeout(function () {
      plane.style.display = 'none';
      planeRestartTimer = setTimeout(restartPlaneAnimation, 4000);
    }, 8000);
  }

  restartPlaneAnimation();
}

function setupCarAnimationLoop() {
  const carContainer = document.getElementById('carContainer');
  if(!carContainer) return;

  function restartCarAnimation() {
    const isMobile = window.innerWidth <= 992;
    const carAnimationDuration = isMobile ? '3s' : '5s';
    const delayTime = 100;

    carContainer.style.animation = 'none';
    carContainer.style.left = '-160px';

    void carContainer.offsetWidth;

    carContainer.style.animation = `fadeInUp 1s ease forwards, carRace ${carAnimationDuration} linear 0.1s forwards`;

    carLoopTimer = setTimeout(restartCarAnimation, (parseFloat(carAnimationDuration) * 1000) + delayTime);
  }

  const isMobile = window.innerWidth <= 992;
  const initialWait = isMobile ? 4000 : 6000;
  carLoopTimer = setTimeout(restartCarAnimation, initialWait);
}

function resetAnimations() {
  clearTimeout(planeHideTimer);
  clearTimeout(planeRestartTimer);
  clearTimeout(carLoopTimer);
  startAnimations();
}

(function () {
  const images = document.querySelectorAll('.hero img, header img, .graffiti-img');
  let loadedImages = 0;
  let hasLoaded = false;

  function finishLoading() {
    if (hasLoaded) return;
    hasLoaded = true;

    const loader = document.getElementById('loader');
    if(loader) {
      loader.style.opacity = '0';
      setTimeout(function () {
        loader.style.display = 'none';
        setTimeout(startAnimations, 100);
      }, 500);
    } else {
      setTimeout(startAnimations, 100);
    }
  }

  function checkAllImagesLoaded() {
    loadedImages++;
    if (loadedImages >= images.length) {
      finishLoading();
    }
  }

  if (images.length === 0) {
    finishLoading();
  } else {
    images.forEach(img => {
      img.loading = 'eager';
      if (img.complete) {
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', checkAllImagesLoaded);
        img.addEventListener('error', checkAllImagesLoaded);
      }
    });
  }
})();

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if(mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if(targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
      });
    }
  });
});

window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 100);
  }

  const logo = document.querySelector('.logo');
  if (logo) {
    
    if (window.scrollY > window.innerHeight * 0.8) {
      logo.classList.add('show-logo');
    } else {
      logo.classList.remove('show-logo');
    }
  }
});

const scrollToTopBox = document.getElementById('scrollToTopBox');
if(scrollToTopBox) {
  let lastScrollTop = 0;

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const margin = clientHeight * 0.25;
    const visible = scrollTop < lastScrollTop && scrollTop > margin && scrollTop + clientHeight < scrollHeight - margin;

    scrollToTopBox.classList.toggle('show', visible);
    lastScrollTop = scrollTop;
  });

  scrollToTopBox.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


const blogSearch = document.getElementById('blogSearch');
if (blogSearch) {
  const blogCards = Array.from(document.querySelectorAll('#blogGrid .blog-card'));
  const blogSearchEmpty = document.getElementById('blogSearchEmpty');
  const blogSearchBtn = document.getElementById('blogSearchBtn');

  function unwrapHighlights(root) {
    root.querySelectorAll('mark.search-highlight').forEach(function (mark) {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function highlightText(root, query) {
    const lower = query.toLowerCase();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function (node) {
      const text = node.nodeValue;
      const index = text.toLowerCase().indexOf(lower);

      if (index === -1) return;

      const fragment = document.createDocumentFragment();
      let last = 0;
      let match = index;

      while (match !== -1) {
        fragment.appendChild(document.createTextNode(text.slice(last, match)));

        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = text.slice(match, match + query.length);
        fragment.appendChild(mark);

        last = match + query.length;
        match = text.toLowerCase().indexOf(lower, last);
      }

      fragment.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function filterBlogs() {
    const query = blogSearch.value.trim();
    const lower = query.toLowerCase();
    let visible = 0;

    blogCards.forEach(function (card) {
      const text = card.querySelector('.blog-text');
      if (!text) return;

      unwrapHighlights(text);

      const match = !query || text.textContent.toLowerCase().indexOf(lower) !== -1;
      card.style.display = match ? '' : 'none';

      if (match) {
        visible++;
        if (query) highlightText(text, query);
      }
    });

    if (blogSearchEmpty) {
      blogSearchEmpty.hidden = visible !== 0;
    }
  }

  blogSearch.addEventListener('input', filterBlogs);

  if (blogSearchBtn) {
    blogSearchBtn.addEventListener('click', function () {
      filterBlogs();
      blogSearch.focus();
    });
  }
}


const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const lightboxBack = document.getElementById('lightboxBack');
const lightboxClose = document.getElementById('lightboxClose');

let currentZoom = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0, startY = 0;

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
  lightboxOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function updateTransform() {
  lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

function zoomIn() {
  currentZoom = Math.min(currentZoom + 0.25, 4);
  updateTransform();
}

function zoomOut() {
  currentZoom = Math.max(currentZoom - 0.25, 1);
  if (currentZoom === 1) {
    translateX = 0;
    translateY = 0;
    updateTransform();
  } else {
    updateTransform();
  }
}


document.querySelectorAll('.graffiti-img').forEach(img => {
  img.addEventListener('click', () => {
    openLightbox(img.src, img.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBack) lightboxBack.addEventListener('click', closeLightbox);
if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);


if (lightboxOverlay) {
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
}


document.addEventListener('keydown', (e) => {
  if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
  if (e.key === 'Escape' || e.key === 'Backspace') closeLightbox();
  if (e.key === '+' || e.key === '=') zoomIn();
  if (e.key === '-' || e.key === '_') zoomOut();
});


if (lightboxImg) {
  lightboxImg.addEventListener('mousedown', (e) => {
    if (currentZoom > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      lightboxImg.classList.add('dragging');
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      lightboxImg.classList.remove('dragging');
    }
  });


  lightboxImg.addEventListener('touchstart', (e) => {
    if (currentZoom > 1 && e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }, { passive: true });

  lightboxImg.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateTransform();
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchend', () => {
    isDragging = false;
  });
}

if (lightboxOverlay) {
  lightboxOverlay.addEventListener('wheel', (e) => {
    if (lightboxOverlay.classList.contains('active')) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    }
  }, { passive: false });
}

function toggleBionic(id, btn) {
  const fullText = document.getElementById(id);
  if (!fullText) return;

  if (!fullText.dataset.originalHtml) {
    const clone = fullText.cloneNode(true);

    clone.querySelectorAll('mark.search-highlight').forEach(function (mark) {
      mark.replaceWith(document.createTextNode(mark.textContent));
    });

    clone.normalize();

    clone.querySelectorAll('[style]').forEach(function (el) {
      el.style.removeProperty('mask-image');
      el.style.removeProperty('-webkit-mask-image');
      el.style.removeProperty('opacity');
      el.style.removeProperty('scale');

      if (!el.getAttribute('style')) {
        el.removeAttribute('style');
      }
    });

    fullText.dataset.originalHtml = clone.innerHTML;
  }

  if (fullText.classList.contains('bionic-active')) {

    fullText.innerHTML = fullText.dataset.originalHtml;
    fullText.classList.remove('bionic-active');

    const visibleBtn = fullText.querySelector('[data-bionic-toggle]') || btn;
    visibleBtn.innerText = 'Bionic Mode';
  } else {

    let html = fullText.dataset.originalHtml;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        
        words.forEach(word => {
          if (word.trim() === '' || word.length < 2) {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const match = word.match(/^([a-zA-Z0-9']+)([\s\S]*)$/);
            if (match) {
              const w = match[1];
              const rest = match[2];
              const half = Math.ceil(w.length / 2);
              const strong = document.createElement('strong');
              strong.textContent = w.substring(0, half);
              fragment.appendChild(strong);
              fragment.appendChild(document.createTextNode(w.substring(half) + rest));
            } else {
              fragment.appendChild(document.createTextNode(word));
            }
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList && node.classList.contains('blog-article-actions')) return;
        Array.from(node.childNodes).forEach(processNode);
      }
    }
    
    Array.from(doc.body.childNodes).forEach(processNode);
    fullText.innerHTML = doc.body.innerHTML;
    fullText.classList.add('bionic-active');

    const visibleBtn = fullText.querySelector('[data-bionic-toggle]') || btn;
    visibleBtn.innerText = 'Normal Mode';
  }
}

function setupScrollFade() {
  const fadeSelectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'img',
    'svg',
    '.btn',
    '.tag',
    '.contact-link',
    '.blog-date',
    '.tech-name',
    '.tech-type'
  ];

  const elements = Array.from(document.querySelectorAll(fadeSelectors.join(','))).filter(function (el) {
    return !el.closest('header') &&
      !el.closest('.lightbox-overlay') &&
      !el.closest('.blog-article') &&
      !el.classList.contains('car-gif') &&
      !el.classList.contains('plane-gif');
  });

  if (elements.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const fadeRange = 140;
  let ticking = false;
  let headerHeight = 80;
  const masks = new Array(elements.length);

  function measure() {
    const header = document.querySelector('header');
    headerHeight = header ? header.getBoundingClientRect().height : 80;
  }

  function update() {
    ticking = false;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const factor = Math.min(1, scrollY / (viewportHeight * 0.3));
    const zoneEnd = headerHeight + fadeRange * factor;
    const zoneStart = zoneEnd - fadeRange;
    const rects = new Array(elements.length);

    for (let i = 0; i < elements.length; i++) {
      rects[i] = elements[i].getBoundingClientRect();
    }

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const rect = rects[i];

      if (rect.height === 0) continue;

      const localStart = zoneStart - rect.top;
      const localEnd = zoneEnd - rect.top;
      let mask;

      if (localEnd <= 0) {
        mask = 'none';
      } else if (localStart >= rect.height) {
        mask = 'linear-gradient(transparent, transparent)';
      } else {
        const alpha = localStart < 0 ? Math.min(1, -localStart / fadeRange) : 0;
        const firstStop = localStart > 0
          ? 'transparent 0px, transparent ' + localStart.toFixed(1) + 'px'
          : 'rgba(0, 0, 0, ' + alpha.toFixed(3) + ') 0px';
        mask = 'linear-gradient(to bottom, ' + firstStop + ', black ' + localEnd.toFixed(1) + 'px)';
      }

      if (masks[i] !== mask) {
        el.style.maskImage = mask;
        el.style.webkitMaskImage = mask;
        masks[i] = mask;
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    measure();
    onScroll();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) onScroll();
  });
  update();
}

setupScrollFade();