let contacturl = $("#url").val();

$(document).ready(function () {
    ajaxRequest('POST', `${contacturl}/user/dashboard`, null, null, null, function (result) {
        if (result.flag == 1) {
            const response = result.data;
            $('#contact_Count_id').text(response.contact_count);
            $('#group_Count_id').text(response.group_count);
        }
    });
});

$("#contact_btn").click(function (result) {
    if (result.flag == 0) {
        showToast(result.msg, 'danger');
    }
    else {
        window.location.href = `${contacturl}/user/contact`;
    };
});

$("#group_btn").click(function (result) {
    if (result.flag == 0) {
        showToast(result.msg, 'danger');
    }
    else {
        window.location.href = `${contacturl}/user/group`;
    };
});