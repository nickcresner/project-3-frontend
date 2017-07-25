angular
  .module('finalProject')
  .service('budget', Budget);

Budget.$inject = ['$http', 'API_URL'];
function Budget($http, API_URL) {
  const vm = this;

  function getBudget(lat, lng) {
    return $http
      .get(`${API_URL}/budget`, { params: { lat, lng } })
      .then((response) => {
        return response.data;
      });
  }
  // console.log(vm.trip.legs);
  vm.getBudget = getBudget;
}
