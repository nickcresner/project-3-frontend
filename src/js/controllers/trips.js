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

TripsShowCtrl.$inject = ['$stateParams', 'Trip'];
function TripsShowCtrl($stateParams, Trip) {
  const vm = this;
  vm.trip = {};

  tripsShow();

  function tripsShow(){
    vm.trip = Trip.get($stateParams);
  }
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

TripsEditCtrl.$inject = ['Trip', '$stateParams', '$state'];
function TripsEditCtrl(Trip, $stateParams, $state) {
  const vm = this;

  vm.trip = Trip.get($stateParams);

  function tripsUpdate() {
    console.log('updating');
    vm.trip
    .$update()
    .then(() => $state.go('tripsShow', $stateParams));
  }

  vm.update = tripsUpdate;

  function addLeg(){
    console.log(vm.newLeg);
    vm.trip.legs.push(vm.newLeg);
    vm.newLeg = {};
  }
  vm.addLeg = addLeg;

  function deleteLeg(leg){
    const legsIndex = vm.trip.legs.indexOf(leg);
    vm.trip.legs.splice(legsIndex, 1);
  }
  vm.deleteLeg = deleteLeg;
}
