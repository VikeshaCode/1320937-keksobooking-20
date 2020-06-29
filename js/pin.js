'use strict';
(function () {

  var map = document.querySelector('.map');
  var mapMainPin = document.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 84;
  var templateMapPin = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    createPin: function (offer) {
      var element = templateMapPin.cloneNode(true);
      element.style.left = offer.location.x + (MAP_PIN_MAIN_WIDTH / 2) + 'px';
      element.style.top = offer.location.y + (MAP_PIN_MAIN_HEIGHT / 2) + 'px';
      element.style.transform = 'translate(-50%, -100%)';
      var img = element.firstElementChild;
      img.src = offer.author.avatar;
      img.alt = offer.offer.title;
      element.addEventListener('click', function () {
        window.card.fillOfferCard(offer);
      });
      return element;
    },

    // Определение координаты главной метки
    getPinCoords: function () {
      var coords = {};
      if (map.classList.contains('map--hidden')) {
        coords.x = mapMainPin.offsetLeft + MAP_PIN_MAIN_WIDTH / 2;
        coords.y = mapMainPin.offsetTop + MAP_PIN_MAIN_WIDTH / 2;
      } else {
        coords.x = mapMainPin.offsetLeft + MAP_PIN_MAIN_WIDTH / 2;
        coords.y = mapMainPin.offsetTop + MAP_PIN_MAIN_HEIGHT;
      }
      return coords;
    }
  };
})();
