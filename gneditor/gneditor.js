// CONFIGURABLE VARIABLES

editMode = true;            // boolean: set true to enable editor
uploadPath = "/uploads/";   // path of image after saving

/*

TODO: complete send package function. just update the path to controller

FUNCTIONS

 - refresh(target)          : Get new data from server and update to target. Currently applicable for gnlist, gntext, gnimage and gnmenu
 - commit(target)           : Send a POST package to server contain data of target. Currently applicable for gnprop, gntext, gnimage and gnmenu
 - addToList(target)        : Request server to add target to the list that contains the target
 - removeFromList(target)   : Request server to remove target from the list that contains the target
 - updateOrder(target)      : Update new order of target in the list that contains the target

PACKAGE STRUCTURE

 Request type is defined with package.command
 
 - package.command  : request type
    values: "get text" | "get list" | "get menu " | "commit text" | "commit image" | "commit menu" | "commit text in list" | "commit image in list" | "add to list" | "delete from list" | "update order" | "login" | "logout"
    
 Request type:
 
 - "login"                  : login with username=package.username and password=package.password
 - "logout"                 : logout current session
    
 - "get text"               : get a text or image from server with gnid=package.id. Server responses a text
 - "get list"               : get a list from server with gnlist=package.list. Server responses a list object encoded with JSON
 - "get menu"               : get a menu from server with gnmenu=package.menu. Server responses a menu object encoded with JSON
 
 - "commit text"            : update a text to server with gnid=package.id and value=package.value
 - "commit image"           : update an image to server with gnid=package.id and value=package.value
 - "commit text in list"    : update a text in a list with gnlist=package.list, gnprop=package.prop, gnid=package.id and value=package.value
 - "commit image in list"   : update an image in a list with gnlist=package.list, gnprop=package.prop, gnid=package.id and value=package.value
 - "commit menu"            : update a menu with gnmenu=package.menu and menu value encoded with JSON package.value
 
 - "add to list"            : request server to add an item to list with gnlist=package.list and an object package.data encoded with JSON. Server responses
                              object gnid.
 - "delete from list"       : request server to delete an item from list with gnlist=package.list and gnid=package.id
 - "update order"           : request server to update order of an item of a list with gnlist=package.list, gnid=package.id and new position package.moveTo

*/

editorTarget = [];
shiftPhase = false;
menuBinded = false;
currentImage = null;

$(document).ready(function() {
    
    log = $(".console .output");
    popup = $(".gnoverlay");
    
    if(editMode) {        
        bindTargetEvent();
        bindEditorEvent();
    }
    else {
        $("[gnlist-add]").remove();
    }
    
});

function bindTargetEvent() {
    
    //bind event for texts
    $("body").on("click", "[gntext]", function() {
        
        parentList = detectParent(this, "gnlist");
        
        if(parentList != false)
            activeControl(["duplicate", "delete"]);
        else
            deactiveControl(["duplicate", "delete"]);
        
        editorTarget.push({from: $(".gnpopup .text-editor"), to: this});
        popup.addClass("visible");
        $(".gnpopup .header").html("Edit Text");
        $(".gnpopup .cke").addClass("active").focus();
        $(".gnpopup .text-editor").val(getText(this));
        if( link = detectParent(this, "gnlink") ) {
            editorTarget.push({from: $(".gnpopup .link-editor input"), to: link});
            $(".gnpopup .link-editor").addClass("active");
            $(".gnpopup .link-editor input").val(getText(link));
        }
    });
    
    //bind event for list
    $("[gnlist-add]").click(function() {
        list = $("[gnlist='" + $(this).attr("gnlist-add") + "']");
        
        list.find("[gnitem]:eq(0)").clone().prependTo(list);
    });
    
    //bind event for menus
    $("body").on("click", "[gnmenu]", function() {
        
        popup.addClass("visible");
        $(".gnpopup .header").html("Edit Menu");
        $(".gnpopup .menu-editor").addClass("active"); 
        bindMenu(this);
        
    });
    
    //bind event for image
    bindImageDrop();
    
}

