// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better 
// to create separate JavaScript files as needed.
//
//= require jquery/jquery.min.js
//= require jquery/jquery-ui.min.js
//= require jquery/jquery.dataTables.min.js
//= require jquery/jquery.form.min.js
//= require jquery/select2.js
//= require bootstrap

//= require scholarmap_csst_js/js/d3.min.js
//= require scholarmap_csst_js/js/jLouvain.js
//= require scholarmap_csst_js/js/lodash.js
//= require_self


if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

$(document).ready(function () {
    var sortablePanel = $("#sortable");

    sortablePanel.sortable({
        update: function (event, ui) {
            var data = $(this).sortable('serialize', {key: "authorSort"}) + "&refId=" + $("#referenceId").val();
            $.ajax({
                type: 'POST',
                url: $("#orderAuthorsURL").val(),
                data: data,
                success: function (data) {
                    console.log('success');
                }

            })
        }
    });

    sortablePanel.find(".removeAuthor").click(function () {
        var id = $(this).attr('id');
        $.ajax({
            type: 'POST',
            url: $("#deleteAuthorsURL").val(),
            data: {
                refId: $("#referenceId").val(),
                authorId: $(this).attr('id')
            },
            success: function (data) {
                sortablePanel.find("#authorSort_" + id).remove();
            }
        });
    });

    var i = 1;
    $("#add_row").click(function () {
        $('#addr' + i).html("<td><input name='fullName' type='text' placeholder='Last name, First name' class='form-control input-md ui-autocomplete-input'  /> </td>");

        $('#tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
        i++;
    });
    $("#delete_row").click(function () {
        if (i > 1) {
            $("#addr" + (i - 1)).html('');
            i--;
        }
    });

    console.log("I am going to set data tables");
    setMethodsDataTable();
    setVenuesDataTable();
    setFieldsDataTable();
    setTheoriesDataTable();
    setUsersDataTable();

    $("#addInterestModal").find("#type").change(function () {
        $("#addInterestModal").find("#name").attr("collectfield", $(this).val());
    });

    if ($("#isRequired").length > 0) {
        $('#fillRequiredModal').modal({
            keyboard: false,
            backdrop: 'static'
        })
    }

    $("#isRegEnabled").click(function () {
        $.ajax({
            url: $("#manipulateReg").val(),
            type: 'POST',
            success: function (data) {
                console.log('success');
            }
        })
    });

    $("#admin_edit_profile").find(".lock").click(function () {
        $.ajax({
            url: $("#manipulateLock").val(),
            type: 'POST',
            data: {
                fieldName: $(this).attr('id'),
                userId: $("#userId").val()
            },
            success: function (data) {
                console.log('success');
            }
        })
    });

    $("#mandatory-sec").find(".mandatory").click(function () {
        $.ajax({
            url: $("#manipulateMand").val(),
            type: 'POST',
            data: {
                fieldName: $(this).attr('id')
            },
            success: function (data) {
                console.log('success');
            }
        })
    });

    $("#editPanel").find(".permission").click(function () {
        $.ajax({
            url: $("#manipulatePermission").val(),
            type: 'POST',
            data: {
                fieldName: $(this).attr('id'),
                userId: $("#userId").val()
            },
            success: function (data) {
                console.log('success');
            }
        })
    });

    var photoPanel = $("#photoPanel");
    $("#changePhoto").click(function () {
        photoPanel.find(".simplePanel").remove();
        photoPanel.append($("#photoPanelClone").clone().css("display", "block"));
    });

    $("#importUser").click(function () {
        $('#myModal').modal('show')
    });

    $(".remove-interest").click(function () {
        $('#deleteInterestModal').modal('show');
        $("#entityId").val($(this).next().val());
    });

    $("#entityTable").dataTable({});

    $("#referenceTable").dataTable({});

    $("#usersTable").dataTable({});

    //$("#listTable").dataTable({});

    $("#entityPeopleTable").dataTable({
        "paging": false,
        "ordering": true,
        "info": false,
        "bFilter": false
    });

    $("#entityRefTable").dataTable({
        "paging": false,
        "ordering": true,
        "info": false,
        "bFilter": false
    });

    $(".edit-entity").click(function () {
        $('#editEntityModal').modal('show');
    });

    $(".edit-reference").click(function () {
        $('#editReferenceModal').modal('show');

        $("#add_author").click(function () {
            $('#sortable').find('li:last-child').after("<li class='ui-state-default'><input type='text' name='newAuthors' /></li>");
        });
    });

    $("#addNewEntity").click(function () {
        resetFields($('#addInterestModal'));
        $('#addInterestModal').modal('show');
        $("#addInterestModal").on('keydown', '#name', function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 9 || keyCode == 13) {
                e.preventDefault();
                $("#addInterestModal").find("#description").focus();
            }
        });
    });

    $("#addInterestBtn").click(function () {
        $.ajax({
            type: 'POST',
            url: $("#addInterestURL").val(),
            data: {
                type: $("#type").val(),
                name: $("#name").val(),
                description: $("#description").val()
            },
            success: function (data) {
                var interestRecords = $('#interestRecords');
                $('#addInterestModal').modal('hide');
                interestRecords.find('table').remove();
                interestRecords.find('#addReferenceModal').remove();
                interestRecords.append(data);
                $('#addReferenceModal').modal('show');
                resetFields($('#addInterestModal'));

            }
        });
    });

    refVote();
    applyDatatable();
    showRefModal();
    setExploreReferenceDataTable();

    $("#mergeRefBtn").click(function () {
        var refForMerge = $(".ref_check:checkbox:checked");
        var array = [];
        refForMerge.each(function () {
            array.push($(this).attr('id'));
        });
        showMergeDialog(array.toString(), true);
    });

    $("#mergeEntityBtn").click(function () {
        var entityForMerge = $(".entity_check:checkbox:checked");
        var array = [];
        entityForMerge.each(function () {
            array.push($(this).attr('id'));
        });
        showMergeDialog(array.toString());
    });

});

