angular
.module('finalProject')
.config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('tripsIndex', {
      url: '/trips',
      templateUrl: '/js/views/trips/index.html',
      controller: 'TripsIndexCtrl as tripsIndex'
    })
    .state('tripsShow', {
      url: '/trips/:id',
      templateUrl: '/js/views/trips/show.html',
      controller: 'TripsShowCtrl as tripsShow'
    });

  $urlRouterProvider.otherwise('/trips');
}