function bindEditorEvent() {
    
    // ckeditor
    $(".gnpopup .text-editor").ckeditor({
        enterMode: CKEDITOR.ENTER_BR
    });
        
    // move all href attributes to data-href
    
    $("[gnmenu] a, [gnlink]").each(function() {
        $(this).attr("data-href", $(this).attr("href"));
        $(this).removeAttr("href");
    });
    
    // make list sortable
    
    $("[gnlist]").sortable();
    
        // add event when reorder list item
    
    $("[gnlist]").on("sortstop", function(e, ui) {
        updateOrder(ui.item);
    });
    
    // close popup and discard draft
    
    $("button.negative").click(function() {
        clearEditor();
    });
    
    // close popup and save data
    
    $(".gnpopup .save").click(function() {
        for(i=0; i<editorTarget.length; i++) {
            todo = editorTarget[i];
            
            transfer(todo.from, todo.to);
            
            commit(todo.to);
        }
        clearEditor();
    });
    
    $(".gnpopup .duplicate").click(function() {
        item = detectParent(editorTarget[0].to, "gnitem");
        $(item).after($(item).clone());
        clearEditor();
    });
    
    $(".gnpopup .delete").click(function() {
        item = detectParent(editorTarget[0].to, "gnitem");
        $(item).remove();
        clearEditor();
    });
    
    // menu advanced
    open = false;
    $(".gnpopup .advanced .title").click(function() {
        open = !open;
        $(".gnpopup .advanced").css("max-height", open?"1000px":"28px");
    });
    
    // Save when shift-enter textarea
    
    $(window).keydown(function(e) {
        if(e.keyCode == 27)
            $(".gnpopup .cancel").click();
        if(e.keyCode == 16)
            shiftPhase = true;
        if(e.keyCode == 13 && shiftPhase)
            $(".gnpopup .save").click();
    });
    
    $(window).keyup(function(e) {
        if(e.keyCode == 16)
            shiftPhase = false;
    });
    
    $(".gnpopup .editor .link-editor input").keydown(function(e) {
        if(e.keyCode == 13)
            $(".gnpopup .save").click();
    });
    
    $(".gnoverlay").click(function(e) {
        if(!$(e.target).is(".gnoverlay *"))
            $(".gnpopup .cancel").click();
    });
    
}

// toggle control in editor

function activeControl(controlArray) {
    for(i=0; i<controlArray.length; i++)
        $(".gnpopup .control ."+controlArray[i]).addClass("active");
}

function deactiveControl(controlArray) {
    for(i=0; i<controlArray.length; i++)
        $(".gnpopup .control ."+controlArray[i]).removeClass("active");
}

// clear editor's data

function clearEditor() {
    popup.removeClass("visible");
    $(".gnpopup .editor>*").removeClass("active");
    $(".gnpopup .drop-image").css("background-image", "none");
    editorTarget = [];
}

// closest element has attribute type

function detectParent(target, type) {
    if(target==null) return false;
    parent=$(target);
    while(parent[0] != undefined && parent[0] != document) {
        if( parent[0].hasAttribute(type) )
            return parent;
        parent=parent.parent();
    }
    return false;
}

// init menu editor

