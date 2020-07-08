'use strict';

(function () {
  window.backend = {
    // Загрузка данных на сервер
    save: function (data, onSuccess, onError) {
      var URL = 'https://javascript.pages.academy/keksobooking';

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onSuccess(xhr.response);
        if (xhr.status === 200) {
          onSuccess(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.open('POST', URL);
      xhr.send(data);
    },
    // Получение данных с сервера
    load: function (onSuccess, onError) {
      var URL = 'https://javascript.pages.academy/keksobooking/data';
      var StatusCode = {
        OK: 200,
      };
      var TIMEOUT_IN_MS = 10000;

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('GET', URL);

      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          onSuccess(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT_IN_MS;

      xhr.open('GET', URL);
      xhr.send();
    }
  };
})();
