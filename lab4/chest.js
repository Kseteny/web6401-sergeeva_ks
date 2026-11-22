const chestButton = document.querySelector('#chest-button');

chestButton.addEventListener('click', () => {
    const isOpen = chestButton.classList.toggle('chest--open');
    chestButton.setAttribute('aria-pressed', String(isOpen));
});
