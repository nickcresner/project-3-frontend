/* global google */
angular
.module('finalProject')
.directive('googleMap', googleMap);

function googleMap() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="map">GOOGLE MAP HERE</div>',
    scope: {
      center: '=',
      legs: '='
    },
    link(scope, element) {

      let map = null;
      let marker = null;
      scope.$watch('legs', initMap);
      scope.$on('$destroy', destroyMap);

      function initMap(){
        console.log(scope.legs);
        console.log(scope.center);
        var bounds = new google.maps.LatLngBounds();

        if(!scope.legs) return false;
        map = new google.maps.Map(element[0], {
          scrollwheel: false,
          zoom: 4,
          center: scope.center
        });
        marker = new google.maps.Marker({
          position: scope.center,
          map
        });
        var legs = [];
        scope.legs.forEach((leg) => {
          var latLng = {lat: leg.lat, lng: leg.lng};
          bounds.extend(latLng);
          legs.push(latLng);
        });
        console.log(legs);
        var flightPath = new google.maps.Polyline({
          path: legs,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        flightPath.setMap(map);
        map.fitBounds(bounds);
      }
      function destroyMap(){
        console.log('destroying map...');
        marker.setMap(null);
        marker = null;
        map = null;
      }
    }
  };
}
