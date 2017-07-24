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

TripsShowCtrl.$inject = ['$stateParams', 'Trip', 'User', '$auth', 'weather'];
function TripsShowCtrl($stateParams, Trip, User, $auth, weather) {
  const vm = this;
  vm.trip = {};
  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

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

<<<<<<< HEAD
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

=======
  function tripsUpdate() {
    Trip
    .update({ id: vm.trip.id }, vm.trip);
  }

  function toggleAttending() {
    const index = vm.trip.attendee_ids.indexOf(vm.currentUser.id);
    if(index > -1) {
      vm.trip.attendee_ids.splice(index, 1);
      vm.trip.attendees.splice(index, 1);
    } else {
      vm.trip.attendee_ids.push(vm.currentUser.id);
      vm.trip.attendees.push(vm.currentUser);
    }
    tripsUpdate();
  }

  vm.toggleAttending = toggleAttending;

  function isAttending() {
    return $auth.getPayload() && vm.trip.$resolved && vm.trip.attendee_ids.includes(vm.currentUser.id);
  }

  vm.isAttending = isAttending;
>>>>>>> development
}

TripsNewCtrl.$inject = ['$state', 'Trip', 'Leg', 'User'];
function TripsNewCtrl($state, Trip, Leg, User){
  const vm = this;
  vm.users = User.query();

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

TripsEditCtrl.$inject = ['Trip', 'Leg', 'User', '$stateParams', '$state'];
function TripsEditCtrl(Trip, Leg, User, $stateParams, $state) {
  const vm = this;
  vm.trip = Trip.get($stateParams);
  vm.users = User.query();


  function tripsUpdate() {
    vm.trip
    .$update()
    .then(() => $state.go('tripsShow', $stateParams));
  }

  vm.update = tripsUpdate;

  function addLeg(){
    vm.newLeg.trip_id = vm.trip.id;
    console.log('About to add:', vm.newLeg);
    Leg.
    save(vm.newLeg)
    .$promise
    .then((leg) => {
      console.log('Leg added:', leg);
      vm.trip.legs.push(leg);
      vm.trip.leg_ids.push(leg.id);
      vm.newLeg = {};
    });
  }
  vm.addLeg = addLeg;

  function deleteLeg(leg){
    Leg.delete({ id: leg.id })
    .$promise
    .then(() => {
      const legsIndex = vm.trip.legs.indexOf(leg);
      vm.trip.legs.splice(legsIndex, 1);
      vm.trip.leg_ids.splice(legsIndex, 1);
    });

  }
  vm.deleteLeg = deleteLeg;
}
