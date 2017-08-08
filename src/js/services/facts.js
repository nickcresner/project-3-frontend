angular
  .module('finalProject')
  .service('facts', Facts);

Facts.$inject = ['$http', 'API_URL'];
function Facts($http, API_URL) {
  const vm = this;

  function getFact(lat, lng) {
    return $http
      .get(`${API_URL}/facts`, { params: { lat, lng } })
      .then((response) => {
        return response.data;
      });
  }
  vm.getFact = getFact;
}