function applyDatatable() {
    setAvailableRefsDataTable();
    setSelectedRefsDataTable();
}

function resetFields(container) {
    container.find('input').val("");
    container.find('select').val("");
    container.find('textarea').val("");
}

function refVote() {
    var availableReferences = $("#availableReferences");
    availableReferences.find(".select-reference").click(function () {
        $.ajax({
            type: 'POST',
            url: $("#referenceVoteURL").val(),
            data: {
                refId: $(this).attr('id'),
                entity: $("#selectedRefPanel").find("#entity").val()
            },
            success: function (data) {
                $("#referenceTablesPanel").remove();
                $("#refTablesContainer").append(data);
                refVote();
                showRefModal();
                applyDatatable();
            }
        });
    });
}

function showRefModal() {
    $("#addNewRefBtn").click(function () {
        clearRefModalFields();
        $('#addNewReferenceModal').modal('show');
    });
}

function clearRefModalFields() {
    $("#addNewReferenceModal").find('.modal-dialog .form-group input').val("");
    $("#addNewReferenceModal").find('.modal-dialog .form-group textarea').val("");
    $("#ref_tab").find("tr:gt(0)").remove();
    $("#ref_tab").css('display', 'none');
    $("#tab_logic").find("tbody tr:gt(0)").remove();
    $("#tab_logic").find("tbody tr:first").val("");
}

function setMethodsDataTable() {
    $("#allMethodsTable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './home/methods',
            "type": "POST"
        },
        "columns": [
            {"data": "interest"},
            {
                "data": "name",
                "mRender": function (data, type, full) {
                    return "<a href='./entity/view?name=" + data + "'>" + data + "</a>";
                }
            },
            {"data": "description"},
            {"data": "references"}
        ]
    });
}

function setVenuesDataTable() {
    $("#allVenuesTable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './home/venues',
            "type": "POST"
        },
        "columns": [
            {"data": "interest"},
            {
                "data": "name",
                "mRender": function (data, type, full) {
                    return "<a href='./entity/view?name=" + data + "'>" + data + "</a>";
                }
            },
            {"data": "description"},
            {"data": "references"}
        ]
    });
}

