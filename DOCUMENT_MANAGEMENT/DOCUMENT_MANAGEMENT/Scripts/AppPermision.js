var nameGroup = "ITAdmin";
var dateExpried = "20250101";

function CheckCurrentUserMembership(callbackfunc,isGetEmp,isPhanQuyen) {
    try {
        var clientContext = SP.ClientContext.get_current();
        var currentUser = clientContext.get_web().get_currentUser();
        var userGroups = currentUser.get_groups();
        clientContext.load(currentUser);
        clientContext.load(userGroups);
        clientContext.executeQueryAsync(function () {
            //var isMember = false;
           // checkExpriedLiscence();
            //console.log("CheckCurrentUserMembership::" + currentUser.get_isSiteAdmin());
            isSiteAdmin = checkPermiss();

            if (isSiteAdmin === false) {
                //$("#PageCore,#List_User_Group,#ListGroup_Tech,#ListFood,#ListLayout,#ListDevice,#ListRoom,#ListArea,#ListCar,\
                //    #ListLeaveRequestConfig,#ListStep,#configPage,#AddEmployee,#Permission,#N-ActivityType").remove();  // phúc thêm 15/1
                ////#ListEmployee,#div_manager,\ #ProjectManager,#ContractManager,#LeaveofAbsenceReport,\ #N-Activity, #N-ActivityType, #N-ActivityEdit, #EventManager
                $('#Setting-li').hide();
            }
            else {
                // $('#divPhanQuyen').show();
                $('#Setting-li').show();
            }
            if (isGetEmp == 1) {//phục vụ cho chức năng mt công ty, mt phòng ban, giao goal, my goal, my work cho nhân viên
                //lấy ra nhân viên
                getItemEmployee(callbackfunc, isPhanQuyen);
            }
            else {
                //if (isPhanQuyen == 1) {
                getItemRoleByUserId(callbackfunc, isPhanQuyen);
                //}
                //else {
                    //if (callbackfunc != undefined) {
                    //    callbackfunc();
                    //}
                //}
            }
        }, function (sender, args) {
            console.log("CheckCurrentUserMembership Error:" + args.get_message());
        });
    }
    catch (err) {
        console.log("CheckCurrentUserMembership:" + err.message);
    }
}
//function CheckCurrentUserMembership() {
//    try {
//        //var clientContext = SP.ClientContext.get_current();
//        //var currentUser = clientContext.get_web().get_currentUser();           
//        //clientContext.load(currentUser);   
//        //clientContext.executeQueryAsync(function () {
//        ////    var isMember = false;
//        //    console.log("CheckCurrentUserMembership1::" + currentUser.get_isSiteAdmin());            
//        ////    console.log("CheckCurrentUserMembership::" + _spPageContextInfo.isSiteAdmin);
//        ////    if (currentUser.get_isSiteAdmin() === false) {
//        ////        $("#configPage").remove();
//        ////    }
//        //}, function (sender, args) {
//        //    console.log("CheckCurrentUserMembership Err:" + args.get_message());
//        //});
//    //    checkExpriedLiscence();

//        //var siteAccounting = checkPermissAccounting();
//        //if (siteAccounting === false) {
//        //    $("#AllRequestAccounting").hide();
//        //    $("#AddNewProject").show();
//        //} else if (siteAccounting === true) {
//        //    $("#AddNewProject").hide();
//        //    $("#AllRequestAccounting").show();
//        //}

//        var siteAdmin = checkPermiss();
//   //     var siteAdmin = checkPermissAccounting();
//        //console.log("CheckCurrentUserMembership::" + SP.User.get_isSiteAdmin());
//        console.log("CheckCurrentUserMembership2::" + _spPageContextInfo.isSiteAdmin);
//        if (siteAdmin === false) {
//            //$("#configPage,#ListProductView,#ListVendorView,#ListGroupView,#ListProductTypeView,#ImportExcel,#PageCore,#ListSaleInfoView,#ListGroup_TechView,#ListStepView,#ListLeaveRequestConfigView,#ListCategoryView,#ListProductCategoryView").remove();
//            //$("#ManagerPage,#TargetCategoryMenu,#TargetEmployeesMenu,#TargetEmployeesDetailMenu,#ReportSaleMenu,#Page_Config_Group,#ListTSG,#DeptReport").remove();
//            //  $('#divPhanQuyen').hide();
//            $('#Setting-li').hide();
//        }
//        else {
//           // $('#divPhanQuyen').show();
//            $('#Setting-li').show();
//        }
//    }
//    catch (err) {
//        console.log("CheckCurrentUserMembership:" + err.message);
//    }
//}

function checkExpriedLiscence() {
    try{
        var currentServerDateTime = new Date(new Date().getTime() + _spPageContextInfo.clientServerTimeDelta);
        console.log("currentServerDateTime:" + moment(currentServerDateTime).format("YYYYMMDD"));
        if (moment(currentServerDateTime).format("YYYYMMDD") > dateExpried) {
            window.location.href = "../Pages/PageExpried.aspx";
            //console.log("Hết hạn bản quyền rồi nhé");
        }
    }catch(err){
        console.log("checkExpriedliscence:" + err.message);
    }
}

function checkPermiss() {
    try {
        var userId = _spPageContextInfo.userId;
        console.log("userId:" + userId + "##" + arrAdmin.join(",") + "##" + arrUser.join(","));
        if (arrAdmin.length > 0) {
            if ($.inArray(userId, arrAdmin) > -1) {
                return true;
            }
        }
        //if (arrAccounting.length > 0) {
        //    if ($.inArray(userId, arrAccounting) > -1) {
        //        return true;
        //    }
        //}
        //if (arrAdminHN.length > 0) {
        //    if ($.inArray(userId, arrAdminHN) > -1) {
        //        return true;
        //    }
        //}
        //if (arrAdminHCM.length > 0) {
        //    if ($.inArray(userId, arrAdminHCM) > -1) {
        //        return true;
        //    }
        //}
        //if (DirectionGeneral.length > 0) {
        //    if (DirectionGeneral.findIndex(u => u.Id == userId) > -1) {
        //        return true;
        //    }
        //}
        //if (arrUser.length > 0) {
        //    if ($.inArray(userId, arrUser) > -1) {
        //        return false;
        //    } else {
        //        console.log("Không có quyền truy cập.");
        //        window.location.href = "../Pages/PageDeny.aspx";
        //        return false;
        //    }
        //}
        return _spPageContextInfo.isSiteAdmin;

    } catch (err) {
        console.log("checkPermiss:" + err.message);
    }
}

function checkPermissAccounting() {
    try {
        var userId = _spPageContextInfo.userId;
        console.log("userId:" + userId + "##" + arrAccounting.join(",") + "##" + arrUser.join(","));
        if (arrAccounting.length > 0) {
            if ($.inArray(userId, arrAccounting) > -1) {
                return true;
            }
        }
        if (arrUser.length > 0) {
            if ($.inArray(userId, arrUser) > -1) {
                return false;
            } else {
                console.log("Không có quyền truy cập.");
                window.location.href = "../Pages/PageDeny.aspx";
                return false;
            }
        }
        return _spPageContextInfo.isSiteAdmin;

    } catch (err) {
        console.log("checkPermissAccounting:" + err.message);
    }
}