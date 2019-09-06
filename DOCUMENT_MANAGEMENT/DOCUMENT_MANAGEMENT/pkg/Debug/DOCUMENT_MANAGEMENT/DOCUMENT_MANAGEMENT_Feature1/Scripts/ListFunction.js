var nameTemp;

function ConfigAddNew(listtitle, listname, listuser, listdate, listlookup, listchoice, itemID, idDivFileAtt) {
    try {
        console.log("ConfigAddNew:" + itemID);
        var targetApproverValue;
        var arrname = listname.split(",");
        var arruser = listuser.split(",");
        var arrdate = listdate.split(",");

        var arrlookup = listlookup.split(",");
        var arrchoice = listchoice.split(",");
        var users = [];
        var clientContext = SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle(listtitle);
        var oListItem;

        //if (itemID) itemID = 0;
        if (itemID > 0) {
            oListItem = oList.getItemById(itemID);
            console.log("ConfigAddNew Update:" + itemID);
        } else {
            var itemCreateInfo = new SP.ListItemCreationInformation();
            oListItem = oList.addItem(itemCreateInfo);
            console.log("ConfigAddNew Add new:" + itemID);
        }
        //console.log("ListaddNewItem:2");
        for (var i = 0; i < arrname.length; i++) {
            if ($.inArray(arrname[i], arruser) > -1) {
                targetApproverValue = getUserKeys(arrname[i]);
                //console.log("ConfigAddNew: " + arrname[i] + ": " + targetApproverValue + "_" + Array.isArray(targetApproverValue));
                if (targetApproverValue) {
                    var targers = targetApproverValue.split(";");
                    users = [];
                    for (var x = 0; x < targers.length; x++) {
                        users.push(SP.FieldUserValue.fromUser(targers[x]));
                    }
                    oListItem.set_item(arrname[i], users);
                }
            } else if ($.inArray(arrname[i], arrdate) > -1) {
                try {
                    var objDate = moment($("#" + arrname[i]).val(), 'DD/MM/YYYY').toDate();
                    //console.log("arrname[i]:" + objDate);
                    if ($("#" + arrname[i]).val() !== '') {
                        oListItem.set_item(arrname[i], objDate);
                    }
                } catch (err) {
                    console.log("arrname[i]:" + err.message)
                }

            } else if ($.inArray(arrname[i], arrchoice) > -1) {
                try {
                    //console.log("ConfigAddNew listchoice:" + $("#" + arrname[i]).val());
                    if (CheckNull($("#" + arrname[i]).val()) !== '') {
                        oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                    }
                    //oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                } catch (err) {
                    console.log("listchoice:" + err.message);
                }
            }
            else if ($.inArray(arrname[i], arrlookup) > -1) {
                try {
                    var lookupvalue = new SP.FieldLookupValue();
                    var itemselect = $("#" + arrname[i]).val();
                    if (Array.isArray(itemselect) === true) {
                        var lookups = [];
                        for (var k = 0; k < itemselect.length; k++) {
                            var newLookUpField = new SP.FieldLookupValue();
                            newLookUpField.set_lookupId(parseInt(itemselect[k]));
                            lookups.push(newLookUpField);
                        }
                        oListItem.set_item(arrname[i], lookups);
                    } else {
                        if (CheckNull(itemselect) !== '') {
                            lookupvalue.set_lookupId(itemselect);
                            oListItem.set_item(arrname[i], lookupvalue);
                        }
                    }

                    //oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                } catch (err) {
                    console.log("listlookup:" + err.message);
                }
            }
            else {
                if (CheckNull($("#" + arrname[i]).val()) !== "") {
                    oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                }
            }
        }

        oListItem.update();
        clientContext.load(oListItem);
        clientContext.executeQueryAsync(
             function () {
                 try {
                     indexList = oListItem.get_item("ID");
                     myAlert("Save successfully.");
                     //window.location.href = "../Pages/PageTemplateEdit.aspx?List=" + listtitle + "&Id=" + indexList;
                 } catch (err) {
                     myAlert("Save failed:" + err.message);
                 }
             },

        function (sender, args) {
            myAlert("");
            console.log('ConfigAddNew Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        });
    } catch (err) {
        console.log("ListaddNewItem:" + err.message);
    }
}

function InsertHistory(listtitle, itemID, Author, Created, Title, StatusApproval,
    UserAppId, indexStep, totalStep, usersH, customerName, TotalMoney, status, callfunc, callupdate) {
    try {
        console.log("ListFunction InsertHistory start...");
        var strId = "";
        if (totalStep === undefined) {
            totalStep = 0;
        }
        if (customerName === undefined || customerName === null) {
            customerName = "";
        }

        var clientContext = SP.ClientContext.get_current();
        var oHSItem, oHStepItem;

        var oHistory = clientContext.get_web().get_lists().getByTitle("ListHistory");
        var camlQuery = new SP.CamlQuery();

        var isHAddNew = false;

        var Statusstep = 0;
        var nameStatus = textStatus.OnGoing;
        if (indexStep === undefined) { indexStep = 1; }
        var strSelect = '<View><Query><Where>'
                    + '<Eq>'
                    + '<FieldRef Name="Key" />'
                    + '<Value Type="Text">' + listtitle + "_" + itemID + '</Value>'
                    + '</Eq>'
                    + '</Where></Query></View>';

        camlQuery.set_viewXml(strSelect);
        oHSItem = oHistory.getItems(camlQuery);
        console.log("InsertHistory strSelect:" + strSelect);
        clientContext.load(oHSItem);
        clientContext.executeQueryAsync(function () {
            var clientContext1 = SP.ClientContext.get_current();
            var oHistory1 = clientContext1.get_web().get_lists().getByTitle("ListHistory");
            var itemH;
            console.log("InsertHistory count:" + oHSItem.get_count());
            if (oHSItem.get_count() === 0) {
                isHAddNew = true;
            }
            else {
                var itemEnumerator = oHSItem.getEnumerator();
                while (itemEnumerator.moveNext()) {
                    itemH = itemEnumerator.get_current();
                }
            }
            if (StatusApproval !== null) {
                indexStep = StatusApproval.split("_")[0];
                Statusstep = StatusApproval.split("_")[1];
                nameStatus = StatusName(Statusstep);
            }

            if (status === 1) {
                status = 0;
            } else {
                status = -1;
                nameStatus = "Save";
                Statusstep = -1;
            }

            console.log("InsertHistory(UserAppId,isHAddNew,indexStep,Statusstep, nameStatus):" + UserAppId + "|" + isHAddNew + "|" + indexStep + "|" + Statusstep + "|" + nameStatus);
            if (isHAddNew === true) {
                var itemHInfo = new SP.ListItemCreationInformation();
                itemH = oHistory1.addItem(itemHInfo);
                itemH.set_item("Title", Title);
                itemH.set_item("UserApproval", UserAppId);
                itemH.set_item("ListName", listtitle);
                itemH.set_item("IndexStep", indexStep);
                itemH.set_item("StatusStep", Statusstep);
                itemH.set_item("ItemIndex", itemID);
                itemH.set_item("UserRequest", Author);
                itemH.set_item("TitleRequest", Title);
                itemH.set_item("TotalStep", totalStep);
                itemH.set_item("DateRequest", Created);
                itemH.set_item("StatusName", nameStatus);
                itemH.set_item("NameUserRequest", userDisplayName);
                itemH.set_item("IsFinnish", status);
                itemH.set_item("CustomerName", customerName);
                itemH.set_item("Key", listtitle + "_" + itemID);
                itemH.set_item("TotalMoney", TotalMoney);
            }

            var newuserfield = new SP.FieldUserValue();
            newuserfield.set_lookupId(UserAppId);
            if (usersH === null) {
                usersH = [];
                usersH.push(newuserfield);
                itemH.set_item("ListUser", usersH);
            } else {
                if (usersH.indexOf(newuserfield) === -1) {
                    usersH.push(newuserfield);
                    itemH.set_item("ListUser", usersH);
                }
            }
            itemH.update();

            clientContext1.load(itemH);
            clientContext1.executeQueryAsync(
                function () {
                    console.log('InsertHistory sucesss.');
                    strId += itemH.get_item("ID") + "&";
                    var clientContext2 = SP.ClientContext.get_current();
                    var oHistoryStep = clientContext2.get_web().get_lists().getByTitle("ListHistoryStep");
                    var itemHStepInfo = new SP.ListItemCreationInformation();
                    var itemHStep = oHistoryStep.addItem(itemHStepInfo);
                    itemHStep.set_item("Title", Title);
                    itemHStep.set_item("UserApproval", UserAppId);
                    itemHStep.set_item("ListName", listtitle);
                    itemHStep.set_item("IndexStep", indexStep);
                    itemHStep.set_item("StatusStep", status);
                    itemHStep.set_item("ItemIndex", itemID);
                    itemHStep.set_item("UserRequest", Author);
                    itemHStep.set_item("TitleRequest", Title);
                    itemHStep.set_item("TotalStep", totalStep);
                    itemHStep.set_item("DateRequest", Created);
                    itemHStep.set_item("StatusName", nameStatus);
                    itemHStep.set_item("NameUserRequest", userDisplayName);
                    itemHStep.set_item("ListHistoryID", itemH.get_item("ID"));
                    itemHStep.set_item("CustomerName", customerName);
                    itemHStep.set_item("Key", listtitle + "_" + itemID + "_" + indexStep);
                    itemHStep.set_item("IsFinnish", status);
                    itemHStep.set_item("TotalMoney", TotalMoney);

                    itemHStep.update();
                    clientContext2.load(itemHStep);
                    clientContext2.executeQueryAsync(
                       function () {
                           console.log('ListHistoryStep  success.');
                           strId += itemHStep.get_item("ID");
                           if (callupdate !== undefined) {
                               callupdate(listtitle, itemID, indexStep - 1, typeApprol.Approved, UserAppId, false, callfunc)
                           } else if (callfunc !== undefined) {
                               callfunc(itemID);

                               //updateHistory(listTitle, ItemId, indexStep, typeApprol.Approved, lookupsIds, DateFinish, true);
                           }

                           return strId;
                           //window.location = "../Pages/CarBookingView.aspx?Id=" + itemID;
                       }, function (sender, args) {
                           console.log('ListHistoryStep failed 0. ' + args.get_message() +
                               '\n' + args.get_stackTrace());
                       });
                }, function (sender, args) {
                    console.log('ListHistoryStep failed 1. ' + args.get_message() +
                        '\n' + args.get_stackTrace());
                });

        }, function (sender, args) {
            console.log('InsertHistory failed 2. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        });

    } catch (err) {
        console.log("ListFunction InsertHistory:" + err.message);
    }
}

function ListaddNewItem(listtitle, listname, listuser, listdate, listlookup, listchoice, itemID, idDivFileAtt) {
    try {
        var isHAddNew = false;
        //console.log("ListaddNewItem:" + itemID);
        var targetApproverValue;
        var arrname = listname.split(",");
        var arruser = listuser.split(",");
        var arrdate = listdate.split(",");

        var arrlookup = listlookup.split(",");
        var arrchoice = listchoice.split(",");
        var users = [];
        var clientContext = SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle(listtitle);
        var oListItem;
        //if (itemID) itemID = 0;

        if (itemID > 0) {
            oListItem = oList.getItemById(itemID);
            console.log("ListaddNewItem Update:" + itemID);
        } else {
            var itemCreateInfo = new SP.ListItemCreationInformation();
            oListItem = oList.addItem(itemCreateInfo);
            console.log("ListaddNewItem Add new:" + itemID);
        }
        //console.log("ListaddNewItem:2");
        for (var i = 0; i < arrname.length; i++) {
            if ($.inArray(arrname[i], arruser) > -1) {
                targetApproverValue = getUserKeys(arrname[i]);
                //myAlert(arrname[i] + ":::" + targetApproverValue);
                if (targetApproverValue) {
                    if (targetApproverValue !== "") {
                        users = [];
                        users.push(SP.FieldUserValue.fromUser(targetApproverValue));
                        oListItem.set_item(arrname[i], users);
                    }
                }
            } else if ($.inArray(arrname[i], arrdate) > -1) {
                //myAlert(arrname[i] +":::"+ $("#" + arrname[i]).val());
                var objDate = moment($("#" + arrname[i]).val(), 'DD/MM/YYYY');
                if ($("#" + arrname[i]).val() !== '') {
                    oListItem.set_item(arrname[i], objDate);
                }
            } else if ($.inArray(arrname[i], arrchoice) > -1) {
                try {

                    console.log("ListaddNewItem listchoice:" + $("#" + arrname[i]).val());
                    oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                    //oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                } catch (err) {
                    myAlert("listchoice:" + err.message);
                }
            }
            else if ($.inArray(arrname[i], arrlookup) > -1) {
                try {
                    //myAlert(arrname[i] + ":(" + listlookup + "):" + $("#" + arrname[i]).val() + "::" + $("#" + arrname[i] + " :selected").text());
                    var lookupvalue = new SP.FieldLookupValue();
                    var itemselect = $("#" + arrname[i]).val();
                    console.log("ListAddNewItem is array:" + Array.isArray(itemselect) + "_" + itemselect);
                    if (Array.isArray(itemselect) === true) {
                        var lookups = [];
                        for (var k = 0; k < itemselect.length; k++) {
                            var newLookUpField = new SP.FieldLookupValue();
                            newLookUpField.set_lookupId(parseInt(itemselect[k]));
                            lookups.push(newLookUpField);
                        }
                        oListItem.set_item(arrname[i], lookups);
                    } else {
                        lookupvalue.set_lookupId(t);
                        oListItem.set_item(arrname[i], lookupvalue);
                    }

                    //oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
                } catch (err) {
                    myAlert("listlookup:" + err.message);
                }
            }
            else {
                //myAlert(arrname[i] + ":::" + $("#" + arrname[i]).val());
                oListItem.set_item(arrname[i], $("#" + arrname[i]).val());
            }
        }

        oListItem.update();
        clientContext.load(oListItem);
        clientContext.executeQueryAsync(
             function () {
                 try {
                     myAlert("");
                     //attach
                     initFileAtt(idDivFileAtt, listtitle, oListItem.get_item("ID"));
                     fdocattach();

                     indexList = oListItem.get_item("ID");
                     InsertHistory(listtitle, indexList, oListItem.get_item("Author"), oListItem.get_item("Created"), oListItem.get_item("Title"),
                         oListItem.get_item("StatusApproval"), $("#userChoice").val(), undefined, undefined, null, null, 0, 1);
                     console.log("StartWorkflow start...");
                     var iStep = 1;
                     var targetApproverValue = $("#userChoice").val();
                     console.log("StartWorkflow int..." + "|" + listtitle + "|" + indexList + "|" + iStep + "|" + targetApproverValue);
                     StartWorkflow(listtitle, indexList, iStep, targetApproverValue);
                     //console.log("save success indexList:" + indexList);
                     //initFileAtt(idDivFileAtt, listtitle, oListItem.get_item("ID"));
                     //fdocattach();
                     //redirect       
                     //myAlert("Save successfully.");
                     //window.location.href = "../Pages/PageTemplateView.aspx?List=" + listtitle + "&Id=" + indexList + "&View=TaskView";
                 } catch (err) {
                     myAlert("Save failed:" + err.message);
                 }
             },

        function (sender, args) {
            myAlert('ListaddNewItem Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        });
    } catch (err) {
        myAlert("ListaddNewItem:" + err.message);
    }
}

function onAddSucceeded(sender, args) {
    $("#saveResult").html("Item successfully added!");
    //SP.UI.Notify.addNotification("Item successfully added!");
}

function onAddFailed(sender, args) {
    myAlert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function initValue(listtitle, listname, listuser, listdate, listlookup, listchoice, listitemid) {
    try {

        //myAlert(listname + ":::" + listuser + ":::" + listdate);
        var arrname = listname.split(",");
        var arruser = listuser.split(",");
        var arrdate = listdate.split(",");
        var arrlookup = listlookup.split(",");
        var arrchoice = listchoice.split(",");

        var clientContext = SP.ClientContext.get_current();
        var item = clientContext.get_web().get_lists().getByTitle(listtitle).getItemById(listitemid);
        var attachmentList = item.get_attachmentFiles();
        var fields = clientContext.get_web().get_lists().getByTitle(listtitle).get_fields();
        clientContext.load(attachmentList);
        clientContext.load(item);
        clientContext.load(fields);
        clientContext.executeQueryAsync(
             function () { // successfully retrieved value from list item
                 try {
                     for (var i = 0; i < arrname.length; i++) {

                         arrname[i] = getLinkField(arrname[i]);

                         if ($.inArray(arrname[i], arruser) > -1) {
                             //myAlert("User::" + arrname[i] + item.get_item(arrname[i]).get_lookupValue());

                             var users = [];
                             nameTemp = arrname[i];
                             var author = item.get_item(arrname[i]);

                             //myAlert(checkMethod(author, "get_lookupValue"));

                             if (Array.isArray(author) === false) {
                                 users.push(author.get_lookupValue());
                             } else {
                                 for (i1 = 0; i1 < author.length; i1++) {
                                     users.push(author[i1].get_lookupValue());
                                 }
                             }
                             for (var j = 0; j < users.length; j++) {
                                 setUserKeys(nameTemp, users[j]);
                             }

                         } else if ($.inArray(arrname[i], arrlookup) > -1) {
                             //myAlert("initValue::" +item.get_item(arrname[i]).get_lookupId() + "+++" + item.get_item(arrname[i]).get_lookupValue());
                             if (item.get_item(arrname[i]) !== null) {
                                 var lookups = item.get_item(arrname[i]);
                                 if (Array.isArray(lookups) === true) {
                                     var arrLookup = [];
                                     for (var k = 0; k < lookups.length; k++) {
                                         arrLookup.push(lookups[k].get_lookupId());
                                     }
                                     //console.log("lookup arr:" + arrLookup.join("##"));
                                     $("#" + arrname[i]).val(arrLookup).trigger("change");
                                 } else {
                                     //console.log("lookup not arr:" + lookups.get_lookupId());
                                     $("#" + arrname[i]).val(lookups.get_lookupId()).trigger("change");
                                 }
                             }
                         } else if ($.inArray(arrname[i], arrchoice) > -1) {
                             //console.log("choice:"+arrname[i] + "##" + listchoice + "##" + item.get_item(arrname[i]));
                             $("#" + arrname[i]).val(item.get_item(arrname[i]));
                         }
                         else if ($.inArray(arrname[i], arrdate) > -1) {
                             if (item.get_item(arrname[i]) !== null) {
                                 $("#" + arrname[i]).datepicker("setDate", item.get_item(arrname[i]));
                             }
                         }
                         else {
                             if (arrname[i] === "RelatedItems") {
                                 pareseRelatedItems(item.get_item(arrname[i]));
                             } if (arrname[i] === "Body" || arrname[i] === "BodyTask") {
                                 console.log("Init value:" + arrname[i] + ":::" + item.get_item(arrname[i]));
                                 $("#" + arrname[i]).html(item.get_item(arrname[i]));
                             }
                             else {
                                 $("#" + arrname[i]).val(item.get_item(arrname[i]));
                             }
                         }
                     }

                     initAttachments(listtitle, listitemid, attachmentList);
                     var fieldsNames = collectionToArraybyName(fields);
                     //console.log("Before call flow:" + fieldsNames.join("#") + $.inArray("StatusApproval", fieldsNames));
                     //if ($.inArray("StatusApproval", fieldsNames) > -1) {
                     //    //"1_-1"
                     //    if (item.get_item("StatusApproval") === null) {
                     //        HtmlprogressBar("1_-1", listTitle);
                     //    }
                     //    else {
                     //        HtmlprogressBar(item.get_item("StatusApproval"), listTitle);
                     //    }
                     //}
                 } catch (err) {
                     myAlert("initValue try catch:" + err.message);
                 }
             },
             function (sender, args) { // on error
                 myAlert("InitValue::" + args.get_message());
             }
        );
    } catch (err) {
        myAlert("InitValue:" + err.message);
    }
}

function resetValue(listtitle, listname, listuser, listdate, listlookup, listchoice, idAttList) {
    try {
        //myAlert(listname + ":::" + listuser + ":::" + listdate);
        var arrname = listname.split(",");
        var arruser = listuser.split(",");
        var arrdate = listdate.split(",");
        var arrlookup = listlookup.split(",");
        var arrchoice = listchoice.split(",");
        // successfully retrieved value from list item
        try {
            for (var i = 0; i < arrname.length; i++) {

                arrname[i] = getLinkField(arrname[i]);

                if ($.inArray(arrname[i], arruser) > -1) {
                    //myAlert("User::" + arrname[i] + item.get_item(arrname[i]).get_lookupValue());
                    nameTemp = arrname[i];
                    //setUserKeys(nameTemp, users[j]);
                    clearUserKeys(nameTemp);

                } else if ($.inArray(arrname[i], arrlookup) > -1) {
                    //myAlert("resetValue::" + item.get_item(arrname[i]).get_lookupId() + "+++" + item.get_item(arrname[i]).get_lookupValue());
                    $("#" + arrname[i]).val('').trigger("change");
                } else if ($.inArray(arrname[i], arrchoice) > -1) {
                    //alert("initValue::" +item.get_item(arrname[i]).get_lookupId() + "+++" + item.get_item(arrname[i]).get_lookupValue());
                    //console.log(arrname[i] + "##" + listchoice + "##" + item.get_item(arrname[i]));
                    $("#" + arrname[i]).val('');
                }
                else if ($.inArray(arrname[i], arrdate) > -1) {
                    //$("#" + arrname[i]).val(item.get_item(arrname[i]));   
                    //$("#" + arrname[i]).data("DateTimePicker").date(new Date());
                    $("#" + arrname[i]).val('');
                }
                else {
                    $("#" + arrname[i]).val('');
                }
            }

            //$("#saveResult").html("reset successfully!");
            idAttList.html("");
        } catch (err) {
            myAlert(" resetValue error:" + err.message);
        }
    } catch (err) {
        myAlert("resetValue:" + err.message);
    }
}

function GeneratorHtml(field) {
    try {


        var get_title, get_internalName, get_fieldTypeKind, get_allowMultipleValues;
        var get_required;
        var get_lookupField, get_lookupList;
        if (checkMethod(field, "get_allowMultipleValues") > 0) {
            get_allowMultipleValues = field.get_allowMultipleValues();
        } else {
            get_allowMultipleValues = false;
        }

        if (checkMethod(field, "get_lookupField") > 0) {
            get_lookupField = field.get_lookupField();
        } else {
            get_lookupField = "";
        }

        if (checkMethod(field, "get_lookupList") > 0) {
            get_lookupList = field.get_lookupList();
        } else {
            get_lookupList = "";
        }

        get_title = field.get_title();
        get_internalName = field.get_internalName();
        get_fieldTypeKind = field.get_fieldTypeKind();
        get_required = getRequiredField(field.get_required());
        //console.log("GeneratorHtml(" + field.get_internalName() + ")::" + field.get_required());
        var html = '';
        var style = '';//'style="margin-bottom:10px;" ';

        get_internalName = getLinkField(get_internalName);

        arrName.push(get_internalName);
        switch (get_fieldTypeKind) {
            case 0://RelatedItems
                if (get_internalName === "RelatedItems") {
                    html = '<div id="itemDetail"/>';
                }
                break;
            case 2://text, computed
                html = '<div class="form-group">'
                + '<div class="row">'
                + '<label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + get_internalName + '">' + get_title + get_required + '</label>'
                + '<div class="col-md-6 col-sm-6 col-xs-12">'
                + '<div class="input-icon right"><i class="fa"></i>'
                + '<input type="text" class="form-control" id="' + get_internalName + '" name="' + get_internalName + '" placeholder="' + get_title + '" name="' + get_internalName + '" ' + style + '' + checkInputReadOnly(get_internalName) + '/>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
                break;
            case 3://multi text
                if (get_internalName === "Body" || get_internalName === "BodyTask") {
                    html = '<div class="form-group">'
                  + '<div class="row">'
                  + '<label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + get_internalName + '">' + get_title + get_required + '</label>'
                  + '<div class="col-md-6 col-sm-6 col-xs-12">'
                  + '<div class="input-icon right"><i class="fa"></i>'
                  + getHtmlTextArea(get_internalName, style)
                  + '</div>'
                  + '</div>'
                  + '</div>'
                  + '</div>';

                } else {
                    html = '<div class="form-group">'
                   + '<div class="row">'
                   + '<label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + get_internalName + '">' + get_title + get_required + '</label>'
                   + '<div class="col-md-6 col-sm-6 col-xs-12">'
                   + '<div class="input-icon right"><i class="fa"></i>'
                   + '<textarea class="form-control" rows="3" id="' + get_internalName + '" name="' + get_internalName + '"' + style + '></textarea>'
                   + '</div>'
                   + '</div>'
                   + '</div>'
                   + '</div>';
                }
                break;
            case 4: //dateTime
                html = '<div class="form-group">'
                + '<div class="row">'
                + '<label class="control-label col-md-3 col-sm-3 col-xs-12">' + get_title + get_required + '</label>'
                + '<div class="col-md-6 col-sm-6 col-xs-12">'
                + '<div class="input-group date" >'
                + '<div class="input-icon right"><i class="fa"></i>'
                //+ '<input type="text" class="form-control" id="' + get_internalName + '" ' + style + '/>'

                + '<input class="form-control form-control-inline input-medium date-picker" data-date-format="dd/mm/yyyy" size="16" type="text" value="" id="' + get_internalName + '" name="' + get_internalName + '" />'
                //+'<span class="help-block"> Select date </span>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
                arrDate.push(get_internalName);
                break;
            case 6: //choice
                html = '<div class="form-group">'
                + '<div class="row">'
                + '<label class="control-label col-md-3 col-sm-3 col-xs-12">' + get_title + get_required + '</label>'
                + '<div class="col-md-6 col-sm-6 col-xs-12">'
                + '<div class="input-icon right"><i class="fa"></i>'
                + '<select class="form-control" id="' + get_internalName + '" name="' + get_internalName + '">'
                + '</select>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
                arrChoiceHtml.push(get_internalName);// + "," + get_lookupList + "," + get_lookupField);
                arrChoice.push(get_internalName);
                break;
            case 7:
                if (get_allowMultipleValues === true) {
                    html = '<div class="form-group">'
                    + '<div class="row">'
                    + '<label class="control-label col-md-3 col-sm-3 col-xs-12">' + get_title + get_required + '</label>'
                    + '<div class="col-md-6 col-sm-6 col-xs-12">'
                    + '<div class="input-icon right"><i class="fa"></i>'
                    + '<select class="form-control select2" id="' + get_internalName + '" name="' + get_internalName + '" multiple></select>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                } else {
                    html = '<div class="form-group">'
                    + '<div class="row">'
                    + '<label class="control-label col-md-3 col-sm-3 col-xs-12">' + get_title + get_required + '</label>'
                    + '<div class="col-md-6 col-sm-6 col-xs-12">'
                    + '<div class="input-icon right"><i class="fa"></i>'
                    + '<select class="form-control select2" id="' + get_internalName + '" name="' + get_internalName + '"></select>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                }
                arrLookupHtml.push(get_internalName + "," + get_lookupList + "," + get_lookupField);
                arrLookup.push(get_internalName);
                break;
            case 8://boolean
                break;
            case 9://number
                html = '<div class="form-group">'
                + '<div class="row">'
                + '<label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + get_internalName + '">' + get_title + get_required + '</label>'
                + '<div class="col-md-6 col-sm-6 col-xs-12">'
                + '<div class="input-icon right"><i class="fa"></i>'
                + '<input type="number" class="form-control" id="' + get_internalName + '" name="' + get_internalName + '" ' + style + '/>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
                break;
            case 10://currency
                break;
            case 11://URL
                break;
            case 12:
                html = '<div class="form-group">'
                + '<div class="row">'
                + '<label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + get_internalName + '">' + get_title + get_required + '</label>'
                + '<div class="col-md-6 col-sm-6 col-xs-12">'
                + '<div class="input-icon right"><i class="fa"></i>'
                + '<input type="text" class="form-control" id="' + get_internalName + '" placeholder="' + get_title + '" name="' + get_internalName + '" ' + style + ' />'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
                break;
            case 19://attachments
                break;
            case 20://user
                html = '<div class="form-group">'
                       + '<div class="row">'
                       + '<label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + get_internalName + '">' + get_title + get_required + '</label>'
                       + '<div class="col-md-6 col-sm-6 col-xs-12">'
                       + '<div class="input-icon right"><i class="fa"></i>'
                       + '<div id="' + get_internalName + '" name="' + get_internalName + '"' + style + '/>'
                       + '</div></div></div></div>';
                //initializePeoplePicker(get_internalName);

                if (get_allowMultipleValues === true) {
                    arrMulUser.push(get_internalName);
                }
                arrUser.push(get_internalName);

                break;
            default:
                break;
        }
        return html;
    } catch (err) {
        myAlert("GeneratorHtml:" + err.message);
    }
}
//
function lookupListItems(divItem, listTitle, fieldTitle) {
    //myAlert(divItem + listTitle + fieldTitle);
    try {
        var collListItem;
        //var context = SP.ClientContext().get_current();
        //console.log(" lookupListItems 1");
        var oList = context.get_web().get_lists().getById(listTitle);
        //var oList = context.get_web().get_lists().getByTitle("Demo List");
        var camlQuery = new SP.CamlQuery();
        //if (strXML === undefined) {
        camlQuery.set_viewXml('');
        //} else {
        //    camlQuery.set_viewXml('');//strXML
        //}        
        //console.log("lookupListItems  2");
        collListItem = oList.getItems(camlQuery);
        context.load(collListItem);
        //console.log("lookupListItems 3" + oList.toString());
        context.executeQueryAsync(
            function () {
                var listItemInfo = '';
                var listItemEnumerator = collListItem.getEnumerator();
                //myAlert("4");
                listItemInfo += ' <option value=""></option>';
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    listItemInfo += ' <option value="' + oListItem.get_item("ID") + '">' + oListItem.get_item(fieldTitle) + '</option>';
                }
                console.log("LisstFunction lookupListItems: " + listItemInfo);
                $("#" + divItem).html(listItemInfo);
                //if (namePortlet !== undefined) {
                //    unblock(namePortlet);
                //}
            },
            function (sender, args) {
                if (namePortlet !== undefined) {
                    unblock(namePortlet);
                }
                console.log('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }
        );
    } catch (err) {
        //if (namePortlet !== undefined) {
        //    unblock(namePortlet);
        //}
        console.log("lookupListItems::" + err.message);
    }
}

function ViewHtml(get_title, item, fields) {

    var item_value, get_Type;
    item_value = item.get_item(get_title);
    get_Type = getTypeKind(fields, get_title);
    //console.log(get_title + " :: " + item_value + " :: " + get_Type);
    var html = "";
    try {
        switch (get_Type) {
            case 1://Integer
                if (item_value !== null) html = CheckNull(item_value);
                break;
            case 2://text, computed     
                if (item_value !== null) html = CheckNull(item_value);
                break;
            case 3://multi text          
                if (item_value !== null) html = CheckNull(item_value);
                break;
            case 4: //dateTime           
                if (item_value !== null) html = getDateFiled(item_value);
                break;
            case 6: //choice
                if (item_value !== null) html = CheckNull(item_value);
                break;
            case 7: //look up
                if (item_value !== null) {
                    if (Array.isArray(item_value) === true) {
                        html = "";
                        for (var t = 0; t < item_value.length; t++) {
                            html += getLookupFiled(item_value[t]) + "; ";
                        }
                    } else {
                        html = getLookupFiled(item_value);
                    }

                }
                break;
            case 8://boolean
                break;
            case 9://number
                if (item_value !== null) html = item_value;
                break;
            case 10://currency
                break;
            case 11://url               
                break;
            case 12://computed
                if (item_value !== null) html = item_value;
                break;
            case 19://attachments
                break;
            case 20://user                  
                if (item_value !== null) {
                    if (Array.isArray(item_value) === true) {
                        for (i = 0; i < item_value.length; i++) {
                            if (item_value[i] !== null) {
                                var member = item_value[i];
                                if (member.get_lookupValue()) {
                                    html += member.get_lookupValue() + "; ";
                                }
                            }
                        }
                    }
                    else {
                        var lookupValue = item_value.get_lookupValue();
                        var lookupId = item_value.get_lookupId();
                        if (lookupValue) {
                            html = lookupValue;
                        }
                    }
                }

                break;
            default:
                if (item_value !== null) html = item_value;
                //myAlert("default");
                break;
        }

    } catch (err) {
        myAlert("ViewHtml:(" + get_title + "):" + err.message);
    }

    return html;
}

function ViewHtmlWithHtml(get_title, item, fields) {
    //myAlert(get_title + " :: " + item_value + " :: " + get_Type);    

    try {
        var item_value, get_Type;
        item_value = item.get_item(get_title);
        get_Type = getTypeKind(fields, get_title);
        var html = "";
        switch (get_Type) {
            case 2://text, computed     
                if (item_value !== null) html = item_value;
                break;
            case 3://multi text          
                if (item_value !== null) html = item_value;
                break;
            case 4: //dateTime           
                if (item_value !== null) html = moment($(item_value)).format("YYYY-MM-DD HH:mm:ss");
                break;
            case 6: //choice
                if (item_value !== null) html = item_value;
                break;
            case 7: //look up
                if (item_value !== null) {
                    if (Array.isArray(item_value) === true) {
                        html = "";
                        for (var t = 0; t < item_value.length; t++) {
                            html += item_value[t].get_lookupValue() + "; ";
                        }
                    } else {
                        html = item_value.get_lookupValue();
                    }

                }
                break;
            case 8://boolean
                break;
            case 9://number
                if (item_value !== null) html = item_value;
                break;
            case 10://currency
                break;
            case 11://url               
                break;
            case 12://computed
                if (item_value !== null) html = item_value;
                break;
            case 19://attachments
                break;
            case 20://user   
                if (item_value !== null) {
                    if (Array.isArray(item_value) === true) {
                        for (i = 0; i < item_value.length; i++) {
                            if (item_value[i] !== null) {
                                var member = item_value[i];
                                if (member.get_lookupValue()) {
                                    html += member.get_lookupValue() + "; ";
                                }
                            }
                        }
                    }
                    else {
                        var lookupValue = item_value.get_lookupValue();
                        var lookupId = item_value.get_lookupId();
                        if (lookupValue) {
                            html = lookupValue;
                        }
                    }
                }
                break;
            default:
                //myAlert("default");
                break;
        }

    } catch (err) {
        myAlert("ViewHtmlWithHtml:(" + get_title + "):" + err.message);
    }
    //myAlert("html (" + get_title + "):" + html);

    html = '<div class="form-group">'
            + '<div class="row">'
            + '<label class="control-label col-md-3 col-sm-3 col-xs-12" >' + get_title + '</label>'
            + '<label class="control-label col-md-6 col-sm-6 col-xs-12 font-grey-cascade" style="text-align:left">' + html + '</label>'
            + '</div>'
            + '</div>';
    return html;
}


// Redirects the browser to the original Source
function redirFromInitForm() {
    window.location = decodeURIComponent(getUrlParams()["Source"]);
}

function choiceListItems(divItem, listTitle, fieldTitle) {

    try {
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var studList = web.get_lists().getByTitle(listTitle);
        //alert("1");
        var studbatches = context.castTo(studList.get_fields().getByInternalNameOrTitle(fieldTitle), SP.FieldChoice);
        //alert("2");
        context.load(studbatches);
        //alert("3");
        context.executeQueryAsync(function () {
            try {
                var choices = studbatches.get_choices();
                //console.log("Choices: (" + choices.length + ") - " + choices.join(", "));
                var listItemInfo = '';
                //alert("4");
                for (var j = 0; j < choices.length; j++) {
                    listItemInfo += ' <option value="' + choices[j] + '">' + choices[j] + '</option>';
                }
                //alert(listItemInfo)
                $("#" + divItem).html(listItemInfo);
            } catch (err) {
                console.log("onSuccessMethod:" + err.message);
            }
        },
        function (sender, args) {
            console.log("Error...!");
        });

    } catch (err) {
        myAlert("choiceListItems:" + err.message);
    }

}

//[{ "ItemId": 1, "WebId": "b83bb226-38e1-45c7-884c-a9f9508906ca", "ListId": "2925cbf8-f555-489e-97aa-018b09b89e55" }]
function pareseRelatedItems(jsonInput) {
    try {
        //jsonInput = '[{ "ItemId": 1, "WebId": "b83bb226-38e1-45c7-884c-a9f9508906ca", "ListId": "2925cbf8-f555-489e-97aa-018b09b89e55" }]';        
        jsonInput = jsonInput.replace("[", "");
        jsonInput = jsonInput.replace("]", "");
        console.log("pareseRelatedItems:" + jsonInput);
        var viewTitle = "Item Detail";
        var json = JSON.parse(jsonInput);
        //console.log("pareseRelatedItems:1");
        var itemid = json.ItemId;
        var listId = json.ListId;
        //console.log("pareseRelatedItems:2" + listId);
        var clientContext = SP.ClientContext.get_current();
        var listTitle = "";
        var oList = clientContext.get_web().get_lists().getById(listId);

        var view = oList.get_views().getByTitle(viewTitle);
        var fieldsInView = view.get_viewFields();
        var fields = oList.get_fields();
        //console.log("pareseRelatedItems:3" + getAllMethod(oList).join("\n"));
        clientContext.load(oList, "Title");
        var itemList = oList.getItemById(itemid);
        var attachmentList = itemList.get_attachmentFiles();

        clientContext.load(itemList);
        clientContext.load(attachmentList);
        clientContext.load(fields);
        clientContext.load(fieldsInView);
        //console.log("pareseRelatedItems:4");
        clientContext.executeQueryAsync(
                function () {
                    var fieldsNames = collectionToArray(fieldsInView); //get field names array 
                    listTitle = oList.get_title();
                    //var html = '<a href="../Pages/PageTemplateEdit.aspx?List=' + listTitle + '&Id=' + itemid + '&View=Item Detail&typeList=0" class="btn btn-success btn-sm" role="button"><span class="glyphicon glyphicon-edit"></span> View Item</a>';//class="btn btn-success btn-sm" role="button"
                    //if ($("#RelatedItems") !== undefined) {
                    //    $("#RelatedItems").html(html);
                    //}
                    var html = "";
                    //html += '<div class="container"><form class="form-horizontal">';

                    for (i = 0; i < fieldsNames.length; i++) {
                        if (checkIsShowField(fieldsNames[i]) === true) {
                            fieldsNames[i] = getLinkField(fieldsNames[i]);
                            html += ViewHtmlWithHtml(fieldsNames[i], item, fields);
                            //var textHtml = ViewHtml(fieldsNames[i], itemList, fields);
                            //if (textHtml.length > 0) {
                            //    if (fieldsNames[i] == "Body" || fieldsNames[i] == "BodyTask") {
                            //        html += '<div class="form-group">'
                            //        + '<label class="control-label col-md-3 col-sm-3 col-xs-12">' + fieldsNames[i] + ':</label>'
                            //        + '<div class="col-md-6 col-sm-6 col-xs-12">'
                            //        + '<div contenteditable="false" style="width: 100%;'
                            //        + 'height: auto;'
                            //        + 'margin: 0 auto;'
                            //        + 'margin-bottom:10px;'
                            //        + 'overflow: auto;'
                            //        + 'border:none;'
                            //        + 'padding: 2px;'
                            //        + 'text-align: justify;'
                            //        + 'background: transparent;">' + textHtml + '</div>'
                            //        + '</div>'
                            //        + '</div>';
                            //    } else {
                            //        html += '<div class="form-group">'
                            //       + '<label class="control-label col-md-3 col-sm-3 col-xs-12">' + fieldsNames[i] + ':</label>'
                            //       + '<div "col-sm-10" style="text-align:left;color:#5882BC">' + textHtml + '</div>' + '</div>';
                            //    }

                            //}
                        }
                    }

                    if (attachmentList !== undefined) {
                        html += GenaratorHtmlAttView(attachmentList);
                    }

                    //html += '</form></div>';
                    console.log("itemDetail:" + html);
                    if ($("#itemDetail") !== undefined) {
                        $("#itemDetail").html(html);
                    }
                },
                function (sender, args) {
                    myAlert('pareseRelatedItems failed. ' + args.get_message() +
                        '\n' + args.get_stackTrace());
                }
            );

    } catch (err) {
        myAlert("pareseRelatedItems:" + err.message);
    }
}

function deleteListItem(listTitle, itemID) {

    var ctx = SP.ClientContext.get_current();
    var oList = ctx.get_web().get_lists().getByTitle(listTitle);
    var ListItem = oList.getItemById(itemID);

    ListItem.deleteObject();
    clientContext.executeQueryAsync(
        function () {
            indexList = 0;
            console.log('List Item deleted: ' + itemID);
            myAlert("Delete successfully");
        }, function (sender, args) {
            unblock_page();
            console.log('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
        }
    );

}

function CarBooking_Group_WithID(divItem, listTitle, fieldTitle, idGroup, namePortlet) {
    try {
        var collListItem;
        var oList = context.get_web().get_lists().getByTitle(listTitle);
        collListItem = oList.getItemById(idGroup);

        context.load(collListItem);
        context.executeQueryAsync(
            function () {
                var listItemInfo = "";
                var listItem = collListItem.get_item(fieldTitle);
                //console.log(" CarBooking_Group_WithID: " + listItem + "*_*" + Array.isArray(listItem));
                listItemInfo += ' <option value=""></option>';
                for (var i = 0; i < listItem.length; i++) {
                    listItemInfo += ' <option value="' + listItem[i].get_lookupId() + '">' + listItem[i].get_lookupValue() + '</option>';
                }
                console.log(" CarBooking_Group_WithID: " + listItemInfo);
                $("#" + divItem).html(listItemInfo);
                if (namePortlet !== undefined) {
                    unblock(namePortlet);
                }
            },
            function (sender, args) {
                if (namePortlet !== undefined) {
                    unblock(namePortlet);
                }
                console.log('CarBooking_Group_WithID Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }
        );
    } catch (err) {
        if (namePortlet !== undefined) {
            unblock(namePortlet);
        }
        console.log("CarBooking_Group_WithID ::" + err.message);
    }
}

function LoadGroupFristDefault(divItem, listTitle, fieldTitle, idGroup, namePortlet, valueDefault) {
    try {
        var collListItem;
        //var valueDefault = '';
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listTitle);
        collListItem = oList.getItemById(idGroup);

        context.load(collListItem);
        context.executeQueryAsync(
            function () {
                var listItemInfo = "";
                var listItem = collListItem.get_item(fieldTitle);
                listItemInfo += ' <option value=""></option>';
                if (listItem !== null) {
                    for (var i = 0; i < listItem.length; i++) {
                        listItemInfo += ' <option value="' + listItem[i].get_lookupId() + '">' + listItem[i].get_lookupValue() + '</option>';
                    }

                    if (valueDefault === undefined || valueDefault === null) {
                        valueDefault = listItem[0].get_lookupId();
                    }
                }
                console.log(" LoadGroupFristDefault: " + listItemInfo);
                $("#" + divItem).html(listItemInfo);
                if (namePortlet !== undefined) {
                    unblock(namePortlet);
                }
                $("#" + divItem).val(valueDefault).trigger("change");
            },
            function (sender, args) {
                if (namePortlet !== undefined) {
                    unblock(namePortlet);
                }
                console.log('LoadGroupFristDefault Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }
        );
    } catch (err) {
        if (namePortlet !== undefined) {
            unblock(namePortlet);
        }
        console.log("CarBooking_Group_WithID ::" + err.message);
    }
}

//

//function ValidRow() {
//    try {
//        var result = true;
//        var resultStep = true;
//        console.log("ValidRow:" + $(".mt-repeater").find('[data-repeater-list]').length);
//        var $list = $(".mt-repeater").find('[data-repeater-list]').first();
//        console.log("ValidRow:" + $list.find('[data-repeater-item]').length);
//        var $item = $list.find('[data-repeater-item]')
//                                     .last();
//        console.log("$item::" + $item);
//        $item.find('[name]').each(function () {
//            resultStep = onChange(this);
//            console.log("rs:" + $(this).attr('name') + "##" + resultStep);
//            if (resultStep === false) { result = false; }
//        });
//        return result;
//        console.log("ValidRow:" + $list);
//    } catch (err) {
//        console.log("ValidRow:" + err.message);
//    }

//}

//function ValidRow(repeaterListName) {
//    try {
//        var result = true;
//        var resultStep = true;
//        //console.log("ValidRow:" + $(".mt-repeater").find('[data-repeater-list]').length);
//        var $list;
//        if (repeaterListName === undefined) {
//            $list = $(".mt-repeater").find('[data-repeater-list]').first();
//        } else {
//            //console.log("check theo repeater list name");
//            $list = $(".mt-repeater").find('[data-repeater-list=' + repeaterListName + ']').first();
//        }
//        //console.log("ValidRow:" + $list.find('[data-repeater-item]').length);
//        var $item = $list.find('[data-repeater-item]')
//                                     .last();
//        // console.log("$item::" + $item);
//        $item.find('[name]').each(function () {
//            resultStep = onChange(this);
//            //console.log("rs:" + $(this).attr('name') + "##" + resultStep);
//            if (resultStep === false) { result = false; }
//        });
//        return result;
//        //console.log("ValidRow:" + $list);
//    } catch (err) {
//        console.log("ValidRow:" + err.message);
//    }

//}

function GetListItemsFromArrList(arrlistName, arrfield, callbackfunc) {
    try {
        var i;
        // here we are fetching current context, but you can also use explicit call (where 'site'  is URL of your site):  var clientContext = new SP.ClientContext(site);
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var list = [];
        var allItems = [];
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('');

        for (i = 0; i < arrlistName.length; i++) {
            list[i] = web.get_lists().getByTitle(arrlistName[i]);
            allItems[i] = list[i].getItems(camlQuery);
            context.load(allItems[i]);
        }
        context.executeQueryAsync(function () {
            try {
                //console.log(allItems.get_count());
                for (i = 0; i < arrlistName.length; i++) {
                    var ListEnumerator = allItems[i].getEnumerator();
                    var txt = " <option value=''></option>";
                    while (ListEnumerator.moveNext()) {
                        var currentItem = ListEnumerator.get_current();
                        var value = currentItem.get_item('NameGroup');
                        var id = currentItem.get_item('ID');
                        txt += "<option value='" + id + "'>";
                        txt += value;
                        txt += "</option> ";
                    }
                    //console.log(txt);
                    $("#" + arrfield[i]).html(txt);
                }
                //console.log("GetListItemsFromArrList: Load finish");
                //jQuery(document).ready(function () { FormRepeater.init() });
                if (callbackfunc !== undefined) {
                    callbackfunc();
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }
        ,
        function (sender, args) {
            alert('GetListItemsFromArrListError: ' + args.get_message() + '\n' + args.get_stackTrace());
        });
    }
    catch (err) {
        console.log("GetListItemsFromArrList:" + err.message);
    }
}

function GetListItems(ListName, Field, Input, val, callbackfunc) {
    try {
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('');

        var oList = web.get_lists().getByTitle(ListName);
        var allItems = oList.getItems(camlQuery);
        context.load(allItems);
        context.executeQueryAsync(function () {
            try {
                var ListEnumerator = allItems.getEnumerator();
                var txt = " <option value=''></option>";
                var i = 0;
                var defaultId = 0;
                while (ListEnumerator.moveNext()) {
                    var currentItem = ListEnumerator.get_current();
                    var value = currentItem.get_item(Field);
                    var id = currentItem.get_item('ID');
                    txt += "<option value='" + id + "'>";
                    txt += value;
                    txt += "</option> ";
                    if (i === 0) {
                        defaultId = currentItem.get_item('ID');
                    }
                    i++;
                }

                $("#" + Input).html(txt);
                if (CheckNullSetZero(defaultId) > 0 && val !== undefined) {
                    $("#" + Input).val(defaultId).trigger('change');
                }

                if (callbackfunc !== undefined) {
                    callbackfunc();
                }
            }
            catch (err) {
                console.log("GetListItems request error: " + err.message);
                if (callbackfunc !== undefined) {
                    callbackfunc();
                }
            }
        }
        ,
        function (sender, args) {
            alert('GetListItems request failed: ' + args.get_message() + '\n' + args.get_stackTrace());
            if (callbackfunc !== undefined) {
                callbackfunc();
            }
        });
    }
    catch (err) {
        console.log("GetListItems error:" + err.message);
    }
}
/**********************HaDTT****************************************/
//ẩn hiện div
function toggleHide(id) {
    $("#" + id).fadeToggle(300);
}
//đổ dữ liệu vào select( combo)
//HaDTT 
//arrListName:lưu tên bảng cần lấy
//arrCombo:lưu tên combo để đổ dữ liệu vào
//arrFieldName:lưu trường tên cần hiển thị
function GetListFromArrList(arrListName, arrCombo, arrFieldName, callbackfunc) {
    try {
        var i;
        // here we are fetching current context, but you can also use explicit call (where 'site'  is URL of your site):  var clientContext = new SP.ClientContext(site);
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var list = [];
        var allItems = [];
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('');

        for (i = 0; i < arrListName.length; i++) {
            list[i] = web.get_lists().getByTitle(arrListName[i]);
            allItems[i] = list[i].getItems(camlQuery);
            context.load(allItems[i]);
        }
        context.executeQueryAsync(
            function () {
                try {
                    //console.log(allItems.get_count());
                    for (i = 0; i < arrListName.length; i++) {
                        var ListEnumerator = allItems[i].getEnumerator();
                        var txt = " <option value=''></option>";
                        while (ListEnumerator.moveNext()) {
                            var currentItem = ListEnumerator.get_current();
                            var value = currentItem.get_item(arrFieldName[i]);
                            var id = currentItem.get_item('ID');
                            txt += "<option value='" + id + "'>";
                            txt += value;
                            txt += "</option> ";
                        }
                        //console.log(txt);
                        $('#' + arrCombo[i]).html(txt);
                    }
                    if (callbackfunc !== undefined) {
                        callbackfunc();
                    }
                }
                catch (err) {
                    console.log('GetListFromArrListError: ' + err.message);
                }
            }
        ,
        function (sender, args) {
            alert('GetListFromArrListError: ' + args.get_message() + '\n' + args.get_stackTrace());
        });
    }
    catch (err) {
        console.log("GetListFromArrList:" + err.message);
    }
}
//HaDTT
//Lấy trường tên fieldName trong list theo id hoặc fieldName1
function getFieldName(list, value, fieldName, fieldName1) {
    var name = "";
    var listEnumerator = list.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        if (fieldName1 == undefined) {
            var id = oListItem.get_item("ID");
            if (id == value) {
                name = CheckNull(oListItem.get_item(fieldName));
                return name;
            }
        }
        else {
            var valueField = oListItem.get_item(fieldName1);
            if (valueField == value) {
                name = CheckNull(oListItem.get_item(fieldName));
                return name;
            }
        }
    }
    return name;
}
//HaDTT
//Lấy trường item trong list theo id
function getArrFieldName(list, idItem, arrField) {
    var arrFieldName = [];
    var listEnumerator = list.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var id = oListItem.get_item("ID");
        if (id == idItem) {
            for (var i = 0; i < arrField.length; i++) {
                arrFieldName[i] = CheckNull(oListItem.get_item(arrField[i]));
            }
            return arrFieldName;
        }
    }
    return arrFieldName;
}
//HaDTT
//Đếm trong list theo id
function getCountInList(list, id, fieldId) {
    var count = 0;
    var listEnumerator = list.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var idItem = oListItem.get_item(fieldId);
        if (id == idItem) {
            count++;
        }
    }
    return count;
}
//HaDTT
//đổ dl vào select(combo) truyền vào là 1 mảng dl
function LoadCombo(arrData, FieldName, Combo) {
    var htmls = '<option value=""></option>';
    for (var i = 0; i < arrData.length; i++) {
        htmls += '<option value="' + arrData[i].ID + '">' + arrData[i][FieldName] + '</option>';
    }
    $('#' + Combo).empty();
    $('#' + Combo).html(htmls);
}
//HaDTT
//đổ dl vào  select combo mục tiêu 
function LoadComboGoal(list, Combo) {
    //for (var i = 0; i < arrCombo.length; i++) {
    var listEnumerator = list.getEnumerator();
    var htmls = '<option value=""></option>';
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var id = oListItem.get_item("ID");
        var title = oListItem.get_item("Title");
        var start = FormatDateShow(oListItem.get_item("StartDate_"));
        var due = FormatDateShow(oListItem.get_item("DueDate_"));
        var name = title + " (" + start + "_" + due + ")";
        htmls += '<option value="' + id + '">' + name + '</option>';
    }
    $('#' + Combo).empty();
    $('#' + Combo).html(htmls);
    //}
}
//đổ dl vào mảng select(combo goal table) 
var arrGTable = [];
function LoadComboGTable(list, cboGoalTable1, cboGoalTable2) {
    arrGTable = [];
    if (cboGoalTable1 == undefined) cboGoalTable1 = 'cboGoalTable';
    var listEnumerator = list.getEnumerator();
    var htmls = '<option value=""></option>';
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var name = oListItem.get_item("Title");
        var id = oListItem.get_item("ID");
        htmls += '<option value="' + id + '">' + name + '</option>';
        var obj = { ID: id, Title: name };
        arrGTable.push(obj);
    }
    if (cboGoalTable1 == undefined) {
        $('#cboGoalTable').empty();
        $('#cboGoalTable').html(htmls);
        if (arrGTable.length > 0) {
            $('#cboGoalTable').val(arrGTable[0].ID).trigger('change');
        }
    }
    else {
        $('#' + cboGoalTable1).empty();
        $('#' + cboGoalTable1).html(htmls);
        if (arrGTable.length > 0) {
            $('#' + cboGoalTable1).val(arrGTable[0].ID).trigger('change');
        }
    }
    if (cboGoalTable2 != undefined) {
        $('#' + cboGoalTable2).empty();
        $('#' + cboGoalTable2).html(htmls);
        if (arrGTable.length > 0) {
            $('#' + cboGoalTable2).val(arrGTable[0].ID).trigger('change');
        }
    }
}
//HaDTT
//đổ dl vào mảng select(combo) 
function LoadArrayCombo(arrlist, arrCombo) {
    for (var i = 0; i < arrCombo.length; i++) {
        var listEnumerator = arrlist[i].getEnumerator();
        var htmls = '<option value=""></option>';
        while (listEnumerator.moveNext()) {
            var oListItem = listEnumerator.get_current();
            var name = oListItem.get_item("Title");
            var id = oListItem.get_item("ID");
            htmls += '<option value="' + id + '">' + name + '</option>';
        }
        $('#' + arrCombo[i]).empty();
        $('#' + arrCombo[i]).html(htmls);
    }
}
//HaDTT
//đổ dl vào  select theo trường giá trị = FiedlValue, trường hiển thị là Title(combo) 
function LoadComboFiedl(list, Combo, FiedlValue) {
    //for (var i = 0; i < arrCombo.length; i++) {
    var listEnumerator = list.getEnumerator();
    var htmls = '<option value=""></option>';
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var name = oListItem.get_item("Title");
        if (FiedlValue == undefined) {
            var id = oListItem.get_item("ID");
            htmls += '<option value="' + id + '">' + name + '</option>';
        }
        else {
            var value = oListItem.get_item(FiedlValue);
            htmls += '<option value="' + value + '">' + name + '</option>';
        }
    }
    $('#' + Combo).empty();
    $('#' + Combo).html(htmls);
    //}
}
//HaDTT
//đổ dl vào  select theo trường giá trị = id , trường hiển thị = ArrFiedl(combo) 
function LoadComboArrFiedl(list, Combo, ArrFiedl) {
    //for (var i = 0; i < arrCombo.length; i++) {
    var listEnumerator = list.getEnumerator();
    var htmls = '<option value=""></option>';
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var id = oListItem.get_item("ID");
        if (ArrFiedl == undefined) {
            var name = oListItem.get_item("Title");
            htmls += '<option value="' + id + '">' + name + '</option>';
        }
        else {
            var name = '';
            for (var i = 0; i < ArrFiedl.length; i++) {
                name += oListItem.get_item(ArrFiedl[i]);
                if (i < ArrFiedl.length - 1) {
                    name += "_";
                }
            }
            htmls += '<option value="' + id + '">' + name + '</option>';
        }
    }
    $('#' + Combo).empty();
    $('#' + Combo).html(htmls);
    //}
}

//HaDTT
//Kiểm tra xem trường name truyền vào có trong mảng arrData không ?true có, false không có trong mảng
function CheckExistArr(arrData, FieldName, name) {
    var isCheck = false;
    for (var i = 0; i < arrData.length; i++) {
        var ten = arrData[i][FieldName];
        if (ten.toLowerCase() == name.toLowerCase()) {
            isCheck = true;
            return isCheck;
        }
    }
    return isCheck;
}
//HaDTT
//Kiểm tra xem trường name, trường idEdit!=ID  truyền vào có trong mảng arrData không ?true có, false không có trong mảng
function CheckExistArrEdit(arrData, FieldName, name, idEdit) {
    var isCheck = false;
    for (var i = 0; i < arrData.length; i++) {
        var ten = arrData[i][FieldName];
        if (ten.toLowerCase() == name.toLowerCase() && arrData[i].ID != idEdit) {
            isCheck = true;
            return isCheck;
        }
    }
    return isCheck;
}
//HaDTT
//đóng form
function Close(idHide) {
    $('#' + idHide).hide();//ẩn form thêm mới hoặc sửa
}
//HaDTT
//Tìm kiếm nhân viên kd
//isPageEmp=true: là đang ở trang nhân viên, false là không phải trang nhân viên
function SearchEmployee(isPageEmp) {
    try {
        $('#employee_search_box').keypress(function (event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            if (keyCode == '13') {
                Search(isPageEmp);
            }
        });
    } catch (err) {
        console.log("SearchEmployee: " + err.message);
    }
}
function Search(isPageEmp) {
    var name = CheckNull($("#employee_search_box").val()).toLowerCase().trim();
    if (isPageEmp == false) {
        window.location = "../Pages/Employee.aspx";
    }
    $(document).ready(function () {
        $('#tab_Employee').hide();
        $('#tab_EmployeeSearch').show();
        $('#nav-Employee .active').removeClass('active');
        $('#employee_search_tab').addClass('active');
        if (name !== '') {
            $("#employee_search_box").val(name);
            var arrDataSearch = [];
            for (var i = 0; i < arrData.length; i++) {
                if ((CheckNull(arrData[i].FisrtName).toLowerCase().includes(name)) || (CheckNull(arrData[i].LastName).toLowerCase().includes(name))) {
                    arrDataSearch.push(arrData[i]);
                }
            }
            ShowResult_Directory(arrDataSearch);
        }
        else
            ShowResult_Directory(arrData);
    });
}
//đổi kiểu ngày sang dạng chuỗi
function ISODateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getFullYear() + '-'
        + pad(d.getMonth() + 1) + '-'
        + pad(d.getDate()) + 'T'
        + pad(d.getHours()) + ':'
        + pad(d.getMinutes()) + ':'
        + pad(d.getSeconds()) + 'Z'
}
//mảng
// function ReplaceAll
function ReplaceAll(Source, stringToFind, stringToReplace) {
    if (Source != null) {
        var temp = Source;
        var index = temp.toString().indexOf(stringToFind);
        while (index != -1) {
            temp = temp.toString().replace(stringToFind, stringToReplace);
            index = temp.toString().indexOf(stringToFind);
        }
        return temp;
    }
}
// function ReplaceComma
function ReplaceComma(Source) {
    var temp = Source;
    if (temp != null) {
        var index = temp.toString().indexOf(',');
        while (index != -1) {
            temp = temp.toString().replace(',', '');
            index = temp.toString().indexOf(',');
        }
    }
    return temp;
}
// Tính tổng giá trị theo cột
function fnTinhTongGiaTri(lst, column) {
    var tong = 0;
    for (var i = 0; i < lst.length; i++) {
        if (ReplaceAll(lst[i][column]) != '' && ReplaceAll(lst[i][column]) != null) {
            tong += parseFloat(ReplaceAll(lst[i][column], ',', ''));
        }
    }
    return tong;
}
//onchange trạng thái
function onChangeStatus(cboStatus, txtComplete) {
    var code = $('#' + cboStatus).val();
    if (code == "HT" || code == 'HTQH') {
        $('#' + txtComplete).val(100);
    }
    //else {
    //    $('#' + txtComplete).val(0);
    //}
}
//onchange phần trăm hoàn thành
function onChangeComplete(cboStatus, txtComplete) {
    var complete = ($('#' + txtComplete).val()) * 1;
    if (complete == 100) {
        $('#' + cboStatus).val('HT').trigger('change');
    }
    else if (complete > 0) {
        $('#' + cboStatus).val('DTH').trigger('change');
    }
    else $('#' + cboStatus).val('CBD').trigger('change');
}
/*************************** Valid HaDTT **************************************************************/
function CheckValidation(startDate, dueDate, txtStartDate, txtDueDate) {
    if (startDate == undefined) startDate = '#txtStartDate';
    if (dueDate == undefined) dueDate = '#txtDueDate';
    onChanges($(startDate));
    onChanges($(dueDate));
    //    onChanges($("#UserOnsite_TopSpan_HiddenInput"));
    toastr.clear();
    if (txtStartDate == undefined) txtStartDate = 'Start Date';
    if (txtDueDate == undefined) txtDueDate = 'Due Date';
    var flag = 1;
    if (isNotNull($(startDate).val()) && isNotNull($(dueDate).val())) {
        var SaleInfoStart = new Date(($(startDate).datepicker("getDate")).getFullYear(), ($(startDate).datepicker("getDate")).getMonth(), ($(startDate).datepicker("getDate")).getDate());
        var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
        if (SaleInfoStart.getTime() > SaleInfoEnd.getTime()) {
            toastr.error(txtDueDate + ' must  greater than or equal ' + txtStartDate);
            console.log(txtDueDate + ' must  greater than or equal ' + txtStartDate);
            flag = 0;
            $(dueDate).closest(".form-group").removeClass("has-success").addClass("has-error");
            var i = $(dueDate).parent(".input-icon").children("i");
            i.removeClass("fa-check").addClass("fa-warning"),
            i.attr("title", txtDueDate + ' must  greater than or equal ' + txtStartDate);
            //   i.attr("data-original-title",txtDueDate +' must  greater than or equal '+ txtStartDate).tooltip({ container: "body" });
        }
    }
    return Number(flag);
}
//kiểm tra ngày isDate=true là kiểm tra start date và due date, isDateExt=true là kiểm tra Extension Deadline và due date, isDateAct=true là kt ngày bắt đầu và ngày kết thúc thực tế
//name!='' thì là ngày + name 
function CheckValidDate(isDate, isDateExt, isDateAct, name) {
    toastr.clear();
    var flag = 1;
    if (name == undefined) {
        if (isDate == true) {
            var startDate = '#txtStartDate';
            var dueDate = '#txtDueDate';
            onChanges($(startDate));
            onChanges($(dueDate));
            if (isNotNull($(startDate).val()) && isNotNull($(dueDate).val())) {
                var SaleInfoStart = new Date(($(startDate).datepicker("getDate")).getFullYear(), ($(startDate).datepicker("getDate")).getMonth(), ($(startDate).datepicker("getDate")).getDate());
                var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
                if (SaleInfoStart.getTime() > SaleInfoEnd.getTime()) {
                    //    toastr.error('Due Date must  greater than or equal Start Date');
                    console.log('Due Date must  greater than or equal Start Date');
                    flag = 0;
                    $(dueDate).closest(".form-group").removeClass("has-success").addClass("has-error");
                    var i = $(dueDate).parent(".input-icon").children("i");
                    i.removeClass("fa-check").addClass("fa-warning"),
                     i.attr("title", 'Due Date must  greater than or equal Start Date');
                    //  i.attr("data-original-title", 'Due Date must  greater than or equal Start Date').tooltip({ container: "body" });
                }
            }
        }
        if (isDateExt == true) {
            var extDate = '#txtExtDeadline';
            var dueDate = '#txtDueDate';
            onChanges($(extDate));
            onChanges($(dueDate));
            if (isNotNull($(extDate).val()) && isNotNull($(dueDate).val())) {
                var SaleInfoExt = new Date(($(extDate).datepicker("getDate")).getFullYear(), ($(extDate).datepicker("getDate")).getMonth(), ($(extDate).datepicker("getDate")).getDate());
                var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
                if (SaleInfoExt.getTime() < SaleInfoEnd.getTime()) {
                    // toastr.error('Extension Deadline must  greater than or equal Due Date');
                    console.log('Extension Deadline must  greater than or equal Due Date');
                    flag = 0;
                    $(extDate).closest(".form-group").removeClass("has-success").addClass("has-error");
                    var i = $(extDate).parent(".input-icon").children("i");
                    i.removeClass("fa-check").addClass("fa-warning"),
                     i.attr("title", 'Extension Deadline must  greater than or equal Due Date');
                    //  i.attr("data-original-title", 'Extension Deadline must  greater than or equal Due Date').tooltip({ container: "body" });
                }
            }
        }
        if (isDateAct == true) {
            var startDate = '#txtActStartDate';
            var dueDate = '#txtActDueDate';
            onChanges($(startDate));
            onChanges($(dueDate));
            if (isNotNull($(startDate).val()) && isNotNull($(dueDate).val())) {
                var SaleInfoStart = new Date(($(startDate).datepicker("getDate")).getFullYear(), ($(startDate).datepicker("getDate")).getMonth(), ($(startDate).datepicker("getDate")).getDate());
                var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
                if (SaleInfoStart.getTime() > SaleInfoEnd.getTime()) {
                    //   toastr.error('Actual Due Date must  greater than or equal Actual Start Date');
                    console.log('Actual Due Date must  greater than or equal Actual Start Date');
                    flag = 0;
                    $(dueDate).closest(".form-group").removeClass("has-success").addClass("has-error");
                    var i = $(dueDate).parent(".input-icon").children("i");
                    i.removeClass("fa-check").addClass("fa-warning"),
                    i.attr("title", 'Actual Due Date must  greater than or equal Actual Start Date');
                    // i.attr("data-original-title", 'Actual Due Date must  greater than or equal Actual Start Date').tooltip({ container: "body" });
                }
            }
        }
    }
    else {
        if (isDate == true) {
            var startDate = '#txtStartDate' + name;
            var dueDate = '#txtDueDate' + name;
            onChanges($(startDate));
            onChanges($(dueDate));
            if (isNotNull($(startDate).val()) && isNotNull($(dueDate).val())) {
                var SaleInfoStart = new Date(($(startDate).datepicker("getDate")).getFullYear(), ($(startDate).datepicker("getDate")).getMonth(), ($(startDate).datepicker("getDate")).getDate());
                var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
                if (SaleInfoStart.getTime() > SaleInfoEnd.getTime()) {
                    //    toastr.error('Due Date must  greater than or equal Start Date');
                    console.log('Due Date must  greater than or equal Start Date');
                    flag = 0;
                    $(dueDate).closest(".form-group").removeClass("has-success").addClass("has-error");
                    var i = $(dueDate).parent(".input-icon").children("i");
                    i.removeClass("fa-check").addClass("fa-warning"),
                     i.attr("title", 'Due Date must  greater than or equal Start Date');
                    //  i.attr("data-original-title", 'Due Date must  greater than or equal Start Date').tooltip({ container: "body" });
                }
            }
        }
        if (isDateExt == true) {
            var extDate = '#txtExtDeadline' + name;
            var dueDate = '#txtDueDate' + name;
            onChanges($(extDate));
            onChanges($(dueDate));
            if (isNotNull($(extDate).val()) && isNotNull($(dueDate).val())) {
                var SaleInfoExt = new Date(($(extDate).datepicker("getDate")).getFullYear(), ($(extDate).datepicker("getDate")).getMonth(), ($(extDate).datepicker("getDate")).getDate());
                var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
                if (SaleInfoExt.getTime() < SaleInfoEnd.getTime()) {
                    // toastr.error('Extension Deadline must  greater than or equal Due Date');
                    console.log('Extension Deadline must  greater than or equal Due Date');
                    flag = 0;
                    $(extDate).closest(".form-group").removeClass("has-success").addClass("has-error");
                    var i = $(extDate).parent(".input-icon").children("i");
                    i.removeClass("fa-check").addClass("fa-warning"),
                     i.attr("title", 'Extension Deadline must  greater than or equal Due Date');
                    //  i.attr("data-original-title", 'Extension Deadline must  greater than or equal Due Date').tooltip({ container: "body" });
                }
            }
        }
        if (isDateAct == true) {
            var startDate = '#txtActStartDate' + name;
            var dueDate = '#txtActDueDate' + name;
            onChanges($(startDate));
            onChanges($(dueDate));
            if (isNotNull($(startDate).val()) && isNotNull($(dueDate).val())) {
                var SaleInfoStart = new Date(($(startDate).datepicker("getDate")).getFullYear(), ($(startDate).datepicker("getDate")).getMonth(), ($(startDate).datepicker("getDate")).getDate());
                var SaleInfoEnd = new Date(($(dueDate).datepicker("getDate")).getFullYear(), ($(dueDate).datepicker("getDate")).getMonth(), ($(dueDate).datepicker("getDate")).getDate());
                if (SaleInfoStart.getTime() > SaleInfoEnd.getTime()) {
                    //   toastr.error('Actual Due Date must  greater than or equal Actual Start Date');
                    console.log('Actual Due Date must  greater than or equal Actual Start Date');
                    flag = 0;
                    $(dueDate).closest(".form-group").removeClass("has-success").addClass("has-error");
                    var i = $(dueDate).parent(".input-icon").children("i");
                    i.removeClass("fa-check").addClass("fa-warning"),
                    i.attr("title", 'Actual Due Date must  greater than or equal Actual Start Date');
                    // i.attr("data-original-title", 'Actual Due Date must  greater than or equal Actual Start Date').tooltip({ container: "body" });
                }
            }
        }
    }
    return Number(flag);
}
function onChanges(input) {
    try {
        //console.log("onChanges call");
        var self = $(input);

        if (self.hasClass("input-required") === false) {
            return true;
        }
        var val = self.val();
        if (val === null || val === undefined || val.trim() === "") {
            self.closest(".form-group").removeClass("has-success").addClass("has-error");
            var i = self.parent(".input-icon").children("i");
            i.removeClass("fa-check").addClass("fa-warning"),
            i.attr("title", "This field is required.");
            //   i.attr("data-original-title", "This field is required.").tooltip({ container: "body" });
            var strHtml = "<li><span class='bold'>" + self.attr("title") + ":</span> required</li>";
            if ($("#alert-danger").is(':visible')) {
                var html = $("#alert-danger").html();
                if (html !== undefined) {
                    if (html.indexOf(strHtml) < 0) {
                        $("#alert-danger").append(strHtml);
                    }
                }
            }
            return false;
        }
        var i = self.parent(".input-icon").children("i");
        self.closest(".form-group").removeClass("has-error").addClass("has-success"),
            i.removeClass("fa-warning").addClass("fa-check");
        return true;
    } catch (err) {
        console.log("onChanges:" + err.message);
    }
}
function onChange(input) {
    try {
        //console.log("onChange call");
        var self = $(input);

        if (self.hasClass("input-required") === false) {
            return true;
        }

        var val = self.val();
        if (val === null || val === undefined || val.trim() === "") {
            self.closest(".form-group").removeClass("has-success").addClass("has-error");
            var i = self.parent(".input-icon").children("i");
            i.removeClass("fa-check").addClass("fa-warning"),
             i.attr("title", "This field is required.");
            //i.attr("data-original-title", "required").tooltip({ container: "body" });
            var strHtml = "<li><span class='bold'>" + self.attr("title") + ":</span> required</li>";
            if ($("#alert-danger").is(':visible')) {
                var html = $("#alert-danger").html();
                if (html !== undefined) {
                    if (html.indexOf(strHtml) < 0) {
                        $("#alert-danger").append(strHtml);
                    }
                }
            }
            return false;
        }

        var i = self.parent(".input-icon").children("i");
        self.closest(".form-group").removeClass("has-error").addClass("has-success"),
        i.removeClass("fa-warning").addClass("fa-check");
        return true;
    } catch (err) {
        console.log("onChange:" + err.message);
    }
}
function ValidRow(repeaterListName) {
    try {
        var result = true;
        var resultStep = true;
        //console.log("ValidRow:" + $(".mt-repeater").find('[data-repeater-list]').length);
        var $list;
        if (repeaterListName === undefined) {
            $list = $(".mt-repeater").find('[data-repeater-list]').first();
        } else {
            //console.log("check theo repeater list name");
            $list = $(".mt-repeater").find('[data-repeater-list=' + repeaterListName + ']').first();
        }
        //console.log("ValidRow:" + $list.find('[data-repeater-item]').length);
        var $item = $list.find('[data-repeater-item]')
                                     .last();
        // console.log("$item::" + $item);
        $item.find('[name]').each(function () {
            resultStep = onChange(this);
            //console.log("rs:" + $(this).attr('name') + "##" + resultStep);
            if (resultStep === false) { result = false; }
        });
        return result;
        //console.log("ValidRow:" + $list);
    } catch (err) {
        console.log("ValidRow:" + err.message);
    }

}

/*************************** End Valid **************************************************************/