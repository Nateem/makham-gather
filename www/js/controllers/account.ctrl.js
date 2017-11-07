angular.module('app')
    .controller('AccountCtrl', function($rootScope, $scope, $cordovaSQLite, $cordovaToast) {

        $scope.settings = {};
        var selectData = function() {
            $cordovaSQLite.execute($rootScope.DB, 'SELECT * FROM settings WHERE ID = 1')
                .then(
                    function(result) {
                        $scope.settings = result.rows.item(0);
                        $scope.settings.DElboolean = ($scope.settings.AUTO_DELETE == 1) ? true : false;
                    },
                    function(error) {
                        //$scope.debugError = error;
                        $cordovaToast.showLongBottom('โหลดรายการ SELECT ผิดพลาด!');
                    }
                );
        };
        selectData();
        $scope.SettingChange = function() {
            $scope.settings.AUTO_DELETE = ($scope.settings.DElboolean == true) ? 1 : 0;
            $cordovaSQLite.execute($rootScope.DB, 'UPDATE settings SET SENT_TO_HOST = ?,DEVICE_NAME = ?,USERNAME = ?,AUTO_DELETE = ? WHERE ID = 1', [$scope.settings.SENT_TO_HOST, $scope.settings.DEVICE_NAME, $scope.settings.USERNAME, $scope.settings.AUTO_DELETE])
                .then(
                    function(result) {
                        selectData();
                    },
                    function(error) {
                        $cordovaToast.showLongBottom('โหลดรายการ INSERT ผิดพลาด!');
                    }
                );
        }


    })
