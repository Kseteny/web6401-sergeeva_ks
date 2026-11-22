class HeroRecord {
    constructor(nickname, level, consent) {
        this.nickname = nickname;
        this.level = level;
        this.consent = consent;
    }

    printToConsole() {
        console.table({
            'Имя или прозвище': this.nickname,
            'Уровень героя': this.level,
            'Согласие на отправку': this.consent ? 'Да' : 'Нет',
        });
    }
}

const form = document.querySelector('.hero-form');
const statusMessage = document.querySelector('#hero-status');
const submitButton = form.querySelector('.hero-form__submit');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fields = new FormData(form);
    const hero = new HeroRecord(
        fields.get('nickname').trim(),
        Number(fields.get('level')),
        fields.get('consent') === 'yes',
    );

    hero.printToConsole();

    submitButton.disabled = true;
    statusMessage.textContent = 'Отправляем анкету…';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new URLSearchParams(fields),
        });

        statusMessage.textContent = await response.text();
    } catch {
        statusMessage.textContent = 'Не удалось отправить анкету. Проверь, запущен ли сервер.';
    } finally {
        submitButton.disabled = false;
    }
});
