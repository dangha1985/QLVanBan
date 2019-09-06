// This function retrieves arguments from the QueryString and comes from Microsoft samples
function getUrlParams() {
    try {

        if (urlParams === null) {
            urlParams = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function (m, key, value) { urlParams[key] = value; });
        }

    } catch (err) {
        console.log("getUrlParams:" + err.message);
    }
    return urlParams;
}

function getLinkField(nameField) {
    if (nameField.startsWith("Link")) {
        nameField = nameField.substr("Link".length, nameField.length - "Link".length);
    }
    return nameField;
}

function collectionToArray(collection) {
    try {
        var items = [];
        var e = collection.getEnumerator();
        while (e.moveNext()) {
            var item = e.get_current();
            items.push(item);
        }
        return items;
    } catch (err) {
        console.log("collectionToArray:" + err.message);
    }
}

function collectionToArraybyName(collection) {
    try {
        var items = [];
        var e = collection.getEnumerator();
        while (e.moveNext()) {
            var item = e.get_current();
            items.push(item.get_internalName());
        }
        return items;
    } catch (err) {
        console.log("collectionToArray:" + err.message);
    }
}



function getTypeKind(fields, fieldsNames) {
    try {
        var fieldEnumerator = fields.getEnumerator();
        while (fieldEnumerator.moveNext()) {
            var field = fieldEnumerator.get_current();
            var fieldName = field.get_internalName();
            if (fieldName === fieldsNames) {
                return field.get_fieldTypeKind();
            }
        }
    } catch (err) {
        console.log("getTypeKind(" + fieldsNames + "):" + err.message)
    }
}


function getAllMethod(obj) {
    try {
        var result = [];
        do {
            result.push(Object.getOwnPropertyNames(obj));
        } while ((obj = Object.getPrototypeOf(obj)))
        return result;
    } catch (err) {
        console.log("getAllMethod:" + err.message);
    }
}

function checkMethod(obj, nameMethod) {
    try {
        var result = [];
        var resultTxt;
        do {
            result.push(Object.getOwnPropertyNames(obj));
        } while ((obj = Object.getPrototypeOf(obj)))

        resultTxt = "," + result.join(",") + ",";
        if (resultTxt.indexOf("," + nameMethod + ",") > -1) { return 1; }

    } catch (err) {
        console.log("getAllMethod:" + err.message);
    }
    return 0;
}

function returnMethodValue(field, nameMethod) {
}
function checkProperty(obj, nameProperty) {
    try {
        return obj.hasOwnProperty(nameProperty);
    } catch (err) {
        console.log("checkProperty:" + err.message);
        return false;

    }
}
function getMyPictureUrl(webUrl, accountName, size) {
    return webUrl + "/_layouts/15/userphoto.aspx?size=" + size + "&accountname=" + accountName;
}

function checkInputReadOnly(nameField) {
    try {
        var arrNames = ["StatusApproval", "StatusMessage"];
        if ($.inArray(nameField, arrNames) > -1) {
            return "disabled";
        }
    } catch (err) {
        console.log("checkInputReadOnly:" + err.message);
    }
    return "";
}

function getRequiredField(isRequire) {
    //console.log("ListCommonFunction getRequiredField:" + isRequire);
    try {
        if (isRequire === true) {
            return ' <span class="required"> * </span> ';
        }
    } catch (err) {
        console.log("getRequiredField:" + err.message);
    }
    return "";
}

function checkIsShowField(fieldName) {

    try {
        if (fieldName.startsWith("wf") !== true) {
            return true;
        }
    } catch (err) {
        console.log("checkisShowField:" + err.message);
    }
    return false;
}

function myAlert(message) {
    //console.log("console.log calllll....");
    try {
        if (waitingDialog) {
            //waitingDialog.hide();
            setTimeout(function () { waitingDialog.hide(); }, 100);
        }
        //if (message !== "") alert(message);
        if (message !== "") messageDialog.show(message);
    } catch (err) {
        //alert("console.log:" + err.message);
        messageDialog.show("console.log::" + err.message);
    }
}
function isBlank(data) {
    return ($.trim(data).length === 0);
}

function checkUserConfig() {
    console.log("checkUserConfig:" + _spPageContextInfo.userDisplayName + _spPageContextInfo.userLoginName);
    if (_spPageContextInfo.userLoginName === "admin@tsgsoft365.onmicrosoft.com" || _spPageContextInfo.userLoginName === "thang.nguyen@tsg.net.vn") {
        return true;
    }
    return false;
}

function getHtmlTextArea(id, style) {
    if (id === "BodyTask") {
        return '<div id="' + id + '" contenteditable="false" style="width: 100%;'
        + 'height: 200px;'
      + 'margin: 0 auto;'
      + 'margin-bottom:10px;'
      + 'overflow: auto;'
      + 'border:1px solid #ABABAB;'
      + 'padding: 2px;'
      + 'text-align: justify;'
      + 'background: transparent;" />';
    }
    return '<div id="' + id + '" contenteditable="true" style="width: 100%;'
        + 'height: 200px;'
      + 'margin: 0 auto;'
      + 'margin-bottom:10px;'
      + 'overflow: auto;'
      + 'border:1px solid #ABABAB;'
      + 'padding: 2px;'
      + 'text-align: justify;'
      + 'background: transparent;" />';
}

function MessageTitleForm(listTitle) {
    var title;
    switch (listTitle) {
        case "ListStep":
            title = "List Step";
            break;
        case "ListLeaveRequestConfig":
            title = "List Config By Step ";
            break;
        case "ListITSupport":
            title = "IT Support Request";
            break;
        case "ListRewardRequest":
            title = "Reward Request";
            break;
        case "ListLeaveRequest":
            title = "Leave Request";
            break;
        case "ListGroup":
            title = "Group";
            break;
        case "ListGroup_User":
            title = "Config User Group";
            break;
        default:
            title = "Request";
            break;
    }
    return title;

}

