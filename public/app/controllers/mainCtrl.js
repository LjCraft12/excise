angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope) {
        var app = this;

        app.loadMe = false;             //use this variable so that the user never sees angular data inside the browser before the page is fully loaded

        //on page refresh of change make sure angular looks at all requirements of display to change
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {
                console.log('Success user is logged in');
                Auth.getUser().then(function (data) {
                    console.log(data.data.username);
                    app.username = data.data.username;
                    app.loadMe = true;
                });
            } else {
                console.log('Failure user is not signed in');
                app.username = '';
                app.loadMe = true;
            }
        });

        this.doLogin = function (loginData) {
            app.loading = true;
            app.errorMsg = false;

            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';
                    $timeout(function () {
                        $location.path('/profile');
                        app.loginData = '';
                        app.successMsg = false;
                    }, 2000)
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };

        this.logout = function () {
            Auth.logout();
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
            }, 2000)
        };

    });