// 새로고침 시 최상단으로
window.scrollTo(0, 0);
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  // ===== LOADING SCREEN =====
  const mainHeader = document.getElementById('main-header');
  const homeHero = document.getElementById('hero-sticky');
  const loadingScreen = document.getElementById('loading-screen');
  const loadLine = document.getElementById('loadLine');
  const curtainL = document.querySelector('.load-curtain-left');
  const curtainR = document.querySelector('.load-curtain-right');

  // 로딩 타임라인 — 하나로 연결
  if (loadLine && curtainL && curtainR) {
    const loadTl = gsap.timeline({
      onComplete: () => {
        if (loadingScreen) loadingScreen.classList.add('done');
      }
    });

    // 선: 0 → 66% (왼쪽에서 시작)
    loadTl.to(loadLine, {
      width: '66%',
      duration: 1.8,
      ease: 'power2.inOut',
    });

    // 선: 66% → 100%
    loadTl.to(loadLine, {
      width: '100%',
      duration: 0.5,
      ease: 'power3.in',
    });

    // 선에서 바로 커튼 열림 (동시에 선 페이드)
    loadTl.to(loadLine, {
      opacity: 0,
      duration: 0.3,
      ease: 'none',
    }, '-=0.1');

    loadTl.to(curtainL, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
    }, '-=0.2');

    loadTl.to(curtainR, {
      yPercent: 100,
      duration: 0.9,
      ease: 'power3.inOut',
    }, '<');

    // 히어로 등장 (커튼 열리면서)
    loadTl.call(() => {
      if (homeHero) homeHero.classList.add('revealed');
    }, [], '-=0.6');

    // 헤더 등장
    loadTl.call(() => {
      mainHeader.classList.remove('header-hidden');
      mainHeader.classList.add('header-visible');
      ScrollTrigger.refresh();
    }, [], '-=0.2');
  }
  const overlay = document.getElementById('page-overlay');
  const panels = document.querySelectorAll('.page-panel');
  const header = document.getElementById('main-header');
  let activePanel = null;

  // ===== NAVIGATION =====
  function navigateTo(target) {
    if (target === 'home') {
      closePanel();
    } else {
      openPanel(target);
    }
  }

  function openPanel(id) {
    const panel = document.getElementById(id);
    if (!panel || activePanel === panel) return;

    if (activePanel) {
      activePanel.classList.remove('active');
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      panel.classList.add('active');
      panel.scrollTop = 0;
      activePanel = panel;
      observeFadeIns(panel);
      // ScrollTrigger refresh for panels
      setTimeout(() => ScrollTrigger.refresh(), 500);
    });
  }

  function closePanel() {
    if (!activePanel) return;
    activePanel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    activePanel = null;
  }

  overlay.addEventListener('click', closePanel);

  document.addEventListener('click', (e) => {
    const navEl = e.target.closest('[data-nav]');
    if (!navEl) return;
    e.preventDefault();
    navigateTo(navEl.getAttribute('data-nav'));
  });

  // ===== SCROLL FADE-IN =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  function observeFadeIns(container) {
    const elements = (container || document).querySelectorAll('.fade-in:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      ...observerOptions,
      root: container && container.classList.contains('page-panel') ? container : null
    });
    elements.forEach(el => observer.observe(el));
  }

  observeFadeIns();

  // ===== GSAP HERO SCROLL (3-Phase) =====
  gsap.registerPlugin(ScrollTrigger);

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-pin',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      pin: false,
    }
  });

  // Phase 1 (0~25%): 텍스트 사라짐 + 이미지 축소
  heroTl.to('.hero-text-tl', { x: -200, opacity: 0, duration: 0.1 }, 0.05);
  heroTl.to('.hero-text-br', { x: 200, opacity: 0, duration: 0.1 }, 0.08);
  heroTl.to('.hero-image-layer', { scale: 0.5, duration: 0.18 }, 0.08);
  heroTl.to('#hero-overlay', { opacity: 0.3, duration: 0.18 }, 0.08);
  heroTl.to('#hero-image', { filter: 'grayscale(0%)', duration: 0.18 }, 0.08);

  // Phase 2 (25~40%): 키워드 등장
  heroTl.to('.hero-keywords-overlay', { opacity: 1, duration: 0.08 }, 0.27);


  // ===== CORE VALUE 가로 스크롤 (Brand 페이지) =====
  const coreWrap = document.getElementById('coreValueWrap');
  const coreTrack = document.getElementById('coreValueTrack');
  const coreDots = document.getElementById('coreValueDots');

  if (coreWrap && coreTrack) {
    const bPanel = document.getElementById('brand');
    const panels = coreTrack.querySelectorAll('.hscroll-panel');
    const dots = coreDots ? coreDots.querySelectorAll('.hscroll-dot') : [];
    let currentSlide = 0;
    let isLocked = false;
    let isCVSection = false;

    function goToSlide(idx) {
      idx = Math.max(0, Math.min(idx, panels.length - 1));
      if (idx === currentSlide) return;
      currentSlide = idx;
      coreTrack.style.transform = `translateX(-${idx * 100}vw)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function checkCVVisible() {
      if (!bPanel) return false;
      const wrapTop = coreWrap.offsetTop;
      const scrollTop = bPanel.scrollTop;
      const viewH = window.innerHeight;
      // 섹션이 화면을 채우고 있는지
      return scrollTop >= wrapTop - viewH * 0.3 && scrollTop <= wrapTop + viewH * 0.3;
    }

    if (bPanel) {
      bPanel.addEventListener('wheel', (e) => {
        isCVSection = checkCVVisible();
        
        if (isCVSection) {
          const atFirst = currentSlide === 0 && e.deltaY < 0;
          const atLast = currentSlide === panels.length - 1 && e.deltaY > 0;
          
          if (!atFirst && !atLast) {
            e.preventDefault();
            if (!isLocked) {
              isLocked = true;
              goToSlide(currentSlide + (e.deltaY > 0 ? 1 : -1));
              setTimeout(() => { isLocked = false; }, 1600);
            }
          }
        }
      }, { passive: false });

      bPanel.addEventListener('scroll', () => {
        isCVSection = checkCVVisible();
        if (coreDots) {
          coreDots.style.opacity = isCVSection ? '1' : '0';
        }
      }, { passive: true });
    }

    if (coreDots) coreDots.classList.add('visible');
  }

  // ===== TEXT REVEAL (글자 순차 등장 — andlab 스타일) =====
  const revealElements = document.querySelectorAll('.text-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const words = el.querySelectorAll('.reveal-word');
        words.forEach((word, i) => {
          setTimeout(() => {
            word.classList.add('revealed');
          }, i * 120);
        });
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION (숫자 카운트업) =====
  const counters = document.querySelectorAll('.counter');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = Date.now();
        
        function updateCounter() {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(eased * target);
          el.textContent = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ===== WORD CLOUD SCATTER (키워드 흩어짐 효과) =====
  const scatterElements = document.querySelectorAll('.word-scatter');
  
  const scatterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.scatter-word');
        words.forEach((word, i) => {
          setTimeout(() => {
            word.classList.add('scattered');
          }, i * 80);
        });
        scatterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scatterElements.forEach(el => scatterObserver.observe(el));

  // ===== PARALLAX SUBTLE =====
  const parallaxElements = document.querySelectorAll('.parallax-slow');

  function handleParallax() {
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        el.style.transform = `translateY(${(progress - 0.5) * -40}px)`;
      }
    });
  }

  // ===== GRAYSCALE → COLOR ON SCROLL =====

  // 배경 이미지도 스크롤 시 컬러 전환
  const bgSections = document.querySelectorAll('.bg-section');
  const bgColorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        entry.target.classList.add('bg-color');
      } else {
        entry.target.classList.remove('bg-color');
      }
    });
  }, { threshold: [0, 0.3] });

  bgSections.forEach(el => bgColorObserver.observe(el));

  // ===== SCROLL HANDLER =====
  window.addEventListener('scroll', () => {
    handleParallax();
  }, { passive: true });

  handleParallax();

  // ===== PRODUCT DETAIL MODAL =====
  const productData = {
    'Arc Slatback': { category: 'Chair', desc: '재활용 철강 프레임으로 제작된 슬랫 백 체어. 등받이의 수직 라인이 금속의 직선성을 표현하며, 인체공학적 곡선이 편안한 착석감을 제공합니다.', material: 'Recycled Steel', dimensions: 'W450 × D520 × H820mm', weight: '4.2kg', year: '2025' },
    'Tri Stool': { category: 'Chair', desc: '원형 좌판과 세 개의 각진 다리가 만들어내는 미니멀 스툴. 알루미늄 폐자재를 녹여 재성형한 좌판이 가볍고 견고한 구조를 완성합니다.', material: 'Recycled Aluminum', dimensions: 'W380 × D380 × H480mm', weight: '2.8kg', year: '2025' },
    'Grid Frame': { category: 'Chair', desc: '사각 프레임의 구조적 아름다움을 강조한 다이닝 체어. 자동차 부품에서 수거한 철강을 용접하여 하나의 연속된 형태로 완성했습니다.', material: 'Recycled Carbon Steel', dimensions: 'W420 × D500 × H850mm', weight: '5.1kg', year: '2025' },
    'Fold Lite': { category: 'Chair', desc: '접이식 구조의 실용적 메탈 체어. 산업 기계에서 수거한 스틸 부품을 절단, 가공하여 가볍고 휴대 가능한 형태로 재탄생시켰습니다.', material: 'Recycled Stainless Steel', dimensions: 'W440 × D480 × H800mm', weight: '3.6kg', year: '2025' },
    'Loop Lounge': { category: 'Chair', desc: '곡선 등받이가 특징인 라운지 체어. 구리 파이프를 수집하여 부드러운 곡선으로 벤딩, 금속의 따뜻한 색감과 유기적 형태가 조화를 이룹니다.', material: 'Recycled Copper', dimensions: 'W560 × D620 × H750mm', weight: '6.3kg', year: '2025' },
    'Gear Lift': { category: 'Table', desc: '기어 메커니즘을 활용한 높이 조절 테이블. 폐기된 산업 기어를 베이스에 그대로 노출시켜 기능과 조형미를 동시에 담았습니다.', material: 'Recycled Steel & Glass', dimensions: 'W600 × D600 × H450~650mm', weight: '12.5kg', year: '2025' },
    'Pivot Round': { category: 'Table', desc: '원형 상판의 미니멀 사이드 테이블. 자전거 프레임에서 수거한 알루미늄 파이프로 다리를 구성, 가벼우면서도 안정적인 구조입니다.', material: 'Recycled Aluminum', dimensions: 'Ø450 × H520mm', weight: '3.8kg', year: '2025' },
    'Slab Console': { category: 'Table', desc: '직선과 면의 조합이 돋보이는 콘솔 테이블. 건축 폐자재 철판을 절단하여 정밀하게 용접, 절제된 형태미를 추구했습니다.', material: 'Recycled Steel Plate', dimensions: 'W1000 × D350 × H750mm', weight: '15.2kg', year: '2025' },
    'Cog Vitrine': { category: 'Table', desc: '유리 상판 아래 기계 기어가 보이는 시그니처 테이블. ONV의 업사이클링 철학을 가장 직접적으로 보여주는 대표작입니다.', material: 'Recycled Steel, Brass & Glass', dimensions: 'W1200 × D700 × H750mm', weight: '28.0kg', year: '2025' },
    'Bend Arc': { category: 'Light', desc: '아크 형태의 플로어 램프. 산업용 철근을 구부려 만든 곡선 암이 공간에 우아한 빛을 드리웁니다.', material: 'Recycled Steel Rod', dimensions: 'W350 × D350 × H1600mm', weight: '5.5kg', year: '2025' },
    'Dome Glow': { category: 'Light', desc: '돔 형태의 데스크 램프. 음료수 캔에서 수거한 알루미늄을 녹여 재성형한 갓이 부드럽게 빛을 분산시킵니다.', material: 'Recycled Aluminum', dimensions: 'Ø200 × H380mm', weight: '1.8kg', year: '2025' },
    'Joint Arm': { category: 'Light', desc: '조절 가능한 관절 구조의 플로어 램프. 각 관절은 폐기된 기계 부품의 조인트를 재활용하여 산업적 미감을 살렸습니다.', material: 'Recycled Steel & Copper', dimensions: 'W300 × D300 × H1400mm', weight: '4.2kg', year: '2025' },
    'Forge Pendant': { category: 'Light', desc: '산업용 조명을 현대적으로 재해석한 펜던트 램프. 공장에서 수거한 금속 갓을 세척하고 마감 처리하여 빈티지한 질감을 유지했습니다.', material: 'Recycled Industrial Metal', dimensions: 'Ø350 × H280mm', weight: '2.5kg', year: '2025' },
    'Mix Module': { category: 'Drawer', desc: '모듈형 서랍 유닛. 각 서랍 면은 다른 종류의 재활용 금속판으로 구성되어 소재의 다양성을 시각적으로 보여줍니다.', material: 'Mixed Recycled Metals', dimensions: 'W500 × D400 × H700mm', weight: '18.0kg', year: '2025' },
    'File Compact': { category: 'Drawer', desc: '2단 서랍장. 산업용 파일 캐비닛의 형태를 재해석하여 가정용으로 최적화한 컴팩트 수납 가구입니다.', material: 'Recycled Steel Sheet', dimensions: 'W450 × D380 × H600mm', weight: '14.5kg', year: '2025' },
    'Wide Matte': { category: 'Drawer', desc: '3단 와이드 서랍장. 넓은 상판은 보조 테이블로도 활용 가능하며, 파우더 코팅 마감으로 매트한 질감을 완성했습니다.', material: 'Recycled Steel', dimensions: 'W800 × D450 × H850mm', weight: '25.0kg', year: '2025' },
    'Grid Shelf': { category: 'Shelves', desc: '오픈 선반 유닛. 수직 프레임과 수평 선반의 교차가 만드는 그리드 구조가 공간을 정돈된 느낌으로 채웁니다.', material: 'Recycled Steel Frame', dimensions: 'W900 × D300 × H1800mm', weight: '20.0kg', year: '2025' },
    'Asym Wall': { category: 'Shelves', desc: '비대칭 배치의 월 마운트 선반. 다양한 크기의 금속 선반이 벽면에 리듬감 있는 디스플레이를 만들어냅니다.', material: 'Recycled Aluminum', dimensions: 'W1200 × D250 × H900mm', weight: '8.5kg', year: '2025' },
    'Rod Bookcase': { category: 'Shelves', desc: '산업적 미감의 북셸프. 철근 프레임과 금속 선반판의 조합이 견고하면서도 개방적인 수납 공간을 제공합니다.', material: 'Recycled Steel Rod & Plate', dimensions: 'W800 × D280 × H1600mm', weight: '16.0kg', year: '2025' },
    'Glass Vault': { category: 'Display Cabinet', desc: '유리와 금속 프레임의 진열장. 내부가 투명하게 보이는 구조로, 소장품을 돋보이게 하면서 공간에 깊이를 더합니다.', material: 'Recycled Steel & Glass', dimensions: 'W600 × D400 × H1500mm', weight: '22.0kg', year: '2025' },
  };

  const modal = document.getElementById('product-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalName = document.getElementById('modal-name');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');
  const modalCloseBtn = document.getElementById('modal-close');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const name = card.querySelector('.product-name')?.textContent;
    const imgSrc = card.querySelector('.product-img-default')?.src;
    const data = productData[name];

    if (!data || !imgSrc) return;

    modalImg.src = imgSrc;
    modalCategory.textContent = data.category;
    modalName.textContent = name;
    modalDesc.textContent = data.desc;
    modalSpecs.innerHTML = `
      <div class="modal-spec-row"><span class="modal-spec-label">Material</span><span class="modal-spec-value">${data.material}</span></div>
      <div class="modal-spec-row"><span class="modal-spec-label">Dimensions</span><span class="modal-spec-value">${data.dimensions}</span></div>
      <div class="modal-spec-row"><span class="modal-spec-label">Weight</span><span class="modal-spec-value">${data.weight}</span></div>
      <div class="modal-spec-row"><span class="modal-spec-label">Year</span><span class="modal-spec-value">${data.year}</span></div>
    `;

    modal.classList.add('active');
  });

  modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // ===== HERO KEYWORD FLOATING IMAGES =====
  const keywordHovers = document.querySelectorAll('.keyword-hover');

  keywordHovers.forEach(kw => {
    const floatId = kw.getAttribute('data-float');
    const floatEl = document.getElementById(floatId);
    if (!floatEl) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isFloating = false;

    function animateFloat() {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;
      floatEl.style.left = currentX + 'px';
      floatEl.style.top = currentY + 'px';
      if (isFloating) requestAnimationFrame(animateFloat);
    }

    kw.addEventListener('mouseenter', () => {
      floatEl.classList.add('floating');
      isFloating = true;
      requestAnimationFrame(animateFloat);
    });

    kw.addEventListener('mouseleave', () => {
      floatEl.classList.remove('floating');
      isFloating = false;
    });

    kw.addEventListener('mousemove', (e) => {
      mouseX = e.clientX - 100;
      mouseY = e.clientY - 100;
    });
  });

  // ===== CORE VALUES — 3등분 순차 등장 =====
  const cvSection = document.getElementById('cvSection');
  const cvCols = document.querySelectorAll('.cv-col');

  if (cvSection && cvCols.length) {
    const cvObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cv-active');
          cvCols.forEach(col => col.classList.add('cv-visible'));
          cvObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    cvObserver.observe(cvSection);
  }

  // ===== BRAND WORKSPACE PARALLAX =====
  const brandPanel = document.getElementById('brand');
  const workspaceImg = document.querySelector('.brand-workspace-img img');

  if (brandPanel && workspaceImg) {
    brandPanel.addEventListener('scroll', () => {
      const section = document.querySelector('.brand-workspace-img');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const translate = (progress - 0.5) * -120;
        workspaceImg.style.transform = `translateY(${translate}px)`;
      }
    }, { passive: true });
  }

  // ===== HIGHLIGHT → SHOP SCROLL =====
  document.querySelectorAll('.highlight-item[data-shop-category]').forEach(item => {
    item.addEventListener('click', () => {
      const catId = item.getAttribute('data-shop-category');
      const shopPanel = document.getElementById('shop');
      
      // shop 패널 열기
      if (shopPanel && !shopPanel.classList.contains('active')) {
        navigateTo('shop');
      }
      
      // 패널 열린 후 해당 카테고리로 스크롤
      setTimeout(() => {
        const target = document.getElementById(catId);
        if (target && shopPanel) {
          shopPanel.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }, 1000);
    });
  });

  // ===== CURSOR CIRCLE =====
  const cursorCircle = document.getElementById('cursor-circle');
  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function updateCursor() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    if (cursorCircle) {
      cursorCircle.style.left = cx + 'px';
      cursorCircle.style.top = cy + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // 호버 시 커서 커지기
  document.querySelectorAll('a, button, .product-card, .highlight-item, .keyword-hover, .home-nav-card, .home-link, .btn-view-all').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorCircle) cursorCircle.classList.add('hover-grow');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorCircle) cursorCircle.classList.remove('hover-grow');
    });
  });

  // ===== BRAND SPOTLIGHT =====
  const brandHeroText = document.querySelector('.brand-hero-text');
  const brandBody = document.querySelector('.brand-hero-text .brand-body');
  let spotlightTimer = null;
  
  if (brandHeroText && brandBody) {
    // 패널 열릴 때 1초 후 spotlight 활성화
    document.addEventListener('click', (e) => {
      const navEl = e.target.closest('[data-nav="brand"]');
      if (navEl) {
        brandBody.classList.remove('spotlight-ready');
        brandBody.style.opacity = '';
        clearTimeout(spotlightTimer);
        spotlightTimer = setTimeout(() => {
          brandBody.classList.add('spotlight-ready');
        }, 500);
      }
    });

    brandHeroText.addEventListener('mousemove', (e) => {
      const rect = brandHeroText.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      brandBody.style.setProperty('--mx', x + '%');
      brandBody.style.setProperty('--my', y + '%');
    });
  }

  // ===== PROCESS PARALLAX =====
  const processBgImg = document.querySelector('.process-parallax-bg');
  if (processBgImg) {
    gsap.to(processBgImg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-process',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  // ===== CONTACT HERO → FIXED THUMB (GSAP) =====
  const contactPanel = document.getElementById('contact');
  const contactHeroImg = document.querySelector('.contact-hero-img');
  const contactContent = document.querySelector('.contact-content');

  if (contactPanel && contactHeroImg && contactContent) {
    let contactST = null;

    function initContactScroll() {
      if (contactST) contactST.kill();

      contactST = ScrollTrigger.create({
        scroller: contactPanel,
        trigger: contactContent,
        start: 'top 80%',
        onEnter: () => contactHeroImg.classList.add('fixed-thumb'),
        onLeaveBack: () => contactHeroImg.classList.remove('fixed-thumb'),
      });
    }

    // Contact 패널 열릴 때 ScrollTrigger 초기화
    document.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav="contact"]');
      if (nav) {
        contactHeroImg.classList.remove('fixed-thumb');
        setTimeout(() => {
          initContactScroll();
          ScrollTrigger.refresh();
        }, 1000);
      }
    });
  }

  // ===== KEYBOARD =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
      } else if (activePanel) {
        closePanel();
      }
    }
  });
});
