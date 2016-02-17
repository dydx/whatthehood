(function () {
  angular.module('ghetto', []);

  angular.module('ghetto')
    .factory('geolocation', function () {
      // get geolocation in a closure and supply args in a callback
      // which can be consumed by firebase / database layer later
      return { 
        location: ["-30.0000", "81.0000"]
      }
    });

  function show (data) {
    return data;
  }

  angular.module('ghetto')
    .controller('ghettoCtrl', function ($log, geolocation) {

      this.amI = function () {
        $log.debug('Fetching information for', geolocation.location);
      };

      this.iAm = function () {
        $log.debug('Submitting information for', geolocation.location);
      };
    });
})();