function bindMenu(target) {
    
    root = $(".gnpopup .menu-editor .tree");
    property = $(".gnpopup .menu-editor .property");
    //item = $(".gnpopup .menu-editor .template li");
    
    //menuTree = crawl(target);
    jqData = crawl(target);
    
    printMenuEditor(jqData, root, property);
    
    $(".jqtree-element:eq(0)").click();
    
    if(menuBinded) return;
    //bind event when change value
    $(root).bind(
        'tree.click',
        function(e) {            
            $(property).find(".title").val(e.node.target.html());
            $(property).find(".link").val(e.node.target.attr("data-href"));
            $(property).find(".rel").val(e.node.target.attr("rel"));
            $(property).find(".class").val(e.node.target.attr("class"));
        }
    );
    
    $(root).bind(
        'tree.move',
        function(e) {            
            movedEl = e.move_info.moved_node.target.parent();
            targetEl = e.move_info.target_node.target.parent();
            switch(e.move_info.position) {
                case "inside": 
                    if($(targetEl).find(">ul").length==0)
                        $(targetEl).append("<ul/>");
                    $(targetEl).find(">ul").prepend(movedEl);
                    break;
                case "before":
                    $(targetEl).before(movedEl);
                    break;
                case "after":
                    $(targetEl).after(movedEl);
                    break;
            }
        }
    );
    
    $(root).bind(
        'tree.click',
        function(e) {
            if ($(root).tree('isNodeSelected', e.node)) {
                e.preventDefault();
            }
        }
    );
    
    
    nodeEdit = {};
    nodeEdit.title = property.find(".title");
    nodeEdit.class = property.find(".class");
    nodeEdit.rel = property.find(".rel");
    nodeEdit.link = property.find(".link");
    
    property.find("input").keyup(function() {
        node = root.tree("getSelectedNode");
        if(!node) return;
        
        node.target.html(nodeEdit.title.val());
        root.tree("updateNode", node, nodeEdit.title.val());
        
        node.target.attr("class", nodeEdit.class.val());
        node.target.attr("rel", nodeEdit.rel.val());
        node.target.attr("data-href", nodeEdit.link.val());
        
    });
    
    property.find(".add-menu").click(function() {
        node = root.tree("getSelectedNode");
        if(!node) return;
        
        node.target.parent().after("<li><a data-href='#'>New Menu</a></li>");
        el = node.target.parent().next().find("a:eq(0)");
        
        root.tree("addNodeAfter",
                  {
                      label: "New Menu",
                      target: el
                  },
                 node);
    });
    
    property.find(".add-submenu").click(function() {
        node = root.tree("getSelectedNode");
        if(!node) return;
        if(node.target.parent().find("ul").length>0) 
        {
            node.target.parent().find("ul").append("<li><a data-href='#'>New Menu</a></li>");
            el = node.target.parent().find("ul").find("a").last();
        }
        else
        {
            node.target.parent().append("<ul><li><a data-href='#'>New Menu</a></li></ul>");
            el = node.target.parent().find("ul").find("a:eq(0)");
        }
        
        root.tree("appendNode",
                  {
                      label: "New Menu",
                      target: el
                  },
                 node);
    });
    
    property.find(".delete-menu").click(function() {
        node = root.tree("getSelectedNode");
        if(!node) return;
        
        node.target.parent().remove();
        
        root.tree("removeNode", node);
    });
    
    menuBinded = true;
}

function crawl(target) {
    "use strict";
    var res = [];
    var child = $(target).find(">li");
    for(var i=0; i<child.length; i++) {
        var el = {};
        el.label = $(child[i]).find(">a").text();
        el.target = $(child[i]).find(">a");
        if($(child[i]).find(">ul").length>0)
            el.children = crawl($(child[i]).find(">ul")[0]);
        res.push(el);
    }
    
    return res;
}

function printMenuEditor(data, root, property) {
    "use strict";
    if(menuBinded) {
        $(root).tree(
        "loadData",
        data
    ); 
    }
    else
    $(root).tree({
        data: data,
        dragAndDrop: true
    });  
    
}

