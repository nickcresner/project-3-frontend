angular
.module('finalProject')
.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state', '$auth', '$transitions', 'User', 'Trip'];
function MainCtrl($rootScope, $state, $auth, $transitions, User, Trip) {
  const vm = this;
  vm.isAuthenticated = $auth.isAuthenticated;

  $rootScope.$on('error', (e, err) => {
    vm.message = err.data.errors.join('; ');
    if(err.status === 401 && vm.pageName !== 'login') {
      vm.stateHasChanged = false;
      $state.go('login');
    }
  });

  const protectedStates = ['tripsNew', 'tripsEdit', 'tripsIndex', 'tripsShow'];
  const editPage = 'tripsEdit';

  $transitions.onSuccess({}, (transition) => {
    console.log(transition.$to());
    if((!$auth.isAuthenticated() && protectedStates.includes(transition.$to().name))) {
      vm.message = 'You must be logged in to access this page.';
      return $state.go('login');
    }
    // if(($auth.isAuthenticated() && $auth.getPayload().id !== editPage.user.id && editPage.includes(transition.$to().name))){
    //   vm.message = 'This is not your source, you cannot edit this.';
    //   return $state.go('tripsIndex');
    // }

    if(transition.$to().name === 'tripsEdit') {
      Trip.get($state.params)
      .$promise
      .then((trip) => {
        if(trip.user.id !== $auth.getPayload().id) {
          vm.message = 'You must be logged in to access this page.';
          return $state.go('tripsIndex');
        }
      });

    }

    vm.pageName = transition.$to().name;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
    if($auth.getPayload()) {
      vm.currentUserId = $auth.getPayload().id;
      vm.currentUser = User.get({ id: vm.currentUserId });
    }
  });


  function logout() {
    $auth.logout();
    $state.go('home');
  }

  vm.logout = logout;
}
