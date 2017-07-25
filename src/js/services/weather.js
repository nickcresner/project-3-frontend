angular
  .module('finalProject')
  .service('weather', Weather);

Weather.$inject = ['$http', 'API_URL'];
function Weather($http, API_URL) {
  const vm = this;

  function getWeather(lat, lng) {
    return $http
      .get(`${API_URL}/weather`, { params: { lat, lng } })
      .then((response) => {
        console.log('response data', response);
        return response.data;
      });
  }
  // console.log(vm.trip.legs);
  vm.getWeather = getWeather;
}