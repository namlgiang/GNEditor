<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Menu - GNEditor</title>
    <style type="text/css">
    a {
        text-decoration: none;
    }
    body {
        font-family: sans-serif;
        font-size: 13px;
        padding: 30px;
    }
    </style>
</head>
<body>
    
    <a href="/">Home</a>
    
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
    
    <ul gnmenu="sample-menu-1">
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