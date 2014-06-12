<!doctype html>
<html lang="en">
<head>
    
    <meta charset="UTF-8">
    <title>Text Example - GNEditor</title>
    
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
    
    
    
<p gnid="sample-text-1" gntext>
Sample paragraph<br>
:)
</p>



<input gnid="sample-text-3" gntext value="Sample input" size="30">
<br><br>


<a gnid="sample-link-1" href="#" gnlink>
    <p gnid="sample-plink-1" gntext>You may edit link wrapped this text.</p>
    <p gnid="sample-plink-2" gntext>This text has the same link with the text above.</p>
    <p gnid="sample-plink-3" gntext>All there lines has 1 common link.</p>
</a>
<br><br>
        
                
    
<?php include "../gneditor/gneditor.php"; ?>
    
</body>
</html>