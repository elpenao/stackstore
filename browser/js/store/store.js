app.config(function($stateProvider) {
    $stateProvider.state('store', {
        url: '/store/:url',
        templateUrl: 'js/store/store.html',
        controller: 'StoreCtrl',
        resolve: {
            storeInfo: function(StoreFactory,$stateParams) {
                return StoreFactory.getStoreInfo($stateParams.url);
            }
        }
    });
});



app.controller('StoreCtrl', function($scope,storeInfo,StoreFactory,$state,$stateParams) {
    $scope.storeInfo = storeInfo;
    $scope.data = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two",
        bottom: false
    };

    $scope.answers = {};

    $scope.selectAnswer = function(question,answer){
        $scope.answers[question._id] = answer;
        console.log($scope.answers)
        if(question._id === $scope.storeInfo.questions[$scope.storeInfo.questions.length-1]._id){
            submitAnswers()
            // $state.go('checkout')
        }
        $scope.next();
    }

    $scope.next = function() {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
    };


    $scope.previous = function() {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    var submitAnswers = function(){
        var tags = [];
        for(var answer in $scope.answers){
            tags = tags.concat($scope.answers[answer].tags);
        }
        StoreFactory.sendAnswers($stateParams.url,tags)
        .then(function(bestProduct){
            console.log(bestProduct)
        })
    }

});


app.factory('StoreFactory', function($http) {
    return {
        getStoreInfo: function(url) {
            return $http.get('/api/store/'+url)
                .then(function(res) {
                    return res.data;
                })
        },
        getAllStores: function() {
            return $http.get('/api/store/')
                .then(function(res) {
                    return res.data;
                })
        },
        sendAnswers: function(url,tags) {
            return $http.post('/api/products/store/'+url+'/tags',tags)
                .then(function(res){
                    return res.data
                })
        }
    };
});

