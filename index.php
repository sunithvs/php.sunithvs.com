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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
</head>
<body>
<div class="alertbutton">
    <div id="error-0" class="window window--active" role="alertdialog" aria-modal="true" aria-labelledby="error-label-0"
         aria-describedby="error-desc-0" data-window hidden>
        <div class="window__header" data-header>
            <div id="error-label-0" class="window__title" data-label>Error</div>
            <button class="window__button alertbutton" type="button" disabled>
                <span class="window__sprite window__sprite--close-disabled"></span>
                <span class="window__sr">Close</span>
            </button>
        </div>
        <div class="window__body">
            <img class="window__body-icon" alt="White X on a red circle with dark red outline and drop shadow"
                 src="https://assets.codepen.io/416221/win95_error_icon.png" width="32" height="32">
            <p id="error-desc-0" class="window__body-text" data-desc></p>
        </div>
        <div class="window__footer">
            <button class="window__button window__button--lg alertbutton" type="button" data-ok>OK</button>
        </div>
    </div>
</div>
<div class="carousel">

    <div class="hoge"><h1>This is a website for listing the php websites hosted <a
                    href="https://php.rohittp.com">here</a>
        </h1></div>
    <ul tabindex="0">
        <?php
        $path = '/home/user/Personal-Home-Page/src';
        $files = scandir($path);
        $files = array_diff(scandir($path), array('.', '..'));
        //        check files is empty
        if (!empty($files)) {
            $i = 2;
            foreach (array_splice($files, 1) as $file) {
                echo '<li id="c1_slide' . $i . '"><div>
                       <iframe style="display: none" src="https://php.rohittp.com/' . $file . '" title="' . $file . '"  width="150" ></iframe></br>' . explode(".php", $file)[0] . '<br />
                            <a  href="https://php.rohittp.com/' . $file . '" target="">View</a>
                            <button class="delete" onclick="alert_hi()">Delete</button>
                            </div>
                        </li>';
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