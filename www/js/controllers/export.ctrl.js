angular.module('app')
    .controller('exportCtrl', function($rootScope, $scope, $cordovaSQLite, $http, $cordovaToast) {
        $scope.$on("$ionicView.afterEnter", function(event, data) {
            $scope.settings = {};
            $scope.form = {};
            var selectData = function() {
                $cordovaSQLite.execute($rootScope.DB, 'SELECT * FROM settings WHERE ID = 1')
                    .then(
                        function(result) {
                            $scope.settings = result.rows.item(0);
                        },
                        function(error) {
                            //$scope.debugError = error;
                            $cordovaToast.showLongBottom('โหลดรายการตั้งค่าผิดพลาด!');
                        }
                    );
            };
            selectData();
            $scope.formExportSubmit = function(formName) {

                $cordovaSQLite.execute($rootScope.DB, 'SELECT * FROM location ORDER BY CREATED DESC', [])
                    .then(
                        function(result) {
                            //$scope.allMessage = result;
                            var repeatDataForExport = [];
                            var i = 0;
                            while (i < result.rows.length) {
                                repeatDataForExport.push(result.rows.item(i));
                                i++;
                            }

                            $http({
                                    method: "POST",
                                    url: $scope.settings.SENT_TO_HOST + '/get_export_data.php',
                                    data: {
                                        TYPES: 'GET_DATA',
                                        DATA: repeatDataForExport,
                                        ADD_MESSAGE: $scope.form.MESSAGE,
                                        DEVICE_NAME:$scope.settings.DEVICE_NAME,
                                        PLATFORM:$scope.settings.PLATFORM,
                                        USERNAME:$scope.settings.USERNAME
                                    },
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                })
                                .then(function(response) {
                                    $cordovaToast.showLongBottom(response.data.MSG);
                                    if($scope.settings.AUTO_DELETE===1){
                                        $cordovaSQLite.execute($rootScope.DB, 'DELETE FROM location');
                                    }
                                    formName.$setPristine();
                                    $scope.form = {};
                                }, function(response) {
                                    $cordovaToast.showLongBottom("ไม่สามารถเชื่อมต่อ Server");
                                });

                        },
                        function(error) {
                            $cordovaToast.showLongBottom('โหลดข้อมูลผิดพลาด!');
                        }
                    );
            };
        });




    })
