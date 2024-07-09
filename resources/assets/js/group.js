let groupUrl = $("#url").val();
let totalPage = 0;
let customLimit = 5;
let lastUserId;

$(document).ready(function () {
    getGroups();
});

$("#group_form").submit(function (event) {
    $("#group_add").prop('disabled', true)
    event.preventDefault();
    var formData = $(this).serialize();
    ajaxRequest('POST', `${groupUrl}/user/group/add`, formData, 'application/x-www-form-urlencoded', true, function (result) {
        if (result.flag === 1) {
            $('#group_form')[0].reset();
            getGroups();
            showToast(result.msg, 'success');
            $('#addGroupModal').modal('hide');
            $("#group_add").prop('disabled', false)
        } else {
            $("#group_add").prop('disabled', false)
            showToast(result.msg, 'danger');
        }
    });
});

$(document).on("click", ".groupUpdateBtn", function () {
    lastUserId = $(this).data("id")
    let group_name = $(this).data("name")
    $("#update_name").val(group_name)
});

$("#group_update_btn").click(function () {
    $("#group_update_btn").prop('disabled', true)
    let update_name = $("#update_name").val()
    let formData = {
        name: update_name
    }
    ajaxRequest('PATCH', `${groupUrl}/user/group/update/${lastUserId}`, formData, 'application/x-www-form-urlencoded', true, function
        (result) {
        if (result.flag === 1) {
            getGroups();
            showToast(result.msg, 'success');
            $('#updateGroupModal').modal('hide');
            $("#group_update_btn").prop('disabled', false)
        }
        else {
            showToast(result.msg, 'danger');
            $("#group_update_btn").prop('disabled', false)
        }
    })
});

$(document).on("click", ".groupDeleteBtn", function () {
    lastUserId = $(this).data("id");
});

$("#delete_group_btn").click(function () {
    if (lastUserId) {
        ajaxRequest('DELETE', `${groupUrl}/user/group/delete/${lastUserId}`, null, 'application/x-www-form-urlencoded', true, function (result) {
            if (result.flag === 1) {
                showToast(result.msg, 'success');
                getGroups();
            }
        });
        lastUserId = null;
    }
});

$('body').on('click', '[id^="page_"]', function () {
    const page = parseInt($(this).data('page'));
    search_name = $('#search_name').val().trim();
    getGroups(page, customLimit, search_name);
});

$('body').on('click', '#prev_page', () => {
    const currentPage = parseInt($('.pagination-lg li.active a').text());
    let prevpage = currentPage - 1;
    search_name = $('#search_name').val().trim();
    if (currentPage > 1) {
        getGroups(prevpage, customLimit, search_name);
    }
});

$('body').on('click', '#next_page', () => {
    const currentPage = parseInt($('.pagination-lg li.active a').text());
    const nextPage = currentPage + 1;
    search_name = $('#search_name').val().trim();
    if (nextPage <= totalPage) {
        getGroups(nextPage, customLimit, search_name);
    }
});

$('#group_limit_form').on('submit', function (event) {
    event.preventDefault();
    customLimit = $("#group_limit").val() || 5;
    search_name = $('#search_name').val().trim();
    getGroups(1, customLimit, search_name);
});

$('#search_form').on('submit', function (event) {
    event.preventDefault();
    const search_name = $('#search_name').val().trim();
    if (search_name !== '') {
        getGroups(1, customLimit, search_name);
    } else {
        $(this)[0].reset();
        showToast('Please Enter Search Field', 'danger');
    }
});

$(document).on('click', "#reset_group_btn", function () {
    $("#search_form")[0].reset();
    getGroups(1, customLimit, '');
});

const getGroups = (page = 1, limit = customLimit, search_name = '') => {
    let FormData = {
        page: page,
        limit: limit,
        search_name: search_name
    }
    ajaxRequest('POST', `${groupUrl}/user/group/list`, FormData, 'application/x-www-form-urlencoded', true, function (result) {
        if (result.flag === 1) {
            const response = result.data.views;
            $('#group_list').html(response);
            totalPage = result.data.totalPage;
        } else {
            console.log("error--->", result);
        }
    });
};