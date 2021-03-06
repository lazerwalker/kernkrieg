'use strict';

angular.module('kkApp')
.factory('Queue', ['$resource', function($resource) {
  return $resource('/api/queue/:id', {id : '@id'},
    {query:
      {method: 'GET',
      transformResponse: function (data) {
        return angular.fromJson(data).objects},
      isArray: false},
    update: {method:'PUT'}});
}]);


angular.module('kkApp')
.factory('MultiQueueLoader', ['Queue', '$q',
  function(Queue, $q) {
    return function() {
      var delay = $q.defer();
      Queue.query(function(queues) {
        delay.resolve(queues.objects);
      }, function() {
        delay.reject('Unable to fetch queues');
      });
      return delay.promise;
    };
  }]);

angular.module('kkApp')
.factory('TestQueueLoader', ['Queue', '$q',
  function(Queue, $q) {
    return function() {
      var delay = $q.defer();
      Queue.query({q: angular.toJson({filters:[{name:"qType",op:"eq",val:0}]})},function(queues) {
        delay.resolve(queues.objects);
      }, function() {
        delay.reject('Unable to fetch queues');
      });
      return delay.promise;
    };
  }]);

angular.module('kkApp')
.factory('NonTestQueueLoader', ['Queue', '$q',
  function(Queue, $q) {
    return function() {
      var delay = $q.defer();
      Queue.query({q: angular.toJson({filters:[{name:"qType",op:"neq",val:0}]})},function(queues) {
        delay.resolve(queues.objects);
      }, function() {
        delay.reject('Unable to fetch queues');
      });
      return delay.promise;
    };
  }]);

angular.module('kkApp')
.factory('SublQueueLoader', ['$http',
  function($http) {
    return function(warrior) {
      var promise = $http.get('/api/queue/submittable?w=' + warrior.id).then(function (response) {
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    };
  }]);

angular.module('kkApp')
.factory('QueueLoader', ['Queue', '$route', '$q',
  function(Queue, $route, $q) {
    return function() {
      var delay = $q.defer();
      Queue.get({id: $route.current.params.queueId},function(queue) {
        delay.resolve(queue);
      }, function() {
        delay.reject('Unable to fetch queue' + $route.current.params.queueId);
      });
      return delay.promise;
    };
  }]);

angular.module('kkApp')
.factory('QueueID', ['$q',
  function(Queue, $q) {
    var queueId
    return function() {
      var delay = $q.defer();
      Queue.query(function(queues) {
        delay.resolve(queues.objects);
      }, function() {
        delay.reject('Unable to fetch queues');
      });
      return delay.promise;
    };
  }]);