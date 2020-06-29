'use strict';
(function () {

  var mapPinsContainer = document.querySelector('.map .map__pins');

  // Заполняет карту пинами
  window.map = {
    fillPins: function (offers) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < offers.length; i++) {
        var pin = window.pin.createPin(offers[i]);
        fragment.appendChild(pin);
      }
      mapPinsContainer.appendChild(fragment);
    }
  };
})();
