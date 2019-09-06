'use strict';
var arr, ArrayListDataCopy = [];

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage() {
    SetInfoUser();
    $(document).ready(function () {
        onReady();
    });
}

function onReady() {
    var ep = new ExcelPlus();
    ep.openLocal({
        "flashPath": "2.5/swfobject/",
        "labelButton": "Open an Excel file"
    }, function () {
        arr = ep.selectSheet(1).readAll({ parseDate: true });
        var html = ""; "<table>";
        for (var i = 0; i < arr.length; i++) {
            html += '<tr>';
            for (var j = 0; j < arr[i].length; j++) {
                html += '<td>' + arr[i][j] + '</td>'
            }
            html += '</tr>';
            var itemCopy = { ListName: arr[i][0], FieldName: arr[i][1] };
            ArrayListDataCopy.push(itemCopy);
        }
        $("#bodyTable").html(html);
    });
}

function ImportExcelList(typeImport) {
    try {
        block_page();
        if (arr === null || arr === undefined) {
            alert('Không có dữ liệu');
            return;
        }
        var LinkListUrl = urlDatabase;
        if (!isNotNull(LinkListUrl)) {
            toastr.error('ImportExcel Request failed: LinkListUrl=' + LinkListUrl);
            return;
            unblock_page();
        }

        arr.splice(0, 1);//loại bỏ dòng đầu tiên trong mảng

        if (typeImport === 0) {
            for (var i = 0; i < arr.length; i++) {
                console.log("ListName :" + arr[i][0]);
                console.log("Feild Name :" + arr[i][1]);
                console.log("TemplateType:" + arr[i][2]);
                CreateListFormExecl(arr[i][0], arr[i][1], arr[i][2], LinkListUrl);
            }
        }
        if (typeImport === 1) {
            for (var i = 0; i < arr.length; i++) {
                //console.log("ListName :" + arr[i][0]);
                //console.log("Feild Name :" + arr[i][1]);
                //console.log("TemplateType:" + arr[i][2]);

                CreateFieldLookupFormExecel(arr[i][0], arr[i][1], arr[i][2], LinkListUrl);
            }
        }



    } catch (err) {
        unblock_page();
        console.log("ImportExcel:" + err.message);
        return;
    }
}

function CreateListFormExecl(ListName, ListTitle, TemplateType, LinkListUrl) {
    try {

        var context = SP.ClientContext.get_current();
        var appContextSite = new SP.AppContextSite(context, LinkListUrl);
        var oWebsite = appContextSite.get_web();

        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(ListName);
        if (TemplateType == "documentLibrary") {
            listCreationInfo.set_templateType(SP.ListTemplateType.documentLibrary);
        } else {
            listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
        }

        var oList = oWebsite.get_lists().add(listCreationInfo);
        context.load(oList);
        context.executeQueryAsync(function () {
            console.log('CreateList succes');
            toastr.info("Create List succes");

            var colField = oList.get_fields();
            if (ListTitle !== undefined && ListTitle !== null) {
                var Titles = ListTitle.split(',');
                for (var i = 0; i < Titles.length; i++) {
                    var TitleInfo = Titles[i].split(':');
                    var Type = TitleInfo[1].trim() == "" ? "Text" : TitleInfo[1];
                    var fieldType;
                    if (Type == "UserMulti") {
                        fieldType = colField.addFieldAsXml('<Field DisplayName="' + TitleInfo[0].trim() + '" Name="' + TitleInfo[0].trim() + '" Type="UserMulti" \
                                        UserSelectionMode="PeopleAndGroups" UserSelectionScope="0" Mult="TRUE" />', true, SP.AddFieldOptions.defaultValue);
                    }

                    else {
                        fieldType = colField.addFieldAsXml('<Field DisplayName="' + TitleInfo[0].trim() + '" Name="' + TitleInfo[0].trim() + '" Type="' + Type.trim() + '" />', true, SP.AddFieldOptions.defaultValue);
                    }

                    fieldType.update();
                }
            }
            context.load(colField);
            context.executeQueryAsync(function () {
                arr = null;
                $("#bodyTable").html("");
                console.log('CreateListInfo Succes');
                toastr.info("Create List Info succes");
                unblock_page();

            }, function (sender, args) {
                console.log(ListName + args);
                toastr.error("Create List Info failed");
                unblock_page();

            });
        },
        function (sender, args) {
            console.log('Create List ' + ListName + ' Request failed: ' + args.get_message() + '\n' + args.get_stackTrace());
            toastr.error('Create List ' + ListName + ' failed. ' + args.get_message());
            unblock_page();

        });
    } catch (err) {
        console.log("CreateList Error: " + err.message);
        unblock_page();

    }
}

