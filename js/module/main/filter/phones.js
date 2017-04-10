HJY.filter("encryPt", function() { //
    return function(input, uppercase) {
        if (input == undefined) {
            return "180****0000"
        } else {
            return input.replace(/(\d{3})(\d{4})/, "$1****");
        }
    }
})
HJY.filter("cardfilter", function() { //
    return function(input, uppercase) {
        if (input == undefined) {
            return "180****0000"
        } else {
            return input.replace(/(\d{4})/, "$1 ");
        }
    }
})