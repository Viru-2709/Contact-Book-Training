let url = $("#url").val();

$(document).ready(function () {
    $("#forget_password_btn").click(function (event) {
        $('#forget_password_btn').prop('disabled', true);
        event.preventDefault();
        $('#forget_password_form').ajaxForm(function (result) {
            $('#forget_password_btn').prop('disabled', false);
            if (result.flag == 1) {
                showToast(result.msg, 'success');
                $('#forget_password_btn').prop('disabled', false);
                setTimeout(function () {
                    window.location.href = `${url}`;
                }, 3000);
            }
            else {
                showToast(result.msg, 'danger');
            };
        }).submit();
    });
}); 