function MessageTitleForm_VN(listTitle) {
    var title;
    switch (listTitle) {
        case "ListStep":
            title = "Cấu hình wofkflow";
            break;
        case "ListLeaveRequestConfig":
            title = "Cấu hình bước wofkflow ";
            break;
        case "ListITSupport":
            title = "IT Support Request";
            break;
        case "ListRewardRequest":
            title = "Reward Request";
            break;
        case "ListLeaveRequest":
            title = "Leave Request";
            break;
        case "ListGroup":
            title = "Group";
            break;
        case "ListGroup_User":
            title = "Config User Group";
            break;
        case "ListIncident":
            title = "Tạo sự cố";
            break;
        case "ListGroup_Tech":
            title = "Tạo nhóm dịch vụ";
            break;
        default:
            title = "Danh sách";
            break;
    }
    return title;

}

function ISODateStringUTC(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getUTCFullYear() + '-'
        + pad(d.getUTCMonth() + 1) + '-'
        + pad(d.getUTCDate()) + 'T'
        + pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes()) + ':'
        + pad(d.getUTCSeconds()) + 'Z'
}

function ISODateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getFullYear() + '-'
        + pad(d.getMonth() + 1) + '-'
        + pad(d.getDate()) + 'T'
        + pad(d.getHours()) + ':'
        + pad(d.getMinutes()) + ':'
        + pad(d.getSeconds()) + 'Z'
}
/***********begin HaDTT**********************/
function Repalce_Field_Mail_Hr(oListItem, arrField, strContent, listName, site, iStep, userStep) {

    if (strContent + "" === "") {
        return "";
    }
    if (arrField === undefined || arrField === null) {
        return strContent;
    }

    try {
        var arr_content = arrField.split(",");
        var urlItem = "";
        var itemId = oListItem.get_item("ID");
        if (site === undefined) { site = 'EmployeeGoalView.aspx'; }
        if (iStep === undefined) { iStep = 0; }
        if (userStep === undefined) { userStep = ""; }
        if (listName === undefined) { listName = ""; }
        for (var t = 0; t < arr_content.length; t++) {
            //console.log("arr_content[t]:" + arr_content[t] + "#" + (arr_content[t] === "UrlItem") + "##" + arr_content[t].localeCompare("UrlItem"));
            if (arr_content[t] === "UrlItem") {
                switch (listName) {
                    case "ListComments":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/" + site + "?Id=" + itemId;
                        break;
                    //case "EmployeeGoalList":
                    //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/"+ site +"?Id=" + itemId;
                    //    break;
                    //case "MyWorkList":
                    //        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ProductView.aspx?Id=" + itemId;
                    //        break;
                        //case "MasterProjectSale":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ReportProjectDetail.aspx?Id=" + itemId;
                        //    break;
                        //case "SaleInfoView":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/SaleInfoView.aspx?Id=" + itemId;
                        //    break;
                        //case "ListCompanyRequest":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CustomerRequestView.aspx?Id=" + itemId;
                        //    break;
                        default:
                            urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/"+ site +"?Id=" + itemId;
                            break;
                }
                if (listName == "ListComments" )
                {
                    urlItem = " <a href='" + urlItem + "'>View Details</a>";
                }
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "UrlHr") {
                var urlHr = _spPageContextInfo.webAbsoluteUrl + "/Pages/Default.aspx";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlHr);
            } else if (arr_content[t] == "Deadline") {
                if ( oListItem.get_item("ExtDeadline") instanceof Date) {
                    strContent = strContent.replace("{" + arr_content[t] + "}", getDateFiled(oListItem.get_item("ExtDeadline")));
                }
                else if (oListItem.get_item("DueDate_") instanceof Date) {
                    strContent = strContent.replace("{" + arr_content[t] + "}", getDateFiled(oListItem.get_item("DueDate_")));
                }
                else {
                    strContent = strContent.replace("{" + arr_content[t] + "}", "");
                }
            }
            else if (oListItem.get_item(arr_content[t]) instanceof Date) {
                  strContent = strContent.replace("{" + arr_content[t] + "}", getDateFiled(oListItem.get_item(arr_content[t])));
            } else if (oListItem.get_item(arr_content[t]) instanceof SP.FieldUserValue) {
                 if (Array.isArray(oListItem.get_item(arr_content[t])) === true) {
                    strContent = strContent.replace("{" + arr_content[t] + "}", ViewUsers(oListItem.get_item(arr_content[t])));
                }
                else {
                    strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
                }
                strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
            } else if (oListItem.get_item(arr_content[t]) instanceof SP.FieldLookupValue) {
                strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
            } else {
                strContent = strContent.replace("{" + arr_content[t] + "}", CheckNull(oListItem.get_item(arr_content[t])));
            }
        }

    } catch (err) {
        console.log("Repalce_Field_Mail_HR:" + err.message + "###" + arrField + "###" + strContent);
        console.log("Repalce_Field_Mail_HR:" + oListItem + "," + arrField + "," + strContent + "," + listName + "," + iStep + "," + userStep);
    }
    return strContent;
}
//function Repalce_Field_Mail_Hr(oListItem, arrField, strContent, listName, site, iStep, userStep) {

//    if (strContent + "" === "") {
//        return "";
//    }
//    if (arrField === undefined || arrField === null) {
//        return strContent;
//    }

