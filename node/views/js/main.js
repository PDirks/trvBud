var map;
var markers = [];
var lines = [];
var temp_places = [];
var ids = [];
var styles = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#FFBB00"
            },
            {
                "saturation": 43.400000000000006
            },
            {
                "lightness": 37.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#FFC200"
            },
            {
                "saturation": -61.8
            },
            {
                "lightness": 45.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 51.19999999999999
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 52
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#0078FF"
            },
            {
                "saturation": -13.200000000000003
            },
            {
                "lightness": 2.4000000000000057
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#00FF6A"
            },
            {
                "saturation": -1.0989010989011234
            },
            {
                "lightness": 11.200000000000017
            },
            {
                "gamma": 1
            }
        ]
    }
]

function initMap() {
    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});


    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 40, lng: -90},
        zoom: 5
    });
    
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

}

var tags = []

function sCities( q ) {
    console.log("s");
    $.ajax({
        url: '/sCity',
        data: {"q":q},
        type: 'get',
        dataType: 'json',
        success: function(data){
            console.log(JSON.stringify(data));
            console.log(data[0].name);
            tags = data;
            data.forEach(function(d){
               tags.push(d.name);
            });
            $('#placeSearch').autocomplete({
               source: tags
            });
        }
    });
}

function clearLines(lines){
    lines.forEach(function(p){
        p.setMap(null);              
    });
    lines = [];
}

function setLines(lines, markers){
    for( var i = 0; i < markers.length-1; i++ ){
        lines.push(
        new google.maps.Polyline({
            path: [
                //new google.maps.LatLng( markers[markers.length-2].position.lat(), markers[markers.length-2].position.lng() ),
                //new google.maps.LatLng( markers[markers.length-1].position.lat(), markers[markers.length-1].position.lat() )
                new google.maps.LatLng( markers[i].position.lat(), markers[i].position.lng() ),
                new google.maps.LatLng( markers[i+1].position.lat(), markers[i+1].position.lng() )
            ],
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 5,
            geodesic: true,
            map: map
        })
        );
    }
    return lines;
}

$(function(){
    $( "#date" ).datepicker();
    console.log("picker");
})

$(document).ready(function(){
    /*
    $('#placeSearch').keyup(function(){
        var q = $('#placeSearch').val();
        console.log("key up: "+q);
        getCities(q)
    });
    */
    /*
    var q = $('#placeSearch').val();
    $('#placeSearch').typeahead(null,{
        name: "city-search",
        display: "value",
        source: citySearch
        //remote: '/sCity?q='+q,
        //minLength: 3
    });
    */
});