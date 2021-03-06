calcomm.factory('CalcommResource', function($resource,CalcommConfig) {
		return $resource("http://"+CalcommConfig.IP+":3000/api/v1/", {
			id: "@id"
		}, {
      saveProfile:{
        method:'POST',
        url:'http://'+CalcommConfig.IP+':3000/api/v1/profiles',
        transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
      },
      saveProfile2:{
        method:'POST',
        url:'http://'+CalcommConfig.IP+':3000/api/v1/profiles',
        transformRequest: function(data, headersGetter) {
        // Here we set the Content-Type header to null.
        var headers = headersGetter();
        headers['Content-Type'] = undefined;

        // And here begins the logic which could be used somewhere else
        // as noted above.
        if (data == undefined) {
          return data;
        }

        var fd = new FormData();

        var createKey = function(_keys_, currentKey) {
          var keys = angular.copy(_keys_);
          keys.push(currentKey);
          formKey = keys.shift()

          if (keys.length) {
            formKey += "[" + keys.join("][") + "]"
          }

          return formKey;
        }

        var addToFd = function(object, keys) {
          angular.forEach(object, function(value, key) {
            var formKey = createKey(keys, key);

            if (value instanceof File) {
              fd.append(formKey, value);
            } else if (value instanceof FileList) {
              if (value.length == 1) {
                fd.append(formKey, value[0]);
              } else {
                angular.forEach(value, function(file, index) {
                  fd.append(formKey + '[' + index + ']', file);
                });
              }
            } else if (value && (typeof value == 'object' || typeof value == 'array')) {
              var _keys = angular.copy(keys);
              _keys.push(key)
              addToFd(value, _keys);
            } else {
              fd.append(formKey, value);
            }
          });
        }

        addToFd(data, []);

        return fd;
      }
    
      }
		});
	})
.factory('CalcommLogin', function (Session,$http,$location,$window,$rootScope,CalcommConfig,Stats) {
  var calcommlogin = {};
  var data;
  var errors;

	calcommlogin.register = function (dataregister,social) {
    	var cookie = {};
      var url = 'http://'+CalcommConfig.IP+':3000/api/v1/normal/register/';

      if(social)
        url = 'http://'+CalcommConfig.IP+':3000/api/v1/social/register/';

		$http.post(url,dataregister,{"headers" : "Content-Type=application/x-www-form-urlencoded; charset=UTF-8"})
		.then(function successCallback(response) {
      data=response.data.data;
      errors = response.data.errors;
			//console.log("sucess: "+JSON.stringify(response.data));
      //console.log("sucess data: "+JSON.stringify(data));
      //console.log("Token: "+response.data.data.relations.tokens[0].attributes.token);
      if(errors==''|| !errors)
      {
        switch(dataregister.auth.provider){
            case 'facebook':
            //console.log('facebook elegido');
              FB.api('/'+dataregister.auth.uid+'/picture?width=800&height=800',function (picture) {
                //console.log("picture: "+JSON.stringify(picture));
                cookie.id = dataregister.auth.uid;
                cookie.user=dataregister.auth.info.name;
                cookie.email= dataregister.auth.info.email;
                cookie.image=picture.data.url;
                cookie.token=data.relations.tokens[0].attributes.token;
                cookie.provider = dataregister.auth.provider;
                Session.StoreSession(cookie);
                //console.log("ALMACENADA LA COOKIE Y REDIRECCIONANDO");
                $window.location.href = '#/signup';
              });
              break;
            case 'google':
                cookie.id = dataregister.auth.uid;
                cookie.user=dataregister.auth.info.name;
                cookie.email= dataregister.auth.info.email;
                cookie.image=dataregister.auth.info.picture;
                cookie.token=data.relations.tokens[0].attributes.token
                cookie.provider = dataregister.auth.provider;
                Session.StoreSession(cookie);
                $window.location.href = '#/signup';
              break;
            case 'angular':
              cookie.id = response.data.data.attributes.id;
              cookie.user=response.data.data.attributes.name;
              cookie.email= response.data.data.attributes.email;
              cookie.token=data.relations.tokens[0].attributes.token;
              cookie.provider = dataregister.auth.provider;
              Session.StoreSession(cookie);
              $window.location.href = '#/signup';
              break;
        };
        
        
      }
      else
      {
        //console.log(response.errors);
        notificar(response.errors);
        
      }

		}, function errorCallback(response) {
      if(response!=undefined)
      {
        notificar(response.data.errors[0]);
      }
      else
      {
        notificar(Stats.missed);
      }
		});
  };

  calcommlogin.login = function(credentials,social){
    var cookie={forms:{}};
    $rootScope.forms={basicinfo:{},profile:{},experience:{},availability:{},legal:{}};
    var url = 'http://'+CalcommConfig.IP+':3000/api/v1/normal/login/';

      if(social)
        url = 'http://'+CalcommConfig.IP+':3000/api/v1/social/login/';

    $http.post(url,credentials,{}).then(function successCallback(response){
      data=response.data.data;
      errors = response.data.errors;
      //console.log("sucess: "+JSON.stringify(response));
      ////console.log("sucess data: "+JSON.stringify(data));
      ////console.log("Token: "+data.relations.tokens[0].attributes.token);
      if (errors==''|| !errors) {
          cookie.id = data.id;
          cookie.user=data.attributes.name;
          cookie.email= data.attributes.email;
          cookie.image=data.attributes.picture;
          cookie.token=data.relations.tokens[0].attributes.token;
          cookie.provider = data.attributes.provider;

            if(data.relations.basic != undefined)
              cookie.forms.basic=true;
            else
              //console.log('no existe basic');

            if(data.relations.profile != undefined)
              cookie.forms.profile=true;
            if(data.relations.experience != undefined)
              cookie.forms.experience=true;
            if(data.relations.availability != undefined)
              cookie.forms.availability=true;
            if(data.relations.legal != undefined)
              cookie.forms.legal=true;
            Session.StoreSession(cookie);

          $window.location.href = '#/signup';
      } else{
        //console.log("Sucess with errors: "+errors);
        notificar(errors.errors);
      };
    },function errorCallback(response){
       if(response!=undefined)
        {
          notificar(response.data.errors[0]);
        }
        else
        {
          notificar(Stats.missed);
        }
    });
  }
 
  calcommlogin.isAuthenticated = function () {
    return Session.getSession()!=null;//validar campos validos
  };
  calcommlogin.isAllowed = function () {
    return Session.getSession()!=null;//validar campos validos
  };
 
  return calcommlogin;
});