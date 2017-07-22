angular
  .module('finalProject')
  .factory('Leg', Leg);

Leg.$inject = ['$resource', 'API_URL'];
function Leg($resource, API_URL) {
  return new $resource(`${API_URL}/legs/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
