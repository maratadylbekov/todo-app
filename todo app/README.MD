# Todo App

Минималистичное веб-приложение для управления задачами с фильтрацией, сортировкой и сохранением данных.

---

## 🚀 Demo

👉 https://zesty-lily-e58b6a.netlify.app/

---

## 📸 Preview

https://prnt.sc/Agcx5t0b5o1O
https://prnt.sc/z-fEkIjXUIYT

---

## ⚙️ Features

- Добавление и удаление задач
- Редактирование задачи (inline)
- Отметка выполнения (checkbox)
- Фильтры:
  - Все
  - Активные
  - Выполненные
- Сортировка:
  - По дате (asc / desc)
  - По приоритету (low / medium / high)
- Приоритет задач (изменяется в UI)
- Очистка выполненных задач
- Сохранение данных в localStorage
- Пустое состояние (empty state)
- Счетчики задач (all / active / completed)

---

## 🧠 Logic & Architecture

- Централизованное состояние (`state`)
- Разделение:
  - state (данные)
  - render (UI)
  - handlers (события)
- Пайплайн обработки:

```js
filter → sort → render
```
