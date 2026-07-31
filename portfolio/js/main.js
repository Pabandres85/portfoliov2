/* ═══════════════════════════════════════
   PORTFOLIO — main.js
   Pablo Andrés Muñoz
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyping();
  initScrollReveal();
  loadData();
  setCurrentYear();
});

/* ───── NAV ───── */
function initNav() {
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('navToggle');
  const menu      = document.getElementById('navMenu');
  const links     = menu.querySelectorAll('.nav__link');

  // Scroll → glass nav
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  // Highlight active section
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }
}

/* ───── TYPING EFFECT ───── */
function initTyping() {
  const roles = [
    'Ingeniero de Sistemas',
    'Full Stack Developer',
    'Especialista en IA',
    'Ingeniero de Datos e IA',
    'Docente universitario'
  ];

  const el       = document.getElementById('typingText');
  let roleIdx    = 0;
  let charIdx    = 0;
  let deleting   = false;
  const typeSpeed   = 70;
  const deleteSpeed = 40;
  const holdTime    = 2200;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; tick(); }, holdTime);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
}

/* ───── SCROLL REVEAL ───── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

/* ───── LOAD DATA ───── */
async function loadData() {
  try {
    const res  = await fetch('data/projects.json');
    const data = await res.json();
    renderTimeline(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderCertifications(data.certifications);
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

/* ───── TIMELINE ───── */
function renderTimeline(items) {
  const container = document.getElementById('timeline');
  container.classList.add('reveal-stagger');

  container.innerHTML = items.map(item => `
    <div class="timeline__item">
      <div class="timeline__card glass">
        <span class="timeline__period">${item.period}</span>
        <h3 class="timeline__role">${item.role}</h3>
        <p class="timeline__company">${item.company}</p>
        <p class="timeline__desc">${item.description}</p>
        <ul class="timeline__results">
          ${item.results.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // Re-observe for scroll reveal
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  obs.observe(container);
}

/* ───── PROJECTS ───── */
function renderProjects(projects) {
  const grid    = document.getElementById('projectsGrid');
  const filters = document.getElementById('projectFilters');

  // Build filter buttons
  const categories = [...new Set(projects.map(p => p.category))];
  const categoryLabels = {
    'desarrollo':    'Desarrollo',
    'ia':            'Inteligencia Artificial',
    'ciencia-datos': 'Ciencia de datos',
    'automatizacion':'Automatización'
  };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = cat;
    btn.textContent = categoryLabels[cat] || cat;
    filters.appendChild(btn);
  });

  // Render all cards
  function renderCards(filter = 'all') {
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    grid.innerHTML = filtered.map(p => `
      <article class="project-card reveal">
        <div class="project-card__img">
          <i class="icon-${p.icon}"></i>
        </div>
        <div class="project-card__body">
          <span class="project-card__category">${categoryLabels[p.category] || p.category}</span>
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.description}</p>
          ${p.result ? `<p class="project-card__result">${p.result}</p>` : ''}
          <div class="project-card__tags">
            ${p.technologies.map(t => `<span class="project-card__tag">${t}</span>`).join('')}
          </div>
          <div class="project-card__links">
            ${p.links.repo   ? `<a href="${p.links.repo}" target="_blank" rel="noopener" class="project-card__link"><i class="icon-github"></i> Código</a>` : ''}
            ${p.links.demo   ? `<a href="${p.links.demo}" target="_blank" rel="noopener" class="project-card__link"><i class="icon-external-link"></i> Demo</a>` : ''}
          </div>
        </div>
      </article>
    `).join('');

    // Re-observe new cards
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  renderCards();

  // Filter click handling
  filters.addEventListener('click', e => {
    if (!e.target.classList.contains('filter-btn')) return;
    filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderCards(e.target.dataset.filter);
  });
}

/* ───── SKILLS ───── */
function renderSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  grid.classList.add('reveal-stagger');

  grid.innerHTML = skills.map(group => `
    <div class="skill-group glass">
      <div class="skill-group__icon"><i class="icon-${group.icon}"></i></div>
      <h3 class="skill-group__title">${group.category}</h3>
      <div class="skill-group__items">
        ${group.items.map(item =>
          `<span class="skill-badge" data-level="${item.level}" title="${capitalize(item.level)}">${item.name}</span>`
        ).join('')}
      </div>
    </div>
  `).join('');

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  obs.observe(grid);
}

/* ───── EDUCATION ───── */
function renderEducation(items) {
  const grid = document.getElementById('educationGrid');
  grid.classList.add('reveal-stagger');

  grid.innerHTML = items.map(item => `
    <div class="edu-card glass">
      <div class="edu-card__icon"><i class="icon-${item.icon}"></i></div>
      <div>
        <h3 class="edu-card__title">${item.title}</h3>
        ${item.institution ? `<p class="edu-card__institution">${item.institution}</p>` : ''}
        <span class="edu-card__status">${item.status}</span>
        ${item.period ? `<span class="edu-card__period">${item.period}</span>` : ''}
      </div>
    </div>
  `).join('');

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  obs.observe(grid);
}

/* ───── CERTIFICACIONES ───── */
function renderCertifications(items) {
  const grid = document.getElementById('certsGrid');
  if (!grid || !items) return;
  grid.classList.add('reveal-stagger');

  grid.innerHTML = items.map(item => `
    <div class="cert-card glass">
      <i class="icon-${item.icon} cert-card__icon"></i>
      <div>
        <h4 class="cert-card__title">${item.title}</h4>
        ${item.issuer ? `<p class="cert-card__issuer">${item.issuer}</p>` : ''}
      </div>
    </div>
  `).join('');

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  obs.observe(grid);
}

/* ───── UTILS ───── */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}
