const btnMenu = document.getElementById('btnMenu');
const sideMenu = document.getElementById('sideMenu');

function toggleMenu() {
  const isOpen = sideMenu.classList.toggle('open');
  btnMenu.classList.toggle('open', isOpen);
  btnMenu.setAttribute('aria-expanded', isOpen);

  if (isOpen) {
    sideMenu.removeAttribute('hidden');
  } else {
    sideMenu.setAttribute('hidden', '');
  }
}

btnMenu.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

document.addEventListener('click', () => {
  if (sideMenu.classList.contains('open')) {
    toggleMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
    toggleMenu();
    btnMenu.focus();
  }
});
