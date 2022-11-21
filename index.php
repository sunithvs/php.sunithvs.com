<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>sunith vs</title>
    <!--    import styles-->
    <link rel="stylesheet" href="style.css">
    <script src="index.js"></script>
</head>
<body>
<div class="carousel" >
    <ul tabindex="0">
        <?php
        $path = '/home/user/Personal-Home-Page/src';
        $files = scandir($path);
        $files = array_diff(scandir($path), array('.', '..'));
        //        check files is empty
        if (!empty($files)) {
//            echo ' <li id="c1_slide1" class="selected"><div><div style="background-image: url(https://random.imagecdn.app/500/200);" ></div>' . $files[0] . '<br /><a href="https://www.google.com">Delete</a></div></li>';
            $i = 2;
            foreach (array_splice($files, 1) as $file) {
                echo '<li id="c1_slide' . $i . '"><div><div style="background-image: url(https://random.imagecdn.app/500/200);"></div>' . explode(".php", $file)[0] . '<br /><a  href="https://php.rohittp.com/' . $file . '" target="">View</a><button class="delete" onclick="console.log(' . $i . ')}">Delete</button></div></li>';
                $i++;
            }
        }
        ?>
    </ul>
    <ol>
        <?php
        $path = '/home/user/Personal-Home-Page/src';
        $files = scandir($path);
        $files = array_diff(scandir($path), array('.', '..'));
        if (!empty($files)) {
            $i = 2;
//            echo '<li class="selected"><a href="#c1_slide1"></a></li>';
            foreach (array_splice($files, 1) as $file) {
                echo '
        <li><a href="#c1_slide' . $i . '"></a></li>
        ';
                $i++;
            }
        }
        ?>
    </ol>
    <div class="prev">&lsaquo;</div>
    <div class="next">&rsaquo;</div>
</div>
</body>
</html>