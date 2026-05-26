type SectionId = 'section-home' | 'section-profile' | 'section-alerts' | 'section-about' | 'section-parking';

// Keep this file as a module to avoid duplicate-global declaration errors when
// the same symbols appear in other scripts. The `export {}` at the bottom
// ensures module scope.

type MapLike = { invalidateSize?: () => void };

const sectionOrder: SectionId[] = ['section-home', 'section-profile', 'section-alerts', 'section-parking', 'section-about'];
const sectionMap: Record<string, SectionId> = {
  '#home': 'section-home',
  '#profile': 'section-profile',
  '#alerts': 'section-alerts',
  '#about': 'section-about',
  '#parking': 'section-parking'
};

function getActiveSection(): SectionId {
  const activeSection = document.querySelector<HTMLElement>('.section.active');
  return (activeSection?.id as SectionId) || 'section-home';
}

function setActiveSection(sectionId: SectionId): void {
  document.querySelectorAll<HTMLElement>('.section').forEach((section) => {
    section.classList.toggle('active', section.id === sectionId);
  });

  document.querySelectorAll<HTMLAnchorElement>('header nav a').forEach((link) => {
    const targetSection = sectionMap[link.getAttribute('href') || ''];
    link.classList.toggle('active', targetSection === sectionId);
  });

  // Safely access a potential `map` property on window.
  const map = (window as any).map as MapLike | undefined;
  if (sectionId === 'section-home' && map && typeof map.invalidateSize === 'function') {
    window.setTimeout(() => map.invalidateSize!(), 200);
  }
}

function goBack(): void {
  // Prefer an in-page section history stack if present
  const historyStack = (window as any)._sectionHistory as SectionId[] | undefined;
  if (historyStack && historyStack.length > 1) {
    historyStack.pop();
    const prev = historyStack[historyStack.length - 1];
    setActiveSection(prev);
    return;
  }

  // Fallback: move to the previous section in the defined order
  const current = getActiveSection();
  const idx = sectionOrder.indexOf(current);
  if (idx > 0) {
    setActiveSection(sectionOrder[idx - 1]);
    return;
  }

  // Final fallback: try browser history then home
  if (window.history && window.history.length > 1) {
    window.history.back();
  } else {
    setActiveSection('section-home');
  }
}

function registerSectionHistory(): void {
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', goBack);
  }

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const navLink = target?.closest('header nav a') as HTMLAnchorElement | null;
    if (!navLink) {
      return;
    }

    const nextSection = sectionMap[navLink.getAttribute('href') || ''];
    if (nextSection) {
      window.setTimeout(() => setActiveSection(nextSection), 0);
    }
  }, true);

  window.addEventListener('hashchange', () => {
    const nextSection = sectionMap[window.location.hash];
    if (nextSection) {
      setActiveSection(nextSection);
    }
  });

  setActiveSection(getActiveSection());
}

document.addEventListener('DOMContentLoaded', registerSectionHistory);

export {};
