var ManagerName = "SALES PORTAL";
var typeApprol = { Save: -1, OnGoing: 0, Approved: 1, Reject: 2, Close: 3, Edit: 4 };
var typeQuotation = { InProgress: 0, Falied: 1, Success: 2, Finish: 3, Edit: 4 };
var typeGroup = { All: 0, DanhMuc: 1, Group: 2 };
var Flag = { Display: 1, NoneDisplay: 0 };
var typeOverProgress = { Normal: 0, Over: 1 };
var typeFlagCustomerAcceept = { Delete: 0, NotDelete: 1 };
var textOverProgress = { Normal: "Trong thời gian xử lý", Over: "Quá thời gian xử lý" };
var TypeOfContract = { Software: 1, Hardware: 2, Both: 3 };
var typeContractName = { Software: "Software", Hardware: "Hardware", Both: "Software & Hardware" };
var typeCustomer = { Agency: 2, Enduser: 1 };  // biến constant loại khách hàng trong báo cáo dự án Agency: Đại lý    Enduse: Người dùng cuối
var typeCustomerName = { Agency: "Agency", Enduser: "EndUser" };  // biến constant loại khách hàng trong báo cáo dự án Agency: Đại lý    Enduse: Người dùng cuối
var Sex = { Male: 1, Female: 2 };
var textStatus = { Save: "Save", OnGoing: "Waiting approval", Approved: "Approved", Reject: "Reject", Close: "Finish", Edit: "Request edit" };
var statusQuotation = { InProgress: "InProgress", Falied: "Falied", Success: "Success", Finish: "Finish", Edit: "Edited" };
var typeOfStatus = { Add: 1, Delete: 0 };
var textOfStatus = { Add: "Add User", Delete: "Remove User" };
var StatusContract = { AlrealyExist: 1, NotExist: 0 };
var dateFormat = "YYYYMMDD";
var Mail_OutOfDate_content = "";
var Mail_OutOfDate_subject = "";
var Mail_OutOfDate_subject_field = "";
var Mail_OutOfDate_content_field = "";

var typeStatusOrder = { NotOrder: 1, Ordering: 2, Ordered: 3 };
var textStatusOrder = { NotOrder: "NotOrder", Ordering: "Ordering", Ordered: "Ordered" };

var Mail_ITTech_Finish_content = "";
var Mail_ITTech_Finish_subject = "";
var Mail_ITTech_Finish_subject_field = "";
var Mail_ITTech_Finish_content_field = "";

var Mail_ITTech_New_content = "";
var Mail_ITTech_New_subject = "";
var Mail_ITTech_New_subject_field = "";
var Mail_ITTech_New_content_field = "";
var LinkServer = "";

var ReopenEmailBody, ReopenEmailSubject, ReopenTaskEmailBody, ReopenTaskEmailSubject, ReEditEmailBody, ReEditEmailSubject;
var EmailCCBody, EmailCCSubject, EmailCCField, PersonCC;

var EmailStatusOrderBody, EmailStatusOrderSubject, EmailStatusOrderField;
var StepStatusOrder = 1;

var strCustomer = '';
var CreditCustomer = 50000000;
var StepAccounting = 2;



var TimeOutClose;
var userDisplayName = "";
var userLoginName = "";
var userKeyCurrent = "";
var userID = 0;
var userEmail = '';

var arrAdmin = [];
var arrUser = [];
var arrAccounting = [];
var arrInfoUser = [];
var SiteAdmin = "https://tsgvietnam.sharepoint.com";
var isSiteAdmin = false;//true là app admin
//hadtt
var Mail_Comment_Subject = "",
    Mail_Comment_Content = "",
    Mail_Comment_Field = "";
var Mail_CommentGoal_Subject = "",
    Mail_CommentGoal_Content = "",
    Mail_CommentGoal_Field = "";
var Mail_OverdueB_Subject = "", Mail_OverdueB_Field = "", Mail_OverdueB_Content = "", Mail_Overdue_Subject = "", Mail_Overdue_Field = "", Mail_Overdue_Content = "";
var NDayAlert = 0, NDaySlowAlert = 0, HoursAlert = 0, HoursSlowAlert = 0;
var urlDatabase = "";//Lưu đường dẫn đến database(list)
var context;
var appContextSite;
var webAppContext;
//endhadtt
//Table
var _TABLE_INFO = "Display _START_ to _END_ in _TOTAL_ lines";
var _TABLE_SORTASCENDING = ": activate to sort column ascending";
var _TABLE_SORTDESCENDING = ": activate to sort column descending";
var _TABLE_EMPTYTABLE = "No data";
var _TABLE_INFOEMPTY = "Not found";
var _TABLE_INFOFILTERED = "(filtered1 từ _MAX_ total)";
var _TABLE_LENGTHMENU = "Display _MENU_";
var _TABLE_SEARCH = "Search:";
var _TABLE_ZERORECORDS = "No fit data";
//End Table
//valid
var _VALID_FAILE = "Please check the fields to enter.";
var _VALID_SUCESS = "Success!."

//en valid

var typeList = {
    Rewward: "ListRewardRequest", Leave: "ListLeaveRequest", ITSupport: "ListITSupport"
    , Purchase: "ListPurchaseRequest", Upload: "ListUploadRequest", Booking: "BookingRequest", CarBooking: "ListCarRequests"
}

var nameList = {
    Rewward: "Reward", Leave: "Leave", ITSupport: "IT Support"
    , Purchase: "Purchase", Upload: "Upload", Booking: "Booking"
};

function getMyPictureUrl(webUrl, accountName, size) {
    return webUrl + "/_layouts/15/userphoto.aspx?size=" + size + "&accountname=" + accountName;
}

function StatusName(status) {
    var name = ""
    switch (parseInt(status)) {
        case 0:
            name = textStatus.OnGoing;
            break;
        case 1:
            name = textStatus.Approved;
            break;
        case 2:
            name = textStatus.Reject;
            break;
        case 3:
            name = textStatus.Close;
            break;
        case 4:
            name = textStatus.Edit;
            break;
        case -1:
            name = textStatus.Save;
            break;
    }
    return name;
}

function StatusQuotation(status) {
    var name = ""
    switch (parseInt(status)) {
        case 0:
            name = statusQuotation.InProgress;
            break;
        case 1:
            name = statusQuotation.Falied;
            break;
        case 2:
            name = statusQuotation.Success;
            break;
        case 3:
            name = statusQuotation.Finish;
            break;
        case 4:
            name = statusQuotation.Edit;
            break;
    }
    return name;
}


function StatusNameWithHtml(status) {
    var name = "";
    switch (parseInt(status)) {
        case 0:
            name = '<span class="label label-sm label-warning">' + textStatus.OnGoing + '</span>';
            break;
        case 1:
            name = '<span class="label label-sm label-success">' + textStatus.Approved + '</span>';
            break;
        case 2:
            name = '<span class="label label-sm label-danger">' + textStatus.Reject + '</span>';
            break;
        case 3:
            name = '<span class="label label-sm label-primary">' + textStatus.Close + '</span>';
            break;
        case 4:
            name = '<span class="label label-sm label-default">' + textStatus.Edit + '</span>';
            break;
        case -1:
            name = '<span class="label label-sm label-info">' + textStatus.Save + '</span>';
            break;
    }
    return name;
}

function StatusNameWithProgress(status) {
    var name = "";
    console.log("StatusNameWithProgress:" + status);
    switch (parseInt(status)) {
        case typeOverProgress.Normal:
            name = '<span class="label label-sm label-warning">' + textOverProgress.Normal + '</span>';
            break;
        case typeOverProgress.Over:
            name = '<span class="label label-sm label-danger">' + textOverProgress.Over + '</span>';
            break;
    }
    return name;
}

