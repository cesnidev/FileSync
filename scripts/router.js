'use strict';

angular.module('Client',['ngFileUpload', 'ngImgCrop','ng-file-model','ngResource','ngRoute','ngMessages','ui.materialize','ui.mask','ngAnimate','angular.css.injector','angularLocalStorage','dropzone'])
.constant('EVENTICA_ROLES', {
  admin: 'admin',
  user: 'user',
  guest: 'guest'
})
.constant('Stats',{
	notlogin:"You are not Signed",
	notallowed:"You are not allowed",
	missed:"Unrecognized Error",
	expired:"Your session has been expired,please login again"
})
.constant('CalcommConfig',{
	AppId:"e86aea35d849802cdf17e00d965c7bd9",
	Min_Age:18,
	Max_Age:30,
	IP:'localhost'
})
.config(function($routeProvider, $locationProvider,cssInjectorProvider,CalcommLoginProvider,Stats){
		cssInjectorProvider.setSinglePageMode(true);

        $routeProvider
		.when('/',{
			templateUrl: 'views/signup.html',
			controller: 'SignUpCtrl'
		}).otherwise({
			redirectTo: '/'
		})
    
	});