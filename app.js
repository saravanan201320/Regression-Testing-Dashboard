var myApp = angular.module('myApp',
    ['ngFileUpload','ngMaterial', 'ngMessages','ngRoute','googlechart','angular.filter','ngSanitize','mainPageControllers','SelectedASGPageControllers','SelectedApplicationPageControllers','Level4PageControllers','ngXlsx']);

// configure our routes
myApp.config(function($routeProvider) {
  $routeProvider
      .when('/index', {
        templateUrl : 'MainPage.html',
        controller  : 'mainController'
      })
      
       .when('/level2Page', {
        templateUrl : 'SelectedASGPage.html',
        controller  : 'SelectedASGPageController'
      })
       .when('/level3Page', {
        templateUrl : 'SelectedApplicationPage.html',
        controller  : 'SelectedApplicationPageController'
      })
       .when('/level4Page', {
        templateUrl : 'Level4Page.html',
        controller  : 'Level4PageController'
      })
       .when('/uploadPage', {
        templateUrl : 'UploadPage.html',
        controller  : 'mainController'
      })
  .otherwise({
        redirectTo: '/',
        templateUrl: 'MainPage.html',
        controller  : 'mainController'
      });
});

// create the controller and inject Angular's $scope
myApp.controller('mainController', function($scope,$rootScope,$http) {
  // create a message to display in our view
  $scope.message = 'Everyone come and see how good I look!';  
  // $window.location.href = upload.html;
});




        
