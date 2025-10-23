/* ===== WISDOMSITE JAVASCRIPT ===== */

// Configuration
const CONFIG = {
  ANIMATION_DURATION: 300,
  SCROLL_OFFSET: 80
};

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const scrollTo = (element, offset = CONFIG.SCROLL_OFFSET) => {
  const targetPosition = element.offsetTop - offset;
  window.scrollTo({ top: targetPosition, behavior: 'smooth' });
};

/* ===== NAVIGATION ===== */
const Navigation = {
  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupActiveLinks();
    this.setupScrollEffects();
  },

  setupMobileMenu() {
    const toggle = $('.mobile-toggle');
    const menu = $('.nav-menu');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  },

  setupSmoothScrolling() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = $(href);
        if (target) {
          e.preventDefault();
          scrollTo(target);
        }
      });
    });
  },

  setupActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    
    $$('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.replace('.html', '').replace('./', '');
        if (linkPage === currentPage || (currentPage === 'index' && linkPage === '')) {
          link.classList.add('active');
        }
      }
    });
  },

  setupScrollEffects() {
    const header = $('.header');
    if (!header) return;

    const handleScroll = debounce(() => {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
      } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = 'none';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }
};

/* ===== ANIMATIONS ===== */
const Animations = {
  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupReadingProgress();
  },

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Animate elements on scroll
    $$('.content-card, .premise-box, .conclusion-box, .argument-box, .counter-box, .bible-verse').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  },

  setupHoverEffects() {
    // Enhanced card hover effects
    $$('.content-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Button glow effects
    $$('.btn-primary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.4)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.boxShadow = '';
      });
    });
  },

  setupReadingProgress() {
    if (!$('.article-content')) return;

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    progressBar.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 3px;
      background: rgba(255,255,255,0.1); z-index: 1001;
    `;
    progressBar.querySelector('.progress-fill').style.cssText = `
      height: 100%; width: 0%; transition: width 0.3s ease;
      background: linear-gradient(90deg, var(--green), var(--red));
    `;
    
    document.body.appendChild(progressBar);

    // Update progress on scroll
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
      
      progressBar.querySelector('.progress-fill').style.width = scrollPercent + '%';
    };

    window.addEventListener('scroll', debounce(updateProgress, 10));
  }
};

/* ===== CONTENT FEATURES ===== */
const Content = {
  init() {
    this.setupArgumentBoxes();
    this.setupBibleVerses();
    this.setupSearch();
  },

  setupArgumentBoxes() {
    // Click to highlight argument boxes
    $$('.premise-box, .conclusion-box, .argument-box, .counter-box').forEach(box => {
      box.style.cursor = 'pointer';
      
      box.addEventListener('click', () => {
        // Remove previous highlights
        $$('.highlighted').forEach(el => el.classList.remove('highlighted'));
        
        // Add highlight
        box.classList.add('highlighted');
        
        // Add highlight styles if not exists
        if (!$('#highlight-styles')) {
          const style = document.createElement('style');
          style.id = 'highlight-styles';
          style.textContent = `
            .highlighted {
              transform: scale(1.05) !important;
              box-shadow: 0 0 30px rgba(34, 197, 94, 0.5) !important;
              z-index: 10;
              position: relative;
            }
          `;
          document.head.appendChild(style);
        }
        
        // Remove highlight after 3 seconds
        setTimeout(() => box.classList.remove('highlighted'), 3000);
      });
    });
  },

  setupBibleVerses() {
    // Add copy functionality to Bible verses
    $$('.bible-verse').forEach(verse => {
      const copyBtn = document.createElement('button');
      copyBtn.innerHTML = '📋';
      copyBtn.style.cssText = `
        position: absolute; top: 10px; right: 10px;
        background: var(--green-dark); color: var(--black);
        border: none; border-radius: 4px; padding: 5px 8px;
        cursor: pointer; opacity: 0; transition: opacity 0.3s;
      `;
      
      verse.style.position = 'relative';
      verse.appendChild(copyBtn);
      
      verse.addEventListener('mouseenter', () => copyBtn.style.opacity = '1');
      verse.addEventListener('mouseleave', () => copyBtn.style.opacity = '0');
      
      copyBtn.addEventListener('click', async () => {
        const text = verse.querySelector('.verse-text').textContent + ' - ' + 
                    verse.querySelector('.verse-reference').textContent;
        
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.innerHTML = '✅';
          setTimeout(() => copyBtn.innerHTML = '📋', 2000);
        } catch (err) {
          console.log('Copy failed');
        }
      });
    });
  },

  setupSearch() {
    // Quick search with Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
    });
  },

  openSearch() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: flex-start;
      justify-content: center; z-index: 2000; padding-top: 10vh;
    `;
    
    modal.innerHTML = `
      <div style="background: var(--dark); border-radius: var(--radius); width: 90%; max-width: 600px; overflow: hidden; border: 1px solid var(--green-dark);">
        <div style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid var(--darker);">
          <input type="text" placeholder="Search content..." style="flex: 1; background: transparent; border: none; outline: none; color: var(--white); font-size: 1.125rem;" autofocus>
          <button style="background: none; border: none; color: var(--grey); font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 1rem; max-height: 50vh; overflow-y: auto;">
          <p style="color: var(--grey);">Start typing to search...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = modal.querySelector('input');
    const results = modal.querySelector('div:last-child');
    const closeBtn = modal.querySelector('button');
    
    // Close functionality
    const close = () => modal.remove();
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => e.target === modal && close());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
    
    // Search functionality
    input.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) {
        results.innerHTML = '<p style="color: var(--grey);">Start typing to search...</p>';
        return;
      }
      
      const searchResults = this.searchContent(query);
      this.displayResults(searchResults, results);
    }, 300));
  },

  searchContent(query) {
    const pages = [
      { title: 'Metaphysics Contradictions', url: 'metaphysics.html', keywords: 'metaphysics contradiction trinity law identity simplicity' },
      { title: 'Logical Issues', url: 'logical-issues.html', keywords: 'logic paradox three one divine simplicity plurality' },
      { title: 'Bible Contradictions', url: 'bible-contradictions.html', keywords: 'bible jesus god father greater scripture verse' }
    ];
    
    return pages.filter(page => 
      page.title.toLowerCase().includes(query) || 
      page.keywords.toLowerCase().includes(query)
    );
  },

  displayResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<p style="color: var(--grey);">No results found.</p>';
      return;
    }
    
    const html = results.map(result => `
      <div onclick="window.location.href='${result.url}'" style="padding: 1rem; border-radius: var(--radius); cursor: pointer; transition: var(--transition); margin-bottom: 0.5rem;" onmouseover="this.style.background='var(--darker)'" onmouseout="this.style.background='transparent'">
        <h4 style="color: var(--green-light); margin: 0 0 0.5rem 0;">${result.title}</h4>
        <p style="color: var(--grey); margin: 0; font-size: 0.875rem;">Click to view this page</p>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
};

