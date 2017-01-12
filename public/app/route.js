var app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: 'app/views/templates/users/home.html',
                controller: 'homeCtrl',
                controllerAs: '$ctrl'
            })
            .when('/register', {
                templateUrl: 'app/views/templates/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })

            .when('/sign', {
                templateUrl: 'app/views/templates/users/signin.html',
                authenticated: false
            })

            .when('/profile', {
                templateUrl: 'app/views/templates/users/profile.html',
                authenticated: true
            })

            .when('/logout', {
                templateUrl: 'app/views/templates/users/logout.html',
                authenticated: true
            })

            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });

app.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.$$route.authenticated == true){
           if (!Auth.isLoggedIn()){
               event.preventDefault();                              //If they are not logged and and authentication is required send them back to the home page
               $location.path('/');
           }
        }else if (!next.$$route.authenticated == false){
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/profile');
            }
        }
    });
}]);

