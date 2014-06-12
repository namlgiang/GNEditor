<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Edit List - GNEditor</title>
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
    <br><br>
    <br>
    Demo list <button gnlist-add="demo-menu">Add new / clone the first item</button>
    <br><br>
    
    <ul gnlist="sample-list">
        <li gnitem="cat1">
            <a href="#1" gnprop="link" gnlink>               
                <span gnprop="text" gntext>Category 1</span>
            </a>
            <p gnprop="description" gntext>
                Description
            </p>
        </li>
        <li gnitem="cat2">
            <a href="#2" gnprop="link" gnlink>
                <span gnprop="text" gntext>Category 2</span>
            </a>
            <p gnprop="description" gntext>
                Description
            </p>
        </li>
        <li gnitem="cat3">
            <a href="#3" gnprop="link" gnlink>
                <span gnprop="text" gntext>Category 3</span>
            </a>
            <p gnprop="description" gntext>
                Description
            </p>
        </li>
    </ul>
    
    
    <?php include "../gneditor/gneditor.php";?>
    
</body>
</html>