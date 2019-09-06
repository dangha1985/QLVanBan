$("td:first-child").css('min-width', '200px');
$(document).ready(function() {
    setHeightTreeGridIndent();
    setHeightTreeGridExpander();
    $(window).resize(function() {
        setHeightTreeGridIndent();
        setHeightTreeGridExpander();
    });
    // $("span").click(function() {
    //     setHeightTreeGridExpander();
    // })
});

function setHeightTreeGridIndent() {
    $("#tableBody td:first-child").each(function () {
        if ($(this).find(".spanInSpan").length > 0) {
            var h1 = $(this).innerHeight() + 1;
            var h2 = $(this).height();
            var x = 0;
            // console.log("Yes. Inner Height: " + h1 + ". Height of element: " + h2);
            if (h1 <= 34) { // 1 line
                x = -6;
            } else if (h1 <= 53) { // 2 line
                x = -15;
            } else if (h1 <= 74) { // 3 line
                x = -25;
            } else if (h1 <= 95) { // 4 line
                x = -35;
            } else if (h1 <= 116) { // 5 line
                x = -47;
            } else if (h1 <= 137) { // 6 line
                x = -58;
            } else {
                x = 0;
            }
            $(this).find(".spanInSpan").css({
                "height": h1,
                "top": x
            })
        } else {
            // console.log("No");
        }

    })
}

function setHeightTreeGridExpander() {
    $("#tableBody td:first-child").each(function () {
        if ($(this).find(".treegrid-expander-expanded").length > 0) {
            var h1 = $(this).innerHeight() + 1;
            var h2 = $(this).height();
            var x = 0;
            // console.log("Yes. Inner Height: " + h1 + ". Height of element: " + h2);
            if (h1 <= 34) {
                x = 8;
            } else if (h1 <= 53) {
                x = 17;
            } else if (h1 <= 74) {
                x = 28;
            } else if (h1 <= 95) { // 4 line
                x = 39;
            } else if (h1 <= 116) { // 5 line
                x = 50;
            } else if (h1 <= 137) { // 6 line
                x = 61;
            } else {
                x = 0;
            }
            $(this).find(".spanInExpander").css("height", x);
        } else {
            // console.log("No");
        }
    })
}