//    try {
//        var arr_content = arrField.split(",");
//        var urlItem = "";
//        var itemId = oListItem.get_item("ID");
//        if (site === undefined) { site = 'EmployeeGoalView.aspx'; }
//        if (iStep === undefined) { iStep = 0; }
//        if (userStep === undefined) { userStep = ""; }
//        if (listName === undefined) { listName = ""; }
//        for (var t = 0; t < arr_content.length; t++) {
//            //console.log("arr_content[t]:" + arr_content[t] + "#" + (arr_content[t] === "UrlItem") + "##" + arr_content[t].localeCompare("UrlItem"));
//            if (arr_content[t] === "UrlItem") {
//                switch (listName) {
//                    case "ListComments":
//                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/" + site + "?Id=" + itemId;
//                        break;
//                    case "EmployeeGoalList":
//                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/EmployeeGoalView.aspx?Id=" + itemId;
//                        break;
//                    //case "DepartmentGoalList":
//                    //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/EmployeeGoalView.aspx?Id=" + itemId;
//                    //    break;
//                        //case "MasterProjectSale":
//                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ReportProjectDetail.aspx?Id=" + itemId;
//                        //    break;
//                        //case "SaleInfoView":
//                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/SaleInfoView.aspx?Id=" + itemId;
//                        //    break;
//                        //case "ListCompanyRequest":
//                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CustomerRequestView.aspx?Id=" + itemId;
//                        //    break;
//                        //default:
//                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTechView.aspx?Id=" + itemId;
//                        //    break;
//                }
//                if (listName != "EmployeeGoalList") urlItem = " <a href='" + urlItem + "'>View Details</a>";
//                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
//            } else if (arr_content[t] === "UrlHr") {
//                var urlHr = _spPageContextInfo.webAbsoluteUrl + "/Pages/Default.aspx";
//                strContent = strContent.replace("{" + arr_content[t] + "}", urlHr);
//            } else if (oListItem.get_item(arr_content[t]) instanceof Date) {
//                strContent = strContent.replace("{" + arr_content[t] + "}", getDateFiled(oListItem.get_item(arr_content[t])));
//            } else if (oListItem.get_item(arr_content[t]) instanceof SP.FieldUserValue) {
//                if (Array.isArray(oListItem.get_item(arr_content[t])) === true) {
//                    strContent = strContent.replace("{" + arr_content[t] + "}", ViewUsers(oListItem.get_item(arr_content[t])));
//                }
//                else {
//                    strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
//                }
//                strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
//            } else if (oListItem.get_item(arr_content[t]) instanceof SP.FieldLookupValue) {
//                strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
//            } else {
//                strContent = strContent.replace("{" + arr_content[t] + "}", CheckNull(oListItem.get_item(arr_content[t])));
//            }
//        }

//    } catch (err) {
//        console.log("Repalce_Field_Mail_HR:" + err.message + "###" + arrField + "###" + strContent);
//        console.log("Repalce_Field_Mail_HR:" + oListItem + "," + arrField + "," + strContent + "," + listName + "," + iStep + "," + userStep);
//    }
//    return strContent;
//}
//////end HaDTT////////////

function Repalce_Field_Mail(oListItem, arrField, strContent, listName, site, iStep, userStep) {

    if (strContent + "" === "") {
        return "";
    }
    if (arrField === undefined || arrField === null) {
        return strContent;
    }

    try {
        var arr_content = arrField.split(",");
        var urlItem = "";
        var itemId = oListItem.get_item("ID");
        if (site === undefined) { site = 'EmployeeGoal.aspx'; }
        if (iStep === undefined) { iStep = 0; }
        if (userStep === undefined) { userStep = ""; }
        //if (TaskId === undefined) { TaskId = oListItem.get_item("ID"); }
        if (listName === undefined) { listName = ""; }
        for (var t = 0; t < arr_content.length; t++) {
            //console.log("arr_content[t]:" + arr_content[t] + "#" + (arr_content[t] === "UrlItem") + "##" + arr_content[t].localeCompare("UrlItem"));
            if (arr_content[t] === "UrlItem") {
                switch (listName) {
                    case "ListComments":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/" + site + "?Id=" + itemId;
                        break;
                        //case "ITSupportRequest":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportView.aspx?Id=" + itemId;
                        //    break;
                        //case "ListProducts":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ProductView.aspx?Id=" + itemId;
                        //    break;
                        //case "MasterProjectSale":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ReportProjectDetail.aspx?Id=" + itemId;
                        //    break;
                        //case "SaleInfoView":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/SaleInfoView.aspx?Id=" + itemId;
                        //    break;
                        //case "ListCompanyRequest":
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CustomerRequestView.aspx?Id=" + itemId;
                        //    break;
                        //default:
                        //    urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTechView.aspx?Id=" + itemId;
                        //    break;
                }
                urlItem = " <a href='" + urlItem + "'>Link Item</a>";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            } else if (arr_content[t] === "UrlTask") {
                switch (listName) {
                    case "ListCarRequests":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CarBookingTask.aspx?List=" + listName + "&Id={TaskId}&Step=" + iStep;
                        break;
                    case "ITSupportRequest":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTask.aspx?Id=" + itemId;
                        break;
                    case "MasterProjectSale":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ProjectDetailTask.aspx?Id=" + itemId;
                        break;
                    case "ListCompanyRequest":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CustomerDetailTask.aspx?Id=" + itemId;
                        break;
                    default:
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTechExecute.aspx?Id=" + itemId;
                        break;
                }
                urlItem = " <a href='" + urlItem + "'>Task Item</a>";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            } else if (arr_content[t] === "ItemUrl") {
                switch (listName) {
                    case "ListCarRequests":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CarBookingView.aspx?Id=" + itemId;
                        break;
                    case "ITSupportRequest":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportView.aspx?Id=" + itemId;
                        break;
                    case "ListProducts":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ProductView.aspx?Id=" + itemId;
                        break;
                    case "MasterProjectSale":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ReportProjectDetail.aspx?Id=" + itemId;
                        break;
                    case "ListCompanyRequest":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CustomerRequestView.aspx?Id=" + itemId;
                        break;
                    default:
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTechView.aspx?Id=" + itemId;
                        break;
                }
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            } else if (arr_content[t] === "TaskUrl") {
                switch (listName) {
                    case "ListCarRequests":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CarBookingTask.aspx?List=" + listName + "&Id={TaskId}&Step=" + iStep;
                        break;
                    case "ITSupportRequest":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTask.aspx?List=" + listName + "&Id={TaskId}&Step=" + iStep;
                        break;
                    case "MasterProjectSale":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ProjectDetailTask.aspx?List=" + listName + "&Id={TaskId}&Step=" + iStep;
                        break;
                    case "ListCompanyRequest":
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/CustomerDetailTask.aspx?List=" + listName + "&Id={TaskId}&Step=" + iStep;
                        break;
                    default:
                        urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ITSupportTechExecute.aspx?Id=" + itemId;
                        break;
                }
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "EditUrl") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ProjectEdit.aspx?Id=" + itemId + "&Step=" + iStep;
                console.log("url :" + urlItem);
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "HomeUrl") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/Default.aspx";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "Customer") {
                urlItem = ViewUsers(oListItem.get_item("UserRequest"));
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "IsMSBuy") {
                urlItem = CheckNullSetZero(oListItem.get_item("IsMSBuy")) === 1 ? "Yes" : "No";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "Money") {
                urlItem = FormatCurrency(oListItem.get_item("Money"));
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "userStep" || arr_content[t] === "BGD") {
                strContent = strContent.replace("{" + arr_content[t] + "}", userStep);
            } else {
                if (oListItem.get_item(arr_content[t]) instanceof Date) {
                    strContent = strContent.replace("{" + arr_content[t] + "}", getDateFiled(oListItem.get_item(arr_content[t])));
                } else if (oListItem.get_item(arr_content[t]) instanceof SP.FieldUserValue) {
                    if (Array.isArray(oListItem.get_item(arr_content[t])) === true) {
                        strContent = strContent.replace("{" + arr_content[t] + "}", ViewUsers(oListItem.get_item(arr_content[t])));
                    }
                    else {
                        strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
                    }
                    strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
                } else if (oListItem.get_item(arr_content[t]) instanceof SP.FieldLookupValue) {
                    strContent = strContent.replace("{" + arr_content[t] + "}", oListItem.get_item(arr_content[t]).get_lookupValue());
                } else {
                    strContent = strContent.replace("{" + arr_content[t] + "}", CheckNull(oListItem.get_item(arr_content[t])));
                }
            }
        }

    } catch (err) {
        console.log("Repalce_Field_Mail:" + err.message + "###" + arrField + "###" + strContent);
        console.log("Repalce_Field_Mail:" + oListItem + "," + arrField + "," + strContent + "," + listName + "," + iStep + "," + userStep);
    }
    return strContent;
}

