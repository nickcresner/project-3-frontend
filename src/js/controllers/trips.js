angular
.module('finalProject')
.controller('TripsIndexCtrl', TripsIndexCtrl)
.controller('TripsShowCtrl', TripsShowCtrl)
.controller('TripsNewCtrl', TripsNewCtrl)
.controller('TripsEditCtrl', TripsEditCtrl);

TripsIndexCtrl.$inject = ['Trip', 'filterFilter', '$scope'];
function TripsIndexCtrl(Trip, filterFilter, $scope) {
  const vm = this;

  Trip.query((trips) => {
    vm.all = trips;
    filterTrips();
  });

  function filterTrips(){
    const params = { country: vm.q };

    vm.filtered = filterFilter(vm.all, params);

  }
  $scope.$watchGroup([
    () => vm.q
  ], filterTrips);

}

TripsShowCtrl.$inject = ['$stateParams', 'Trip', 'User', 'Comment', '$auth', 'weather', 'budget', '$state', 'facts'];
function TripsShowCtrl($stateParams, Trip, User, Comment, $auth, weather, budget, $state, facts) {
  const vm = this;
  vm.trip = {};
  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

  Trip.get($stateParams)
  .$promise
  .then((trip) => {
    vm.trip = trip;
    vm.trip.legs = vm.trip.legs.map(legWeather);
    vm.trip.leg = countryBudget(vm.trip.legs[0]);
    vm.trip.leg = countryFact(vm.trip.legs[0]);
  });

  function tripsDelete() {
    vm.trip
    .$remove()
    .then(() => $state.go('tripsIndex'));
  }

  vm.delete = tripsDelete;

  function legWeather(leg) {
    weather.getWeather(leg.lat, leg.lng)
    .then((response) => {
      leg.weather = response;
    });
    return leg;
  }

  function countryBudget(leg){
    budget.getBudget(leg.lat, leg.lng)
    .then((response) => {
      leg.budget = response;
    });
    return leg;
  }

  function countryFact(leg){
    facts.getFact(leg.lat, leg.lng)
    .then((response) => {
      leg.facts = response;
    });
    return leg;
  }



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

  function addComment() {
    vm.comment.trip_id = vm.trip.id;

    Comment
    .save(vm.comment)
    .$promise
    .then((comment) => {
      vm.trip.comments.push(comment);
      vm.comment = {};
    });
  }

  vm.addComment = addComment;

  function deleteComment(comment) {
    Comment
    .delete({ id: comment.id })
    .$promise
    .then(() => {
      const index = vm.trip.comments.indexOf(comment);
      vm.trip.comments.splice(index, 1);
    });
  }

  vm.deleteComment = deleteComment;

}

TripsNewCtrl.$inject = ['$state', 'Trip', 'Leg', 'User', '$auth'];
function TripsNewCtrl($state, Trip, Leg, User, $auth){
  const vm = this;
  vm.users = User.query();

  vm.legs = [];

  vm.create = tripsCreate;

  function tripsCreate(){
    vm.trip.attendee_ids = [$auth.getPayload().id];
    if(vm.newTripForm.$valid && vm.legs.length >= 2){
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
  Trip.get($stateParams)
    .$promise
    .then((trip) => {
      vm.trip = trip;
      vm.trip.start_date = new Date(vm.trip.start_date);
      vm.trip.end_date = new Date(vm.trip.end_date);
    });
  vm.users = User.query();


  function tripsUpdate() {
    if(vm.editTripForm.$valid && vm.trip.legs.length >= 2){
      vm.trip
      .$update()
      .then(() => $state.go('tripsShow', $stateParams));
    }
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
