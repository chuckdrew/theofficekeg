theofficekeg.filter('active', ["$filter", function ($filter) {
    return function(is_active){
        if(is_active) {
            return "Active";
        } else {
            return "";
        }
    };
}]);