function Repalce_Field_Mail_CC(arrValue, arrField, strContent, itemId) {

    if (strContent + "" === "") {
        return "";
    }
    if (arrField === undefined || arrField === null) {
        return strContent;
    }

    try {
        var arr_content = arrField.split(",");
        var urlItem = "";
        for (var t = 0; t < arr_content.length; t++) {

            if (arr_content[t] === "UrlItem") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ReportProjectDetail.aspx?Id=" + itemId;
                urlItem = " <a href='" + urlItem + "'>Link Item</a>";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            } else if (arr_content[t] === "ItemUrl") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/ReportProjectDetail.aspx?Id=" + itemId;
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "HomeUrl") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/Default.aspx";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            } else {
                strContent = strContent.replace("{" + arr_content[t] + "}", arrValue[t]);
            }
        }

    } catch (err) {
        console.log("Repalce_Field_Mail error: " + err.message);
    }
    return strContent;
}

function Repalce_Field_Mail_CC_Sale(arrValue, arrField, strContent, itemId) {

    if (strContent + "" === "") {
        return "";
    }
    if (arrField === undefined || arrField === null) {
        return strContent;
    }

    try {
        var arr_content = arrField.split(",");
        var urlItem = "";
        for (var t = 0; t < arr_content.length; t++) {

            if (arr_content[t] === "UrlItem") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/SaleInfoView.aspx?Id=" + itemId;
                urlItem = " <a href='" + urlItem + "'>Link Item</a>";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            } else if (arr_content[t] === "ItemUrl") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/SaleInfoView.aspx?Id=" + itemId;
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else if (arr_content[t] === "HomeUrl") {
                urlItem = _spPageContextInfo.webAbsoluteUrl + "/Pages/Default.aspx";
                strContent = strContent.replace("{" + arr_content[t] + "}", urlItem);
            }
            else {
                strContent = strContent.replace("{" + arr_content[t] + "}", arrValue[t]);
            }

        }

    } catch (err) {
        console.log("Repalce_Field_Mail error: " + err.message);
    }
    return strContent;
}

function block_page(msgShow) {
    try {

        if (msgShow === undefined) {
            msgShow = "Please wait...";
        }
        App.blockUI({
            animate: true
        });
    } catch (err) {
        console.log("block_page:" + err.message);
    }
}

function unblock_page() {
    try {
        App.unblockUI();
        //window.setTimeout(function () {
        //App.unblockUI();
        //}, 2000);
        //App.stopPageLoading();
    } catch (err) {
        console.log("unblock_page:" + err.message);
    }
}

//function block_page(msgShow) {
//    try {
//        if (msgShow === undefined) {
//            msgShow = "Please wait...";
//        }
//        App.startPageLoading({ animate: true });
//    } catch (err) {
//        console.log("block_page:" + err.message);
//    }
//}

//function block_animate() {
//    try {
//        App.startPageLoading({ animate: true });
//    } catch (err) {
//        console.log("block_animate:" + err.message);
//    }
//}

//function unblock_page() {
//    try {
//        App.stopPageLoading();
//    } catch (err) {
//        console.log("unblock_page:" + err.message);
//    }
//}

function CallPageLoadError() {
    //window.location = "../Pages/PageError.aspx";
}

function FormatDateShow(objDate, locale) {
    try {
        if (objDate === null) { return ""; }
        //"numeric", "2-digit", "narrow", "short", "long".
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        if (locale === undefined) { locale = "en-GB"; }
        return objDate.toLocaleString(locale, options);
        // → "12/19/2012" en-US
        // → "20/12/2012" en-GB
    } catch (err) {
        console.log("FormatDateShow1:" + err.message);
        return objDate;
    }
}

function FormatDateShow1(objDate, locale) {
    try {
        if (objDate === null) { return ""; }
        //"numeric", "2-digit", "narrow", "short", "long".
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        if (locale === undefined) { locale = "en-GB"; }
        return objDate.toLocaleString(locale, options);
        // → "12/19/2012" en-US
        // → "20/12/2012" en-GB
    } catch (err) {
        console.log("FormatDateShow1:" + err.message);
        return objDate;
    }
}

function FormatDateShow2(objDate, locale) {
    try {
        if (objDate === null) { return ""; }
        //"numeric", "2-digit", "narrow", "short", "long".
        var options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        if (locale === undefined) { locale = "en-GB"; }
        return objDate.toLocaleString(locale, options);
        // → "12/19/2012" en-US
        // → "20/12/2012" en-GB
    } catch (err) {
        console.log("FormatDateShow2:" + err.message);
        return objDate;
    }
}