/* ===== ACCESSIBILITY ===== */
const Accessibility = {
  init() {
    this.setupKeyboardNav();
    this.setupFocusManagement();
    this.setupSkipNav();
  },

  setupKeyboardNav() {
    // Add keyboard navigation for interactive elements
    $$('.content-card, .premise-box, .conclusion-box, .argument-box, .counter-box').forEach((el, index) => {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  setupFocusManagement() {
    // Improve focus visibility
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid var(--green) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  },

  setupSkipNav() {
    // Add skip navigation
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.textContent = 'Skip to main content';
    skipNav.style.cssText = `
      position: absolute; top: -40px; left: 6px;
      background: var(--green-dark); color: var(--black);
      padding: 8px; text-decoration: none; border-radius: 4px;
      z-index: 1001; transition: top 0.3s;
    `;
    
    skipNav.addEventListener('focus', () => skipNav.style.top = '6px');
    skipNav.addEventListener('blur', () => skipNav.style.top = '-40px');
    
    document.body.insertBefore(skipNav, document.body.firstChild);
  }
};

/* ===== PERFORMANCE ===== */
const Performance = {
  init() {
    this.optimizeAnimations();
    this.setupLazyLoading();
  },

  optimizeAnimations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  },

  setupLazyLoading() {
    // Lazy load images if any exist
    const images = $$('img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }
};

/* ===== MAIN APP ===== */
const WisdomSite = {
  init() {
    try {
      Navigation.init();
      Animations.init();
      Content.init();
      Accessibility.init();
      Performance.init();
      
      document.body.classList.add('loaded');
      console.log('WisdomSite initialized successfully');
      
    } catch (error) {
      console.error('Error initializing WisdomSite:', error);
    }
  }
};

/* ===== UTILITY FUNCTIONS ===== */
window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

window.printPage = () => window.print();

window.sharePage = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.content || '',
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.log('Could not copy URL');
    }
  }
};

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', WisdomSite.init);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  console.log(document.hidden ? 'Page hidden' : 'Page visible');
});

// Export for external use
window.WisdomSite = {
  Navigation,
  Animations,
  Content,
  Accessibility,
  Performance
};

console.log('WisdomSite JavaScript loaded successfully');