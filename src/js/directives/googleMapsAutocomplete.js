/* global google */
angular
.module('finalProject')
.directive('autocomplete', autocomplete);

autocomplete.$inject = [];

function autocomplete() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      lat: '=',
      lng: '='
    },
    link: function(scope, element, attrs, model) {
      const options = {
        types: []
      };
      const autocomplete = new google.maps.places.Autocomplete(element[0], options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        scope.lat = place.geometry.location.toJSON().lat;
        scope.lng = place.geometry.location.toJSON().lng;
        // console.log(place);
        // console.log(place.geometry.location.lat());
        // console.log(place.geometry.location.lng());
        model.$setViewValue(element.val());
        scope.$apply();
      });
    }
  };
}