function FormatDateShow3(objDate, locale) {
    try {
        if (objDate === null) { return ""; }
        //"numeric", "2-digit", "narrow", "short", "long".
        var options = { month: 'long', day: 'numeric' };
        if (locale === undefined) { locale = "en-GB"; }
        return objDate.toLocaleString(locale, options);
        // → "12/19/2012" en-US
        // → "20/12/2012" en-GB
    } catch (err) {
        console.log("FormatDateShow3:" + err.message);
        return objDate;
    }
}

function FormatDateShow4(objDate, locale) {
    try {
        if (objDate === null) { return ""; }
        //"numeric", "2-digit", "narrow", "short", "long".
        var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        if (locale === undefined) { locale = "en-GB"; }
        return objDate.toLocaleString(locale, options);
        // → "12/19/2012" en-US
        // → "20/12/2012" en-GB
    } catch (err) {
        console.log("FormatDateShow1:" + err.message);
        return objDate;
    }
}

function block_animate(name) {
    try {
        App.blockUI({
            target: '#' + name,
            //boxed: true
            animate: true
        });
    } catch (err) {
        console.log("block_animate:" + err.message);
    }

}

function unblock(name) {
    try {
        App.unblockUI('#' + name);
    } catch (err) {
        console.log("unblock:" + err.message);
    }
}

function OpenFile(url) {
    if (url) {
        console.log("OpenFile url:" + url);
        window.open(url);
    }
}

function ITTechView(Id) {
    unblock_page();
    window.location = "../Pages/ReportProjectDetail.aspx?Id=" + Id;
}

function ViewUsers_Email(userTech) {
    try {
        var techview = "";
        if (Array.isArray(userTech) === true) {
            var k;
            for (k = 0; k < userTech.length; k++) {
                techview = techview + " " + userTech[k].get_email();
            }
        } else {
            techview = userTech.get_email();
        }
        return techview;
    } catch (err) {
        console.log("ViewUsers:" + err.message);
    }
}
function ViewUsers(userTech) {
    try {
        var techview = "";
        if (Array.isArray(userTech) === true) {
            var k;
            for (k = 0; k < userTech.length; k++) {
                techview = techview + " " + userTech[k].get_lookupValue();
            }
        } else {
            techview = userTech.get_lookupValue();
        }
        return techview;
    } catch (err) {
        console.log("ViewUsers:" + err.message);
    }
}
function ViewUsers_3(userTech) {
    try {
        var techview = "";
        if (userTech === null) { return techview; }
        if (Array.isArray(userTech) === true) {
            var k;
            techview = userTech[0].get_lookupValue();
            for (k = 1; k < userTech.length; k++) {
                techview = techview + ", " + userTech[k].get_lookupValue();
            }
        } else {
            techview = userTech.get_lookupValue();
        }
        return techview;
    } catch (err) {
        console.log("ViewUsers:" + err.message);
    }
}

function ViewUsersMail(userTech) {
    try {
        var techview = "";
        if (Array.isArray(userTech) === true) {
            var k;
            for (k = 0; k < userTech.length; k++) {
                techview = techview + userTech[k].get_lookupValue() + ",";
            }
        } else {
            techview = userTech.get_lookupValue();
        }
        return techview;
    } catch (err) {
        console.log("ViewUsers:" + err.message);
    }
}

function ArrayUsers(userTech) {
    try {
        var techview = [];

        if (userTech === null) { return techview; }

        if (Array.isArray(userTech) === true) {
            var k;
            for (k = 0; k < userTech.length; k++) {
                techview.push(userTech[k].get_lookupId());
            }
        } else {
            techview.push(userTech.get_lookupId());
        }
        return techview;
    } catch (err) {
        console.log("ArrayUsers:" + err.message);
    }
}

function ArrayInfoUsers(userTech) {
    try {
        var techview = [];

        if (userTech === null) { return techview; }

        if (Array.isArray(userTech) === true) {
            var k;
            var item;
            for (k = 0; k < userTech.length; k++) {
                item = { Id: userTech[k].get_lookupId(), Mail: userTech[k].get_email() };
                techview.push(item);
            }
        } else {
            item = { Id: userTech.get_lookupId(), Mail: userTech.get_email() };
            techview.push(item);
        }
        return techview;
    } catch (err) {
        console.log("ArrayInfoUsers:" + err.message);
    }
}

function ViewUsersComment(userTech) {
    try {
        var techview = "";
        if (Array.isArray(userTech) === true) {
            var k;
            for (k = 0; k < userTech.length; k++) {
                console.log("ViewUsersComment:" + getAllMethod(userTech[k]));
                techview = techview + " @" + userTech[k].get_lookupValue();
            }
        } else {
            techview = userTech.get_lookupValue();
        }
        return techview;
    } catch (err) {
        console.log("ViewUsers:" + err.message);
    }
}

function callbackFuncITSupport(indexList) {
    unblock_page();
    window.location = "../Pages/ITSupportView.aspx?Id=" + indexList;
}

function callbackFuncProject(indexList) {
    unblock_page();
    window.location = "../Pages/ReportProjectDetail.aspx?Id=" + indexList;
}

function SearchProduct(vendorId) {
    unblock_page();
    var filter = "";
    if (vendorId !== undefined && vendorId !== null) {
        filter = "vendorId=" + vendorId;
    }
    if (filter !== "") {
        window.location = "../Pages/SearchProduct.aspx?" + filter;
    } else {
        window.location = "../Pages/SearchProduct.aspx";
    }
}

function SearchSaleInfo() {
    unblock_page();
    window.location = "../Pages/SearchSaleInfo.aspx";
}

function getLookupFiled(item) {
    var valueReturn = "";
    try {
        if (item !== null) {
            valueReturn = item.get_lookupValue();
        }
    } catch (err) {
        console.log("getLookupFiled:" + err.message);
    }
    return CheckNull(valueReturn);
}

function getLookupFiledId(item) {
    var valueReturn = 0;
    try {
        if (item !== null) {
            valueReturn = item.get_lookupId();
        }
    } catch (err) {
        console.log("getLookupFiledId:" + err.message);
    }
    return valueReturn;
}

