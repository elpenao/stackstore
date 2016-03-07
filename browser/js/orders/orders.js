app.config(function($stateProvider) {
    $stateProvider.state('orders', {
        url: '/orders',
        onEnter: function($state, AuthService) {
            if (!AuthService.isAuthenticated()) $state.go("home");
        },
        templateUrl: 'js/orders/orders.html',
        controller: 'OrdersCtrl',
        resolve: {
            allMyOrders: function(AuthService, OrdersFactory) {
                return OrdersFactory.getAllMyOrders()
                    .catch(console.log.bind(console))
            },
            orderDetails: function(){return null},
            confNum: function(){return null}
        }
    });
});

app.controller("OrdersCtrl", function($scope, $state, allMyOrders, orderDetails, OrdersFactory, confNum, AuthService) {    
    if(allMyOrders) allMyOrders = allMyOrders.map(function(order) {
        order.numItems = order.contents.reduce(function(prev, next) {
            return prev + next.quantity;
        }, 0);
        return order;
    });
    $scope.allMyOrders = allMyOrders;
    $scope.orderDetails = orderDetails;
    $scope.confNum = confNum;

    $scope.isAuthenticated = AuthService.isAuthenticated;

    $scope.goHome = function(){
        $state.go("home");
    }

    $scope.selectRow = function(order){
        $scope.orderDetails = order;
    }
});

app.config(function($stateProvider) {
    $stateProvider.state('thankyou', {
        url: '/thankyou/:confirmationNum',
        templateUrl: 'js/orders/orders.html',
        controller: "OrdersCtrl",
        resolve: {
            allMyOrders: function(AuthService, OrdersFactory) {
                return OrdersFactory.getAllMyOrders()
                    .catch(console.log.bind(console))
            },
            orderDetails: function(OrdersFactory, $stateParams) {
                return OrdersFactory.getOrderDetails($stateParams.confirmationNum);
            },
            confNum: function($stateParams) {
                return $stateParams.confirmationNum;
            }
        }
    });
});

app.factory('OrdersFactory', function($http) {
    return {
        getAllMyOrders: function() {
            return $http.get('/api/user/orders')
                .then(function(res) {
                    return res.data;
                })
        },
        getOrderDetails: function(confirmationNum) {
            return $http.get('api/orders/' + confirmationNum)
                .then(function(res) {
                    return res.data;
                })
        }
    };
});