(function () {
  angular.module('ghetto', ['angularGeoFire']);

  angular.module('ghetto')
    .controller('ghettoCtrl', function ($scope, $log, $geofire) {

      var vm = this;

      var firebase = new Firebase('https://whatthehood.firebaseio.com/');
      var $geo = $geofire(firebase);

      vm.results = [];

      // The state of these things needs to he handled in a better way
      // this is terrible
      vm.inThaHood = false;
      vm.hoodChecked = false;
      vm.hoodNotified = false;
      vm.locationLocked = false;

      // debugging
      $log.debug('Location Acquired: ', vm.locationLocked);
      navigator.geolocation.getCurrentPosition(function (position) {
        vm.coords = [
          position.coords.latitude,
          position.coords.longitude
        ];
        vm.locationLocked = true;
        // debugging
        $log.debug('Location Acquired: ', vm.locationLocked);
      });

      vm.amI = function () {
        // this.inThaHood is determined by performing a geospacial query
        vm.hoodChecked = vm.hoodChecked === true ? false : true;
        vm.hoodNotified = false;

        // GeoFire Query
        var search = $geo.$query({
          center: vm.coords,
          radius: 1
        });

        var geoQueryCallback = search.on('key_entered', 'SEARCH:KEY_ENTERED');
        $scope.$on("SEARCH:KEY_ENTERED", function (event, key, loc, distance) {
          vm.results.push({key: key, loc: loc, distance: distance});

          if (distance > 5) {
            geoQueryCallback.cancel();
          }
        });

        if (vm.results.length > 1) {
          vm.inThaHood = true;
        }
      };

      vm.iAm = function () {
        vm.hoodChecked = false;
        vm.hoodNotified = vm.hoodNotified === true ? false : true;

        // GeoFire Insert
        $geo.$set(Date.now().toString(), vm.coords)
          .catch(function (err) {
            $log.error(err);
          });
      };
    });
})();
