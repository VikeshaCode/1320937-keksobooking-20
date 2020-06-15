'use strict';

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

var map = document.querySelector('.map');
map.classList.remove('map--faded');


var generateObject = function (x) {
  var object = {
    author: {
      avatar: 'img/avatars/user0' + x + '.png'
    },
    offer: {
      title: 'Предложение ' + x,
      price: Math.round(Math.random() * 1000),
      type: HOUSE_TYPES[Math.round(Math.random() * 3)],
      rooms: Math.round(Math.random() * 5),
      guests: Math.round(Math.random() * 6),
      checkin: TIMES[Math.round(Math.random() * 2)],
      checkout: TIMES[Math.round(Math.random() * 2)],
      features: FEATURES.slice(
          Math.round(Math.random() * FEATURES.length),
          Math.round(Math.random() * FEATURES.length)),
      description: 'Oписание ' + x,
      photos: PHOTOS.slice(
          Math.round(Math.random() * PHOTOS.length),
          Math.round(Math.random() * PHOTOS.length)),
    },
    location: {
      x: Math.round(Math.random() * map.getBoundingClientRect().width),
      y: Math.round(Math.random() * 500) + 130,
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
    popupCapacity.textContent = cardData.offer.rooms + ' комнат для ' + cardData.offer.guests + ' гостей';
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

var data = generateArray();
fillPins(data);

var firstAdvertData = data[0];
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapCard = cardTemplate.cloneNode(true);
fillAdvertCard(firstAdvertData, mapCard);

var mapPins = document.querySelector('.map .map__pins');
mapPins.insertAdjacentElement('afterend', mapCard);
