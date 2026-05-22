(() => {
  const figures = Array.from(document.querySelectorAll('.hero-photo, .photo-card'));
  if (!figures.length) return;

  const items = figures
    .map((figure) => {
      const image = figure.querySelector('img');
      if (!image) return null;
      const caption = figure.querySelector('figcaption')?.textContent?.trim() || image.alt || '';
      return {
        src: image.currentSrc || image.src,
        alt: image.alt || caption,
        caption
      };
    })
    .filter(Boolean);

  if (!items.length) return;

  let currentIndex = 0;
  const viewer = document.createElement('div');
  viewer.className = 'album-viewer';
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <button class="album-viewer__close" type="button" aria-label="写真を閉じる">閉じる</button>
    <button class="album-viewer__button album-viewer__prev" type="button" aria-label="前の写真へ">←</button>
    <div class="album-viewer__stage" role="dialog" aria-modal="true" aria-label="写真ビューア">
      <img class="album-viewer__image" src="" alt="">
      <div class="album-viewer__caption"></div>
    </div>
    <button class="album-viewer__button album-viewer__next" type="button" aria-label="次の写真へ">→</button>
  `;
  document.body.appendChild(viewer);

  const viewerImage = viewer.querySelector('.album-viewer__image');
  const viewerCaption = viewer.querySelector('.album-viewer__caption');
  const closeButton = viewer.querySelector('.album-viewer__close');
  const prevButton = viewer.querySelector('.album-viewer__prev');
  const nextButton = viewer.querySelector('.album-viewer__next');

  function render(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    viewerImage.src = item.src;
    viewerImage.alt = item.alt;
    viewerCaption.textContent = `${item.caption}  ${currentIndex + 1} / ${items.length}`;
  }

  function openViewer(index) {
    render(index);
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus({ preventScroll: true });
  }

  function closeViewer() {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  figures.forEach((figure, index) => {
    figure.setAttribute('tabindex', '0');
    figure.addEventListener('click', () => openViewer(index));
    figure.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openViewer(index);
      }
    });
  });

  closeButton.addEventListener('click', closeViewer);
  prevButton.addEventListener('click', () => render(currentIndex - 1));
  nextButton.addEventListener('click', () => render(currentIndex + 1));
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });

  window.addEventListener('keydown', (event) => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') render(currentIndex - 1);
    if (event.key === 'ArrowRight') render(currentIndex + 1);
  });
})();
