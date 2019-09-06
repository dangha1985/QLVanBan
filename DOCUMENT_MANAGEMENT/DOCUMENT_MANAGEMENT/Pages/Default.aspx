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
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.0/css/all.css" integrity="sha384-aOkxzJ5uQz7WBObEZcHvV5JvRW3TUc2rNPA7pe3AwnsUohiw1Vj2Rgx2KSOkF5+h" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet" />
      <link href="../Content/stylesheet.css" rel="stylesheet" type="text/css" />
    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
     <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
  
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div>
        <nav class="navbar navbar-bg">
            <div class="container-fluid container-menu">
                <ul class="nav navbar-nav " id="myNavbar">
                    <li id="Setting-li" class=""><a data-toggle="modal" data-target="#Setting-menu"><i class="fas fa-cogs "></i>SETTING</a></li>
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
                        <input type="text" class="form-control" placeholder="Find " name="search" style="height: 33px;">
                        <div class="input-group-btn" style="width: 20px;">
                            <button class="btn btn-default" type="submit">
                                <i class="glyphicon glyphicon-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
       
        </div>
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
                                    <div class="col-md-12">
                                        <div class="modalMenu-job">
                                            <a href="../Pages/CreateList.aspx"><i class="fas fa-pencil-alt"></i>
                                                Tạo List</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                           
                            </div>
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
