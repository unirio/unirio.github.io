var CodeSnackApp = angular.module('CodeSnackApp', []);

CodeSnackApp.controller('TodoCtrl', function($scope, $http) {

	$http.get('catalogo.json')
		.then(function(res){
        	$scope.dados = res.data;
        });
});