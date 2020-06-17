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

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var addressField = adForm.querySelector('#address');
var mapFilters = document.querySelector('.map__filters');
var formFieldsets = adForm.querySelectorAll('fieldset');
var mapFiltersInputs = mapFilters.querySelectorAll('select, fieldset');
var mapPinMain = document.querySelector('.map__pin--main');
var MAP_PIN_MAIN_WIDTH = 65;
var MAP_PIN_MAIN_HEIGHT = 84;

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

var getRandomNumber = function (maxNumber) {
  return Math.round(Math.random() * maxNumber);
};

var generateObject = function (x) {
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
      x: getRandomNumber(map.getBoundingClientRect().width),
      y: getRandomNumber(500) + 130,
    }
  };
  object.offer.address = object.location.x + ', ' + object.location.y;
  return object;
};
var generateArray = function () {
  var array = [];
  for (var i = 0; i < 8; i++) {
    var obj = generateObject(i + 1);
    array[i] = obj;
  }
  return array;
};

// Заполняет карту пинами
var fillPins = function (data) {
  var pins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var pin = document.querySelector('#pin')
    .content
    .querySelector('button');

  for (var i = 0; i < data.length; i++) {
    var currentDatum = data[i];
    var element = pin.cloneNode(true);
    element.style.left = currentDatum.location.x + (pin.getBoundingClientRect().width / 2) + 'px';
    element.style.top = currentDatum.location.y + (pin.getBoundingClientRect().height / 2) + 'px';
    element.style.transform = 'translate(-50%, -100%)';

    var img = element.firstElementChild;
    img.src = currentDatum.author.avatar;
    img.alt = currentDatum.offer.title;
    fragment.appendChild(element);
  }
  pins.appendChild(fragment);
};

// Заполняет карточку объявления
var fillAdvertCard = function (cardData, template) {
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

  fillElementText(popupTitle, cardData.offer.title);
  fillElementText(popupAddress, cardData.offer.address);
  fillElementText(popupPrice, cardData.offer.price ? cardData.offer.price + ' ₽/ночь' : '');
  fillElementText(popupType, HOUSE_TYPES_MAPPING[cardData.offer.type]);
  fillElementText(popupDescription, cardData.offer.description);

  if (cardData.offer.rooms && cardData.offer.guests) {
    var roomStr = cardData.offer.rooms + ' ' + toNounString(cardData.offer.rooms, ['комната', 'комнаты', 'комнат']);
    var guestStr = 'для ' + cardData.offer.guests + ' ' + toNounString(cardData.offer.guests, ['гостя', 'гостей', 'гостей']);
    popupCapacity.textContent = roomStr + ' ' + guestStr;
  } else {
    popupCapacity.remove();
  }

  if (cardData.offer.checkin && cardData.offer.checkout) {
    popupTime.textContent = 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout;
  } else {
    popupTime.remove();
  }

  if (cardData.author.avatar) {
    popupAvatar.src = cardData.author.avatar;
  } else {
    popupAvatar.remove();
  }

  // Список удобств
  if (cardData.offer.features.length) {
    var featuresFragment = document.createDocumentFragment();
    for (var k = 0; k < cardData.offer.features.length; k++) {
      var featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature');
      featureItem.classList.add('popup__feature--' + cardData.offer.features[k]);
      featuresFragment.appendChild(featureItem);
    }
    popupFeatures.innerHTML = '';
    popupFeatures.appendChild(featuresFragment);
  } else {
    popupFeatures.remove();
  }

  // Список фотографий
  if (cardData.offer.photos.length) {
    var photosFragment = document.createDocumentFragment();
    for (var j = 0; j < cardData.offer.photos.length; j++) {
      var currentPhotoItem = photoItem.cloneNode(true);
      currentPhotoItem.src = cardData.offer.photos[j];
      photosFragment.appendChild(currentPhotoItem);
    }
    popupPhotos.innerHTML = '';
    popupPhotos.appendChild(photosFragment);
  } else {
    popupPhotos.remove();
  }
};

var advertsData = generateArray();
//
// var firstAdvertData = data[0];
// var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
// var mapCard = cardTemplate.cloneNode(true);
// fillAdvertCard(firstAdvertData, mapCard);

// var mapPins = document.querySelector('.map .map__pins');
// mapPins.insertAdjacentElement('afterend', mapCard);

// Блокирует или активирует поля формы
var disable = function (elements, state) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', state);
  }
};

disable(formFieldsets, 'true');
disable(mapFiltersInputs, 'true');

// Определение координаты главной метки
var getPinCoords = function () {
  var coords = {};
  if (map.classList.contains('map--hidden')) {
    coords.x = mapPinMain.offsetLeft + MAP_PIN_MAIN_WIDTH / 2;
    coords.y = mapPinMain.offsetTop + MAP_PIN_MAIN_WIDTH / 2;
  } else {
    coords.x = mapPinMain.offsetLeft + MAP_PIN_MAIN_WIDTH / 2;
    coords.y = mapPinMain.offsetTop + MAP_PIN_MAIN_HEIGHT;
  }
  return coords;
};

// Устанавливает значение в поле адреса
var setAddress = function () {
  var address = getPinCoords();
  addressField.value = address.x + ', ' + address.y;
};

// Активирует сайт
var activate = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  disable(formFieldsets, 'false');
  disable(mapFiltersInputs, 'false');
  fillPins(advertsData);
};

// Активирует сайт при взаимодействии с главной меткой
mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activate();
    setAddress();
  }
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activate();
    setAddress();
  }
});


