'use strict';

(function () {
  var onSuccessHandler = function (offers) {
    window.data = offers;
    window.application.setMainBehaviour();
  };
  window.backend.load(onSuccessHandler);
})();