function CreateFieldLookupFormExecel(ListName, ListField, FieldColumn, LinkListUrl) {
    try {
        var lengthColumn = FieldColumn.split(',');
        var lengthListField = ListField.split(',');

        if (parseInt(lengthColumn.length) !== parseInt(lengthListField.length)) {
            console.log("lengthListField.length ## lengthColumn.length")
            return;
            unblock_page();
        }
        var i;
        var context = SP.ClientContext.get_current();
        var appContextSite = new SP.AppContextSite(context, LinkListUrl);
        var oList = appContextSite.get_web().get_lists().getByTitle(ListName);
        var colField = oList.get_fields();
        context.load(colField);

        var oListA = [];
        for (i = 0; i < lengthListField.length; i++) {
            oListA[i] = appContextSite.get_web().get_lists().getByTitle(lengthListField[i].split(':')[0]);
            context.load(oListA[i]);
        }

        context.executeQueryAsync(function () {

            if (isNotNull(FieldColumn)) {
                for (i = 0; i < lengthColumn.length; i++) {
                    var TitleInfo = lengthColumn[i].split(':');
                    var Type = TitleInfo[1].trim() == "" ? "Text" : TitleInfo[1];
                    var fieldType;
                    if (Type === "LookupMulti") {
                        fieldType = colField.addFieldAsXml('<Field DisplayName="' + TitleInfo[0].trim() + '" Name="' + TitleInfo[0].trim() + '" Type="' + Type.trim() + '" Mult="TRUE" />', true, SP.AddFieldOptions.defaultValue);
                    }

                    else {
                        fieldType = colField.addFieldAsXml('<Field DisplayName="' + TitleInfo[0].trim() + '" Name="' + TitleInfo[0].trim() + '" Type="' + Type.trim() + '" />', true, SP.AddFieldOptions.defaultValue);
                    }

                    var fieldLookup = context.castTo(fieldType, SP.FieldLookup);
                    fieldLookup.set_lookupList(oListA[i].get_id());
                    if (isNotNull(lengthListField[i].split(':')[1])) {
                        fieldLookup.set_lookupField(lengthListField[i].split(':')[1]);
                    }
                    else {
                        fieldLookup.set_lookupField("Title");
                    }
                    fieldLookup.update();
                }
            }
            context.load(colField);
            context.executeQueryAsync(function () {
                arr = null;
                $("#bodyTable").html("");
                console.log('CreateListInfo Succes');
                toastr.info("Create field column succes");
                unblock_page();
            }, function (sender, args) {
                console.log("fail" + args.get_message());
                toastr.error("Create field column failed");
                unblock_page();
            });
        },
        function (sender, args) {
            console.log('Create Request failed: ' + args.get_message() + '\n' + args.get_stackTrace());
            toastr.error('Create List ' + ListName + ' failed. ' + args.get_message());
            unblock_page();
        });
    } catch (err) {
        console.log("CreateList Error: " + err.message);
        unblock_page();

    }
}

function DeleteList() {
    try {
        block_page();
        if (arr === null || arr === undefined) { return; }
        var LinkListUrl = urlDatabase;
        if (!isNotNull(LinkListUrl)) {
            toastr.error('ImportExcel Request failed: LinkListUrl=' + LinkListUrl);
            return;
            unblock_page();
        }
        arr.splice(0, 1);
        var context = SP.ClientContext.get_current();
        var appContextSite = new SP.AppContextSite(context, LinkListUrl);
        var oList = [];
        for (var i = 0; i < arr.length; i++) {
            console.log("ListName :" + arr[i][0]);
            oList[i] = appContextSite.get_web().get_lists().getByTitle(arr[i][0]);
            oList[i].deleteObject();
        }
        context.executeQueryAsync(function () {
            try {
                arr = null;
                $("#bodyTable").html("");
                console.log('DeleteList Succes');
                toastr.info("DeleteList succes");
                unblock_page();
            }
            catch (err) {
                console.log("DeleteList Error: " + err.message);
                unblock_page();
            }
        },
        function (sender, args) {
            console.log('DeleteList failed: ' + args.get_message() + '\n' + args.get_stackTrace());
            toastr.error('DeleteList failed. ' + args.get_message());
            unblock_page();
        });
    }
    catch (err) {
        console.log("Fail Delete " + err.message);
        unblock_page();
    }
}
