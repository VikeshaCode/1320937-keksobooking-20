'use strict';
(function () {

  var MAX_PRICE = '1000000';
  var offerForm = document.querySelector('.ad-form');
  var offerAddressField = offerForm.querySelector('#address');
  var allOffersFieldsets = offerForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var allMapInputFilters = mapFilters.querySelectorAll('select, fieldset');
  var mapCard = null;
  var map = document.querySelector('.map');

  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');
  var errorMessageElement = errorMessageTemplate.cloneNode(true);
  var errorButton = errorMessageElement.querySelector('.error__button');
  var successMessageElement = successMessageTemplate.cloneNode(true);

  window.form = {
    // Блокирует или активирует поля формы
    disable: function (elements, state) {
      for (var i = 0; i < elements.length; i++) {
        if (state) {
          elements[i].setAttribute('disabled', state);
        } else {
          elements[i].removeAttribute('disabled');
        }
      }
    },

    // Устанавливает значение в поле адреса
    setAddress: function () {
      var coords = window.pin.getPinCoords();
      offerAddressField.value = coords.x + ', ' + coords.y;
    }
  };

  // Выключаем все инпуты формы объявления при загрузке
  window.form.disable(allOffersFieldsets, true);
  window.form.disable(allMapInputFilters, true);

  var typeField = offerForm.querySelector('#type');
  var priceField = offerForm.querySelector('#price');
  var timeinField = offerForm.querySelector('#timein');
  var timeoutField = offerForm.querySelector('#timeout');
  var roomNumberField = offerForm.querySelector('#room_number');
  var capacityField = offerForm.querySelector('#capacity');
  var titleField = offerForm.querySelector('#title');
  var photoField = offerForm.querySelector('#images');
  var avatarField = offerForm.querySelector('#avatar');


  // Устанавливает минимальное значение цены
  var setMinPriceValue = function (evt) {
    var minPrice = 0;
    var type = evt.target.value;
    switch (type) {
      case 'flat':
        minPrice = 1000;
        break;
      case 'palace':
        minPrice = 10000;
        break;
      case 'bungalo':
        minPrice = 0;
        break;
      case 'house':
        minPrice = 5000;
        break;
    }
    priceField.min = minPrice;
    priceField.placeholder = minPrice;
  };

  // Устаналивет соответствующее время выезда
  var setCheckoutValue = function () {
    for (var i = 0; i < timeoutField.length; i++) {
      if (timeoutField[i].value === timeinField.value) {
        timeoutField[i].selected = true;
      }
    }
  };

  // Устаналивет соответствующее время заезда
  var setCheckinValue = function () {
    for (var i = 0; i < timeinField.length; i++) {
      if (timeinField[i].value === timeoutField.value) {
        timeinField[i].selected = true;
      }
    }
  };

  // Проверяет поле выбора количества гостей на валидность
  var checkCapacity = function () {
    switch (roomNumberField.value) {
      case '1':
        if (capacityField.value === '3' || capacityField.value === '2' || capacityField.value === '0') {
          roomNumberField.setCustomValidity('Только для 1 гостя');
        } else {
          roomNumberField.setCustomValidity('');
        }
        break;

      case '2':
        if (capacityField.value === '3' || capacityField.value === '0') {
          roomNumberField.setCustomValidity('Только для 1-го или 2-х гостей');
        } else {
          roomNumberField.setCustomValidity('');
        }
        break;

      case '3':
        if (capacityField.value === '0') {
          roomNumberField.setCustomValidity('Только для 1-го, 2-х или 3-х гостей');
        } else {
          roomNumberField.setCustomValidity('');
        }
        break;

      case '100':
        if (capacityField.value !== '0') {
          roomNumberField.setCustomValidity('Не для гостей');
        } else {
          roomNumberField.setCustomValidity('');
        }
        break;
    }
  };

  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      if (mapCard) {
        mapCard.remove();
      }
    }
  });

  // Валидация поля с заголовком объявления
  var MIN_NAME_LENGTH = 30;
  var MAX_NAME_LENGTH = 100;

  titleField.addEventListener('invalid', function () {
    if (titleField.validity.valueMissing) {
      titleField.setCustomValidity('Обязательное поле');
    } else {
      titleField.setCustomValidity('');
    }
  });

  titleField.addEventListener('input', function () {
    var valueLength = titleField.value.length;
    if (valueLength < MIN_NAME_LENGTH) {
      titleField.setCustomValidity('Ещё ' + (MIN_NAME_LENGTH - valueLength) + ' симв.');
    } else if (valueLength > MAX_NAME_LENGTH) {
      titleField.setCustomValidity('Удалите лишние ' + (valueLength - MAX_NAME_LENGTH) + ' симв.');
    } else {
      titleField.setCustomValidity('');
    }
  });

  // Валидация поля с ценой за ночь
  priceField.addEventListener('invalid', function () {
    if (priceField.validity.valueMissing) {
      priceField.setCustomValidity('Обязательное поле');
    } else {
      titleField.setCustomValidity('');
    }
  });

  priceField.addEventListener('input', function () {
    if (priceField.value > MAX_PRICE) {
      priceField.setCustomValidity('Максимальная цена не может превышать 1 000 000');
    } else {
      priceField.setCustomValidity('');
    }
  });

  // Валидация поля с фотографией пользователя
  avatarField.addEventListener('change', function (evt) {
    if (evt.target.files[0].type !== 'image/jpeg' && evt.target.files[0].type !== 'image/png') {
      evt.target.setCustomValidity('Аватар может быть только изображением в формате jpg или png');
    }
  });

  // Валидация поля с фотографией жилья
  photoField.addEventListener('change', function (evt) {
    for (var i = 0; i < evt.target.files.length; i++) {
      if (evt.target.files[i].type !== 'image/jpeg' && evt.target.files[i].type !== 'image/png') {
        evt.target.setCustomValidity('Фотографии могут быть только изображениями в формате jpg или png');
      }
    }
  });

  // При изменении значения поля выбора количества гостей проверяем его на валидность
  capacityField.addEventListener('change', function () {
    checkCapacity();
  });

  // При изменени количества комнат, устанавливаем разрешённые варианты выбора количества гостей, проверяем его на валидность
  roomNumberField.addEventListener('change', function () {
    checkCapacity();
  });

  // При изменении времени заезда, устанавливаем новое время выезда
  timeinField.addEventListener('change', function () {
    setCheckoutValue();
  });

  // При изменении времени выезда, устанавливаем новое время заезда
  timeoutField.addEventListener('change', function () {
    setCheckinValue();
  });

  // Валидация поля с типом жилья
  typeField.addEventListener('change', setMinPriceValue);

  // При изменени количества комнат, устанавливаем разрешённые варианты выбора количества гостей
  roomNumberField.addEventListener('change', function () {
    checkCapacity();
  });

  // Выводит сообщение об успешной отправке данных
  var successHandler = function () {
    var pins = map.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
    offerForm.classList.add('ad-form--disabled');
    offerForm.reset();
    main.appendChild(successMessageElement);
    document.addEventListener('keydown', successMessageKeydownHandler);
    document.addEventListener('click', successMessageClickHandler);
  };

  // Показывает сообщение об ошибке при отправке данных
  var errorHandler = function () {
    main.appendChild(errorMessageElement);
    document.addEventListener('keydown', errorMessageKeydownHandler);
    document.addEventListener('click', errorMessageClickHandler);
    errorButton.addEventListener('click', errorButtonClickHandler);
  };

  // Исчезновение сообщения при нажатии на Esc
  var successMessageKeydownHandler = function (evt) {
    if (evt.key === 'Escape') {
      successMessageElement.remove();
      document.removeEventListener('keydown', successMessageKeydownHandler);
    }
  };

  // Исчезновение сообщения по клику
  var successMessageClickHandler = function () {
    successMessageElement.remove();
    document.removeEventListener('click', successMessageClickHandler);
  };

  // Исчезновение сообщения при нажатии на Esc
  var errorMessageKeydownHandler = function (evt) {
    if (evt.key === 'Escape') {
      errorMessageElement.remove();
      document.removeEventListener('keydown', errorMessageKeydownHandler);
    }
  };

  // Исчезновение сообщения по клику
  var errorMessageClickHandler = function () {
    errorMessageElement.remove();
    document.removeEventListener('click', errorMessageKeydownHandler);
  };

  // Исчезновение сообщения по клику на кнопку
  var errorButtonClickHandler = function () {
    errorMessageElement.remove();
    errorButton.removeEventListener('click', errorMessageKeydownHandler);
  };

  offerForm.addEventListener('submit', function (evt) {
    checkCapacity();
    evt.preventDefault();
    window.backend.save(new FormData(offerForm), successHandler, errorHandler);
  });
})();
