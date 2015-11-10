var trvBudApp = angular.module("trvBudApp", []);

trvBudApp.controller("trvBudCtrl", [ '$filter', '$scope', function ($filter, $scope) {
    $scope.places = JSON.parse(window.localStorage.getItem('trvBud-places') || '[]');
    
    $scope.addPlace = function(){
        $scope.places.push({'name': $scope.newAdd.trim()})
        console.log("new place")
        $scope.newadd = '';
    }
    
}]);// end trvBudApp.controller