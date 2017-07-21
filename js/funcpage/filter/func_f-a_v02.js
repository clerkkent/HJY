HJY.filter("cardPt", function() { //
    return function(input, uppercase) {
        if (input.length == 16) {
            return input.replace(/(\d{2})(\d{10})(\d{4})/, "$1****$3");
        } else if (input.length == 19) {
            return input.replace(/(\d{2})(\d{13})(\d{4})/, "$1****$3");
        }

    }
})