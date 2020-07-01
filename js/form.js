'use strict';
(function () {

  var mapMainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var offerForm = document.querySelector('.ad-form');
  var offerAddressField = offerForm.querySelector('#address');
  var allOffersFieldsets = offerForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var allMapInputFilters = mapFilters.querySelectorAll('select, fieldset');
  var mapCard = null;

  // Блокирует или активирует поля формы
  var disable = function (elements, state) {
    for (var i = 0; i < elements.length; i++) {
      if (state) {
        elements[i].setAttribute('disabled', state);
      } else {
        elements[i].removeAttribute('disabled');
      }
    }
  };

  // Выключаем все инпуты формы объявления при загрузке
  disable(allOffersFieldsets, true);
  disable(allMapInputFilters, true);

  // Устанавливает значение в поле адреса
  var setAddress = function () {
    var address = window.pin.getPinCoords();
    offerAddressField.value = address.x + ', ' + address.y;
  };

  // Активирует сайт
  var activate = function () {
    map.classList.remove('map--faded');
    offerForm.classList.remove('ad-form--disabled');
    disable(allOffersFieldsets, false);
    disable(allMapInputFilters, false);
    window.map.fillPins(window.data);
  };

  // Активирует сайт при взаимодействии с главной меткой
  mapMainPin.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      activate();
      setAddress();
    }
  });

  mapMainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      activate();
      setAddress();
    }
  });

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
    if (priceField.value > priceField.max) {
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

  // Дополнительные проверки на валидность при отправке формы
  offerForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    checkCapacity();
  });
})();
