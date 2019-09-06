<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.0/css/all.css" integrity="sha384-aOkxzJ5uQz7WBObEZcHvV5JvRW3TUc2rNPA7pe3AwnsUohiw1Vj2Rgx2KSOkF5+h"
        crossorigin="anonymous"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet"/>
    <link href="../Content/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/mdbboostrap/css/toastr.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/select2/css/select2.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/select2/css/select2-bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/datatables/datatables.min.css" rel="stylesheet" type="text/css" />
    <link href="../Content/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../Content/stylesheet.css" rel="stylesheet" />

    <!-- Add your JavaScript to the following file -->

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <%--<script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>--%>
    <script src="../Content/assets/global/plugins/mdbboostrap/js/toastr.min.js" type="text/javascript"></script>
    <script src="../Content/assets/global/scripts/datatable.js" type="text/javascript"></script>
    <script src="../Content/assets/global/plugins/datatables/datatables.min.js" type="text/javascript"></script>
    <script src="../Content/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js" type="text/javascript"></script>
    <script type="text/javascript" src="../Content/assets/global/plugins/select2/js/select2.full.min.js"></script>
    <script type="text/javascript" src="../Content/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js"></script>

     <script src="../Content/assets/global/plugins/xlsx.core.min.js" type="text/javascript"></script>
     <script src="../Content/assets/global/plugins/excelplus-2.5.min.js" type="text/javascript"></script>

     <script type="text/javascript" src="../Scripts/app.min.js"></script>
     <script type="text/javascript" src ="../Scripts/AppCommon.js"></script>
    <script type="text/javascript" src="../Scripts/ListCommonFunction.js"></script>
    <script type="text/javascript" src="../Scripts/ListFunction.js"></script>
      <script type="text/javascript" src="../Scripts/AppPermision.js"></script>
    <script type="text/javascript" src="../Scripts/CreateList.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<%--<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
