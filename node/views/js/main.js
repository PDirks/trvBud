var map;

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

function getCities( q ) {
    $.ajax({
        url: '/getCity',
        data: q,
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

$(document).ready(function(){
    $('#placeSearch').keyup(function(){
        var q = $('#placeSearch').val();
        console.log("key up: "+q);
        getCities(q)
    });
    
});