let url = $("#url").val();
let loginAttempts = 0;

$(document).ready(function () {
    $("#login_btn").click(function (event) {
        $('#login_btn').prop('disabled', true);
        event.preventDefault();
        $('#Login_form').ajaxForm(function (result) {
            $('#login_btn').prop('disabled', false);
            if (result.flag == 0) {
                loginAttempts++;
                showToast(result.msg, 'danger');
                if (loginAttempts >= 3) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                }
            }
            else {
                showToast(result.msg, 'success');
                $('#login_btn').prop('disabled', false);
                setTimeout(function () {
                    window.location.href = `${url}/user/dashboard`;
                }, 3000);
            }
        }).submit();
    });
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error) {
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'error-message';
        errorMessageDiv.innerText = error;
        document.getElementById('Login_form').prepend(errorMessageDiv);
    }
});