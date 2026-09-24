(function () {
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
    image.decoding = 'async';
  });

  const lazyVideos = document.querySelectorAll('video[data-lazy-video]');
  if (lazyVideos.length) {
    const loadVideo = (video) => {
      const source = video.querySelector('source[data-src]');
      if (source && !source.getAttribute('src')) {
        source.src = source.dataset.src;
        video.load();
      }
    };
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            loadVideo(video);
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { rootMargin: '280px 0px', threshold: 0.02 });
      lazyVideos.forEach((video) => videoObserver.observe(video));
    } else {
      lazyVideos.forEach((video) => {
        loadVideo(video);
        video.play().catch(() => {});
      });
    }
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(value);
        const original = button.textContent;
        button.textContent = '已复制';
        setTimeout(() => { button.textContent = original; }, 1300);
      } catch (error) {
        window.location.href = 'mailto:' + value;
      }
    });
  });

  const storyModal = document.querySelector('#story-modal');
  const storyModalImage = document.querySelector('#story-modal-image');
  const storyModalTitle = document.querySelector('#story-modal-title');
  if (storyModal && storyModalImage && storyModalTitle) {
    document.querySelectorAll('.people-case-v3 [data-published-open] span, .people-case-v3 .published-window strong').forEach((label) => {
      label.textContent = '查看发布内容 ↗';
    });
    if (storyModalTitle.textContent.trim() === 'Published story') storyModalTitle.textContent = '已发布文章';
    document.querySelectorAll('[data-published-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        storyModalImage.src = trigger.getAttribute('data-image') || '';
        storyModalImage.alt = trigger.getAttribute('data-title') || '完整文章预览';
        storyModalTitle.textContent = trigger.getAttribute('data-title') || 'Published story';
        if (typeof storyModal.showModal === 'function') {
          storyModal.showModal();
        } else {
          storyModal.setAttribute('open', '');
          storyModal.classList.add('is-open');
        }
      });
    });
    document.querySelectorAll('[data-published-close]').forEach((button) => {
      button.addEventListener('click', () => {
        if (typeof storyModal.close === 'function') storyModal.close();
        storyModal.classList.remove('is-open');
      });
    });
    storyModal.addEventListener('click', (event) => {
      if (event.target === storyModal) {
        if (typeof storyModal.close === 'function') storyModal.close();
        storyModal.classList.remove('is-open');
      }
    });
  }

  const caseImageModal = document.querySelector('#case-image-modal');
  const caseImageModalImage = document.querySelector('#case-image-modal-image');
  const caseImageModalTitle = document.querySelector('#case-image-modal-title');
  if (caseImageModal && caseImageModalImage && caseImageModalTitle) {
    const openCaseImage = (trigger) => {
      caseImageModalImage.src = trigger.getAttribute('src') || '';
      caseImageModalImage.alt = trigger.getAttribute('alt') || '项目图片预览';
      caseImageModalTitle.textContent = trigger.getAttribute('data-preview-title') || 'Image detail';
      if (typeof caseImageModal.showModal === 'function') {
        caseImageModal.showModal();
      } else {
        caseImageModal.setAttribute('open', '');
        caseImageModal.classList.add('is-open');
      }
    };
    document.querySelectorAll('[data-case-preview]').forEach((trigger) => {
      trigger.addEventListener('click', () => openCaseImage(trigger));
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCaseImage(trigger);
        }
      });
    });
    document.querySelectorAll('[data-case-preview-close]').forEach((button) => {
      button.addEventListener('click', () => {
        if (typeof caseImageModal.close === 'function') caseImageModal.close();
        caseImageModal.classList.remove('is-open');
      });
    });
    caseImageModal.addEventListener('click', (event) => {
      if (event.target === caseImageModal) {
        if (typeof caseImageModal.close === 'function') caseImageModal.close();
        caseImageModal.classList.remove('is-open');
      }
    });
  }

  const peopleCase = document.querySelector('.people-case-v3');
  if (peopleCase) {
    const flowerNames = new Map([
      ['罗玉国', '晨阳'],
      ['何莎莎', '可乐'],
      ['孙君旭', '重楼']
    ]);
    const textWalker = document.createTreeWalker(peopleCase, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
    textNodes.forEach((node) => {
      let value = node.nodeValue;
      flowerNames.forEach((flowerName, realName) => {
        value = value.split(realName).join(flowerName);
      });
      node.nodeValue = value;
    });
    peopleCase.querySelectorAll('img[alt]').forEach((image) => {
      let value = image.getAttribute('alt') || '';
      flowerNames.forEach((flowerName, realName) => {
        value = value.split(realName).join(flowerName);
      });
      image.setAttribute('alt', value);
    });
    peopleCase.querySelector('.role-v3-boundary')?.remove();
  }
})();
