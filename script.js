function startAnimations() {
  const heroImages = document.getElementById('heroImages');
  const heroButtons = document.getElementById('heroButtons');
  const carContainer = document.getElementById('carContainer');

  if(heroImages) heroImages.style.animation = 'fadeInUp 1s ease forwards';
  if(heroButtons) heroButtons.style.animation = 'fadeInUp 1s ease 0.3s forwards';

  if(carContainer) {
    const isMobile = window.innerWidth <= 992;
    const carAnimationDuration = isMobile ? '3s' : '5s';
    carContainer.style.animation = `fadeInUp 1s ease 0s forwards, carRace ${carAnimationDuration} linear 0.5s forwards`;
    const carGif = document.querySelector('.car-gif');
    if(carGif) carGif.style.animation = 'vibrate 0.2s linear infinite';
    setupCarAnimationLoop();
  }

  const aboutContent = document.getElementById('aboutContent');
  if(aboutContent) aboutContent.style.animation = 'fadeInUp 1s ease 0.5s forwards';

  const sectionHeader = document.getElementById('sectionHeader');
  if(sectionHeader) sectionHeader.style.animation = 'fadeInUp 1s ease 0.7s forwards';

  const prototypesHeader = document.getElementById('prototypesHeader');
  if (prototypesHeader) {
      prototypesHeader.style.animation = 'fadeInUp 1s ease 1.1s forwards';
  }

  const experimentalHeader = document.getElementById('experimentalHeader');
  if (experimentalHeader) {
      experimentalHeader.style.animation = 'fadeInUp 1s ease 1.4s forwards';
  }

  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    const delay = 0.9 + (index * 0.2);
    card.style.animation = `fadeInUp 1s ease ${delay}s forwards`;
  });

  const contactContent = document.getElementById('contactContent');
  if(contactContent) contactContent.style.animation = 'fadeInUp 1s ease 1.7s forwards';

  setTimeout(function () {
    const plane = document.getElementById('planeGif');
    if (plane) {
      plane.style.opacity = '1';
      plane.style.animation = 'flyPlane 8s ease-in-out forwards';
      setTimeout(function () {
        plane.style.display = 'none';
      }, 8000);
    }
  }, 0); // this number decides when the plane animation starts
}

function setupCarAnimationLoop() {
  const carContainer = document.getElementById('carContainer');
  if(!carContainer) return;

  function restartCarAnimation() {
    const isMobile = window.innerWidth <= 992;
    const carAnimationDuration = isMobile ? '3s' : '5s';
    const delayTime = 100;

    carContainer.style.animation = 'none';
    carContainer.style.left = '-150px';

    void carContainer.offsetWidth;

    carContainer.style.animation = `fadeInUp 1s ease forwards, carRace ${carAnimationDuration} linear 0.1s forwards`;

    setTimeout(restartCarAnimation, (parseFloat(carAnimationDuration) * 1000) + delayTime);
  }

  const isMobile = window.innerWidth <= 992;
  const initialWait = isMobile ? 4000 : 6000;
  setTimeout(restartCarAnimation, initialWait);
}

window.addEventListener('load', function () {
  const images = document.querySelectorAll('img');
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

  const safetyTimeout = setTimeout(finishLoading, 4000);

  function checkAllImagesLoaded() {
    loadedImages++;
    if (loadedImages === images.length) {
      clearTimeout(safetyTimeout); 
      finishLoading();
    }
  }

  if (images.length === 0) {
    clearTimeout(safetyTimeout);
    finishLoading();
  } else {
    images.forEach(img => {
      if (img.complete) {
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', checkAllImagesLoaded);
        img.addEventListener('error', checkAllImagesLoaded);
      }
    });
  }
});

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
    if (window.scrollY > 100) {
      header.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
    } else {
      header.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
    }
  }
});

const scrollToTopBox = document.getElementById('scrollToTopBox');
if(scrollToTopBox) {
  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowHeight + scrollTop >= documentHeight - 5) {
      scrollToTopBox.classList.add('show');
    } else {
      scrollToTopBox.classList.remove('show');
    }
  });

  scrollToTopBox.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


function toggleBlog(id, btn) {
  const fullText = document.getElementById(id);
  if (fullText) {
    fullText.classList.toggle('active');
    if (fullText.classList.contains('active')) {
      btn.innerText = 'Read Less';
    } else {
      btn.innerText = 'Read More';
    }
  }
}