function StatusLabel(status, isFinnish) {
    if (isFinnish === undefined) { isFinnish = 0; }
    if (isFinnish === null) { isFinnish = 0; }
    var name = "";
    switch (parseInt(status)) {
        case -1:
            name = "label-info";
            break;
        case 0:
            name = "label-warning";
            break;
        case 1:
            name = "label-success";
            break;
        case 2:
            name = "label-danger";
            break;
        case 3:
            name = "label-primary";
            break;
        case 4:
            name = "label-default";
            break;
        default:
            name = "label-default";
            break;
    }
    if (isFinnish === 0) {
        name = "label-warning";
    }
    return name;
}

function StatusNameText(status, isFinnish) {
    if (isFinnish === undefined) { isFinnish = 0; }
    if (isFinnish === null) { isFinnish = 0; }
    var name = status;

    if (isFinnish === 0) {
        name = textStatus.OnGoing;
    }
    return name;
}

function SetInfoUser(callbackfunc, isGetEmp, isPhanQuyen, isListCommon) {
    //Load menu top
    $("#HR-ManagerMenu").load("DefaultTest.aspx", function () {
    });
   
    context = new SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();
    context.load(user);
    //gọi list app config để lấy đường dẫn database
    var oList = context.get_web().get_lists().getByTitle("AppConfig");
    var colList = oList.getItems("");
    context.load(colList);
    context.executeQueryAsync(function () {
        //$('#message').text('Hello ' + user.get_title() + "," + user.get_email());
        //var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">'
        //         + '<img alt="" class="img-circle" src="' + getMyPictureUrl(_spPageContextInfo.webAbsoluteUrl, user.get_loginName(), "M") + '" />'
        //         + '<span class="username username-hide-on-mobile">' + user.get_title() + '</span>'
        //         + '<i class="fa fa-angle-down"></i>'
        //         + '</a>';

        //var html = '<a class="dropdown-toggle" style="padding: 10px 10px; color: black;" data-toggle="dropdown" href="#">'
        //         + '<img class="userLoginImg img-circle" src="' + getMyPictureUrl(_spPageContextInfo.webAbsoluteUrl, user.get_loginName(), "M") + '"/>'
        //         + '<span class="caret">' + user.get_title() + '</span></a>';

        userKeyCurrent = user.get_title();
        userDisplayName = user.get_title();
        userID = _spPageContextInfo.userId;
        userEmail = _spPageContextInfo.userEmail;

        console.log("userID : " + userID);
        // console.log("userID : " + _spPageContextInfo);
        //lấy đường dẫn đến List( database)
        var listEnumerator = colList.getEnumerator();
        while (listEnumerator.moveNext()) {
            var item = listEnumerator.get_current();
            urlDatabase = item.get_item("Title");
            console.log("urlDatabase:" + urlDatabase);
        }
        if (urlDatabase != "") {
            appContextSite = new SP.AppContextSite(context, urlDatabase);
            webAppContext = appContextSite.get_web();
        }
        else {
            console.log("urlDatabase=''");
            toastr.info("Path Database Empty.");
            return;
        }
        //load list common
        LoadAppConfig(callbackfunc, isGetEmp, isPhanQuyen);
      
        //if (isGetEmp == 1) {//phục vụ cho chức năng giao goal, my goal, my work cho nhân viên
        //    //lấy ra nhân viên
        //    getItemEmployee(callbackfunc, isPhanQuyen);
        //}
        //else {
        //    if (isPhanQuyen == 1) {
        //        getItemRoleByUserId(callbackfunc);
        //    }
        //    else {
        //        if (callbackfunc != undefined) {
        //            callbackfunc();
        //        }
        //    }
        //}
    },
    function (sender, args) {
        console.log('Failed to get user name. Error:' + args.get_message());
    });
    //lấy ra ds ListCommon
    //if (isListCommon == 1) { 
    //    LoadAppConfig();
    //}
    //InitShow();
    //LoadMenu();
    //check admin trong sharepoint, nếu không phải admin thì ẩn phần phân quyền
    // CheckCurrentUserMembership();
}
//function setContext() {
//    var context = SP.clientContext.get_current();
//    var appContextSite = new SP.appContextSite(context, urlDatabase);
//    var webAppContext = appContextSite.get_web();
//}

