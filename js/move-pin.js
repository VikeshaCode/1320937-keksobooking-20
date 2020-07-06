'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapMainPin = document.querySelector('.map__pin--main');
  var offerForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters');
  var allMapInputFilters = mapFilters.querySelectorAll('select, fieldset');
  var allOffersFieldsets = offerForm.querySelectorAll('fieldset');

  // Перемещение главной метки по карте
  var setMainPinDragAndDropHandlers = function () {
    mapMainPin.addEventListener('mousedown', function (evt) {
      if (!offerForm.classList.contains('ad-form--disabled')) {
        evt.preventDefault();
        var startCoords = {
          x: evt.clientX,
          y: evt.clientY
        };

        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();

          var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: startCoords.y - moveEvt.clientY
          };

          startCoords = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };

          mapMainPin.style.top = (mapMainPin.offsetTop - shift.y) + 'px';
          mapMainPin.style.left = (mapMainPin.offsetLeft - shift.x) + 'px';
        };

        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();
          window.form.setAddress();
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    });
  };

  // Активирует сайт
  var activate = function () {
    map.classList.remove('map--faded');
    offerForm.classList.remove('ad-form--disabled');
    window.form.disable(allOffersFieldsets, false);
    window.form.disable(allMapInputFilters, false);
    window.map.fillPins(window.data);
  };

  // Активирует сайт при взаимодействии с главной меткой
  var setMainPinActivateHandlers = function () {
    mapMainPin.addEventListener('mousedown', function (evt) {
      if (evt.button === 0) {
        activate();
        window.form.setAddress();
      }
    });
  };

  mapMainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      activate();
      window.form.setAddress();
    }
  });

  var setMainPinBehavior = function () {
    // Активируем страницу с помощью главной метки
    setMainPinActivateHandlers();
    // Задаём возможность перетаскивания главной метки
    setMainPinDragAndDropHandlers();
  };

  setMainPinBehavior();
})();
