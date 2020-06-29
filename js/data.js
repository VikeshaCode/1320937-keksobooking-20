'use strict';
(function () {
  var map = document.querySelector('.map');
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
        price: window.util.getRandomNumber(1000),
        type: HOUSE_TYPES[window.util.getRandomNumber(HOUSE_TYPES.length)],
        rooms: window.util.getRandomNumber(5),
        guests: window.util.getRandomNumber(6),
        checkin: TIMES[window.util.getRandomNumber(TIMES.length)],
        checkout: TIMES[window.util.getRandomNumber(TIMES.length)],
        features: FEATURES.slice(
            window.util.getRandomNumber(FEATURES.length),
            window.util.getRandomNumber(FEATURES.length)),
        description: 'Oписание ' + x,
        photos: PHOTOS.slice(
            window.util.getRandomNumber(PHOTOS.length),
            window.util.getRandomNumber(PHOTOS.length)),
      },
      location: {
        x: window.util.getRandomNumber(map.getBoundingClientRect().width),
        y: window.util.getRandomNumber(500) + 130,
      }
    };
    object.offer.address = object.location.x + ', ' + object.location.y;
    return object;
  };
  // Генерирует массив предлождений
  var generateOffers = function () {
    var array = [];
    for (var i = 0; i < 8; i++) {
      array[i] = generateOffer(i + 1);
    }
    return array;
  };
  // Генерируем массив объявлений
  window.data = generateOffers();
})();

