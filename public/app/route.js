angular.module('appRoutes', ['ngRoute'])

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
                controllerAs: 'register'
            })

            .when('/sign', {
                templateUrl: 'app/views/templates/users/signin.html'
            })

            .when('/profile', {
                templateUrl: 'app/views/templates/users/profile.html'
            })

            .when('/logout', {
                templateUrl: 'app/views/templates/users/logout.html'
            })

            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });

console.log('angular routes is here');