function getDateFiled(item) {
    var valueReturn = "";
    try {
        if (item !== null) {
            valueReturn = FormatDateShow(item);//ISODateString
        }
    } catch (err) {
        console.log("getLookupFiled:" + err.message);
    }
    return valueReturn;
}

function getNullSetEmpty(item) {
    var valueReturn = "";
    try {
        if (item !== null) {
            valueReturn = item;
        }
    } catch (err) {
        console.log("getLookupFiled:" + err.message);
    }
    return valueReturn;
}

function getNullSetZero(item) {
    var valueReturn = 0;
    try {
        if (item !== null) {
            valueReturn = item;
        }
    } catch (err) {
        console.log("getLookupFiled:" + err.message);
    }
    return valueReturn;
}

function TableInit(input) {
    try {
        var tableView = $('#table').dataTable({
            language: {
                aria: {
                    sortAscending: _TABLE_SORTASCENDING,
                    sortDescending: _TABLE_SORTDESCENDING
                },
                emptyTable: _TABLE_EMPTYTABLE,
                info: _TABLE_INFO,
                infoEmpty: _TABLE_INFOEMPTY,
                infoFiltered: _TABLE_INFOFILTERED,
                lengthMenu: _TABLE_LENGTHMENU,
                search: _TABLE_SEARCH,
                zeroRecords: _TABLE_ZERORECORDS,
                paginate: { previous: "Prev", next: "Next", last: "Last", first: "First" }
            },
            bStateSave: !1,
            lengthMenu: [[5, 15, 20, 50, -1], [5, 15, 20, 50, "All"]],
            pageLength: 10,
            pagingType: "bootstrap_full_number",
            columnDefs: [
                { orderable: !1, targets: [0] },
                { searchable: !1, targets: [0] },
                { className: "dt-right" }],
            order: [[1, "desc"]],
            "sDom": 'tip',
            "ordering": false,
            initComplete: function () {
            }
        });
        return tableView;
    } catch (err) {
        console.log("TableInit:" + err.message);
    }
}

function TableInit2(input) {
    try {
        var tableView = $('#table').dataTable({
            language: {
                aria: {
                    sortAscending: _TABLE_SORTASCENDING,
                    sortDescending: _TABLE_SORTDESCENDING
                },
                emptyTable: _TABLE_EMPTYTABLE,
                info: _TABLE_INFO,
                infoEmpty: _TABLE_INFOEMPTY,
                infoFiltered: _TABLE_INFOFILTERED,
                lengthMenu: _TABLE_LENGTHMENU,
                search: _TABLE_SEARCH,
                zeroRecords: _TABLE_ZERORECORDS,
                paginate: { previous: "Prev", next: "Next", last: "Last", first: "First" }
            },
            bStateSave: !1,
            lengthMenu: [[10, 15, 20, 50, -1], [10,15, 20, 50, "All"]],
            pageLength: 10,
            pagingType: "bootstrap_full_number",
            columnDefs: [
                { orderable: !1, targets: [0] },
             //   { searchable: !1, targets: [0] },
                { className: "dt-right" }],
            order: [[1, "desc"]],
            //   "sDom": 'tip',// ẩn phần này đi sẽ hiển thị phần chọn số bản ghi và search
            "ordering": false, //true sẽ cho sắp xếp theo cột
            initComplete: function () {
            }
        });
        return tableView;
    } catch (err) {
        console.log("TableInit:" + err.message);
    }
}
function TableInit3(table) {
    try {
        var tableView = $('#' + table).dataTable({
            language: {
                aria: {
                    sortAscending: _TABLE_SORTASCENDING,
                    sortDescending: _TABLE_SORTDESCENDING
                },
                emptyTable: _TABLE_EMPTYTABLE,
                info: _TABLE_INFO,
                infoEmpty: _TABLE_INFOEMPTY,
                infoFiltered: _TABLE_INFOFILTERED,
                lengthMenu: _TABLE_LENGTHMENU,
                search: _TABLE_SEARCH,
                zeroRecords: _TABLE_ZERORECORDS,
                paginate: { previous: "Prev", next: "Next", last: "Last", first: "First" }
            },
            bStateSave: !1,
            lengthMenu: [[5, 10, 15, 20, 50, -1], [5, 15, 20, 50, "All"]],
            pageLength: 10,
            pagingType: "bootstrap_full_number",
            columnDefs: [
                { orderable: !1, targets: [0] },
             //   { searchable: !1, targets: [0] },
                { className: "dt-right" }],
            order: [[1, "desc"]],
            "sDom": 'tip',// phần này đi sẽ k hiển thị phần chọn số bản ghi và search
            "ordering": false, //true sẽ cho sắp xếp theo cột
            initComplete: function () {
            }
        });
        return tableView;
    } catch (err) {
        console.log("TableInit:" + err.message);
    }
}
function TableInit1() {
    try {
        var tableView = $('#table').dataTable({
            language: {
                aria: {
                    sortAscending: _TABLE_SORTASCENDING,
                    sortDescending: _TABLE_SORTDESCENDING
                },
                emptyTable: _TABLE_EMPTYTABLE,
                info: _TABLE_INFO,
                infoEmpty: _TABLE_INFOEMPTY,
                infoFiltered: _TABLE_INFOFILTERED,
                lengthMenu: _TABLE_LENGTHMENU,
                search: _TABLE_SEARCH,
                zeroRecords: _TABLE_ZERORECORDS,
                paginate: { previous: "Prev", next: "Next", last: "Last", first: "First" }
            },
            bStateSave: !1,
            lengthMenu: [[5, 15, 20, 50, -1], [5, 15, 20, 50, "All"]],
            pageLength: 50,
            pagingType: "bootstrap_full_number",
            columnDefs: [
                { orderable: !1, targets: [0] },
                { searchable: !1, targets: [0] },
                { className: "dt-right" }],
            order: [[1, "desc"]],
            "sDom": 'tip',
            "ordering": false,
            initComplete: function () {
            }
        });
        return tableView;
    } catch (err) {
        console.log("TableInit:" + err.message);
    }
}

function isNotNull(str) {
    return (str !== null && str !== "" && str !== undefined);
}

