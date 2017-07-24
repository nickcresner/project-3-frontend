angular
.module('finalProject')
.controller('UsersShowCtrl', UsersShowCtrl)
.controller('UsersEditCtrl', UsersEditCtrl);


UsersShowCtrl.$inject = ['$auth', 'User', '$state', '$stateParams'];
function UsersShowCtrl($auth, User, $state, $stateParams) {

  const vm = this;
  vm.user = {};

  usersShow();

  function usersShow(){
    vm.user = User.get($stateParams);
  }
}


UsersEditCtrl.$inject = ['User', '$stateParams', '$state'];
function UsersEditCtrl(User, $stateParams, $state) {
  const vm = this;

  vm.user = User.get($stateParams);
  console.log(vm.user, 'here');
  function usersUpdate() {
    if (vm.userForm.$valid) {
      vm.user
      .$update()
      .then(() => $state.go('usersShow', $stateParams));
    }
  }

  vm.update = usersUpdate;
}