</asp:Content>--%>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

     <nav class="navbar navbar-bg">
            <div class="container-fluid container-menu">
                <ul class="nav navbar-nav " id="myNavbar">
                   <%-- <li id="CoreHR-li" class=""><a data-toggle="modal" data-target="#coreHR-menu"><i class="fas fa-user"></i>CORE HR</a></li>
                     <li><a data-toggle="modal" data-target="#time-menu"><i class="far fa-calendar-alt"></i>TIME & ATTENDANCE</a></li>
            <li><a data-toggle="modal" data-target="#compensation-menu"><i class="fas fa-dollar-sign"></i>COMPENSATION</a></li>
            <li><a data-toggle="modal" data-target="#recruiting-menu"><i class="fas fa-search"></i>RECRUITING</a></li>
                    <li id="Performance-li"><a data-toggle="modal" data-target="#performance-menu"><i class="fas fa-chart-line"></i>PERFORMANCE</a></li>
                     <li><a data-toggle="modal" data-target="#compensation-menu"><i class="fas fa-book"></i>LEARNING</a></li>
            <li><a data-toggle="modal" data-target="#compensation-menu"><i class="fas fa-handshake"></i>SUCCESSION</a></li>
            <li><a data-toggle="modal" data-target="#compensation-menu"><i class="fas fa-scroll"></i>REPORT</a></li>--%>
                    <li id="Setting-li" ><a data-toggle="modal" data-target="#Setting-menu"><i class="fas fa-cogs "></i>SETTING</a></li>
                    <%--  <li><a data-toggle="modal" data-target="#SharepointSite-menu"><i class="fas fa-cogs"></i>SHAREPOINT SITE</a></li>--%>
                </ul>

                <ul class="nav navbar-nav navbar-right" id="currentuser-area">
                    <li class="dropdown" style="border: 0; background: #f3f1f1;">
                        <div id="userInfo"></div>
                        <a class="dropdown-toggle" style="padding: 10px 10px; color: black;" data-toggle="dropdown" href="#">
                            <img class="userLoginImg" id="userInfor-li" src="">
                            <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#">Page 1-1</a></li>
                            <li><a href="#">Page 1-2</a></li>
                            <li><a href="#">Page 1-3</a></li>
                        </ul>
                    </li>
                </ul>
                <div class="navbar-form navbar-right">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Find Employee" name="search" style="height: 33px;">
                        <div class="input-group-btn" style="width: 20px;">
                            <button class="btn btn-default" type="submit">
                                <i class="glyphicon glyphicon-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="modal fade modal-menu in" id="Setting-menu" role="dialog">
            <div class="modal-dialog modal-dialog-menu noMargin">
                <div class="modal-content modal-content-menu">
                    <span data-toggle="modal" data-target="#Setting-menu" class="close">&times;</span>
                    <div class="container-fuild">
                        <div class="row noMargin">
                            <div class="col-md-3">
                                <div class="modalMenu-title">
                                    <i class="fas fa-chart-line blue"></i>
                                    <h2>Setting</h2>
                                </div>
                                <div class="modalMenu-job">
                                    <p>
                                    </p>
                                    <div class="col-md-12">

                                        <div class="modalMenu-job">
                                            <a href="../Pages/CreateList.aspx"><i class="fas fa-pencil-alt"></i>
                                                Tạo List</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="modalMenu-title">
                                    <%--  <i class="fas fa-chart-line blue"></i>
                                <h3></h3>--%>
                                </div>
                                <div class="modalMenu-job">
                                </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    <div class="subMenu">
        <div class="subMenu-top">
            <p class="noMargin">Browse</p>
        </div>
        <div class="subMenu-bottom">
            <img src="../Images/Logo.jpg">
            <div class="breadcrumbDiv">
                <h3>Create List</h3>
                <ul class="breadcrumb">
                    <li><a href="../Pages/Default.aspx"><i class="fas fa-home blue"></i></a></li>
                   <%-- <li><a href="#"><i class="fas fa-chart-line"></i>Performance</a></li>
                    <li><a href="#">Goals</a></li>--%>
                    <li><a href="#">Create List</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="container-fuild paddingMain">
           <div class="row noMargin paddingRow" id="divbtnAdd">
          <%--  <button type="button" class="btn btn-normal btn-green" data-toggle="modal" data-target="#formCreateList">
            <i class="fas fa-plus"></i>
            Init List</button>--%>
            <button type="button" class="btn btn-normal btn-green" onclick="ImportExcelList(0);"> Import Create List</button>
              <%-- <button type="button" class="btn btn-default btn-sm"  onclick="ImportExcelList(1);">
                                                    <i class="fa fa-paper-plane font-green-jungle right-5"></i>&nbsp; Import Lookup Column</button>--%>
            <button type="button" class="btn btn-normal btn-green" onclick="DeleteList()">Delete List</button>
        </div>
        <div class="row noMargin">
            <div class="col-sm-12">
                <div class="portlet box bg-grey bg-font-grey fx-portlet">
                    <div class="portlet-title">
                        <div class="caption caption-md">
                            <span class="caption-subject hr-process uppercase portlet_title_tsg_2" data-toggle="collapse" data-target="#body_input">
                                <i class="icon-doc" style="margin-right: 5px"></i>Choose data file</span>
                        </div>
                    </div>
                    <div class="portlet-body collapse in" id="body_input">
                        <div class="row noMargin">
                            <div class="col-md-6">
                                <p>You select the excel data file: </p>
                                <input id="file-object" type="file" value="Open an Excel file">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row noMargin">
            <div class="col-sm-12">
                <div class="portlet box bg-grey bg-font-grey fx-portlet">
                    <div class="portlet-title">
                        <div class="caption caption-md">
                            <span class="caption-subject hr-process uppercase portlet_title_tsg_2" data-toggle="collapse" data-target="#body_ct">
                                <i class="icon-list" style="margin-right: 5px"></i>Data</span>
                        </div>
                    </div>
                    <div class="portlet-body collapse in" id="body_ct">
                        <div class="row noMargin">
                            <div class="col-sm-12">
                                <div class="table-responsive">
                                    <table class="table table-advance table-bordered" id="table">
                                        <tbody id="bodyTable">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <%--  <div class="row paddingRow noMargin">
            <div class="col-md-12 noPadding">
                <div class="portlet-body">
                    <div id="ApprRe-table" class="">
                        <div class="table-scrollable">
                            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer"
                                id="table" role="grid" aria-describedby="sample_1_info">
                                <thead>
                                     <tr role="row">
                                            <th style="width:20% "><span class="ZPbold">List Name</span></th>
                                            <th style="width:50% "><span class="ZPbold">Type</span></th>
                                            <th style="width:20% ""><span class="ZPbold">Actions</span></th>
                                        </tr>
                                </thead>
                                <tbody id="tableBody">
                                   
                                </tbody>
                            </table>
                        </div>
                  
                    </div>
                </div>
            </div>
        </div>--%>
    </div>
    <!-- modal của phần form form_Department -->
    <div class="modal fade in" id="formCreateList" role="dialog">
        <div class="modal-dialog" style="width: 800px;">
            <div class="modal-content">
                <div class="modal-header">
                      <span type="button" class="close" data-dismiss="modal" aria-label="Close">x</span>
                    <h4 class="modal-title" id="modal-title"> <span  id="form_header_name">Init List</span></h4>
                </div>
                <div class="modal-body padding-bottom">
                    <div class="row rowForm">
                        <form></form>
                        <form class="form-horizontal noMargin" id="CreateList">
                             <div class="form-group" style="margin-left: 0; margin-right: 0;">
                                <div class="col-sm-3">
                                    <label class="control-label" for="">Url Home</label>
                                </div>
                                <div class="col-sm-8">
                                     <input type="text" class="form-control" id="urlCreateList" placeholder="" name="Title">
                                </div>
                            </div>
                        </form>
                    </div>
