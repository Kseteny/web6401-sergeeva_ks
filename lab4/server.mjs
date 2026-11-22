import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
    ['/', ['index.html', 'text/html']],
    ['/index.html', ['index.html', 'text/html']],
    ['/bestiary.html', ['bestiary.html', 'text/html']],
    ['/advice.html', ['advice.html', 'text/html']],
    ['/hero.html', ['hero.html', 'text/html']],
    ['/style.css', ['style.css', 'text/css']],
    ['/chest.js', ['chest.js', 'text/javascript']],
    ['/hero.js', ['hero.js', 'text/javascript']],
    ['/images/sword.svg', ['images/sword.svg', 'image/svg+xml']],
]);

const server = createServer(async (request, response) => {
    const { pathname } = new URL(request.url, 'http://localhost');

    if (request.method === 'POST' && pathname === '/api/heroes') {
        request.setEncoding('utf8');
        let body = '';

        for await (const chunk of request) {
            body += chunk;
        }

        const fields = new URLSearchParams(body);
        const nickname = (fields.get('nickname') ?? '').trim();
        const level = Number(fields.get('level'));
        const consent = fields.get('consent') === 'yes';

        const isValid = nickname.length > 0 && nickname.length <= 50
            && Number.isInteger(level) && level >= 1 && level <= 100
            && consent;

        response.writeHead(isValid ? 200 : 400, {
            'Content-Type': 'text/plain; charset=utf-8',
        });
        response.end(isValid ? 'Анкета героя получена.' : 'Проверь поля анкеты.');
        return;
    }

    const file = files.get(pathname);

    if (request.method !== 'GET' || !file) {
        response.writeHead(404).end();
        return;
    }

    const [filename, contentType] = file;

    try {
        const content = await readFile(new URL(filename, import.meta.url));
        response.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
        response.end(content);
    } catch {
        response.writeHead(404).end();
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Сайт запущен: http://127.0.0.1:3000');
});
