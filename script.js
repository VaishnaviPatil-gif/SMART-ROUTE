"use strict";
const sectionOrder = ['section-home', 'section-profile', 'section-alerts', 'section-parking', 'section-about'];
const sectionMap = {
    '#home': 'section-home',
    '#profile': 'section-profile',
    '#alerts': 'section-alerts',
    '#about': 'section-about',
    '#parking': 'section-parking'
};
function getActiveSection() {
    const activeSection = document.querySelector('.section.active');
    return (activeSection?.id) || 'section-home';
}
function setActiveSection(sectionId) {
    document.querySelectorAll('.section').forEach((section) => {
        section.classList.toggle('active', section.id === sectionId);
    });
    document.querySelectorAll('header nav a').forEach((link) => {
        const targetSection = sectionMap[link.getAttribute('href') || ''];
        link.classList.toggle('active', targetSection === sectionId);
    });
    if (sectionId === 'section-home' && window.map && typeof window.map.invalidateSize === 'function') {
        window.setTimeout(() => window.map.invalidateSize(), 200);
    }
}
function goBack() {
    const currentSection = getActiveSection();
    const currentIndex = sectionOrder.indexOf(currentSection);
    if (currentIndex <= 0) {
        setActiveSection('section-home');
        return;
    }
    setActiveSection(sectionOrder[currentIndex - 1]);
}
function registerSectionHistory() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    document.addEventListener('click', (event) => {
        const target = event.target;
        const navLink = target?.closest('header nav a');
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