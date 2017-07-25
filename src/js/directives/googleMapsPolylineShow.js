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
      let legsMarkers = [];
      let infowindow = null;
      scope.$watch('legs', initMap);
      scope.$on('$destroy', destroyMap);
      scope.$watch('legs', addLegsMarkers, true);

      function initMap(){

        var bounds = new google.maps.LatLngBounds();

        if(!scope.legs) return false;
        map = new google.maps.Map(element[0], {
          scrollwheel: false,
          zoom: 4,
          center: scope.center,
          styles: [
            {
              'featureType': 'landscape',
              'stylers': [
                {
                  'hue': '#FFBB00'
                },
                {
                  'saturation': 43.400000000000006
                },
                {
                  'lightness': 37.599999999999994
                },
                {
                  'gamma': 1
                }
              ]
            },
            {
              'featureType': 'road.highway',
              'stylers': [
                {
                  'hue': '#FFC200'
                },
                {
                  'saturation': -61.8
                },
                {
                  'lightness': 45.599999999999994
                },
                {
                  'gamma': 1
                }
              ]
            },
            {
              'featureType': 'road.arterial',
              'stylers': [
                {
                  'hue': '#FF0300'
                },
                {
                  'saturation': -100
                },
                {
                  'lightness': 51.19999999999999
                },
                {
                  'gamma': 1
                }
              ]
            },
            {
              'featureType': 'road.local',
              'stylers': [
                {
                  'hue': '#FF0300'
                },
                {
                  'saturation': -100
                },
                {
                  'lightness': 52
                },
                {
                  'gamma': 1
                }
              ]
            },
            {
              'featureType': 'water',
              'stylers': [
                {
                  'hue': '#0078FF'
                },
                {
                  'saturation': -13.200000000000003
                },
                {
                  'lightness': 2.4000000000000057
                },
                {
                  'gamma': 1
                }
              ]
            },
            {
              'featureType': 'poi',
              'stylers': [
                {
                  'hue': '#00FF6A'
                },
                {
                  'saturation': -1.0989010989011234
                },
                {
                  'lightness': 11.200000000000017
                },
                {
                  'gamma': 1
                }
              ]
            }
          ]
        });
        var legs = [];
        scope.legs.forEach((leg) => {
          var latLng = {lat: leg.lat, lng: leg.lng};
          bounds.extend(latLng);
          legs.push(latLng);
        });
        
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

      function addLegsMarkers(legs) {
        if(!legs) return false;
        removeLegsMarkers();

        legs.forEach((leg) => {
          addLegMarker(leg);
        });
      }

      function addLegMarker(leg) {
        console.log(leg.lat, leg.lng);
        const marker = new google.maps.Marker({
          position: {lat: leg.lat, lng: leg.lng },
          map
        });

        legsMarkers.push(marker);

        marker.addListener('click', () => {
          markerLegClick(marker, leg);
        });
      }
      function markerLegClick(marker, leg) {
        if(infowindow) infowindow.close();

        const name = leg.name;

        infowindow = new google.maps.InfoWindow({
          content: `${name}`,
          pixelOffset: new google.maps.Size(0, 13)

        });
        infowindow.open(map, marker);
      }
      function removeLegsMarkers(){
        legsMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        legsMarkers = [];
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
