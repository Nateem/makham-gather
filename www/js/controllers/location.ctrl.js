angular.module('app')
    .controller('locationCtrl', function($rootScope, $scope, $cordovaGeolocation, $cordovaToast, $cordovaDialogs, $cordovaSQLite) {
        document.addEventListener("deviceready", function() {

        }, false);
        $scope.form = {};
        $scope.patternNumberDouble = /[0-9.]/;
        $scope.patternNumberInt = /[0-9]/;
        $scope.ageRepeat = [{
            "NAME": "อายุพืช 1-5 ปี",
            "VALUE": 1,
        }, {
            "NAME": "อายุพืช 6-10 ปี",
            "VALUE": 2,
        }, {
            "NAME": "อายุพืช 11-15 ปี",
            "VALUE": 3,
        }, {
            "NAME": "อายุพืช 15-20 ปี",
            "VALUE": 4,
        }, {
            "NAME": "อายุพืช 20 ปีขึ้นไป",
            "VALUE": 5,
        }, ];
        $scope.getLocation = function() {
            console.log("click");
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    var lat = position.coords.latitude
                    var long = position.coords.longitude
                    $scope.form.LAT = lat;
                    $scope.form.LONG = long;
                }, function(err) {
                    $cordovaToast.showLongBottom("Error : กรุณาตรวจสอบ GPS");
                });
        }
        $scope.formSubmit = function(formName) {
                $cordovaDialogs.confirm('คุณต้องการบันทึก ใช่ หรือ ไม่ ?', 'ยืนยัน !', ['ใช่', 'ยกเลิก'])
                    .then(function(buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            var DNOW = new Date();
                            $cordovaSQLite.execute($rootScope.DB, 'INSERT INTO location (LAT,LONG,MASCODE,NAME,NOTE,FRUIT_TYPE,FRUIT_QTY,FRUIT_AREA,FRUIT_AGE_ID,CREATED) VALUES (?,?,?,?,?,?,?,?,?,?)', [$scope.form.LAT, $scope.form.LONG, $scope.form.MASCODE, $scope.form.NAME, $scope.form.NOTE, $scope.form.FRUIT_TYPE, $scope.form.FRUIT_QTY, $scope.form.FRUIT_AREA, $scope.form.FRUIT_AGE_ID, DNOW]).then(function(res) {
                                $cordovaToast.showLongBottom("บันทึกข้อมูลสำเร็จ..");
                                formName.$setPristine();
                                $scope.form = {};
                            }, function(err) {
                                $cordovaToast.showLongBottom("Error : "+err);
                            });
                            
                        }

                    });
            }
            /*
            $scope.radioTest = function() {
                $cordovaToast.showLongBottom($scope.form.FRUIT_AGE_ID).then(function(success) {
                    // success
                }, function(error) {
                    // error
                });
            }*/
    })