function CheckNull(str) {
    if (!isNotNull(str)) {
        return "";
    }
    else {
        return str;
    }
}

function CheckNullSetZero(str) {
    if (!isNotNull(str)) {
        return 0;
    } else if (Number.isNaN(str)) {
        return 0;
    }
    else {
        return Number(str);
    }
}


function FormatMoney(input) {

    var self = $(input);
    var money = self.val();
    money = money.replace(new RegExp(',', 'g'), '');

    var Money;

    Money = "";
    if (isNotNull(money)) {
        if (isNaN(money))   // check kiểu dữ liệu số
        {
            Money = "0";
        }
        else {
            var g = 0;
            var check = Number(money);
            if (check < 0) // check số âm
            {
                g = 1;  // nếu số âm bỏ qua ký tự đầu tiên
            }
            money = money.toString();
            var j = 0;
            for (var l = money.length - 1; l >= g; l--) {
                if (j % 3 === 0 && j > 0) {
                    Money = "," + Money;
                }
                Money = money[l] + Money;
                j++;
            }
            if (check < 0) // check số âm
            {
                Money = '- ' + Money;
            }
        }
    }
    self.val(Money);
}

function FormatPercent(input) {
    var self = $(input);
    var val = self.val();
    if (isNotNull(val)) {
        if (val.indexOf('%') < 0) {
            val = val + '%';
        } else {
            val = val.replace(new RegExp('%', 'g'), '');
            val = val + '%';
        }
    }
    self.val(val);
}


// Hàm tính tồng chi phí FB trong báo cáo dự án 
// Ngày tạo 31/07/2018
// Người tạo Hà
function GetTotalMoneyFB(TotalMoneyContract, TotalMoneyReal) {
    return CheckNullSetZero(TotalMoneyContract) - CheckNullSetZero(TotalMoneyReal);
}

// Hàm tính chi phí FB thực trả khách hàng theo % thuế thu lại
// Ngày tạo 31/07/2018
// Người tạo Hà
function GetMoneyCustomerFB(TotalMoneyFB, PercentCustomerFB) {
    return CheckNullSetZero(TotalMoneyFB) * (100 - CheckNullSetZero(PercentCustomerFB)) / 100;
}


// Hàm tính thuế thu nhập cá nhân theo % thuế thu lại
// Ngày tạo 31/07/2018
// Người tạo Hà
function GetMoneyVAT_FB(TotalMoneyFB, PercentCustomerFB) {
    return CheckNullSetZero(TotalMoneyFB) * CheckNullSetZero(PercentCustomerFB) / 100;
}

// Hàm tính tiền thuế tính vào doanh thu theo tổng chi phí fb và % thuế
// Ngày tạo 31/07/2018
// Người tạo Hà
function GetMoneyVATAddRevenue(TotalMoneyFB, PercentVATAddRevenue) {
    return CheckNullSetZero(TotalMoneyFB) * CheckNullSetZero(PercentVATAddRevenue) / 100;
}

// Hàm tính tổng chi phí triển khai
// Ngày tạo 31/07/2018
// Người tạo Hà
function GetMoneyDeploy(CostFinance, TotalMoneyFB, MoneyOtherCost, MoneyVATAddRevenue) {
    return CheckNullSetZero(CostFinance) + CheckNullSetZero(TotalMoneyFB) + CheckNullSetZero(MoneyOtherCost) - CheckNullSetZero(MoneyVATAddRevenue);
}


// Hàm tính lợi nhuận gộp
// Ngày tạo 31/07/2018
// Người tạo Hà
function GetProfitMoney(TotalMoneyContract, TotalMoneyImport, TotalMoneyFB, TotalCost) {
    return CheckNullSetZero(TotalMoneyContract) - CheckNullSetZero(TotalMoneyImport) - CheckNullSetZero(TotalMoneyFB) - CheckNullSetZero(TotalCost);
}

// check valid voi popup
function checkValid(input) {
    try {
        var self = $(input);
        var value = self.val();
        if (value === null || value === undefined || value.toString().trim() === "") {

            self.closest(".form-group").removeClass("has-success").addClass("has-error");
            var i = self.parent(".input-icon").children("i");
            i.removeClass("fa-check").addClass("fa-warning");
            return false;
        }

        var i = self.parent(".input-icon").children("i");
        self.closest(".form-group").removeClass("has-error").addClass("has-success"),
        i.removeClass("fa-warning").addClass("fa-check");
        return true;
    } catch (err) {
        console.log("checkValid catch:" + err.message);
    }
}


function FormatCurrency(number) {
    if (number === undefined || number === null || number === "") {
        return 0;
    } else {
        if (number.toString().indexOf(".") > -1) {
            return numeral(number).format('0,0.000');
        } else {
            return numeral(number).format('0,0');
        }
    }
}


// Hàm thêm số 0 vào các chữ số từ 1 đến 9
// Ngày tạo 31/07/2018
// Người tạo Hà
function OderCover(order) {
    if (isNotNull(order)) {
        if (isNaN(order)) {
            return "";
        }
        else {
            if (Number(order) > 0 && Number(order) < 10)
                return "0" + order;
            else
                return order;
        }
    }
    return "";
}

function PrintPreview(IdDivName) {
    PrintElement(document.getElementById(IdDivName));

    //var modThis = document.querySelector("#printSection .modifyMe");
    window.print();
}

function PrintElement(elem) {
    var domClone = elem.cloneNode(true);

    var $printSection = document.getElementById("printSection");

    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }

    $printSection.innerHTML = "";

    $printSection.appendChild(domClone);
}

function SetNullWithZero(input) {
    var value;
    console.log("value: " + input);
    if (CheckNullSetZero(input) === 0) {
        value = "";
    } else {
        value = FormatCurrency(input);
    }
    console.log("result value: " + value);
    return value;
}

// Hàm chia tiền cho 1 triệu
// Ngày tạo 8/08/2018
// Người tạo Hà
function GetMoneyChart(money) {

    if (isNotNull(money)) {
        if (isNaN(money))
            return 0;

        money = Number(money);
        return Number(parseFloat(CheckNullSetZero(money / 1000000)).toFixed(3));
    }
    return 0;
}

