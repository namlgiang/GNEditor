<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>

<!-- CK EDITOR -->
<script type="text/javascript" src="/gneditor/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="/gneditor/ckeditor/adapters/jquery.js"></script>

<!-- JQ TREE -->
<script type="text/javascript" src="/gneditor/jqtree/tree.jquery.js"></script>
<link rel="stylesheet" href="/gneditor/jqtree/jqtree.css">

<!-- GNEDITOR PLUGIN -->
<script type="text/javascript" src="/gneditor/jquery.filedrop.js"></script>
<script type="text/javascript" src="/gneditor/gneditor.js"></script>

<link rel="stylesheet" href="/gneditor/gneditor.css">

<div class="gnoverlay">
    <div class="gnpopup">
        <div class="header">Target</div>
        <div class="editor">
            <textarea class="text-editor" cols="30" rows="10"></textarea>
            <div class="link-editor">
                Link: <input type="text">
            </div>
            <div class="menu-editor">
                <div class="tree"></div>
                <div class="property">
                    <span class="label">Title</span><input type="text" class="value title" value="Item 1"><br>
                    <div class="tree-control">
                        <button class="add-menu">Add menu</button>
                        <button class="add-submenu">Add submenu</button>
                        <button class="delete-menu">Delete</button>
                    </div>
                    <div class="advanced">
                        <div class="title">Advanced</div>
                        <div class="advanced-container">
                            <span class="label">Class</span><input type="text" class="value class" value="Item 1"><br>
                            <span class="label">Link</span><input type="text" class="value link"><br>
                            <span class="label">Rel</span><input type="text" class="value rel"><br>
                        </div>
                    </div>
                </div>
            </div>
            <div class="drop-image">
                <div class="bar">
                    <div class="progress"></div>
                </div>
            </div>
        </div>
        <div class="control">
            <div class="left">
                <button class="duplicate positive">Duplicate</button>
                <button class="delete positive">Delete</button>
            </div>
            <div class="right">
                <button class="save positive active">Save</button>
                <button class="cancel negative active">Cancel</button>
            </div>
        </div>
    </div>
</div>
<!-- GNEDITOR PLUGIN -->