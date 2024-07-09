let contactsurl = $("#url").val();
let totalPage = 0;
let customLimit = 5;
let lastUserId;

$(document).ready(function () {
    getcontacts();
});

$("#contact_form").submit(function (event) {
    $("#contact_add").prop('disabled', true);
    event.preventDefault();
    var formData = new FormData(this);
    ajaxRequest('POST', `${contactsurl}/user/contact/add`, formData, false, false, function (result) {
        if (result.flag === 1) {
            $('#contact_form')[0].reset();
            getcontacts();
            showToast(result.msg, 'success');
            $('#addModal').modal('hide');
            $("#contact_add").prop('disabled', false)
        } else {
            showToast(result.msg, 'danger');
            $("#contact_add").prop('disabled', false)
        }
    });
});

$(document).on("click", ".updateBtn", function () {
    lastUserId = $(this).data("id");
    let contact_name = $(this).data("name");
    let contact_email = $(this).data("email");
    let contact_number = $(this).data("number");
    let contact_image = $(this).data("image");
    let contact_group = $(this).data("group");

    $("#update_form input[name='name']").val(contact_name);
    $("#update_form input[name='email']").val(contact_email);
    $("#update_form input[name='number']").val(contact_number);
    $("#update_form input[name='image']").val(contact_image);
    $("#update_form select[name='group']").val(contact_group);
});

$("#contact_update_btn").click(function () {
    $('#contact_update_btn').prop('disabled', true);
    let formData = new FormData($("#update_form")[0]);
    if (lastUserId) {
        ajaxRequest('PATCH', `${contactsurl}/user/contact/update/${lastUserId}`, formData, false, false, function (result) {
            if (result.flag === 1) {
                $("#update_form")[0].reset();
                getcontacts();
                showToast(result.msg, 'success');
                $("#updateModal").modal("hide");
                $('#contact_update_btn').prop('disabled', false);
            } else {
                showToast(result.msg, 'danger');
                $('#contact_update_btn').prop('disabled', false);
            }
        });
    };
});

$(document).on("click", ".deleteBtn", function () {
    lastUserId = $(this).data("id");
});

$("#delete_contact_btn").click(function () {
    if (lastUserId) {
        ajaxRequest('DELETE', `${contactsurl}/user/contact/delete/${lastUserId}`, null, false, false, function (result) {
            if (result.flag === 1) {
                getcontacts();
                showToast(result.msg, 'success');
                $('#deleteModal').modal('hide');
            } else {
                showToast(result.msg, 'danger');
            }
        });
        lastUserId = null;
    }
});

$('body').on('click', '[id^="page_"]', function () {
    const page = parseInt($(this).data('page'));
    const searchData = getSearchData();
    getcontacts(page, customLimit, searchData);
});

$('body').on('click', '#prev_page', () => {
    const currentPage = parseInt($('.pagination-lg li.active a').text());
    let prevPage = currentPage - 1;
    const searchData = getSearchData();
    if (currentPage > 1) {
        getcontacts(prevPage, customLimit, searchData);
    }
});

$('body').on('click', '#next_page', () => {
    const currentPage = parseInt($('.pagination-lg li.active a').text());
    const nextPage = currentPage + 1;
    const searchData = getSearchData();
    if (nextPage <= totalPage) {
        getcontacts(nextPage, customLimit, searchData);
    }
});

$(document).on('submit', '#contact_limit_form', function (event) {
    event.preventDefault();
    const limitInput = $("#contact_limit").val();
    if (limitInput.length > 3) {
        showToast('Input value cannot exceed 3 digits', 'danger');
    } else {
        customLimit = limitInput || 5;
        const searchData = getSearchData();
        getcontacts(1, customLimit, searchData);
    }
});

const getSearchData = () => {
    return {
        name: $('#search_name').val().trim(),
        email: $('#search_email').val().trim(),
        number: $('#search_number').val().trim(),
        group: $('#search_group').val().trim(),
    };
};

$(document).on('submit', '#search_form', function (event) {
    event.preventDefault();

    const searchData = getSearchData();

    if (Object.values(searchData).some(value => value !== '')) {
        getcontacts(1, customLimit, searchData);
    } else {
        $(this)[0].reset();
        showToast('Please enter at least one search field', 'danger');
    }
});

$(document).on('click', "#reset_btn", function () {
    $("#search_form")[0].reset();
    getcontacts(1, customLimit, '', '', '', '');
});

const getcontacts = (page = 1, limit = customLimit, searchData = {}) => {
    let FormData = {
        page: page,
        limit: limit,
        search_name: searchData.name,
        search_email: searchData.email,
        search_number: searchData.number,
        search_group: searchData.group
    }
    ajaxRequest('POST', `${contactsurl}/user/contact/list`, FormData, 'application/x-www-form-urlencoded', true, function (result) {
        if (result.flag === 1) {
            const response = result.data.views;
            $('#contact_list').html(response);
            totalPage = result.data.totalPage;
        }
    });
};

ajaxRequest('POST', `${contactsurl}/user/contact/group`, null, false, false, function (result) {
    if (result.flag == 1) {
        const group = result.data;
        let groupName = group.map((group, index) => {
            const groupID = `group_selected_${index}`
            return `<option class="selectedOption" id="${groupID}" data-id="${groupID}" value="${group._id}">${group.name}</option>`;
        });
        const groupNameDefault = `<option value="">Select Group</option>${groupName.join('')}`;
        $('#add_group, #update_group, #search_group').html(groupNameDefault);
    };
})