// Hàm chuyển số thành chữ cái
// Ngày tạo 15/08/2018
// Người tạo Hà
var DOCSO = function () {
    var t =
        ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
        r = function (r, n) {
            var o = "", a = Math.floor(r / 10), e = r % 10;
            return a > 1 ? (o = " " + t[a] + " mươi", 1 == e && (o += " một")) : 1 == a ?
        (o = " mười", 1 == e && (o += " một")) : n && e > 0 && (o = " linh"), 5 == e && a >= 1 ? o += " năm" : 4 == e && a >= 1 ? o += " bốn" : (e > 1 || 1 == e && 0 == a) && (o += " " + t[e]), o
        }, n = function (n, o) { var a = "", e = Math.floor(n / 100), n = n % 100; return o || e > 0 ? (a = " " + t[e] + " trăm", a += r(n, !0)) : a = r(n, !1), a }, o = function (t, r) {
            var o = "", a = Math.floor(t / 1e6), t = t % 1e6;
            a > 0 && (o = n(a, r) + " triệu", r = !0); var e = Math.floor(t / 1e3), t = t % 1e3; return e > 0 && (o += n(e, r) + " nghìn", r = !0), t > 0 && (o += n(t, r)), o
        };
    return { doc: function (r) { if (0 == r) return t[0]; var n = "", a = ""; do ty = r % 1e9, r = Math.floor(r / 1e9), n = r > 0 ? o(ty, !0) + a + n : o(ty, !1) + a + n, a = " tỷ"; while (r > 0); return n.trim() + " đồng " } }
}();

// Hàm xuất ra máy in theo id thẻ
// Ngày tạo 15/08/2018
// Người tạo Hà
function PrintByIdDiv(divId) {
    var printContents = document.getElementById(divId).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

}

// Hàm export to word theo id thẻ
// Ngày tạo 20/08/2018
// Người tạo Hà
function saveDoc(idDiv, nameContract) {

    if (!window.Blob) {
        alert('Your legacy browser does not support this action.');
        return;
    }

    var html, link, blob, url, css;

    // EU A4 use: size: 841.95pt 595.35pt;
    // US Letter use: size:11.0in 8.5in;

    css = ('\
   <style>\
   @page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: portrait;}\
   div.WordSection1 {page: WordSection1;}\
   h1 {font-family: "Times New Roman", Georgia, Serif; font-size: 16pt;}\
   p {font-family: "Times New Roman", Georgia, Serif; font-size: 14pt;}\
   </style>\
  ');

    var rightAligned = document.getElementsByClassName("sm-align-right");
    for (var i = 0, max = rightAligned.length; i < max; i++) {
        rightAligned[i].style = "text-align: right;"
    }

    var centerAligned = document.getElementsByClassName("sm-align-center");
    for (var i = 0, max = centerAligned.length; i < max; i++) {
        centerAligned[i].style = "text-align: center;"
    }

    html = document.getElementById(idDiv).innerHTML;
    html = '\
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">\
  <head>\
    <title>Document Title</title>\
    <xml>\
      <w:worddocument xmlns:w="#unknown">\
        <w:view>Print</w:view>\
        <w:zoom>90</w:zoom>\
        <w:donotoptimizeforbrowser />\
      </w:worddocument>\
    </xml>\
  </head>\
  <body lang=RU-ru style="tab-interval:.5in">\
    <div class="Section1">' + html + '</div>\
  </body>\
  </html>'

    blob = new Blob(['\ufeff', css + html], {
        type: 'application/msword'
    });

    url = URL.createObjectURL(blob);
    link = document.createElement('A');
    link.href = url;

    filename = nameContract;

    // Set default file name.
    // Word will append file extension - do not add an extension here.
    link.download = filename;

    document.body.appendChild(link);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename + '.doc'); // IE10-11
    } else {
        link.click(); // other browsers
    }

    document.body.removeChild(link);
};

// Hàm viết hoa chữ đầu của chuỗi
// Ngày tạo 23/08/2018
// Người tạo Hà
function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function gotoBack() {
    window.history.back();
}

function FindItemByField(arr, field, value) {
    if (arr === undefined || arr === null) {
        return null;
    }

    if (field === null || field === undefined) {
        field = "Id";
        value = CheckNullSetZero(value);
    }

    for (var i = 0; i < arr.length; i++) {
        if (arr[i][field] === value) {
            return arr[i];
        }
    }
    return null;
}


//Hàm chuyển đổi số sang chữ tiếng anh
// Ngày tạo 04/10/2018
// Người tạo Nguyễn Minh Phúc
function numberToEnglish(n) {

    var string = n.toString(), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words, and = 'and';

    /* Remove spaces and commas */
    string = string.replace(/[, ]/g, "");

    /* Is number zero? */
    if (parseInt(string) === 0) {
        return 'zero';
    }

    /* Array of units as words */
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    /* Array of scales as words */
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
        return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

        chunk = parseInt(chunks[i]);

        if (chunk) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split('').reverse().map(parseFloat);

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if (ints[1] === 1) {
                ints[0] += 10;
            }


            /* Add scale word if chunk is not zero and array item exists */
            if ((word = scales[i])) {
                words.push(word);
            }

            /* Add unit word if array item exists */
            if ((word = units[ints[0]])) {
                words.push(word);
            }

            /* Add tens word if array item exists */
            if ((word = tens[ints[1]])) {
                words.push(word);
            }

            /* Add 'and' string after units or tens integer if: */
            if (ints[0] || ints[1]) {

                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if (ints[2] || (i + 1) < chunksLen) { words.push(and); and = ''; }

            }

            /* Add hundreds word if array item exists */
            if ((word = units[ints[2]])) {
                words.push(word + ' hundred');
            }

        }

    }
    console.log(words.reverse().join(' '));
    return words.reverse().join(' ');

}

//Chuyển đổi ngày tháng sang chữ
//04/10/2018
//Nguyễn Minh Phúc
function convertMonthToWord(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[date];
}


//Xóa dấu tiếng việt
//04/10/2018
//Nguyễn Minh Phúc
function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}


// Hàm check email
// phúc
// 23/11
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
