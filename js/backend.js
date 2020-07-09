'use strict';

(function () {
  window.backend = {
    // Загрузка данных на сервер
    save: function (data, successHandler, errorHandler) {
      var URL = 'https://javascript.pages.academy/keksobooking';

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        successHandler(xhr.response);
        if (xhr.status === 200) {
          successHandler(xhr.response);
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.open('POST', URL);
      xhr.send(data);
    },
    // Получение данных с сервера
    load: function (successHandler, errorHandler) {
      var URL = 'https://javascript.pages.academy/keksobooking/data';
      var statusCode = {
        OK: 200,
      };
      var TIMEOUT_IN_MS = 10000;

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('GET', URL);

      xhr.addEventListener('load', function () {
        if (xhr.status === statusCode.OK) {
          successHandler(xhr.response);
        } else {
          errorHandler('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });


      xhr.addEventListener('error', function () {
        errorHandler('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT_IN_MS;

      xhr.open('GET', URL);
      xhr.send();
    }
  };
})();
