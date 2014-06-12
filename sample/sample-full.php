<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Full - GNEditor</title>
    <style type="text/css">
    a {
        text-decoration: none;
    }
    body {
        font-family: sans-serif;
        font-size: 13px;
        padding: 30px;
    }
    .sample-image {
        width: 500px;
        height: 200px;
        background-size: cover;
        background-position: center;
        background-image: url("../uploads/sample-image.jpg");
    }
    </style>
</head>
<body>
    
    
    <h3>Sample list, drag to reorder</h3>
    
    <div gnlist="list-full">
        <div gnitem="item-1">
            <a href="#" gnprop="link" gnlink>
                <h4 gnprop="title" gntext>Item 1</h4>
                <div class="sample-image" gnrop="image" gnimage></div>
            </a>
            <p gnprop="description" gntext>Description</p>
            <input type="text" gnprop="tag" gntext value="tag">
        </div>
        <div gnitem="item-2">
            <a href="#" gnprop="link" gnlink>
                <h4 gnprop="title" gntext>Item 1</h4>
                <div class="sample-image" gnrop="image" gnimage></div>
            </a>
            <p gnprop="description" gntext>Description</p>
            <input type="text" gnprop="tag" gntext value="tag">
        </div>
    </div>
    <br><br>
    <h3>Sample menu</h3>
    <ul gnmenu="sample-menu">
        <li><a href="#">Menu 1</a></li>
        <li><a href="#">Menu 2</a></li>
        <li><a href="#">Menu 3</a></li>
        <li><a href="#">Menu 4</a></li>
        <li><a href="#">Menu 5</a>
            <ul>
                <li><a href="#">Submenu 1</a></li>
                <li><a href="#">Submenu 2</a></li>
                <li><a href="#">Submenu 3</a></li>
            </ul>
        </li>
    </ul>
    
    <?php include "../gneditor/gneditor.php";?>
    
</body>
</html>