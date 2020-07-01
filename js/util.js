'use strict';
(function () {
  window.util = {
    getRandomNumber: function (maxNumber) {
      return Math.round(Math.random() * maxNumber);
    },
    toNounString: function (number, titles) {
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
    }
  };
})();
