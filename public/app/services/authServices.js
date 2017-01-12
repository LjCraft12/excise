angular.module('authServices', [])

    .factory('Auth', function ($http, AuthToken) {
        var authFactory = {};

        //Auth.create(regData)
        authFactory.login = function (loginData) {
            return $http.post('api/authenticate', loginData).then(function (data) {
                AuthToken.setToken(data.data.token);
                return data
            })
        };

        //AuthIsLoggedIn();
        authFactory.isLoggedIn = function () {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        // Auth.getUser();
        authFactory.getUser = function () {
            if (AuthToken.getToken()) {
                return $http.post('api/currentuser');              //return the current user if token is valid
            } else {
                $q.reject({message: 'User has no token'});
            }
        };

        // Auth.logout();
        authFactory.logout = function () {
            AuthToken.setToken();                                    //removing the token from local storage on log out
        };

        return authFactory;
    })

    .factory('AuthToken', function ($window) {
        var authTokenFactory = {};

        authTokenFactory.setToken = function (token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };
        // AuthToken.getToken();
        authTokenFactory.getToken = (function () {                  //gets tokens if they exist
            return $window.localStorage.getItem('token');
        });

        return authTokenFactory
    })

    .factory('AuthInterceptors', function (AuthToken) {                           //get token for every request
        var authInterceptorsFactory = {};

        authInterceptorsFactory.request = function (config) {
            var token = AuthToken.getToken();

            if (token) config.headers['x-access-token'] = token;            //assign tokens to the headers

            return config
        };

        return authInterceptorsFactory;
    });