'use strict';

export default ($scope, $http) => {
  $scope.kpi = '';

  $scope.getKPI = () => {
    $http.get('http://localhost:3000/api/ratio')
      .then((res) => {
        $scope.kpi = res.data.KPIratio;
      })
      .catch((err) => console.log(err));
  };
};