function bindImageDrop() {
    $("body").on("click", "[gnimage]", function() {
        
        currentImage = $(this);
        popup.addClass("visible");
        $(".gnpopup .header").html("Drop Image To Upload");
        $(".gnpopup .drop-image").addClass("active");         
        
        if( link = detectParent(this, "gnlink") ) {
            editorTarget.push({from: $(".gnpopup .link-editor input"), to: link});
            $(".gnpopup .link-editor").addClass("active");
            $(".gnpopup .link-editor input").val(getText(link));
        }
        
    });
    
    $(".gnpopup .drop-image").filedrop({
		// The name of the $_FILES entry:
		paramname:'pic',
		
		maxfiles: 5,
    	maxfilesize: 2,
		url: '../post_file.php',
		
		uploadFinished:function(i,file,response){
			$(".popup .drop-image .bar").removeClass("active");
		},
		
		// Called before each upload is started
		beforeEach: function(file){
			if(!file.type.match(/^image\//)){
				alert('Only images are allowed!');
				return false;
			}
		},
		
		uploadStarted:function(i, file, len){
            $(".popup .drop-image .bar").addClass("active");
            $(".gnpopup .drop-image").attr("filename", file.name);
            editorTarget.push({
                from: $(".gnpopup .drop-image"),
                to: currentImage
            })
			createImage(file);
		},
		
		progressUpdated: function(i, file, progress) {
			$('.popup .drop-image .progress').width(progress);
		}
    	 
	});
    
    
}

function createImage(file){

    var reader = new FileReader();

    reader.onload = function(e){
        $(".gnpopup .drop-image").css('background-image', 'url("'+e.target.result+'")');
    };

    reader.readAsDataURL(file);
}

/*---------------
----OPERATIONS---
---------------*/

//These operations should work for both text, image and list

function refresh(target) {
    /*
     * get data from server 
     * gnlist | gnid | gnmenu
     *
     */
    
    package = {};
    
    if($(target).is("[gnid]")) {
        package.command = "get text";
        package.id = $(target).attr("gnid");
        
        sendPackage(package, function(text) {
            if($(target).is("[gntext]"))
                setText(target, text);
            if($(target).is("[gnimage]"))
                $(target).css("background-image", text);
        });
        
    }
    
    if($(target).is("[gnlist]")) {
        package.command = "get list";
        package.list = $(target).attr("gnlist");
        
        sendPackage(package, function(data) {
            
            list = $.parseJSON(data);
        
            item = $(target).find("[gnitem]:eq(0)").clone();
            $(target).html("");

            for(i=0; i<list.length; i++) {
                $(item).find("[gnprop]").each(function() {
                    prop = $(this).attr("gnprop");
                    if($(this).is("[gntext]"))
                        setText(this, list[i][prop]);
                    if($(this).is("[gnimage]"))
                        $(this).css("background-image", list[i][prop]);
                });
                $(target).append(item.clone());
            }
            
        });
    }
    
    if($(target).is("[gnmenu]")) {
        package.command = "get menu";
        package.menu = $(target).attr("gnmenu");
        
        sendPackage(package, function(data) {
            
            menu = $.parseJSON(data);
            printMenu(menu, target);
            
        });
    }
    
}

function printMenu(menu, target) {
    $(target).html("");
    for(i=0; i<menu.length; i++) {
        $(target).append("<li>"+ menu[i].node +"</li>");
        if(menu[i].children != null) {
            $(target).append("<ul/>");
            printMenu(menu[i].children, $(target).find("ul:eq(0)"));
        }
    }
}

function commit(target) {

    /*
     *
     * send data to server
     *
     */
    
    if($(target).is("[gnid]")) {
        // this is a standalone item
        // update text or image (id, type, value)
        
        theId = $(target).attr("gnid");
        
        if($(target).is("[gntext]"))
            value = getText(target);
        if($(target).is("[gnimage]"))
            value = $(target).css("background-image");
        
        package = {};
        package.command = "commit " + $(target).is("[gntext]")?"text":"image";
        package.id = theId;
        package.value = value;
        
        sendPackage(package);
    }
    
    if($(target).is("[gnprop]")) {     
        // this is just a property of a list item
        // update text or image (list, id, prop, type, value)
        
        theProp = $(target).attr("gnprop");
        theId = detectParent(target, "gnitem").attr("gnitem");
        theList = detectParent(target, "gnlist").attr("gnlist");
        
        if($(target).is("[gntext], [gnlink]"))
            value = getText(target);
        if($(target).is("[gnimage]"))
            value = $(target).css("background-image");
        
        package = {};
        package.command = "commit " + $(target).is("[gntext]")?"text":"image"  + " in list";
        package.list = theList;
        package.id = theId;
        package.prop = theProp;
        package.value = value;
        
        sendPackage(package);
    }
    
    if($(target).is("[gnmenu]")) {
        // handle menu (id, type, value)
        package = {};
        package.command = "commit menu";
        package.menu = $(target).attr("gnmenu");
        package.value = JSON.stringify(getMenu(target));
        
        sendPackage(package);
    }

}

function getMenu(target) {
    // just a additional function
    "use strict";
    var res = [];
    var child = $(target).find(">li");
    for(var i=0; i<child.length; i++) {
        var el = {};
        el.node = $(child[i]).html();
        if($(child[i]).find(">ul").length>0)
            el.children = getMenu($(child[i]).find(">ul")[0]);
        res.push(el);
    }
    
    return res;
}

function addToList(target) {
    // send an item of a list to server
    
    package = {};
    // package(list, obj)
    package.command = "add to list";
    package.list = detectParent(target, "gnlist").attr("gnlist");
    
    el = {};
    $(target).find("[gnprop]").each(function() {
        if($(this).is("[gntext]"))
            el[ $(this).attr("gnprop") ] = getText(this);
        else
            el[ $(this).attr("gnprop") ] = $(this).css("background-image");
    });
    
    package.data = JSON.stringify(el);
    
    sendPackage(package, function(theId) {
        $(target).attr("gnitem", theId);
    });
}

function deleteFromList(target) {
    // request to delete an item of a list
    
    package = {};
    // package(list, id)
    package.command = "delete from list";
    package.list = detectParent(target, "gnlist").attr("gnlist");
    package.id = $(target).attr("gnitem");
    
    sendPackage(package);
}

function updateOrder(target) {
    // update new order of an item
    
    package = {};
    // package(list, id, moveTo)
    package.command = "update order";
    package.list = detectParent(target, "gnlist").attr("gnlist");
    package.id = $(target).attr("gnitem");
    package.moveTo =  $(target).index("[gnlist='"+ package.list +"'] [gnitem]");
    
    sendPackage(package);
    return package;
}

function transfer(from, to) {
    if($(to).is("[gntext]") || $(to).is("[gnlink]")) {
        setText(to, $(from).val());
    }
    
    if($(to).is("[gnimage]")) {
        $(to).css("background-image", "url('" + uploadPath + $(from).attr("filename") + "')");
    }
}


/*---------------
---DOM FUNCTION--
---------------*/

function setText(e, text) {
    // This function is much more useful when dealing with different types of tags like p, a, input, textarea and img
    tag = $(e).prop("tagName").toLowerCase();
    
    if(tag=="a") {
        $(e).attr("data-href", text);
        return;
    }
    
    if(tag=="input" || tag=="textarea") {
        $(e).val(text);
        return;
    }
    
    if(tag=="img") {
        $(e).attr("src", text);
        return;
    }
    
    $(e).html(text);
}
    
function getText(e) {
    // This function is much more useful when dealing with different types of tags like p, a, input, textarea and img
    tag = $(e).prop("tagName").toLowerCase();
    
    if(tag=="a") 
        return $(e).attr("data-href");
    
    if(tag=="input" || tag=="textarea")
        return $(e).val();
    
    if(tag=="img")
        return $(e).attr("src");
    
    return $(e).html();
}
    
/*---------------
--CORE FUNCTION--
---------------*/

function login(username, password) {
    package = {
        command: "login",
        username: username,
        password: password
    };
    sendPackage(package);
}

function logout() {
    package = {
        command: "logout"
    };
    sendPackage(package);
}

function sendPackage (package, callback) {
    // TODO: update path
    /*
    $.post( "REPLACE_PATH_HERE", package )
    .done(function(data) {
        callback(data);
    });
    */
}