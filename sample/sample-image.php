<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Image - GNEditor</title>
    
    <style type="text/css">
    
    .sample-image {
        width: 500px;
        height: 200px;
        background-size: cover;
        background-position: center;
        background-image: url("../uploads/sample-image.jpg");
    }
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
    
    <div class="sample-image" gnimage gnid="image-1"></div>
    
    <div class="sample-image" gnimage gnid="image-2"></div>
    
<?php include "../gneditor/gneditor.php";?>
    
</body>
</html>