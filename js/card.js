'use strict';
(function () {
  var mapCard = null;
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var mapPinsContainer = document.querySelector('.map .map__pins');
  var HOUSE_TYPES_MAPPING = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  // Заполняет карточку объявления
  window.card = {
    fillOfferCard: function (offer) {
      var template = templateCard.cloneNode(true);
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
        var roomStr = offer.offer.rooms + ' ' + window.util.toNounString(offer.offer.rooms, ['комната', 'комнаты', 'комнат']);
        var guestStr = 'для ' + offer.offer.guests + ' ' + window.util.toNounString(offer.offer.guests, ['гостя', 'гостей', 'гостей']);
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
      mapPinsContainer.insertAdjacentElement('afterend', mapCard);
    }
  };
})();
