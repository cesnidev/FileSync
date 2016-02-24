'use strict';
var calcomm = angular.module('Client');
calcomm.controller('SignUpCtrl', function(fileUpload,uploadService,$rootScope,$scope,CalcommResource,cssInjector,$window,Session,$location,CalcommConfig,CalcommLogin,Upload) {
	
	$scope.files=[];
		cssInjector.add("assets/css/proyecto.form.css");
			
			$scope.profile = { "waist": "32", "jacketsize": "", "chest": "42", "hips": "", "dressize": "", "waistfemale": "", "nflanguage": "", "slanguage": "", "piercings": false, "tatoos": false, "englishfuently": false, "englishacent": false, "gender": "male", "height": "4'12", "weight": "1231", "eye_color": "Green", "hair_color": "Auburn", "hair_length": "Medium", "tshirt_size": "M", "pants_size": "S", "shoes_size": "5.5", "jacket_size": "40", "first_language": "German", "second_language": "Italian", "english_accent": true, "spanish_fluently": true };

			$scope.user = Session.getSession();
			$rootScope.user = $scope.user;	
			
			$scope.jprofile = {token:$scope.user.token,app_id:CalcommConfig.AppId,profile:''};
			
			
			$scope.profileclick1 = function(c,form)
			{
				$scope.jprofile.profile = $scope.profile;
						CalcommResource.saveProfile($scope.jprofile).$promise.then(function(response){
							
						});
			};
			$scope.profileclick2 = function(c,form)
			{
				console.log($scope.profile.picture1);
				$scope.jprofile.profile = $scope.profile;
				console.log($scope.jprofile);
				var fd = new FormData();
		        for (var key in $scope.jprofile) {
		            fd.append(key, $scope.jprofile[key]);
		        }
						CalcommResource.saveProfile(fd).$promise.then(function(response){
							
						});
			};	
			$scope.profileclick3 = function(c,form)
			{
				Upload.upload({
		            url: 'http://localhost:3000/api/v1/profiles',
		            data: {profile:{picture1:$scope.profile.picture1}, token: $scope.user.token,app_id:CalcommConfig.AppId}
		        }).then(function (resp) {
		            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
		        }, function (resp) {
		            console.log('Error status: ' + resp.status);
		        }, function (evt) {
		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		        });
			};	
			$scope.profileclick4 = function(c,form)
			{
				uploadService.send($scope.profile.picture1,$scope.user.token,$scope.profile);	
			};	
			$scope.profileclick5 = function(c,form)
			{
				console.log($scope.profile.picture1);
				$scope.jprofile.profile = $scope.profile;
				
		        Upload.upload({
			      url: 'http://localhost:3000/api/v1/profiles',
			      method: 'POST',
			      headers: { 'Content-Type': undefined },
			      fields: {
			      	app_id:CalcommConfig.AppId,
			      	token:$scope.user.token,
			        'profile[gender]': $scope.profile.gender,
			        'profile[eye_color]': $scope.profile.eye_color,
			        'profile[shoesize]': $scope.profile.shoesize,
			        'profile[picture1]': $scope.files[0]
			      }
			    }).then(function (resp) {
			      //console.log('Success ' + resp.config.file.name + 'uploaded. Response: ' + resp.data);
			    }, function (resp) {
			      //console.log('Error status: ' + resp.status);
			    }, function (evt) {
			      //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			      //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			    });
			};	
			$scope.profileclick6 = function(c,form)
			{
					
		        Upload.upload({
			      url: 'http://localhost:3000/api/v1/profiles',
			      method: 'POST',
			      headers: { 'Content-Type': undefined },
			      picture1: $scope.profile.picture1,
			      token:$scope.user.token,
			      app_id:CalcommConfig.AppId,
			      profile:{picture1:$scope.profile.picture1},
			      sendFieldsAs: 'json'
			    }).then(function (resp) {
			      //console.log('Success ' + resp.config.file.name + 'uploaded. Response: ' + resp.data);
			    }, function (resp) {
			      //console.log('Error status: ' + resp.status);
			    }, function (evt) {
			      //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			      //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			    });
			};	
			$scope.profileclick7 = function(c,form)
			{
				console.log($scope.profile.picture1);
				$scope.jprofile.profile = $scope.profile;
				fileUpload.uploadFileToUrl($scope.profile.picture1, 'http://localhost:3000/api/v1/profiles',$scope.user.token);
			};	
			$scope.profileclick8 = function(c,form)
			{
				console.log($scope.profile.picture1);
				$scope.jprofile.profile = $scope.profile;
				console.log($scope.jprofile);

				CalcommResource.saveProfile2($scope.jprofile).$promise.then(function(response){
							
						});
				
			};	
			$scope.profileclick9 = function(c,form)
			{
				var fd = new FormData();
        		fd.append('picture1', $scope.profile.picture1);
            fd.append('token',$scope.user.token);
            fd.append('app_id','e86aea35d849802cdf17e00d965c7bd9');
            fd.append('profile',$scope.profile);
            CalcommResource.saveProfile(fd).$promise.then(function(response){
							
						});
			};	
			$scope.profileclick10 = function(c,form)
			{
				var fd = new FormData();
        		fd.append('picture1', $scope.profile.picture1);
            fd.append('token',$scope.user.token);
            fd.append('app_id','e86aea35d849802cdf17e00d965c7bd9');
            fd.append('profile',$scope.profile);
            CalcommResource.saveProfile2(fd).$promise.then(function(response){
							
						});
			};		
		
		
})
.directive('uploaderModel', ["$parse", function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) 
		{
			iElement.on("change", function(e)
			{
				var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                    	scope.$apply(function () {
                    		scope.previewo = loadEvent.target.result;
                    	});
                    	//console.log('loader file reader:'+loadEvent.target.result);
                    	//scope.previewo = loadEvent.target.result;
                    	//scope.previewo = 'somepo';
                    }
                    reader.readAsDataURL(iElement[0].files[0]);
				$parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
			});
		}
	};
}])
.service('upload',function ($http, $q) 
{
	this.uploadFile = function(data)
	{
		var deferred = $q.defer();
		//var formData = new FormData();
		return $http.post('http://localhost:3000/api/v1/profiles', data, {
			headers: {
				"Content-type": undefined
			},
			transformRequest: angular.identity
		})
		.success(function(res)
		{
			deferred.resolve(res);
		})
		.error(function(msg, code)
		{
			deferred.reject(msg);
		})
		return deferred.promise;
	}	
}).directive('fileChange', function () {

    var linker = function ($scope, element, attributes) {
        element.bind('change', function (event) {
            var files = event.target.files;
            $scope.$apply(function () {
            		$scope.files = element[0].files[0];
                    $scope.profile.picture1=element[0].files[0];
                    console.log("imagen in"+$scope.files[0]);
                
            });
        });
    };

    return {
        restrict: 'A',
        link: linker
    };

})
.factory('uploadService', ['$rootScope', function ($rootScope) {

    return {
        send: function (file,token,data) {
            var data = new FormData(),
                xhr = new XMLHttpRequest();

            xhr.onloadstart = function () {
                $rootScope.$emit('upload:loadstart', xhr);
                console.log("Request: "+xhr);
            };

            xhr.onerror = function (e) {
                $rootScope.$emit('upload:error', e);
                console.log("Error envio: "+e);
            };
            data.append('picture1', file, 'picture1.jpg');
            data.append('token',token);
            data.append('app_id','e86aea35d849802cdf17e00d965c7bd9');
            data.append('profile',data);
            xhr.open('POST', 'http://localhost:3000/api/v1/profiles');
            xhr.send(data);
        }
    };

}])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.service('fileUpload', ['$http','$rootScope', function ($http,$rootScope) {
    this.uploadFileToUrl = function(file, uploadUrl,token){
        var fd = new FormData();
        fd.append('picture1', file);
            fd.append('token',token);
            fd.append('app_id','e86aea35d849802cdf17e00d965c7bd9');
            fd.append('profile',{picture1:file,gender:'male',shoesize:'5'});
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);

