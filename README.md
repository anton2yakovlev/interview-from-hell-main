# Interview From Hell

Текстовая браузерная игра про графического дизайнера, который проходит собеседование в Сбер.
Всё начинается как обычное корпоративное интервью — и постепенно становится странным.

---

## Быстрый старт

### С Docker Compose (рекомендуется)

```bash
# 1. Скопируй .env
cp backend/.env.example backend/.env

# 2. Запусти
docker compose up --build
```

Открой браузер: **http://localhost**

Бэкенд API: **http://localhost:8000/api/health**

---

### Локально без Docker

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Бэкенд запущен на http://localhost:8000

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Фронтенд запущен на http://localhost:5173

Vite автоматически проксирует `/api` → `http://localhost:8000`.

---

## Структура проекта

```
interview-from-hell/
├── backend/
│   ├── app/
│   │   ├── api/routes.py        # HTTP endpoints
│   │   ├── data/story.py        # Сценарий игры
│   │   ├── schemas/game.py      # Pydantic-схемы
│   │   ├── services/game_service.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/gameApi.ts
│   │   ├── components/
│   │   ├── hooks/useGameState.ts
│   │   ├── pages/
│   │   └── types/game.ts
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── CLAUDE.md
```

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Проверка работоспособности |
| GET | `/api/scenes/start` | Начальная сцена |
| GET | `/api/scenes/{id}` | Сцена по ID |
| POST | `/api/scenes/{id}/choose` | Выбор варианта → следующая сцена |

POST body: `{ "choice_id": "c1" }`

## Игровой прогресс

Сохраняется в `localStorage` под ключом `ifh-progress`.
Кнопка «Начать заново» удаляет его и возвращает на первую сцену.
