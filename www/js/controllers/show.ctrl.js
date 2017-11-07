angular.module('app')
    .controller('showCtrl', function($rootScope, $scope,$state, $cordovaSQLite, $cordovaToast, $cordovaDialogs) {

        var selectType = function() {
            $cordovaSQLite.execute($rootScope.DB, 'SELECT ID,MASCODE,NAME FROM location ORDER BY CREATED DESC', [])
                .then(
                    function(result) {
                        //$scope.allMessage = result;
                        $scope.locationRepeat = [];
                        var i = 0;
                        while (i < result.rows.length) {
                            $scope.locationRepeat.push(result.rows.item(i));
                            i++;
                        }
                    },
                    function(error) {
                        $cordovaToast.showLongBottom('โหลดรายการผิดพลาด!');
                    }
                );
        };
        selectType();
        // เมื่อคลิกแท็บเข้ามา
        $scope.$on("$ionicView.enter", function(event, data) {
            // คำสั่ง sql
            $cordovaSQLite.execute($rootScope.DB, 'SELECT ID FROM location', [])
                .then(
                    // ถ้าคำสั่งสำเร็จ
                    function(result) {
                        //ตรวจสอบ ถ้าข้อมูลเปลี่ยนแปลงไปจากตอนแรก( .run - app.js )
                        if ($rootScope.onLoadShow != result.rows.length) {
                            //ให้โหลดข้อมูลใหม่อีกครั้ง
                            selectType();
                            // เปลี่ยนค่าให้เป็นปัจจุบัน
                            $rootScope.onLoadShow = result.rows.length;
                        }
                    },
                    // ถ้าคำสั่ง เออเร่อ
                    function(error) {

                    }
                );
            $scope.delDataWhereId = function(id) {
                $cordovaDialogs.confirm('คุณต้องการลบ ใช่ หรือ ไม่ ?', 'ยืนยัน !', ['ใช่', 'ยกเลิก'])
                    .then(function(buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            $cordovaSQLite.execute($rootScope.DB, 'DELETE FROM location WHERE ID = ? ', [id]).then(function(res) {
                                $cordovaToast.showLongBottom("ลบข้อมูลสำเร็จ..");
                                selectType();
                            }, function(err) {
                                $cordovaToast.showLongBottom("Error : " + err);
                            });

                        }

                    });
            }
        });

    })
