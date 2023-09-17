особистий кабінет (GET /users/id):

1. аватарка (photo)
2. ім'я (firstName)
3. прізвище (якщо введено lastName)
4. дата народження (або вік вирахуваний між датою народження і сьогоднішнім днем) (Date/number)
5. хобі/захоплення (hobbies: [{hobby:"example"}, {hobby:"new example"}...])
6. Рейтинг (rating відображати тільки якщо advert != null) і кількість проголосованих (ratingCount)
7. Розклад (поки орієнтуємось на дизайн, або взагалі поки що не робимо)

меню особистого кабінету:

1. Редагувати особисті дані (PATCH /users передавати разом з акцес токеном)
2. Редагувати моє оголошення (активне якщо advert != null, PATCH /adverts передавати разом з акцес токеном)
3. Редагувати розклад (активне якщо advert != null, поки як заглушка, потім продумаємо)
4. Повідомлення (messages (роут треба продумати) чи це необхідно зараз? поки під питанням, заглушка)
5. Налаштування (/setings чи це необхідно взагалі? поки під питанням, заглушка)

Створення оголошення (POST /adverts):

1. ціна (price: number)
2. опис оголошення (shortDescription: string)
3. мови якими розмовляє (spokenLanguages: [{language: "english"}, {language: "ukrainian"}])
4. мови яким навчає (teachingLanguages: [{language: "english"}, {language: "ukrainian"}])
5. картинка (шлях до картинки, поки приймаю тільки рядок) (imagePath: string) (потім буде imagePathes: [{path: "images/img1.jpg"},{path: "images/img2.jpg"}])

   example:
   POST /adverts
   body: {
   "shortDescription": "polski jezyk ",
   "price": 33,
   "imagePath": "image889.jpg",
   "hobbies": [{"hobby":58},{"hobby":"develop"},{"hobby":"some new "},{"hobby":"fast run"},{"hobby":"дивитись на мертвих москалів"}],
   "spokenLanguages":[{"language":"polski"},{"language":"ukrainian"}],
   "teachingLanguages":[{"language":"polski"}]
   }
