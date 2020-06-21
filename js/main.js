'use strict';

var toNounString = function (number, titles) {
  number = number % 100;
  var number1 = number % 10;
  if (number > 10 && number < 20) {
    return titles[2];
  }
  if (number1 > 1 && number1 < 5) {
    return titles[1];
  }
  if (number1 === 1) {
    return titles[0];
  }
  return titles[2];
};
var getRandomNumber = function (maxNumber) {
  return Math.round(Math.random() * maxNumber);
};

/*
 * Элементы страницы
 */
var MAP = document.querySelector('.map'); // Offers map
var MAP_FILTERS = document.querySelector('.map__filters');
var MAP_MAIN_PIN = document.querySelector('.map__pin--main');
var MAP_PIN_MAIN_WIDTH = 65;
var MAP_PIN_MAIN_HEIGHT = 84;
var MAP_PINS_CONTAINER = document.querySelector('.map .map__pins');

var OFFER_FORM = document.querySelector('.ad-form'); // Offer's form
var OFFER_ADDRESS_FIELD = OFFER_FORM.querySelector('#address');

var ALL_OFFERS_FIELDSETS = OFFER_FORM.querySelectorAll('fieldset');
var ALL_MAP_INPUT_FILTERS = MAP_FILTERS.querySelectorAll('select, fieldset');

var TEMPLATE_MAP_PIN = document.querySelector('#pin').content.querySelector('.map__pin');
var TEMPLATE_CARD = document.querySelector('#card').content.querySelector('.map__card');
var mapCard = null;

var HOUSE_TYPES_MAPPING = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var HOUSE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Generates single offer object
var generateOffer = function (x) {
  var object = {
    author: {
      avatar: 'img/avatars/user0' + x + '.png'
    },
    offer: {
      title: 'Предложение ' + x,
      price: getRandomNumber(1000),
      type: HOUSE_TYPES[getRandomNumber(HOUSE_TYPES.length)],
      rooms: getRandomNumber(5),
      guests: getRandomNumber(6),
      checkin: TIMES[getRandomNumber(TIMES.length)],
      checkout: TIMES[getRandomNumber(TIMES.length)],
      features: FEATURES.slice(
        getRandomNumber(FEATURES.length),
        getRandomNumber(FEATURES.length)),
      description: 'Oписание ' + x,
      photos: PHOTOS.slice(
        getRandomNumber(PHOTOS.length),
        getRandomNumber(PHOTOS.length)),
    },
    location: {
      x: getRandomNumber(MAP.getBoundingClientRect().width),
      y: getRandomNumber(500) + 130,
    }
  };
  object.offer.address = object.location.x + ', ' + object.location.y;
  return object;
};
// Generates array of offer objects
var generateOffers = function () {
  var array = [];
  for (var i = 0; i < 8; i++) {
    array[i] = generateOffer(i + 1);
  }
  return array;
};

var createPin = function (offer) {
  var element = TEMPLATE_MAP_PIN.cloneNode(true);
  element.style.left = offer.location.x + (MAP_PIN_MAIN_WIDTH / 2) + 'px';
  element.style.top = offer.location.y + (MAP_PIN_MAIN_HEIGHT / 2) + 'px';
  element.style.transform = 'translate(-50%, -100%)';
  var img = element.firstElementChild;
  img.src = offer.author.avatar;
  img.alt = offer.offer.title;
  element.addEventListener('click', function () {
    fillOfferCard(offer);
  });
  element.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      fillOfferCard(offer);
    }
  });
  return element;
};

