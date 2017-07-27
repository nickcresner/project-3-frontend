angular
.module('finalProject')
.controller('UsersShowCtrl', UsersShowCtrl)
.controller('UsersEditCtrl', UsersEditCtrl);


UsersShowCtrl.$inject = ['$auth', 'User', '$state'];
function UsersShowCtrl($auth, User, $state) {

  const vm = this;
  vm.user = User.get($state.params);
}


UsersEditCtrl.$inject = ['User', '$stateParams', '$state'];
function UsersEditCtrl(User, $stateParams, $state) {
  const vm = this;

  vm.user = User.get($stateParams);
  function usersUpdate() {
    if(vm.userForm.$valid){
      vm.user
      .$update()
      .then(() => $state.go('usersShow', $stateParams));
    }
  }

  vm.update = usersUpdate;
}
