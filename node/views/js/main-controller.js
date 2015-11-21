var trvBudApp = angular.module("trvBudApp", []);

trvBudApp.controller("trvBudCtrl", [ '$filter', '$scope', function ($filter, $scope) {
    
    $scope.places = JSON.parse(window.localStorage.getItem('trvBud-places') || '[]');
    $scope.newAdd = '';
    
    $scope.saveTrip = function(){
        console.log("[saveTrip] sending out: "+angular.toJson($scope.places));
        console.log("[saveTrip] (sending out): "+angular.toJson($scope.places));
        //var outData = JSON.stringify($scope.places);
        //var outData = $scope.places;

        $.ajax({
                url: '/saveTrip',
                data: {"q": angular.toJson($scope.places)},
                type: 'post',
                dataType: 'json',
                success: function(data){
                    console.log("[get!] "+data.key);
                    $(".perm_link").text("perm link: pete-dev.cloudapp.net/review?key="+data.key);
                }
        });
        
    }// end saveTrip
    
    $scope.moveUp = function(target){
        if($scope.places.indexOf(target) != 0){
            // change markers
            var temp_marker = markers[$scope.places.indexOf(target)];
            markers[$scope.places.indexOf(target)] = markers[$scope.places.indexOf(target)-1];
            markers[$scope.places.indexOf(target)-1] = temp_marker;
            
            // change labels
            var t_p = temp_places[$scope.places.indexOf(target)].name;
            temp_places[$scope.places.indexOf(target)].name = temp_places[$scope.places.indexOf(target)-1].name;
            temp_places[$scope.places.indexOf(target)-1].name = t_p;
            
            t_p = $scope.places[$scope.places.indexOf(target)].name;
            $scope.places[$scope.places.indexOf(target)].name = $scope.places[$scope.places.indexOf(target)-1].name;
            $scope.places[$scope.places.indexOf(target)-1].name = t_p;
            
            
            // change paths... just wipe them all and redraw?(!)
            clearLines(lines);
            lines = setLines(lines, markers);
                
        }// end 0 check
    }// end moveUp
    
    $scope.moveDown = function(target){
        if($scope.places.indexOf(target) != lines.length){
            // change markers
            var temp_marker = markers[$scope.places.indexOf(target)];
            markers[$scope.places.indexOf(target)] = markers[$scope.places.indexOf(target)+1];
            markers[$scope.places.indexOf(target)+1] = temp_marker;
            
            // change labels
            var t_p = temp_places[$scope.places.indexOf(target)].name;
            temp_places[$scope.places.indexOf(target)].name = temp_places[$scope.places.indexOf(target)-1].name;
            temp_places[$scope.places.indexOf(target)-1].name = t_p;
            
            t_p = $scope.places[$scope.places.indexOf(target)].name;
            $scope.places[$scope.places.indexOf(target)].name = $scope.places[$scope.places.indexOf(target)+1].name;
            $scope.places[$scope.places.indexOf(target)+1].name = t_p;
            
            // change paths... just wipe them all and redraw?(!)
            clearLines(lines);
            lines = setLines(lines, markers);
                
        }// end 0 check
    }// end moveDown
    
    $scope.rmAll = function(target){
        for( var i = 0; i < markers.length; i++ ){
            markers[i].setMap(null);
        }
        for( var i = 0; i < lines.length; i++ ){
            lines[i].setMap(null);
        }
        lines = [];
        markers = [];
        ids = [];
        $scope.places = [];
    }// end rmAll
    
    $scope.rmPlace = function(target){
        console.log("rm "+ $scope.places.indexOf(target));
        
        if(lines.length > 0 && $scope.places.indexOf(target) != lines.length && $scope.places.indexOf(target) != 0 ){
            // remove connections from map
            console.log("[rm] removing "+$scope.places.length);
            lines[$scope.places.indexOf(target)].setMap(null);
            lines[$scope.places.indexOf(target)-1].setMap(null);
            
            // remove connections from array
            lines.splice($scope.places.indexOf(target), 1);
            lines.splice($scope.places.indexOf(target)-1, 1);
            
            //patch lines
            
            lines.push(
                new google.maps.Polyline({
                    path: [
                        //new google.maps.LatLng( markers[markers.length-2].position.lat(), markers[markers.length-2].position.lng() ),
                        //new google.maps.LatLng( markers[markers.length-1].position.lat(), markers[markers.length-1].position.lat() )
                        new google.maps.LatLng( markers[$scope.places.indexOf(target)-1].position.lat(), markers[$scope.places.indexOf(target)-1].position.lng() ),
                        new google.maps.LatLng( markers[$scope.places.indexOf(target)+1].position.lat(), markers[$scope.places.indexOf(target)+1].position.lng() )
                    ],
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                    geodesic: true,
                    map: map
                })
            );    
        }// end line check
        //now for the edge cases...
        else if(lines.length > 0 && $scope.places.indexOf(target) == lines.length){
            lines[$scope.places.indexOf(target)-1].setMap(null);
            lines.splice($scope.places.indexOf(target), 1);
        }
        else if(lines.length > 0 && $scope.places.indexOf(target) == 0 ){
            lines[$scope.places.indexOf(target)].setMap(null);
            lines.splice($scope.places.indexOf(target)-1, 1);
        }
        
        markers[$scope.places.indexOf(target)].setMap(null);
        markers.splice($scope.places.indexOf(target),1);
        ids.splice( $scope.places.indexOf(target), 1 );
        $scope.places.splice( $scope.places.indexOf(target), 1 );
        //$scope.$digest();
    }// end rmPlace
    
    $scope.addPlace = function(){
        //console.log("date: "+$("#date").datepicker('getDate').toLocaleDateString());
        console.log("/gCity..."+$scope.newAdd.trim());
        $.ajax({
            url: '/gCity',
            data: {"q":$scope.newAdd.trim()},
            type: 'get',
            dataType: 'json',
            success: function(data){
                console.log(JSON.stringify(data));
                //console.log(data[0].name);
                /*
                var marker = new google.maps.Marker({
                    position: {lat: data.Latitude, lng: data.Longitude},
                    map: map,
                    title: data.AccentCity +", "+data.Country,
                    animation: google.maps.Animation.DROP   
                });
                */
                var marker_idx = markers.length;
                markers.push(
                    new google.maps.Marker({
                        position: {lat: data.Latitude, lng: data.Longitude},
                        map: map,
                        title: data.AccentCity +", "+data.Country,
                        animation: google.maps.Animation.DROP
                    })
                );
                
                if( markers.length > 1 ){
                    console.log("len"+markers.length);
                    lines.push(
                        new google.maps.Polyline(
                            {
                            path: [
                                //{lat: 0, lng: 0},
                                //{lat: 10, lng: 10}
                                new google.maps.LatLng( markers[markers.length-2].position.lat(), markers[markers.length-2].position.lng() ),
                                new google.maps.LatLng( markers[markers.length-1].position.lat(), markers[markers.length-1].position.lng() )
                            ],
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 5,
                            geodesic: true,
                            map: map
                            }
                        )
                    );
                    //console.dir("added line");
                    
                }
                var date;
                if( $("#date").datepicker('getDate') == null ){
                    date = "";
                }
                else{
                    date = $("#date").datepicker('getDate').toLocaleDateString();
                }
                
                if( data.Country == "US" ){
                    $scope.places.push(
                        {
                            'name': data.AccentCity+", "+data.Region,
                            'lat': data.Latitude,
                            'lng': data.Longitude,
                            'arrive': date
                        });
                }
                else{
                    $scope.places.push(
                        {
                            'name': data.AccentCity+", "+data.Country, 
                            'lat': data.Latitude,
                            'lng': data.Longitude,
                            'arrive': date
                        });
                }
                temp_places.push(
                    {
                        'name': data.AccentCity+", "+data.Region,
                        'lat': data.Latitude,
                            'lng': data.Longitude,
                        'arrive': date
                    }
                );
                
                $scope.$digest();
                map.panTo(new google.maps.LatLng(data.Latitude,data.Longitude));
                
                console.log("done!");
                console.log("testing... "+$scope.places[0].arrive);
            }// end ajax
        });
        $scope.newAdd = '';
        $scope.newDate = '';
    }// end addPlace
    
}]);// end trvBudApp.controller