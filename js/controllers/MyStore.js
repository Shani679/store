app.controller('MyStore', ($scope,$http)=>{
	$scope.products=[];
	$scope.filterGender=[];
	$scope.filterBudget=[];
	$scope.dataToShow=[];
	$scope.genderValue;
	$scope.budgetValue;
	$scope.notFound=false;
	$http.get('/store/products.json').then(function(data){
	 	$scope.filterGender=data.data.GenderFilter;
	 	$scope.filterBudget=data.data.PriceFilter;
	 	$scope.filterGender[0].DisplayText="HIM";
		$scope.filterGender[1].DisplayText="HER";
	 	createProductsArr(data.data.Stores);
	 	$scope.dataToShow=$scope.products;
	}).catch(function(err){
	    console.log(err);
	})

	function createProductsArr(storesArr){
		for (var i = 0; i < storesArr.length; i++) {
			for (var j = 0; j < storesArr[i].Products.length; j++) {
				storesArr[i].Products[j].storeName=storesArr[i].StoreName;
				$scope.products.push(storesArr[i].Products[j])
			};
		};
	}
	$scope.filterByGender=(value)=>{
		debugger;
		$scope.genderValue=value;
		$scope.dataToShow=filterBy($scope.budgetValue, filterByGender, filterByBudget);
		$scope.notFound=false;
		if($scope.dataToShow.length==0){
			$scope.notFound=true;
		}
	}
	$scope.filterByBudget=(value)=>{
		$scope.budgetValue=value;
		$scope.dataToShow=filterBy($scope.genderValue, filterByBudget, filterByGender);
		$scope.notFound=false;
		if($scope.dataToShow.length==0){
			$scope.notFound=true;
		}
	}
	function filterByGender(arr){
		var otherValue = ($scope.genderValue==3) ? 4 : 3;
		if($scope.genderValue!="both"){
			return filterByGenderValue(false, $scope.genderValue, otherValue, arr);
		}
		return filterByGenderValue(true, 4, otherValue, arr);
	}
	
	function filterByBudget(arr){
		var result=[];
		if($scope.budgetValue!="$100+" && $scope.budgetValue!="all"){
			var min=$scope.budgetValue.split("-")[0];
			var max=$scope.budgetValue.split("-")[1];
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].Price>=min && arr[i].Price<=max){
					result.push(arr[i])
				}
			}
			return result;
		}
		if($scope.budgetValue=="$100+"){
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].Price>=100){
					result.push(arr[i]);
				}
			}
			return result;
		}
		return arr;
	}

	function filterByGenderValue(bool, value, otherValue, arr){
		var result=[]
		for (var i = 0; i < arr.length; i++) {
			var foundValue=false 
			var foundOtherValue=false;
			for (var j = 0; j < arr[i].ProductTags.length; j++) {
				if(arr[i].ProductTags[j]==value){
					foundValue=true;
				}
				if(arr[i].ProductTags[j]==otherValue){
					foundOtherValue=true;
				}
			}
			if(foundValue && foundOtherValue==bool){
				result.push(arr[i])
			}	
		}
		return result
	}

	function filterBy(value, cb, cb2){
		if(!value){
			return cb($scope.products);
		}
		return cb(cb2($scope.products));
	}
})