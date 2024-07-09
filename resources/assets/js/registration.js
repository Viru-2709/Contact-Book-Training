let url = $("#url").val();

$(document).ready(function () {
    $("#password").keyup(function () {
        let password = $(this).val();
        let strength = checkPasswordStrength(password);
        let strengthText = '';
        let progressWidth = 0;

        switch (strength) {
            case 1:
                strengthText = "Too weak";
                progressWidth = 20;
                setProgressColor('red');
                break;
            case 2:
                strengthText = "Weak";
                progressWidth = 40;
                setProgressColor('orange');
                break;
            case 3:
                strengthText = "Medium";
                progressWidth = 60;
                setProgressColor('yellow    ');
                break;
            case 4:
                strengthText = "Strong";
                progressWidth = 80;
                setProgressColor('lightgreen');
                break;
            case 5:
                strengthText = "Very strong";
                progressWidth = 100;
                setProgressColor('green');
                break;
            default:
                strengthText = "Too weak";
                progressWidth = 0;
                setProgressColor('white');
        }

        $('#strength_text').html(`Password Strength: ${strengthText}`);
        $('#progress_bar').css('width', `${progressWidth}%`).attr('aria-valuenow', progressWidth);
        $('#password_strength').show();
    });

    function setProgressColor(color) {
        $('#progress_bar').removeClass().addClass(`progress-bar progress-bar-${color}`);
    }

    $("#registration_btn").click(function (event) {
        $('#registration_btn').prop('disabled', true);
        event.preventDefault();
        $('#registration_form').ajaxForm(function (result) {
            $('#registration_btn').prop('disabled', false);
            if (result.flag == 1) {
                showToast(result.msg, 'success');
                $('#registration_btn').prop('disabled', false);
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

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length > 6) {
        strength += 1;
    }
    if (password.match(/[a-z]/)) {
        strength += 1;
    }
    if (password.match(/[A-Z]/)) {
        strength += 1;
    }
    if (password.match(/[0-9]/)) {
        strength += 1;
    }
    if (password.match(/[$@$!%*?&]/)) {
        strength += 1;
    }
    return strength;
}