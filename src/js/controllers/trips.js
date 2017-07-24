angular
.module('finalProject')
.controller('TripsIndexCtrl', TripsIndexCtrl)
.controller('TripsShowCtrl', TripsShowCtrl)
.controller('TripsNewCtrl', TripsNewCtrl)
.controller('TripsEditCtrl', TripsEditCtrl);

TripsIndexCtrl.$inject = ['Trip'];
function TripsIndexCtrl(Trip) {
  const vm = this;

  vm.all = Trip.query();

  vm.delete = tripsDelete;

  function tripsDelete(trip){

    Trip.delete({ id: trip.id })
    .$promise
    .then(() => {
      const index = vm.all.indexOf(trip);
      vm.all.splice(index, 1);
    });
  }

}

TripsShowCtrl.$inject = ['$stateParams', 'Trip', 'weather'];
function TripsShowCtrl($stateParams, Trip, weather) {
  const vm = this;
  vm.trip = {};

  Trip.get($stateParams)
    .$promise
    .then((trip) => {
      vm.trip = trip;
      vm.trip.legs = vm.trip.legs.map(legWeather);
    });

  function legWeather(leg) {
    weather.getWeather()
      .then((response) => {
        leg.weather = response;
      });

    return leg;
  }

  // console.log(legWeather({lat: 51, lng: -0.1}));

  // vm.legWeather = legWeather;

  // function getWeather(vm.trip.legs.lat, vm.trip.legs.lng) {
  //
  // }
  //
  // weather.getWeather(vm.trip.leg.lat, vm.trip.leg.lng);
  // .then((weather) => {
  //   vm.weather = weather;
  // });
  //
  // console.log(weather.getWeather());

}

TripsNewCtrl.$inject = ['$state', 'Trip', 'Leg'];
function TripsNewCtrl($state, Trip, Leg){
  const vm = this;

  vm.legs = [];

  vm.create = tripsCreate;

  function tripsCreate(){
    Trip
    .save(vm.trip)
    .$promise
    .then((trip) => {

      vm.legs.forEach((leg) => {
        leg.trip_id = trip.id;
        Leg.
        save(leg)
        .$promise
        .then(() => {
          $state.go('tripsIndex');
        });
      });
    });
  }

  function addLeg(){
    console.log(vm.newLeg);
    vm.legs.push(vm.newLeg);
    vm.newLeg = {};
  }
  vm.addLeg = addLeg;

  function deleteLeg(leg){
    const legsIndex = vm.legs.indexOf(leg);
    vm.legs.splice(legsIndex, 1);
  }
  vm.deleteLeg = deleteLeg;
}

TripsEditCtrl.$inject = ['Trip', 'Leg', '$stateParams', '$state'];
function TripsEditCtrl(Trip, Leg, $stateParams, $state) {
  const vm = this;

  vm.trip = Trip.get($stateParams);
  console.log(vm.trip);
  console.log(vm.trip.legs);

  function tripsUpdate() {
    console.log('updating');
    vm.trip
    .$update()
    .then(() => $state.go('tripsShow', $stateParams));
  }

  vm.update = tripsUpdate;

  function addLeg(){
    console.log(vm.newLeg);
    vm.legs.push(vm.newLeg);
    vm.newLeg = {};
  }
  vm.addLeg = addLeg;

  function deleteLeg(leg){
    console.log('deleting mi leg');
    const legsIndex = vm.legs.indexOf(leg);
    vm.legs.splice(legsIndex, 1);
  }
  vm.deleteLeg = deleteLeg;
}
