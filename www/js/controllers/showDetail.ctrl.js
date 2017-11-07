angular.module('app')
    .controller('showDetailCtrl', function($rootScope, $scope,$state, $cordovaSQLite,$cordovaDialogs, $cordovaToast, $stateParams) {

        $scope.showId = $stateParams.showId;
        $scope.tabsName = $stateParams.MASCODE + ' : ' + $stateParams.NAME;
        $scope.getData = {};
        $scope.plantAge = {};
        var selectPlantAge = function(id){
            $cordovaSQLite.execute($rootScope.DB, 'SELECT * FROM plant_age WHERE ID = ?', [id])
                .then(
                    function(result) {
                        $scope.plantAge = result.rows.item(0);
                    },
                    function(error) {
                        $cordovaToast.showLongBottom('โหลดอายุพืชผิดพลาด!');
                    }
                );
        }
        var selectData = function() {
            $cordovaSQLite.execute($rootScope.DB, 'SELECT * FROM location WHERE ID = ?', [$scope.showId])
                .then(
                    function(result) {
                        $scope.getData = result.rows.item(0);
                        selectPlantAge($scope.getData.FRUIT_AGE_ID);
                    },
                    function(error) {
                        $cordovaToast.showLongBottom('โหลดรายการผิดพลาด!');
                    }
                );
        };
        selectData();

        $scope.delDataWhereId = function(){
            $cordovaDialogs.confirm('คุณต้องการลบ ใช่ หรือ ไม่ ?', 'ยืนยัน !', ['ใช่', 'ยกเลิก'])
                    .then(function(buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {                            
                            $cordovaSQLite.execute($rootScope.DB, 'DELETE FROM location WHERE ID = ? ',[$scope.showId]).then(function(res) {
                                $cordovaToast.showLongBottom("ลบข้อมูลสำเร็จ..");
                                $state.go('tab.show');
                            }, function(err) {
                                $cordovaToast.showLongBottom("Error : "+err);
                            });
                            
                        }

                    });
        }

    })
