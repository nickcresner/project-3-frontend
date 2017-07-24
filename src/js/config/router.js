angular
.module('finalProject')
.config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/js/views/static/home.html'
  })
  .state('tripsIndex', {
    url: '/trips',
    templateUrl: '/js/views/trips/index.html',
    controller: 'TripsIndexCtrl as tripsIndex'
  })
  .state('tripsShow', {
    url: '/trips/:id',
    templateUrl: '/js/views/trips/show.html',
    controller: 'TripsShowCtrl as tripsShow'
  })
  .state('tripsNew', {
    url: '/trips/new',
    templateUrl: '/js/views/trips/new.html',
    controller: 'TripsNewCtrl as tripsNew'
  })
  .state('tripsEdit', {
    url: '/trips/:id/edit',
    templateUrl: '/js/views/trips/edit.html',
    controller: 'TripsEditCtrl as tripsEdit'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'js/views/auth/login.html',
    controller: 'LoginCtrl as login'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'js/views/auth/register.html',
    controller: 'RegisterCtrl as register'
  })
  .state('usersShow', {
    url: '/users/:id',
    templateUrl: 'js/views/users/show.html',
    controller: 'UsersShowCtrl as usersShow'
  })
  .state('usersEdit', {
    url: '/users/:id/edit',
    templateUrl: 'js/views/users/edit.html',
    controller: 'UsersEditCtrl as usersEdit'
  });

  $urlRouterProvider.otherwise('/trips');
}
