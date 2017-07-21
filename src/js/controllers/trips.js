angular
.module('finalProject')
.controller('TripsIndexCtrl', TripsIndexCtrl)
.controller('TripsShowCtrl', TripsShowCtrl);

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