function SetInfoUser_Expried(menuAc_1, menuAc_2) {
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();
    context.load(user);
    context.executeQueryAsync(function () {
        //$('#message').text('Hello ' + user.get_title() + "," + user.get_email());
        var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">'
                 + '<img alt="" class="img-circle" src="' + getMyPictureUrl(_spPageContextInfo.webAbsoluteUrl, user.get_loginName(), "M") + '" />'
                 + '<span class="username username-hide-on-mobile">' + user.get_title() + '</span>'
                 + '<i class="fa fa-angle-down"></i>'
                 + '</a>';
        userDisplayName = user.get_title();
        $("#userInfo").html(html);
    },
    function (sender, args) {
        console.log('Failed to get user name. Error:' + args.get_message());
    });

    LoadAppConfig();
    InitShow();
    LoadMenu(menuAc_1, menuAc_2);
    //CheckCurrentUserMembership();
}
/********************************** HaDTT **********************************************************/
var itemUser = null;//lưu người dùng
var itemRole;//lưu nhóm
var isAdmin = false;//isAdmin=true là admin
var arrRSPerm = [];//lưu ds các quyền
var url = ''//lưu đường dẫn trang hiện tại
//HaDTT
//Lấy ra người dùng từ bảng EmployeeList theo userEmail
function getItemEmployee(callbackfunc, isPhanQuyen) {
    try {
        //   var context = new SP.ClientContext.get_current();
        //   var oList = context.get_web().get_lists().getByTitle('EmployeeList');
        var oList = webAppContext.get_lists().getByTitle('EmployeeList');
        var camlQuery = new SP.CamlQuery();
        var strSelect = "<View><Query><Where><Eq><FieldRef Name='EmailId' /><Value Type='Text'>" + userEmail + "</Value></Eq></Where></Query></View>";
        camlQuery.set_viewXml(strSelect);
        var colList = oList.getItems(camlQuery);
        context.load(colList);
        context.executeQueryAsync(function () {
            var listAreaEnumerator = colList.getEnumerator();
            while (listAreaEnumerator.moveNext()) {
                itemUser = listAreaEnumerator.get_current();
            }
            console.log("getItemEmployee success");
            //if (isPhanQuyen == 1) {
             getItemRoleByUserId(callbackfunc, isPhanQuyen);
            //}
            //else {
                //if (callbackfunc != undefined) {
                //    callbackfunc();
                //}
            //}
            // if (itemUser != null ) {
            //    //lấy ra nhóm
            //    getItemRole(callbackfunc);
            // }
            //if (callbackfunc != undefined) {
            //    callbackfunc();
            //}
        },
            function (sender, args) {
                console.log('getItemEmployee Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            });
    } catch (err) {
        console.log("getItemEmployee:" + err.message);
    }
}
//HaDTT
//Lấy ra nhóm từ bảng RolesList theo Id kd
function getItemRole(callbackfunc) {
    try {
        var roleId = CheckNull(itemUser.get_item('RoleID'));
        if (roleId == "") {
            toastr.error("Role empty");
            return;
        }
        var clientContext = new SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle('RoleList');
        var colList = oList.getItemById(roleId);
        clientContext.load(colList);
        clientContext.executeQueryAsync(function () {
            itemRole = colList;
            console.log("getItemRole success");
            if (itemRole != undefined) {
                //check xem có phải là admin k?
                isAdmin = CheckAdmin();
                if (isAdmin == false) {
                    //Lấy ra chức năng id và ds quyền
                    getSiteId(callbackfunc);
                }
                else {
                    callbackfunc();
                }
            }
        },
            function (sender, args) {
                console.log('getItemRole Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            });
    } catch (err) {
        console.log("getItemRole:" + err.message);
    }
}
//HaDTT
//Lấy ra nhóm từ bảng RolesList theo userId
function getItemRoleByUserId(callbackfunc,isPhanQuyen) {
    try {
        if (userID == "") {
            toastr.error("UserID empty");
            return;
        }
        var strSelect = '<View><Query><Where>'
    + '<Contains>'
    + '<FieldRef Name="GroupUser" LookupId="TRUE"/>'
    + "<Value Type='Integer'>" + userID + "</Value>"
    + "</Contains>"
    + '</Where></Query></View>';
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(strSelect);
        // var context = new SP.ClientContext.get_current();
        var oList = webAppContext.get_lists().getByTitle('RoleList');
        var colList = oList.getItems(camlQuery);
        context.load(colList);
        context.executeQueryAsync(function () {
            var listAreaEnumerator = colList.getEnumerator();
            while (listAreaEnumerator.moveNext()) {
                itemRole = listAreaEnumerator.get_current();
                console.log("getItemRoleByUserId success");
                break;
            }
            //check xem có phải là admin k?
            isAdmin = CheckAdmin();
            if (isAdmin == true) {
                // $('#divPhanQuyen').show();
                $('#Setting-li').show();
                if (callbackfunc != undefined) {
                    callbackfunc();
                }
            }
            else if (itemRole != undefined) {
                // if (isAdmin == false) {
                //lấy ra url trang dùng để lấy quyền của trang
                url = (window.location.href).toUpperCase().replace((_spPageContextInfo.webAbsoluteUrl).toUpperCase(), '');
                //ẩn các chức năng phân quyềnd
                // $('#divPhanQuyen').hide();
                //if (url == "/Pages/Role.aspx" || url == "/Pages/Permission.aspx" || url == "/Pages/Site.aspx" || url == "/Pages/RoleInSitePermission.aspx")
                //    return;
                //ẩn phần setting
                $('#Setting-li').hide();
                //Lấy ra chức năng id và ds quyền
                if (url.indexOf("/DEFAULT.ASPX") == -1 && isPhanQuyen==1) { //kiểm tra k phải trang chủ thì mới gọi tiếp
                    getFunctionId(callbackfunc);
                }
                else if (callbackfunc != undefined) {
                    callbackfunc();
                }
                // }
            }
            else  {
                //  $('#divbtnAdd').hide();
                // $('#div_Sync').hide();//ẩn div đồng bộ ở form Employee
                toastr.info("You do not have permission access");
            }
            //  }
        },
            function (sender, args) {
                console.log('getItemRole Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            });
    } catch (err) {
        console.log("getItemRole:" + err.message);
    }
}
//HaDTT
//Lấy ra FunctionId(chức năng id) trong SiteList theo url
function getFunctionId(callbackfunc) {
    try {
        var SiteId = 0;
        // var context = new SP.ClientContext.get_current();
        var web = webAppContext;
        var oList = web.get_lists().getByTitle('SiteList');
        var camlQuery = new SP.CamlQuery();
        var strSelect = "<View><Query><Where>"
            + "<Contains><FieldRef Name='Path' /><Value Type='Text'>" + url + "</Value></Contains>"
            + "</Where></Query></View>";
        camlQuery.set_viewXml(strSelect);
        var colList = oList.getItems(camlQuery);
        context.load(colList);
        context.executeQueryAsync(function () {
            var listAreaEnumerator = colList.getEnumerator();
            while (listAreaEnumerator.moveNext()) {
                var itemSite = listAreaEnumerator.get_current();
                SiteId = itemSite.get_item("ID");
            }
            console.log("getFunctionId success");
            if (SiteId != 0) {
                //lấy ra ds quyền
                getRSPermissionList(SiteId, itemRole.get_item("ID"), callbackfunc);
            }
            else {
                $('#divbtnAdd').hide();
                toastr.info("You do not have permission access site");
            }
        },
            function (sender, args) {
                console.log('getFunctionId Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            });
    } catch (err) {
        console.log("getFunctionId:" + err.message);
    }
}
//HaDTT
//Lấy ra danh sách quyền từ bảng RoleInSitePermissionList theo FunctionId, RoleId
function getRSPermissionList(SiteId, RoleId, callbackfunc) {
    arrRSPerm = [];
    try {
        //   var context = new SP.ClientContext.get_current();
        //  var web = context.get_web();
        var web = webAppContext;
        //RoleInSitePermissionList
        var oList = web.get_lists().getByTitle('RoleInSitePermissionList');
        var camlQuery = new SP.CamlQuery();
        var strSelect = "<View><Query><Where><And>"
            + "<Eq><FieldRef Name='SiteID' /><Value Type='Number'>" + SiteId + "</Value></Eq>"
            + "<Eq><FieldRef Name='RoleID' /><Value Type='Number'>" + RoleId + "</Value></Eq>"
            + "</And></Where></Query></View>";
        camlQuery.set_viewXml(strSelect);
        var colList = oList.getItems(camlQuery);
        context.load(colList);
        //PermissionsList
        var oListPerm = web.get_lists().getByTitle('PermissionList');
        var colListPerm = oListPerm.getItems('');
        context.load(colListPerm);

        context.executeQueryAsync(function () {
            var listAreaEnumerator = colList.getEnumerator();
            //   var listPerm = colListPerm.getEnumerator();
            while (listAreaEnumerator.moveNext()) {
                var oItemRSP = listAreaEnumerator.get_current();
                var namePerm = '';
                var idPerm = oItemRSP.get_item("PermissionID");
                var value = oItemRSP.get_item("PermissionValue");
                if (value == 1) {//có quyền thì mới cho vào mảng
                    namePerm = getFieldName(colListPerm, idPerm, "Title");
                    var Item = {
                        SiteId: oItemRSP.get_item("SiteID"),
                        RoleId: oItemRSP.get_item("RoleID"),
                        PermissionId: idPerm,
                        PermissionValue: value,
                        PermissionName: namePerm
                    }
                    arrRSPerm.push(Item);
                }
            }
            console.log("getRSPermissionList success");
            console.log(arrRSPerm);
            if (callbackfunc != undefined) {
                callbackfunc();
            }
        },
            function (sender, args) {
                console.log('getRSPermissionList Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            });
    } catch (err) {
        console.log("getRSPermissionList:" + err.message);
    }
    return arrRSPerm;
}
//HaDTT
//Check Admin
function CheckAdmin() {
    isAdmin = false;
    if ((itemRole != undefined && itemRole.get_item("IsAdmin") == true) || isSiteAdmin == true) {
        isAdmin = true;
    }
    return isAdmin;
}
//HaDTT
//Load menu left kd
function LoadMenuLeft() {
    try {
        var html = "";
        var arrSite = [];
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var oListGroup = web.get_lists().getByTitle('FunctionGroupsList');
        //var camlQuery = new SP.CamlQuery();
        //var strSelect = "<View><Query><Where>"
        //    + "<Contains><FieldRef Name='Path' /><Value Type='Text'>" + url + "</Value></Contains>"
        //    + "</Where></Query></View>";
        //camlQuery.set_viewXml(strSelect);
        var colListGroup = oListGroup.getItems('');
        context.load(colListGroup);

        var oList = web.get_lists().getByTitle('FunctionsList');
        //var camlQuery = new SP.CamlQuery();
        //var strSelect = "<View><Query><Where>"
        //    + "<Contains><FieldRef Name='Path' /><Value Type='Text'>" + url + "</Value></Contains>"
        //    + "</Where></Query></View>";
        //camlQuery.set_viewXml(strSelect);
        var colList = oList.getItems('');
        context.load(colList);
        context.executeQueryAsync(function () {
            //lấy ds chức năng ra và lưu vào mảng chức năng arrSite
            var listAreaEnumerator = colList.getEnumerator();
            while (listAreaEnumerator.moveNext()) {
                var itemSite = listAreaEnumerator.get_current();
                var oItem = {
                    ID: itemSite.get_item("ID"),
                    IdParent: CheckNull(itemSite.get_item("IdParent")),
                    Title: CheckNull(itemSite.get_item("Title")),
                    Path: CheckNull(itemSite.get_item("Path")) + '&id=' + itemSite.get_item("ID"),
                };
                arrSite.push(oItem);
            }
            //html home
            html += '<li class="nav-item ">';
            html += '<a href="../Pages/Default.aspx" class="nav-link nav-toggle">';
            html += ' <i class="icon-home"></i>';
            html += '<span class="title">Home</span>';
            html += '<span class="selected"></span>';
            html += '<span class="arrow open"></span>';
            html += '</a>';
            html += '</li>';

            var listAreaEnumeratorGroup = colListGroup.getEnumerator();
            while (listAreaEnumeratorGroup.moveNext()) {
                var item = listAreaEnumeratorGroup.get_current();
                var title = CheckNull(item.get_item("Title"));
                var id = item.get_item("ID");
                if (title == "System") {
                    html += '<li class="nav-item  ">';
                    html += '<a href="javascript:;" class="nav-link nav-toggle">';
                    html += '<i class="icon-settings"></i>';
                    html += '<span class="title">System</span>';
                    html += '<span class="arrow"></span>';
                    html += '</a>';
                }
                else {
                    html += '<li class="nav-item  ">';
                    html += '<a href="javascript:;" class="nav-link nav-toggle">';
                    html += '<i class="ZPMic ZPic-ED">';
                    html += '<i class="IC-ED-01 path1"></i>';
                    html += '<i class="IC-ED-02 path2"></i>';
                    html += '</i>';
                    html += '<span class="title">' + title + '</span>';
                    html += '<span class="arrow"></span>';
                    html += '</a>';
                }
                var dau = false;
                for (var i = 0; i < arrSite.length; i++) {
                    if (arrSite[i].IdParent == id) {
                        if (dau == false) {
                            html += '<ul class="sub-menu">';
                            dau = true;
                        }
                        html += '<li class="nav-item">';
                        html += '<a href="' + arrSite[i].Path + '" class="nav-link">';
                        html += '<span class="title">' + arrSite[i].Title + '</span>';
                        html += '</a>';
                        html += '</li>';
                    }
                }

                if (dau == true) {
                    html += '</ul>';
                }
                html += '</li>';
            }
            $("#LoadMenu").html(html);
            console.log("LoadMenuLeft success");
        },
            function (sender, args) {
                console.log('LoadMenuLeft Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            });


    } catch (err) {
        console.log("AppCommon LoadmenuLeft:" + err.message);
    }
}
//Kiểm tra có quyền không? true là có, false là k có quyền
function CheckPermission(name) {
    if (isAdmin == false) {
        if (CheckExistArr(arrRSPerm, "PermissionName", name) == false) {
            //  toastr.info("You do not have permission to " + name);
            return false;
        }
    }
    return true;
}
/********************************** End HaDTT **********************************************************/
var userProfileProperties;
function getUserProperties() {
    try {
        var clientContext = new SP.ClientContext.get_current();
        var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);
        userProfileProperties = peopleManager.getMyProperties();
        clientContext.load(userProfileProperties);
        clientContext.executeQueryAsync(onRequestSuccess, onRequestFail);
    } catch (err) {
        console.log("getUserProperties:" + err.message);
    }
}
function onRequestSuccess() {
    var Bild = userProfileProperties.get_userProfileProperties()['PictureURL']
    console.log("onRequestSuccess:" + userProfileProperties.get_userProfileProperties()['WorkEmail'] + "**" +
    userProfileProperties.get_userProfileProperties()['PreferredName'] + "**" +
    userProfileProperties.get_userProfileProperties()['WorkPhone'] + "**" + Bild);
}

function onRequestFail(sender, args) { console.log("onRequestFail:" + args.get_message()); }

function notifyRequest(colNew) {
    try {

        $("#totalRequest").html(colNew.get_count());
        $("#totalRequest1").html(colNew.get_count());

        var html = "";
        //'<li class="external">'
        //        + '<h3>You have <span class="bold">' + colNew.get_count() + ' New</span> request</h3>'
        //        + '</li>'
        //        + '<li>'
        //        + '<ul class="dropdown-menu-list scroller" style="height: 275px;" data-handle-color="#637283">';
        var itemEnumerator = colNew.getEnumerator();
        while (itemEnumerator.moveNext()) {
            var item = itemEnumerator.get_current();
            var user = item.get_item("UserRequest");
            html += '<li>'
            + '<a href="' + getLinkTaskItem(item.get_item("ListName"), item.get_item("TaskId"), item.get_item("IndexStep")) + '">'
                + '<span class="photo">'
                + '<img src="' + getMyPictureUrl(_spPageContextInfo.webAbsoluteUrl, user.get_lookupValue(), "M") + '" class="img-circle" alt=""> </span>'
                + '</span>'
                + '<span class="subject">'
                    + '<span class="from">' + user.get_lookupValue() + '</span>'
                    + '<span class="time">' + FormatDateShow2(item.get_item("DateRequest")) + '</span>'
                + '</span>'
                + '<span class="message">Yêu cầu ' + item.get_item("TitleRequest") + ' chỉ định tới bạn.</span>'
            + '</a>'
            + '</li>';
        }
        //html += '</ul></li>';
        //console.log("AppCommon notifyRequest html:" + html);
        $("#notifyRequest").html(html);
    } catch (err) {
        console.log("AppCommon notifyRequest:" + err.message);
    }
}

function LoadAppConfig(callBackfunc,isGetEmp,isPhanQuyen) {
    try {
        var clientContext = SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle("ListCommon");
        //  var oListCustomer = clientContext.get_web().get_lists().getByTitle("ListCustomer");

        var strSelect = "<Query>"
        + "<Where>"
        + "<Eq>"
        + "<FieldRef Name='IndexId' />"
        + "<Value Type='Number'>1</Value>"
        + "</Eq>"
        + "</Where>"
        + "</Query>"
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(strSelect);
        var colItem = oList.getItems(camlQuery);
        clientContext.load(colItem);

        //strSelect = "<Query><Where><Contains>"
        // + "<FieldRef Name='Sale' LookupId='TRUE'/>"
        // + "<Value Type='Integer'><UserID /></Value>"
        // + "</Contains></Where></Query>";
        //camlQuery.set_viewXml(strSelect);
        //var colData = oListCustomer.getItems(camlQuery);
        //clientContext.load(colData);

        clientContext.executeQueryAsync(
               function () {
                   try {
                       //console.log("LoadAppConfig colItem:" + colItem.get_count());
                       var itemEnumerator = colItem.getEnumerator();
                       while (itemEnumerator.moveNext()) {
                           var item = itemEnumerator.get_current();
                           Mail_Comment_Subject = CheckNull(item.get_item("Mail_Comment_Subject"));
                           Mail_Comment_Content = CheckNull(item.get_item("Mail_Comment_Content"));
                           Mail_Comment_Field = CheckNull(item.get_item("Mail_Comment_Field"));

                           Mail_CommentGoal_Subject = CheckNull(item.get_item("Mail_CommentGoal_Subject"));
                           Mail_CommentGoal_Content = CheckNull(item.get_item("Mail_CommentGoal_Content"));
                           Mail_CommentGoal_Field = CheckNull(item.get_item("Mail_CommentGoal_Field"));

                           Mail_OverdueB_Subject = CheckNull(item.get_item("Mail_OverdueB_Subject"));
                           Mail_OverdueB_Field = CheckNull(item.get_item("Mail_OverdueB_Field"));
                           Mail_OverdueB_Content = CheckNull(item.get_item("Mail_OverdueB_Content"));

                           Mail_Overdue_Subject = CheckNull(item.get_item("Mail_Overdue_Subject"));
                           Mail_Overdue_Field = CheckNull(item.get_item("Mail_Overdue_Field"));
                           Mail_Overdue_Content = CheckNull(item.get_item("Mail_Overdue_Content"));

                           NDayAlert = CheckNull(item.get_item("NDayAlert")) == "" ? 1 : item.get_item("NDayAlert");
                           HoursAlert = CheckNull(item.get_item("HoursAlert")) == "" ? 8 : item.get_item("HoursAlert");
                           NDaySlowAlert = CheckNull(item.get_item("NDaySlowAlert")) == "" ? -1 : "-" + item.get_item("NDaySlowAlert");
                           HoursSlowAlert = CheckNull(item.get_item("HoursSlowAlert")) == "" ? 8 : item.get_item("HoursSlowAlert");

                           if (isNotNull(item.get_item("AppAdmin"))) {
                               arrAdmin = ArrayUsers(item.get_item("AppAdmin"));
                           }

                           //TimeOutClose = item.get_item("TimeOut_CLoseTicket");

                           //if (TimeOutClose === null) {
                           //    TimeOutClose = 3;
                           //}
                           //ReopenEmailBody = item.get_item("ReopenEmailBody");
                           //ReopenEmailSubject = item.get_item("ReopenEmailSubject");
                           //ReopenTaskEmailBody = item.get_item("ReopenTaskEmailBody");
                           //ReopenTaskEmailSubject = item.get_item("ReopenTaskEmailSubject");
                           //ReopenField = item.get_item("ReopenField");
                           //LinkServer = item.get_item("LinkServer");

                           //ReEditEmailBody = item.get_item("ReEditEmailBody");
                           //ReEditEmailSubject = item.get_item("ReEditEmailSubject");

                           //EmailCCBody = item.get_item("EmailCCBody");
                           //EmailCCSubject = item.get_item("EmailCCSubject");
                           //EmailCCField = item.get_item("EmailCCField");
                           //PersonCC = item.get_item("PersonCC");

                           //EmailStatusOrderBody = item.get_item("EmailStatusOrderBody");
                           //EmailStatusOrderSubject = item.get_item("EmailStatusOrderSubject");
                           //EmailStatusOrderField = item.get_item("EmailStatusOrderField");

                           //arrUser = ArrayUsers(item.get_item("AppUser"));
                           //arrInfoUser = ArrayInfoUsers(item.get_item("AppUser"));
                           // arrAdmin = ArrayUsers(item.get_item("AppAdmin"));
                           //arrAccounting = ArrayUsers(item.get_item("AppAccounting"));
                           //if (item.get_item("CreditCustomer") !== null && parseInt(item.get_item("CreditCustomer")) > 0) {
                           //    CreditCustomer = parseInt(item.get_item("CreditCustomer"));
                           //}
                           //if (item.get_item("StepAccounting") !== null && parseInt(item.get_item("StepAccounting")) > 0) {
                           //    StepAccounting = parseInt(item.get_item("StepAccounting"));
                           //}
                           //if (item.get_item("StepStatusOrder") !== null && parseInt(item.get_item("StepStatusOrder")) > 0) {
                           //    StepStatusOrder = parseInt(item.get_item("StepStatusOrder"));
                           //}
                           //if (CheckNull(item.get_item("SiteAdmin")) !== '') {
                           //    SiteAdmin = item.get_item("SiteAdmin");
                           //}
                           break;
                       }
                       //  $("#logoExport").attr("src", LinkServer + "logo_excel.PNG");

                       //var itemEnumeratorCus = colData.getEnumerator();
                       //strCustomer = '<option value=""></option>';
                       //while (itemEnumeratorCus.moveNext()) {
                       //    var itemCus = itemEnumeratorCus.get_current();
                       //    strCustomer += ' <option value="' + itemCus.get_item("ID") + '">' + itemCus.get_item("Title") + '</option>';
                       //}
                       //console.log("strCustomer: " + strCustomer);

                       //goi hàm kiểm tra admin. nếu là admin thì hiển thị setting
                       CheckCurrentUserMembership(callBackfunc,isGetEmp,isPhanQuyen);
                       //if (callBackfunc !== undefined) {
                       //    callBackfunc();
                       //}
                   } catch (err) {
                       console.log("LoadAppConfig failed:" + err.message);
                       if (callBackfunc !== undefined) {
                           callBackfunc();
                       }
                   }
               },
          function (sender, args) {
              console.log('LoadAppConfig failed. ' + args.get_message() +
                  '\n' + args.get_stackTrace());
              unblock_page();
              if (callBackfunc !== undefined) {
                  callBackfunc();
              }
          });
    } catch (err) {
        console.log("LoadAppConfig:" + err.message);
        if (callBackfunc !== undefined) {
            callBackfunc();
        }
    }
}


function InitShow() {
    try {
        //var a = $("#body"), t = $(".page-sidebar"), i = $(".page-sidebar-menu");
        //$(".sidebar-search", t).removeClass("open");        
        //a.addClass("page-sidebar-closed"),
        //i.addClass("page-sidebar-menu-closed"),
        //a.hasClass("page-sidebar-fixed") && i.trigger("mouseleave"),
        //Cookies && Cookies.set("sidebar_closed", "1");

        //$(window).trigger("resize");
        $('body').on('click', '.sidebar-toggler', function (e) {
            var body = $('body');
            var sidebar = $('.page-sidebar');
            var sidebarMenu = $('.page-sidebar-menu');
            $(".sidebar-search", sidebar).removeClass("open");

            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                sidebarMenu.removeClass("page-sidebar-menu-closed");
                if ($.cookie) {
                    $.cookie('sidebar_closed', '0');
                }
            } else {
                body.addClass("page-sidebar-closed");
                sidebarMenu.addClass("page-sidebar-menu-closed");
                if (body.hasClass("page-sidebar-fixed")) {
                    sidebarMenu.trigger("mouseleave");
                }
                if ($.cookie) {
                    $.cookie('sidebar_closed', '1');
                }
            }
            $(window).trigger('resize');
        });
    } catch (err) {
        console.log("InitShow:" + err.message);
    }

}

function getLinkItem(ListName, ItemIndex) {
    var html = "#";
    try {
        switch (ListName) {
            case "ListCarRequests":
                html = '../Pages/CarBookingView.aspx?Id=' + ItemIndex;
                break;
            case "ITSupportRequest":
                html = '../Pages/ITSupportView.aspx?Id=' + ItemIndex;
                break;
            case "MasterProjectSale":
                html = '../Pages/ReportProjectDetail.aspx?Id=' + ItemIndex;
                break;
            case "ListCompanyRequest":
                html = '../Pages/CustomerRequestView.aspx?Id=' + ItemIndex;
                break;
            default:
                html = '../Pages/PageTemplateView.aspx?List=' + ListName + '&Id=' + ItemIndex + '&View=TaskView&Name=' + ListName + 'New';
                break;
        }
    } catch (err) {
        console.log("App common getLinkItem:" + err.message);
    }
    return html;
}
function getLinkTaskItem(ListName, TaskId, indexStep) {
    var html = "#";
    try {
        switch (ListName) {
            case "ListCarRequests":
                html = '../Pages/CarBookingTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep;
                break;
            case "ITSupportRequest":
                html = '../Pages/ITSupportTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep;
                break;
            case "MasterProjectSale":
                html = '../Pages/ProjectDetailTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep;
                break;
            case "ListCompanyRequest":
                html = '../Pages/CustomerDetailTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep;
                break;
            default:
                html = '../Pages/PageTaskEdit.aspx?List=WorkflowTaskList&Id=' + TaskId;
                break;
        }
    } catch (err) {
        console.log("App common getLinkTaskItem:" + err.message);
    }
    return html;
}

function LinkHtmlTable(ListName, ItemIndex) {
    var html = "jacascript;";
    switch (ListName) {
        case "ListCarRequests":
            html = '<td>'
            + '<a href="../Pages/CarBookingView.aspx?Id=' + ItemIndex + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
            + '</td>'
            + '</tr>';
            break;
        case "ITSupportRequest":
            html = '<td>'
           + '<a href="../Pages/ITSupportView.aspx?Id=' + ItemIndex + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
           + '</td>'
           + '</tr>';
            break;
        case "ListCompanyRequest":
            html = '<td>'
           + '<a href="../Pages/CustomerDetailTask.aspx?Id=' + ItemIndex + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
           + '</td>'
           + '</tr>';
            break;

        default:
            html = '<td>'
           + '<a href="../Pages/PageTemplateView.aspx?List=' + ListName + '&Id=' + ItemIndex + '&View=TaskView&Name=' + ListName + 'New" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
           + '</td>'
           + '</tr>';
            break;
    }
    return html;
}

function LinkItemById(ListName, ItemId, Title) {
    var html = "jacascript;";
    switch (ListName) {
        case "ListProducts":
            html = '<a href="../Pages/ProductView.aspx?Id=' + ItemId + '">' + Title + ' </a>'
            break;
        case "ListSaleInfo":
            html = '<a href="../Pages/SaleInfoView.aspx?Id=' + ItemId + '">' + Title + ' </a>'
            break;
    }
    return html;
}

function LinkHtmlTitle(ListName, ItemIndex, Title, status, indexStep) {
    var html = "jacascript;";
    if (indexStep === undefined) { indexStep = 1; }
    switch (ListName) {
        case "ListCarRequests":
            html = '<a href="../Pages/CarBookingView.aspx?Id=' + ItemIndex + '"' + Title + '</a>'
            break;
        case "ITSupportRequest":
            html = '<a href="../Pages/ITSupportView.aspx?Id=' + ItemIndex + '">' + Title + ' </a>'
            break
        case "MasterProjectSale":
            if (status !== undefined && (parseInt(status) === 4 || parseInt(status) === -1)) {
                html = '<a href="../Pages/ProjectEdit.aspx?Id=' + ItemIndex + '&Step=' + indexStep + '">' + Title + ' </a>'
            } else {
                html = '<a href="../Pages/ReportProjectDetail.aspx?Id=' + ItemIndex + '">' + Title + ' </a>'
            }
            break;
        case "ListCompanyRequest":
            html = '<a href="../Pages/CustomerRequestView.aspx?Id=' + ItemIndex + '">' + Title + ' </a>'
            break
        default:
            html = '<a href="../Pages/PageTemplateView.aspx?List=' + ListName + '&Id=' + ItemIndex + '&View=TaskView&Name=' + ListName + 'New">' + Title + '</a>'
            break;
    }
    return html;
}

function LinkTaskTitle(ListName, TaskId, indexStep, Title) {
    var html = "javascript;"
    try {
        switch (ListName) {
            case "ListCarRequests":
                html = '<a href="../Pages/CarBookingTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '" >' + Title + '</a>'
                break;
            case "ITSupportRequest":
                html = '<a href="../Pages/ITSupportTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '">' + Title + '</a>'
                break;
            case "MasterProjectSale":
                html = '<a href="../Pages/ProjectDetailTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '">' + Title + '</a>'
                break;
            case "ListCompanyRequest":
                html = '<a href="../Pages/CustomerDetailTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '">' + Title + '</a>'
                break;
            default:
                html = '<a href="../Pages/PageTaskEdit.aspx?List=WorkflowTaskList&Id=' + TaskId + '" >' + Title + '</a>'
                break;
        }
    } catch (err) { console.log("LinkTaskTable:" + err.message); }
    return html;
}

function LinkTaskTable(ListName, TaskId, indexStep) {
    var html = "javascript;"
    try {
        switch (ListName) {
            case "ListCarRequests":
                html = '<td>'
                + '<a href="../Pages/CarBookingTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
                + '</td>'
                + '</tr>';
                break;
            case "ITSupportRequest":
                html = '<td>'
                + '<a href="../Pages/ITSupportTask.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
                + '</td>'
                + '</tr>';
                break;
            case "ListCompanyRequest":
                html = '<td>'
                + '<a href="../Pages/CustomerDetailTask.aspx.aspx?List=' + ListName + '&Id=' + TaskId + '&Step=' + indexStep + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
                + '</td>'
                + '</tr>';
                break;
            default:
                html = '<td>'
                + '<a href="../Pages/PageTaskEdit.aspx?List=WorkflowTaskList&Id=' + TaskId + '" class="btn btn-xs green dropdown-toggle"><i class="fa fa-list"></i> Detail </a>'
                + '</td>'
                + '</tr>';
                break;
        }
    } catch (err) { console.log("LinkTaskTable:" + err.message); }
    return html;
}

function LoadMenu_1(menuAc_1, menuAc_2) {
    try {
        var html = "";

        //<!-- DOC: To remove the sidebar toggler from the sidebar you just need to completely remove the below "sidebar-toggler-wrapper" LI element -->
        //<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
        html += '<li class="sidebar-toggler-wrapper hide">'
        html += '    <div class="sidebar-toggler">'
        html += '<span></span>'
        html += '</div>'
        html += '</li>'
        //<!-- END SIDEBAR TOGGLER BUTTON -->
        //<!-- DOC: To remove the search box from the sidebar you just need to completely remove the below "sidebar-search-wrapper" LI element -->
        html += '<li class="sidebar-search-wrapper">'
        //<!-- BEGIN RESPONSIVE QUICK SEARCH FORM -->
        //<!-- DOC: Apply "sidebar-search-bordered" class the below search form to have bordered search box -->
        //<!-- DOC: Apply "sidebar-search-bordered sidebar-search-solid" class the below search form to have bordered & solid search box -->
        //<!-- END RESPONSIVE QUICK SEARCH FORM -->

        html += '</li>'
        html += '<li class="nav-item start" id="Default">'
        html += '<a href="../Pages/Default.aspx" class="nav-link nav-toggle">'
        html += '<i class="icon-home"></i>'
        html += '<span class="title">Dashboard</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="heading">'
        html += '<h3 class="uppercase">Request</h3>'
        html += '</li>'
        html += '<li class="nav-item" id="CreateItem">'
        html += '<a href="javascript:;" class="nav-link nav-toggle">'
        html += '<i class="icon-diamond"></i>'
        html += '<span class="title">Create</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ITSupportRequestNew">'
        html += '<a href="../Pages/ITSupportRequest.aspx?List=ITSupportRequests&Id=0&View=Item Detail&Name=ITSupportRequestsNew" class="nav-link ">'
        html += '<span class="title">IT Request</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'
        html += '<li class="nav-item" id="MyRequest">'
        html += '<a href="../Pages/MyRequest.aspx" class="nav-link nav-toggle">'
        html += '<i class="icon-diamond"></i>'
        html += '<span class="title">My Request</span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="Execution">'
        html += '<a href="../Pages/Execution.aspx" class="nav-link nav-toggle">'
        html += '<i class="icon-diamond"></i>'
        html += '<span class="title">Execution</span>'

        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="RequestHistory">'
        html += '<a href="../Pages/RequestHistory.aspx" class="nav-link nav-toggle">'
        html += '<i class="icon-diamond"></i>'
        html += '<span class="title">Request History</span>'
        html += '</a>'
        html += '</li>'

        html += '<li class="heading">'
        html += '<h3 class="uppercase">Reports</h3>'
        html += '</li>'
        html += '<li class="nav-item" id="Reports">'
        html += '<a href="#" class="nav-link nav-toggle">'
        html += '<i class="icon-layers"></i>'
        html += '<span class="title">My Report</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ITSupportReport">'
        html += '<a href="../Pages/ITSupportReport.aspx" class="nav-link ">'
        html += '<i class="icon-layers"></i>'
        html += '<span class="title">IT Support Report</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'

        html += '<li class="nav-item" id="MyCalendar">'
        html += '<a href="#" class="nav-link nav-toggle" >'
        html += '<i class="icon-calendar"></i>'
        html += '<span class="title">My Calendar</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="MyWorkView">'
        html += '<a href="../Pages/MyWorkView.aspx" class="nav-link ">'
        html += '<span class="title">My Work View</span>'
        html += '</a>'
        html += '</li>'

        html += '</ul>'
        html += '</li>'

        html += '<li class="nav-item" id="configPage">'
        html += '<a href="#" class="nav-link nav-toggle">'
        html += '<i class="icon-layers"></i>'
        html += '<span class="title">Config</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ListStep">'
        html += '<a href="javascript:;" class="nav-link nav-toggle">'
        html += '<i class="icon-settings"></i><span class="title"> Config List</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ListStepNew">'
        html += '<a href="../Pages/PageConfigDetail.aspx?List=ListStep&Id=0&View=Item Detail&Name=ListStepNew" class="nav-link ">'
        html += '<i class="icon-star"></i><span class="title"> Add New</span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="ListStepView">'
        html += '<a href="../Pages/PageConfigView.aspx?List=ListStep&View=List View&Name=ListStepView" class="nav-link ">'
        html += '<i class="icon-star"></i><span class="title"> List</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'
        html += '<li class="nav-item" id="ListLeaveRequestConfig">'
        html += '<a href="javascript:;" class="nav-link nav-toggle">'
        html += '<i class="icon-globe"></i><span class="title"> Config List Step</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ListLeaveRequestConfigNew">'
        html += '<a href="../Pages/PageConfigDetail.aspx?List=ListLeaveRequestConfig&Id=0&View=Item Detail&Name=ListLeaveRequestConfigNew" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> Add New</span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="ListLeaveRequestConfigView">'
        html += '<a href="../Pages/PageConfigView.aspx?List=ListLeaveRequestConfig&View=List View&Name=ListLeaveRequestConfigView" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> List</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'

        html += '<li class="nav-item" id="ListCar">'
        html += '<a href="javascript:;" class="nav-link nav-toggle">'
        html += '<i class="icon-globe"></i><span class="title">Cars List</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ListCarNew">'
        html += '<a href="../Pages/CarDetail.aspx?List=ListCar&Id=0&View=Item Detail&Name=ListCarNew" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> Add New</span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="ListCarView">'
        html += '<a href="../Pages/CarList.aspx?List=ListCar&View=List View&Name=ListCarView" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> List</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'

        html += '<li class="nav-item" id="ListGroup_Tech">'
        html += '<a href="javascript:;" class="nav-link nav-toggle">'
        html += '<i class="icon-globe"></i><span class="title">Software/Hardware Group</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ListGroup_TechNew">'
        html += '<a href="../Pages/PageConfigDetail.aspx?List=ListGroup_Tech&Id=0&View=Item Detail&Name=ListGroup_TechNew" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> Add New</span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="ListGroup_TechView">'
        html += '<a href="../Pages/PageConfigView.aspx?List=ListGroup_Tech&View=List View&Name=ListGroup_TechView" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> List</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'

        html += '<li class="nav-item" id="ListIncident">'
        html += '<a href="javascript:;" class="nav-link nav-toggle">'
        html += '<i class="icon-globe"></i><span class="title">Incident</span>'
        html += '<span class="arrow"></span>'
        html += '</a>'
        html += '<ul class="sub-menu">'
        html += '<li class="nav-item" id="ListIncidentNew">'
        html += '<a href="../Pages/PageConfigDetail.aspx?List=ListIncident&Id=0&View=Item Detail&Name=ListIncidentNew" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> Add New</span>'
        html += '</a>'
        html += '</li>'
        html += '<li class="nav-item" id="ListIncidentView">'
        html += '<a href="../Pages/PageConfigView.aspx?List=ListIncident&View=List View&Name=ListIncidentView" class="nav-link ">'
        html += '<i class="icon-user"></i><span class="title"> List</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>'

        html += '<li class="nav-item" id="PageCore">'
        html += '<a href="../Pages/PageCore.aspx" class="nav-link ">'
        html += '<span class="title">Page Core</span>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</li>';
        $("#LoadMenu").html(html);
        if (menuAc_1 !== undefined) {
            $("#" + menuAc_1).addClass("active open");
        }
        if (menuAc_2 !== undefined) {
            $("#" + menuAc_2).addClass("active open");
        }
    } catch (err) {
        console.log("AppCommon Loadmenu:" + err.message);
    }
}

function DropdownStatusQuotaion(status, defaultValue) {
    try {
        var html = "";
        html += ' <option value=""></option>';
        html += ' <option value="' + typeQuotation.InProgress + '">' + statusQuotation.InProgress + '</option>';
        html += ' <option value="' + typeQuotation.Falied + '">' + statusQuotation.Falied + '</option>';
        html += ' <option value="' + typeQuotation.Success + '">' + statusQuotation.Success + '</option>';
        if (status === 1) {
            html += ' <option value="' + typeQuotation.Finish + '">' + statusQuotation.Finish + '</option>';
        }
        html += ' <option value="' + typeQuotation.Edit + '">' + statusQuotation.Edit + '</option>';
        $("#QuotationtStatus").html(html);
        if (defaultValue !== undefined) {
            $("#QuotationtStatus").val(defaultValue).trigger('change');
        }
    } catch (err) {
        console.log("DropdownStatusQuotaion:" + err.message);
    }
}

function DropdownStatus() {
    try {
        var html = "";
        html += ' <option value=""></option>';
        html += ' <option value="' + typeApprol.Save + '">' + textStatus.Save + '</option>';
        html += ' <option value="' + typeApprol.OnGoing + '">' + textStatus.OnGoing + '</option>';
        html += ' <option value="' + typeApprol.Reject + '">' + textStatus.Reject + '</option>';
        html += ' <option value="' + typeApprol.Approved + '">' + textStatus.Approved + '</option>';
        html += ' <option value="' + typeApprol.Edit + '">' + textStatus.Edit + '</option>';
        html += ' <option value="' + typeApprol.Close + '">' + textStatus.Close + '</option>';
        $("#RequestStatus").html(html);
    } catch (err) {
        console.log("DropdownStatus:" + err.message);
    }
}

// Drop dow dùng để chọn hành động thêm hoặc xóa user khỏi toàn bộ group user member
// Người tạo Hà
// ngày tạo 28/8/2018
function DropdownStatusUser() {
    try {
        var html = "";
        html += ' <option value=""></option>';
        html += ' <option value="' + typeOfStatus.Add + '">' + textOfStatus.Add + '</option>';
        html += ' <option value="' + typeOfStatus.Delete + '">' + textOfStatus.Delete + '</option>';

        $("#StatusUser").html(html);
    } catch (err) {
        console.log("Status:" + err.message);
    }
}
// Drop dow dùng để chọn chọn loại hợp đồng in ra
// Người tạo Hà
// ngày tạo 20/8/2018
function DropdownContract() {
    try {
        var html = "";
        html += ' <option value=""></option>';
        html += ' <option value="' + TypeOfContract.Software + '">' + typeContractName.Software + '</option>';
        html += ' <option value="' + TypeOfContract.Hardware + '">' + typeContractName.Hardware + '</option>';
        html += ' <option value="' + TypeOfContract.Both + '">' + typeContractName.Both + '</option>';
        $("#TypeContract").html(html);
    } catch (err) {
        console.log("DropdownStatus:" + err.message);
    }
}

function DropdownSale() {
    try {
        var html = "";
        html += '<option value=""></option>';
        for (var i = 0; i < arrUser.length; i++) {
            html += '<option value="' + arrUser[i].get_lookupId + '">' + arrUser[i].get_lookupValue + '</option>';
        }
        $("#Sale").html(html);
    } catch (err) {
        console.log("DropdownSale:" + err.message);
    }
}

function DropdownDate() {
    $("#defaultrange").daterangepicker({
        opens: App.isRTL() ? "left" : "right", format: "MM/DD/YYYY", separator: " to "
                  , startDate: moment().subtract("days", 29), endDate: moment(),
        ranges: {
            Today: [moment(), moment()], Yesterday: [moment().subtract("days", 1), moment().subtract("days", 1)]
            , "Last 7 Days": [moment().subtract("days", 6), moment()],
            "Last 30 Days": [moment().subtract("days", 29), moment()], "This Month": [moment().startOf("month"),
                moment().endOf("month")], "Last Month": [moment().subtract("month", 1).startOf("month"),
                    moment().subtract("month", 1).endOf("month")]
        }, minDate: "01/01/2012", maxDate: "12/31/2018"
    }, function (t, e) { $("#defaultrange input").val(t.format("MMMM D, YYYY") + " - " + e.format("MMMM D, YYYY")) });
}
function gotoSite() {
    window.location = "../Pages/Default.aspx";
}

function LoadMenu() {
    try {
        var html = "";
        html += '<li class="nav-item ">';
        html += '<a href="../Pages/Default.aspx" class="nav-link nav-toggle">';
        html += ' <i class="icon-home"></i>';
        html += '<span class="title">Home</span>';
        html += '<span class="selected"></span>';
        html += '<span class="arrow open"></span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item  ">';
        html += '<a href="javascript:;" class="nav-link nav-toggle">';
        html += '<i class="ZPMic ZPic-ED">';
        html += '<i class="IC-ED-01 path1"></i>';
        html += '<i class="IC-ED-02 path2"></i>';
        html += '</i>';
        html += '<span class="title">Organization</span>';
        html += '<span class="arrow"></span>';
        html += '</a>';

        html += '<ul class="sub-menu">';
        html += '<li class="nav-item">';
        html += '<a href="../Pages/Employee.aspx" class="nav-link">';
        html += '<span class="title">Employee</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/Department.aspx" class="nav-link">';
        html += '<span class="title">Department</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/EmployeeTree.aspx" class="nav-link">';
        html += '<span class="title">Organization Tree</span>';
        html += '</a>';
        html += '</li>';

        html += '</ul>';
        html += '</li>';

        html += '<li class="nav-item  ">';
        html += '<a href="javascript:;" class="nav-link nav-toggle">';
        html += '<i class="icon-docs"></i>';
        html += '<span class="title">Category</span>';
        html += '<span class="arrow"></span>';
        html += '</a>';

        html += '<ul class="sub-menu">';
        html += '<li class="nav-item">';
        html += '<a href="../Pages/dmDepartment.aspx" class="nav-link">';
        html += '<span class="title">Departments</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/Designation.aspx" class="nav-link">';
        html += '<span class="title">Designations</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/Location.aspx" class="nav-link">';
        html += '<span class="title">Locations</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/EmployeeStatusPage.aspx" class="nav-link">';
        html += '<span class="title">Employee Status</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/EmployeeTypePage.aspx" class="nav-link">';
        html += '<span class="title">Employee Type</span>';
        html += '</a>';
        html += '</li>';

        html += '</ul>';
        html += '</li>';

        html += '<li class="nav-item  ">';
        html += '<a href="javascript:;" class="nav-link nav-toggle">';
        html += '<i class="icon-settings"></i>';
        html += '<span class="title">System</span>';
        html += '<span class="arrow"></span>';
        html += '</a>';

        html += '<ul class="sub-menu">';
        html += '<li class="nav-item">';
        html += '<a href="../Pages/sysRole.aspx" class="nav-link">';
        html += '<span class="title">Roles</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/sysPermission.aspx" class="nav-link">';
        html += '<span class="title">Permissions</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/sysFunctionGroup.aspx" class="nav-link">';
        html += '<span class="title">Function Groups</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/sysFunction.aspx" class="nav-link">';
        html += '<span class="title">Functions</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/sysUser.aspx" class="nav-link">';
        html += '<span class="title">Users</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/sysFuncPermission.aspx" class="nav-link">';
        html += '<span class="title">Function Permissions</span>';
        html += '</a>';
        html += '</li>';

        html += '<li class="nav-item">';
        html += '<a href="../Pages/PageCore.aspx" class="nav-link">';
        html += '<span class="title">Sharepoint site</span>';
        html += '</a>';
        html += '</li>';

        html += '</ul>';
        html += '</li>';
        $("#LoadMenu").html(html);
    } catch (err) {
        console.log("AppCommon Loadmenu:" + err.message);
    }
}


function AddStatusOrder(ProductName, ProjectID) {
    try {

        var clientContexts = SP.ClientContext.get_current();
        var oListStatus = clientContexts.get_web().get_lists().getByTitle('ListOrderStatusProject');

        var itemCreateInfo = new SP.ListItemCreationInformation();
        var oListItemStatus = oListStatus.addItem(itemCreateInfo);

        oListItemStatus.set_item('Title', ProductName);
        oListItemStatus.set_item('StatusOrderID', typeStatusOrder.NotOrder);
        oListItemStatus.set_item('StatusOrderName', textStatusOrder.NotOrder);
        oListItemStatus.set_item('ProjectID', ProjectID);

        oListItemStatus.update();
        clientContexts.load(oListItemStatus);

        clientContexts.executeQueryAsync(function () {

            console.log("success!");
        },
            function (sender, args) {
                console.log("Add fail : " + args.get_message());
            });

    }
    catch (err) {
        console.log("Food :" + err.message);
    }
}

function StatusOrderView(status) {
    var name = "";
    switch (parseInt(status)) {
        case typeStatusOrder.NotOrder:
            name = "#ed6b75";
            break;
        case typeStatusOrder.Ordering:
            name = "#F1C40F";
            break;
        case typeStatusOrder.Ordered:
            name = "#337ab7";
            break;
    }
    return name;
}