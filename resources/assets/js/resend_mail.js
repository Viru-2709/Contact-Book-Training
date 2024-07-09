let url = $("#url").val();

$(document).ready(function () {
    $("#resend_mail_btn").click(function (event) {
        $('#resend_mail_btn').prop('disabled', true);
        event.preventDefault();
        $('#resend_mail_form').ajaxForm(function (result) {
            $('#resend_mail_btn').prop('disabled', false);
            if (result.flag === 1) {
                showToast(result.msg, 'success');
                setTimeout(function () {
                    window.location.href = `${url}`;
                }, 3000);
            } else {
                showToast(result.msg, 'danger');
            }
        }).submit();
    });
}); 