<%--                    <div class="row rowForm">
                        <form></form>
                        <form class="form-horizontal noMargin">
                            <div class="form-group" style="margin-left: 0; margin-right: 0;">
                              <div id="toast-container" class="toast-top-right" aria-live="polite" role="alert" style="position: inherit;"><div class="toast toast-error" style="opacity: 0.768745;width: 100%;"><div class="toast-message">Create List failed</div></div></div>
                            </div>
                        </form>
                    </div>--%>
                </div>
                  <div class="modal-footer text-left divButtomEdit ">
                                    <button type="button" id="edit_btn" onclick="CreateList()" class="btn btn-green">Create List Auto</button>
                                </div>
            </div>
        </div>
    </div>
         <%--  BEGIN MODEL delete--%>
            <div class="modal fade ZPmdl DelMdl in" role="dialog" aria-labelledby="modalconfirmDel" id="confirmDel" aria-hidden="false">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header PR">
                            <div class="Icn orgbgi"><i id="zp_modal_icon" class="whi S24 IC-alert"></i></div>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">
                                    <div class="IC-cls-1px red S21 CP" onclick="Cancel()"></div>
                                </span>
                            </button>
                            <h4 id="zp_modal_header" class="modal-title">People Alert</h4>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <p class="text-center LH20" id="zp_confirm_body">Are you sure you want to delete?</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" onclick="DeleteById()" class="btn btn-primary">Confirm</button>
                            <button type="button" onclick="Close('confirmDel')" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <script type="text/javascript">
        function hideMenu(id) {
            $("#" + id).css("display", "none");
        }
        function showMenu(id) {
            $("#" + id).css("display", "block");
        }
      //  SetInfoUser();
       // $("#HR-ManagerMenu").load("DefaultTest.aspx", function () {

       // });
    </script>

</asp:Content>
