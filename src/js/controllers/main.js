angular
.module('finalProject')
.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state', '$auth', '$transitions', 'User'];
function MainCtrl($rootScope, $state, $auth, $transitions, User) {
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

  $transitions.onSuccess({}, (transition) => {
    if((!$auth.isAuthenticated() && protectedStates.includes(transition.$to().name))) {
      vm.message = 'You must be logged in to access this page.';
      return $state.go('login');
    }
    vm.pageName = transition.$to().name;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
    if($auth.getPayload()) vm.currentUserId = $auth.getPayload().userId;
    if($auth.getPayload()) {
      vm.currentUserId = $auth.getPayload().userId;
      vm.currentUser = User.get({ id: vm.currentUserId });
    }
  });


  function logout() {
    $auth.logout();
    $state.go('home');
  }

  vm.logout = logout;
}
