var houseType = ['palace', 'flat', 'house', 'bungalo'];
var time = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');

var generateObject = function (x) {
  var object = {
    author: {
      avatar: 'img/avatars/user0' + x + '.png'
    },
    offer: {
      title: 'Предложение ' + x,
      price: Math.round(Math.random() * 1000),
      type: houseType[Math.round(Math.random() * 3)],
      rooms: Math.round(Math.random() * 5),
      guests: Math.round(Math.random() * 6),
      checkin: time[Math.round(Math.random() * 2)],
      checkout: time[Math.round(Math.random() * 2)],
      features: features.slice(
          Math.round(Math.random() * features.length),
          Math.round(Math.random() * features.length)),
      description: 'Oписание ' + x,
      photos: photos.slice(
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