// Заполняет карту пинами
var fillPins = function (offers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    var pin = createPin(offers[i]);
    fragment.appendChild(pin);
  }
  MAP_PINS_CONTAINER.appendChild(fragment);
};
// Заполняет карточку объявления
var fillOfferCard = function (offer) {
  var template = TEMPLATE_CARD.cloneNode(true);
  var popupTitle = template.querySelector('.popup__title');
  var popupAddress = template.querySelector('.popup__text--address');
  var popupPrice = template.querySelector('.popup__text--price');
  var popupType = template.querySelector('.popup__type');
  var popupCapacity = template.querySelector('.popup__text--capacity');
  var popupTime = template.querySelector('.popup__text--time');
  var popupFeatures = template.querySelector('.popup__features');
  var popupDescription = template.querySelector('.popup__description');
  var popupPhotos = template.querySelector('.popup__photos');
  var photoItem = popupPhotos.querySelector('.popup__photo');
  var popupAvatar = template.querySelector('.popup__avatar');

  var fillElementText = function (el, text) {
    if (text) {
      el.textContent = text;
    } else {
      el.remove();
    }
  };

  fillElementText(popupTitle, offer.offer.title);
  fillElementText(popupAddress, offer.offer.address);
  fillElementText(popupPrice, offer.offer.price ? offer.offer.price + ' ₽/ночь' : '');
  fillElementText(popupType, HOUSE_TYPES_MAPPING[offer.offer.type]);
  fillElementText(popupDescription, offer.offer.description);

  if (offer.offer.rooms && offer.offer.guests) {
    var roomStr = offer.offer.rooms + ' ' + toNounString(offer.offer.rooms, ['комната', 'комнаты', 'комнат']);
    var guestStr = 'для ' + offer.offer.guests + ' ' + toNounString(offer.offer.guests, ['гостя', 'гостей', 'гостей']);
    popupCapacity.textContent = roomStr + ' ' + guestStr;
  } else {
    popupCapacity.remove();
  }

  if (offer.offer.checkin && offer.offer.checkout) {
    popupTime.textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  } else {
    popupTime.remove();
  }

  if (offer.author.avatar) {
    popupAvatar.src = offer.author.avatar;
  } else {
    popupAvatar.remove();
  }

  // Список удобств
  if (offer.offer.features.length) {
    var featuresFragment = document.createDocumentFragment();
    for (var k = 0; k < offer.offer.features.length; k++) {
      var featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature');
      featureItem.classList.add('popup__feature--' + offer.offer.features[k]);
      featuresFragment.appendChild(featureItem);
    }
    popupFeatures.innerHTML = '';
    popupFeatures.appendChild(featuresFragment);
  } else {
    popupFeatures.remove();
  }

  // Список фотографий
  if (offer.offer.photos.length) {
    var photosFragment = document.createDocumentFragment();
    for (var j = 0; j < offer.offer.photos.length; j++) {
      var currentPhotoItem = photoItem.cloneNode(true);
      currentPhotoItem.src = offer.offer.photos[j];
      photosFragment.appendChild(currentPhotoItem);
    }
    popupPhotos.innerHTML = '';
    popupPhotos.appendChild(photosFragment);
  } else {
    popupPhotos.remove();
  }
  if (mapCard) {
    mapCard.remove();
  }

  var closeButton = template.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    template.remove();
  });

  mapCard = template;
  MAP_PINS_CONTAINER.insertAdjacentElement('afterend', mapCard);
};
// Генерируем массив объявлений
var offersArray = generateOffers();

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
disable(ALL_OFFERS_FIELDSETS, true);
disable(ALL_MAP_INPUT_FILTERS, true);

// Определение координаты главной метки
var getPinCoords = function () {
  var coords = {};
  if (MAP.classList.contains('map--hidden')) {
    coords.x = MAP_MAIN_PIN.offsetLeft + MAP_PIN_MAIN_WIDTH / 2;
    coords.y = MAP_MAIN_PIN.offsetTop + MAP_PIN_MAIN_WIDTH / 2;
  } else {
    coords.x = MAP_MAIN_PIN.offsetLeft + MAP_PIN_MAIN_WIDTH / 2;
    coords.y = MAP_MAIN_PIN.offsetTop + MAP_PIN_MAIN_HEIGHT;
  }
  return coords;
};

// Устанавливает значение в поле адреса
var setAddress = function () {
  var address = getPinCoords();
  OFFER_ADDRESS_FIELD.value = address.x + ', ' + address.y;
};

// Активирует сайт
var activate = function () {
  MAP.classList.remove('map--faded');
  OFFER_FORM.classList.remove('ad-form--disabled');
  disable(ALL_OFFERS_FIELDSETS, false);
  disable(ALL_MAP_INPUT_FILTERS, false);
  fillPins(offersArray);
};

// // Активирует сайт при взаимодействии с главной меткой
MAP_MAIN_PIN.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activate();
    setAddress();
  }
});

MAP_MAIN_PIN.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activate();
    setAddress();
  }
});

var typeField = OFFER_FORM.querySelector('#type');
var priceField = OFFER_FORM.querySelector('#price');
var timeinField = OFFER_FORM.querySelector('#timein');
var timeoutField = OFFER_FORM.querySelector('#timeout');
var roomNumberField = OFFER_FORM.querySelector('#room_number');
var capacityField = OFFER_FORM.querySelector('#capacity');
var titleField = OFFER_FORM.querySelector('#title');
var photoField = OFFER_FORM.querySelector('#images');
var avatarField = OFFER_FORM.querySelector('#avatar');


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

// При изменении типа жилья устанавливает новую минимальную цену
typeField.addEventListener('change', setMinPriceValue);

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
typeField.addEventListener('change', function () {
  setMinPriceValue();
});

// При изменени количества комнат, устанавливаем разрешённые варианты выбора количества гостей
roomNumberField.addEventListener('change', function () {
  checkCapacity();
});

// Дополнительные проверки на валидность при отправке формы
OFFER_FORM.addEventListener('submit', function (evt) {
  evt.preventDefault();
  checkCapacity();
});

