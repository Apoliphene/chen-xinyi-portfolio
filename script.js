if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add('will-reveal');
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 55}ms`;
    observer.observe(item);
  });
}

const filters = document.querySelectorAll('.filter');
const stories = document.querySelectorAll('.story');
const storyList = document.querySelector('.story-list');
const searchInput = document.querySelector('#story-search');
const yearFilter = document.querySelector('#year-filter');
const storyCount = document.querySelector('#story-count');
const noResults = document.querySelector('#no-results');
let activeCategory = 'all';

function applyStoryFilters() {
  const query = searchInput.value.trim().toLocaleLowerCase('zh-CN');
  const year = yearFilter.value;
  const isFiltered = activeCategory !== 'all' || year !== 'all' || query.length > 0;

  stories.forEach((story) => {
    const matchesCategory = activeCategory === 'all' || story.dataset.category === activeCategory;
    const matchesYear = year === 'all' || story.dataset.year === year;
    const matchesQuery = !query || story.textContent.toLocaleLowerCase('zh-CN').includes(query);
    story.classList.toggle('hidden', !(matchesCategory && matchesYear && matchesQuery));
    story.classList.remove('story-single');
  });

  const visibleStories = [...stories].filter((story) => !story.classList.contains('hidden'));
  storyList.classList.toggle('filtered-view', isFiltered);

  if (visibleStories.length === 1) {
    visibleStories[0].classList.add('story-single');
  }

  storyCount.textContent = `${visibleStories.length} 篇`;
  noResults.hidden = visibleStories.length !== 0;
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    filters.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    applyStoryFilters();
  });
});

searchInput.addEventListener('input', applyStoryFilters);
yearFilter.addEventListener('change', applyStoryFilters);

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.classList.toggle('active');
  nav.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.classList.remove('active');
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开菜单');
    document.body.style.overflow = '';
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && menuButton.classList.contains('active')) {
    menuButton.classList.remove('active');
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开菜单');
    document.body.style.overflow = '';
  }
});
