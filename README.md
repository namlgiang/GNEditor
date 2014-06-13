TODO: complete send package function. just update the path to controller



CONFIGURABLE VARIABLES

 - editMode                 : Enable/disable edit mode
 - uploadPath               : Path of files after upload. Change this corresponding to the logic in post_file.php

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
 
 - "add to list"            : request server to add an item to list with gnlist=package.list, order is package.order and an object package.data encoded with JSON. Server responses
                              object gnid.
 - "delete from list"       : request server to delete an item from list with gnlist=package.list and gnid=package.id
 - "update order"           : request server to update order of an item of a list with gnlist=package.list, gnid=package.id and new position package.moveTo
