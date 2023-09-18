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

адмін панель (GET /admin):

1. таблиця усіх оголошень
2. таблиця усіх користувачів
таблиця оголошень:
   1. id
   2. shortDescription
   3. price
   4. createdAt
   5. spokenLanguages
   6. teachingLanguages
   7. imagePath (imagePathes)
   8. hobbies
   9. userId (or user)
   10. Кнопка "Edit advert"
   11. Кнопка "Delete advert"

кнопка "Edit Advert" (POST /admin/adverts/:id):
   1. shortDescription
   2. price
   3. spokenLanguages
   4. teachingLanguages
   5. imagePath (imagePathes)
   6. hobbies
   example:
      POST /admin/adverts/5
      body: {
      "shortDescription": "the best promotion",
      "price": 50,
      "imagePath": "images/image889.jpg",
      "hobbies": [{"hobby":"run"},{"hobby":"develop"},{"hobby":"swim"},{"hobby":"дивитись на мертвих москалів"}],
      "spokenLanguages":[{"language":"english"},{"language":"polski"},{"language":"ukrainian"}],
      "teachingLanguages":[{"language":"polski"},{"language":"english"}]
      }

кнопка "Delete advert" (DELETE admin/adverts/:id)

таблиця користувачів:
   1. id
   2. firstName
   3. lastName
   4. registeredAt
   5. hobbies
   6. motherland
   7. pathToPhoto
   8. advertId (or NULL if advert is null)
   9. Кнопка "Edit user info"
   10. Кнопка "Delete user"

кнопка "Edit user info" (POST /admin/users/:id):
   1. firstName
   2. lastName
   3. hobbies
   4. motherland
   5. pathToPhoto
   example:
      POST /admin/users/2
      body: {
      "firstName": "Stepan",
      "lastName": "Bandera",
      "hobbies": [{"hobby":"run"},{"hobby":"різати русню"}],
      "motherland":"Ukraine",
      "pathToPhoto":"/images/photoBandera.jpg"
      }
      
кнопка "Delete user" (DELETE admin/users/:id)