function setUsersDataTable() {
    $("#listTable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './list',
            "type": "POST"
        },
        "columns": [

            {
                "data": "fullName",
                "mRender": function (data, type, full) {
                    return "<a href='/ScholarMap/user/" + full.username + "'>" + data + "</a>";
                }
            },
            {"data": "currentInstitution"},
            {"data": "position"},
            {"data": "schoolOrDepartment"}
        ]
    });
}

function setFieldsDataTable() {
    $("#allFieldsTable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './home/areas',
            "type": "POST"
        },
        "columns": [
            {"data": "interest"},
            {
                "data": "name",
                "mRender": function (data, type, full) {
                    return "<a href='./entity/view?name=" + data + "'>" + data + "</a>";
                }
            },
            {"data": "description"},
            {"data": "references"}
        ]
    });
}

function setTheoriesDataTable() {
    console.log("I am here");
    $("#allTheoriesTable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './home/theories',
            "type": "POST"
        },
        "columns": [
            {"data": "interest"},
            {
                "data": "name",
                "mRender": function (data, type, full) {
                    return "<a href='./entity/view?name=" + data + "'>" + data + "</a>";
                }
            },
            {"data": "description"},
            {"data": "references"}
        ]
    });
}

function setAvailableRefsDataTable() {
    $("#availableReferences").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './loadAvailableReferences',
            "type": "POST",
            'data': {
                entity: $("#entity").val()
            }
        },
        "columns": [
            {"data": "author[; ]"},
            {"data": "year"},
            {"data": "citation"},
            {"data": "votes"},
            {
                "data": "id",
                "mRender": function (data, type, full) {
                    return "<a class='glyphicon glyphicon-eye-open' href='/ScholarMap/reference/view" + data + "'></a>" +
                        "<a class='select-reference glyphicon glyphicon-arrow-up' href='/ScholarMap/interests/referenceVote" + data + "'></a>";
                }
            }
        ]
    });
}

function setSelectedRefsDataTable() {
    $("#selectedReferences").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './loadSelectedReferences',
            "type": "POST",
            'data': {
                entity: $("#entity").val(),
                isOwner: $("#isOwner").val(),
                user: $("#user").val()
            }
        },
        "columns": [
            {"data": "author[; ]"},
            {"data": "year"},
            {"data": "citation"},
            {"data": "votes"},
            {
                "data": "id",
                "mRender": function (data, type, full) {
                    if (full.isOwner == true) {
                        return "<a class='glyphicon glyphicon-eye-open' href='/ScholarMap/reference/view" + data + "'></a>" +
                            "<a class='glyphicon glyphicon-remove' href='/ScholarMap/interests/removeVote" + data + "'></a>";
                    } else {
                        return "<a class='glyphicon glyphicon-eye-open' href='/ScholarMap/reference/view" + data + "'></a>";
                    }

                }
            }
        ]
    });
}

function setExploreReferenceDataTable() {
    $("#exploreRefTable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": './home/references',
            "type": "POST"
        },
        "columns": [
            {"data": "author[; ]"},
            {"data": "year"},
            {"data": "citation"},
            {"data": "votes"},
            {
                "data": "id",
                "mRender": function (data, type, full) {
                    return "<a class='glyphicon glyphicon-eye-open' href='/ScholarMap/reference/view/" + data + "'></a>";
                }
            }
        ]
    });
}

function showMergeDialog(entity, isRef) {
    console.log(entity);
    var url = "";
    if (typeof(isRef) === 'undefined') {
        url = $("#mergeDialogURL").val();
    } else {
        url = $("#mergeRefDialogURL").val();
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            entities: entity
        },
        success: function (data) {
            $("#tabPanel").append(data);
            if ($('#mergeEntityModal').length > 0) {
                $('#mergeEntityModal').modal('show');
            } else {
                $('#mergeReferenceModal').modal('show');
            }
            closeMergeDialog();
        }
    });
}

function closeMergeDialog() {
    $('#cancelMergeModal').click(function () {
        $('.modal-open').find('.modal-backdrop').remove();
        $('#tabPanel').find('.modal').remove();
        $('body').removeClass('modal-open');
    });
}
