// Ionic app App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova'])

.run(function($rootScope, $ionicPlatform, $cordovaSQLite, $ionicLoading) {
    $ionicPlatform.ready(function() {

        $rootScope.app = {};
        $rootScope.app.name = "GPS รวบรวมข้อมูล";

        var location = "CREATE TABLE IF NOT EXISTS location (ID INTEGER PRIMARY KEY AUTOINCREMENT," +
            "LAT TEXT," +
            "LONG TEXT," +
            "MASCODE TEXT," +
            "NAME TEXT," +
            "NOTE TEXT," +
            "FRUIT_TYPE TEXT," +
            "FRUIT_QTY INTEGER," +
            "FRUIT_AREA TEXT," +
            "FRUIT_AGE_ID INTEGER," +
            "CREATED TEXT" +
            ")";
        var CREATE_plant_age = "CREATE TABLE IF NOT EXISTS plant_age (ID INTEGER , " +
            "NAME TEXT " +
            ")";
            
        var INSERT_plant_age = "INSERT INTO plant_age(ID,NAME) VALUES (?,?)";

        var TB_Settings = "CREATE TABLE IF NOT EXISTS settings ( ID INTEGER DEFAULT '1' ," +
            "SENT_TO_HOST TEXT DEFAULT 'http://192.168.1.102' , " +
            "DEVICE_NAME TEXT DEFAULT 'My Phone' , " +
            "PLATFORM TEXT , " +
            "USERNAME TEXT DEFAULT 'User' , " +
            "AUTO_DELETE NUMERIC DEFAULT 0 " +
            ")";
        var IS_Settings = "INSERT INTO settings(ID,SENT_TO_HOST,DEVICE_NAME,PLATFORM,USERNAME,AUTO_DELETE) VALUES (?,?,?,?,?,?)";

        //var drop_settings = "DROP TABLE IF EXISTS settings";
        //var drop_location = "DROP TABLE IF EXISTS location";
        var onLoadShow = "SELECT ID FROM location";

        $rootScope.DB = $cordovaSQLite.openDB({ name: "fruit.db", location: 'default' });
        //$cordovaSQLite.execute($rootScope.DB, drop_location);
        $cordovaSQLite.execute($rootScope.DB, location);
        //$cordovaSQLite.execute($rootScope.DB, drop_settings);

        //สร้างตาราง ตั้งค่า ถ้ายังไม่เคยสร้าง 
        $cordovaSQLite.execute($rootScope.DB, TB_Settings).then(
            function(result) {
                //ตั้งค่าเริ่มต้นให้กับแอป
                $cordovaSQLite.execute($rootScope.DB, IS_Settings, ['1', "http://192.168.1.102", "My Phone", ionic.Platform.platform(), "User", 0]);
            }
        );
        $cordovaSQLite.execute($rootScope.DB, CREATE_plant_age).then(
            function(result) {                
                $cordovaSQLite.execute($rootScope.DB, INSERT_plant_age, ['1', 'อายุพืช 1-5 ปี']);
                $cordovaSQLite.execute($rootScope.DB, INSERT_plant_age, ['2', 'อายุพืช 6-10 ปี']);
                $cordovaSQLite.execute($rootScope.DB, INSERT_plant_age, ['3', 'อายุพืช 11-15 ปี']);
                $cordovaSQLite.execute($rootScope.DB, INSERT_plant_age, ['4', 'อายุพืช 15-20 ปี']);
                $cordovaSQLite.execute($rootScope.DB, INSERT_plant_age, ['5', 'อายุพืช 20 ปีขึ้นไป']);
            }
        );

        //ตรวจสอบจำนวนของข้อมูล ป้องกันการโหลดซ้ำในเมนูแสดงผล
        $cordovaSQLite.execute($rootScope.DB, onLoadShow).then(
            function(result) {
                //ประกาศค่าจำนวนของข้อมูล
                $rootScope.onLoadShow = result.rows.length;
            }
        );
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('tab.help', {
            url: '/help',
            views: {
                'tab-help': {
                    templateUrl: 'templates/tab-help.html',
                    controller: 'HelpCtrl'
                }
            }
        })

        .state('tab.location', {
            url: '/location',
            views: {
                'tab-location': {
                    templateUrl: 'templates/tab-location.html',
                    controller: 'locationCtrl'
                }
            }
        })

        .state('tab.show', {
                url: '/show',
                views: {
                    'tab-show': {
                        templateUrl: 'templates/tab-show.html',
                        controller: 'showCtrl'
                    }
                }
            })
            .state('tab.show-detail', {
                url: '/show/:showId/:MASCODE/:NAME',
                views: {
                    'tab-show': {
                        templateUrl: 'templates/show-detail.html',
                        controller: 'showDetailCtrl'
                    }
                }
            })

        .state('tab.export', {
            url: '/export',
            views: {
                'tab-export': {
                    templateUrl: 'templates/tab-export.html',
                    controller: 'exportCtrl'
                }
            }
        })

        .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })



        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/help');

    })
    .factory('customeInterceptor', function($timeout, $injector, $q) {

        var requestInitiated;

        function showLoadingText() {
            $injector.get("$ionicLoading").show(
                /*{
                 template: 'Loading...',
                 animation: 'fade-in',
                 showBackdrop: true
                 }*/
            );
        };

        function hideLoadingText() {
            $injector.get("$ionicLoading").hide();
        };

        return {
            request: function(config) {
                requestInitiated = true;
                showLoadingText();
                console.log('Request Initiated with interceptor');
                return config;
            },
            response: function(response) {
                requestInitiated = false;

                // Show delay of 300ms so the popup will not appear for multiple http request
                $timeout(function() {

                    if (requestInitiated) return;
                    hideLoadingText();
                    console.log('Response received with interceptor');

                }, 300);

                return response;
            },
            requestError: function(err) {
                hideLoadingText();
                console.log('Request Error logging via interceptor');
                return err;
            },
            responseError: function(err) {
                hideLoadingText();
                console.log('Response error via interceptor');
                return $q.reject(err);
            }
        }
    });
