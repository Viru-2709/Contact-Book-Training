let url = $("#url").val();

$(document).ready(function () {
    $("#logout_btn").click(function (result) {
        ajaxRequest('POST', `${url}/logout`, null, 'application/x-www-form-urlencoded', true, function (result) {
            if (result.flag == 1) {
                window.location.href = `${url}`;
            }
        });
    });
});
