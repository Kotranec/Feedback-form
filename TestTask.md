## Тестовое задание

### Использовать технологии

<img align="left" alt="React" width="50px" title="React" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" />
<img align="left" alt="Typescript" width="50px" title="Typescript" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" />
<img align="left" alt="Webpack" width="50px" title="Webpack" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/webpack/webpack.png" />
<img align="left" alt="SASS" width="50px" title="SASS" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/sass/sass.png" />
<img align="left" alt="Git" width="50px" title="Git" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />

```

```

### Задание

```
Реализовать форму обратной связи со следующими полями:
    •	Имя Фамилия
    •	E-mail
    •	Номер телефона (с маской российского номера)
    •	Дата рождения
    •	Сообщение

Требования к форме:
    •	Валидация
        o	Поле “Имя Фамилия” может состоять только из 2-х слов (имя и фамилия) латинского алфавита.
                Минимальная длина каждого слова 3 символа, максимальная 30.
                Между словами может быть только 1 пробел.
                При вводе символы должны приводиться в верхний регистр.
        o	E-mail должен быть корректным (должна быть отключена браузерная валидация).
        o	Для номера телефона использовать маску Российского номера.
        o	Дата рождения вводиться через календарь.
        o	Поле “Сообщение” имеет минимальную длину в 10 символов и максимальную в 300.

    •	Отправка формы
        o	Отправка происходит ajax запросом на сервер.
                В ответе должен прийти json с 2-мя возможными статусами: error/success и текстом ошибки/”успешной отправки”.
                Ответ необходимо обработать на фронте и вывести соответствующее сообщение под формой.
        o	Пока не пришел ответ с сервера, форму нельзя отправить повторно.
        o	В случае успешного ответа с сервера, очистить все поля формы.

Вся валидация должны быть написана самостоятельно, без использования сторонних библиотек.
Поля формы необходимо валидировать во время ввода и перед отправкой на сервер.
Если поле не проходит валидацию, выводить соответствующее сообщение под полем.
Код должен быть залит в удаленный, публичный репозиторий.
```
