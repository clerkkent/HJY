HJY.filter("encryPt", function() {
    return function(input, uppercase) {
        console.log(input)
        return input.replace(/(\d{3})(\d{4})/, "$1****");
    }
})