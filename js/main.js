'use strict';

var HOUSE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');

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
          Math.round(Math.random() * features.length),
          Math.round(Math.random() * features.length)),
      description: 'Oписание ' + x,
      photos: PHOTOS.slice(
          Math.round(Math.random() * photos.length),
          Math.round(Math.random() * photos.length)),
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

var data = generateArray();

document.querySelector('.map').classList.remove('map--faded');

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

  var img = element.firstElementChild;
  img.src = currentDatum.author.avatar;
  img.alt = currentDatum.offer.title;
  fragment.appendChild(element);
}
pins.appendChild(fragment);


