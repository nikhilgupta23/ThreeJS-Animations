/* Global Variables */
/* Scene Dimensions */
var mySceneTLX;        /* Top Left corner X coordinate */
var mySceneTLY;        /* Top Left corner Y coordinate */
var mySceneBRX;        /* Bottom Right corner X coordinate */
var mySceneBRY;        /* Bottom Right corner Y coordinate */
var mySceneW;          /* Scene Width */
var mySceneH;          /* Scene Height */
var centerX;         /* Scene Center X coordinate */
var centerY;         /* Scene Center Y coordinate */
var centerZ;         /* Scene Center Z coordinate */

var controls;

/* Display Panel Variables */
var numDigitText;
var numWordsText;
var ballRadius;
var spaceRadius;  

function initialiseControlVariables()
{
    numDigitText = "Number";
    numWordsText = "Number in words";
}

function initialiseControls()
{
    initialiseControlVariables();
    /* Create Display Panel */
    PIEaddDisplayText(numDigitText, "");
    PIEaddDisplayText(numWordsText, "");    

    insertAfter = function(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }
    
    var ref = document.querySelector('div.dg.main.a ul');
    var listItem = document.createElement("li");
    var button = document.createElement("button");
    button.setAttribute("id", "openexample");
    button.innerHTML = "Practice";
    button.addEventListener("click", function(){
        modal.style.display = "block";
    });
    listItem.appendChild(button);
    insertAfter(listItem, ref);
}


/******************* End of GUI control objects code ***********************/

/******************* Load Experiment objects code ***********************/

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Learn counting experiment help</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>This experiment helps to learn counting from 1 to 9.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>In this stage, you can see a control window at the right.</p>";
    helpContent = helpContent + "<p>You can control the following:</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Practice</b>&nbsp;&nbsp;:&nbsp;Opens a practice session where the user has to enter the number of balls displayed.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>In the animation stage, balls are randomly generated and the count corresponding to the number of balls is displayed.</p>";
    helpContent = helpContent + "<p>The right hand panel now shows the values of the two experiment variables during animation.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Number</b>&nbsp;&nbsp;:&nbsp;Shows the count of the balls.</li>";
    helpContent = helpContent + "<li><b>Number in words</b>&nbsp;&nbsp;:&nbsp;Shows the count of the balls in words.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play button on the top line.</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animaion by uing the speed control buttons.</p>";
    helpContent = helpContent + "<p>Click and drag to pan, scroll to zoom in and out and use the arrow keys to move in a particular direction.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Learn counting experiment concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>This experiment helps to learn counting from 1 to 9.</p>";    
    PIEupdateInfo(infoContent);
}

function initialiseScene()
{
    /* Initialise Scene Variables */
    mySceneTLX = 0.0;
    mySceneTLY = 3.0;
    mySceneBRX = 4.0;
    mySceneBRY = 0.0;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    centerX  = (mySceneTLX + mySceneBRX) / 2.0;
    centerY  = (mySceneTLY + mySceneBRY) / 2.0;
    centerZ    = -2.0;
    spaceRadius = mySceneH/1.8;
}

function initialiseOtherVariables()
{
    /* Initialise variables */
    spaceRadius = mySceneH/1.8;
    ballRadius = mySceneW/20.0;
    segments = 32;
    textCountArray = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function onDocumentMouseDown( event ) 
{
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    event.preventDefault();
    
    // update the mouse variable
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, PIEcamera );

    var intersects = raycaster.intersectObjects( targetList );
    if ( intersects.length > 0 )
    {
        intersects[0].object.callback();
    }

}

/**
 * This function creates the scene of the experiment.
 */

var initialSetupDone = false, textCountArray, targetList=[], practiceMesh, learnMesh;
function loadExperimentElements()
{
    startActivityWithOpenExample();
    PIEsetExperimentTitle("Learn Counting");
    PIEsetDeveloperName("Nikhil Gupta");
    PIEhideControlElement();

    /* initialise help and info content */
    initialiseHelp();
    initialiseInfo();
    /* initialise Scene */
    initialiseScene();

    /* initialise Other Variables */
    initialiseOtherVariables();
    
    controls = new THREE.OrbitControls(PIEcamera);
    controls.addEventListener('change', PIErender);
    controls.target.set(centerX, centerY, centerZ);

    window.addEventListener('resize', function(){
        PIEcamera.aspect = window.innerWidth / window.innerHeight;
        PIEcamera.updateProjectionMatrix();
        PIErenderer.setSize( window.innerWidth, window.innerHeight );
    }, false);
    
    var geometry  = new THREE.SphereGeometry(500, segments, segments);
    var material  = new THREE.MeshBasicMaterial();

    var backgroundTexture = THREE.ImageUtils.loadTexture( 'wildtextures-creased-black-paper-texture.jpg' );
    backgroundTexture.wrapS = backgroundTexture.wrapT = THREE.RepeatWrapping;
    backgroundTexture.repeat.set( 500, 500 );
    
    material = new THREE.MeshBasicMaterial( { map: backgroundTexture } );
    material.side  = THREE.BackSide;
    var mesh  = new THREE.Mesh(geometry, material);
    PIEaddElement(mesh);

    var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
    var materialArray = [ materialFront, materialSide ];
    loader.load( 'optimer_bold.typeface.js', function ( font ) {
        var textGeom = new THREE.TextGeometry( "Learn", 
        {
            size: 1, height: 0.1, curveSegments: segments,
            font: font, weight: "bold", style: "normal",
            bevelThickness: 0.01, bevelSize: 0.2, bevelEnabled: true,
            material: 0, extrudeMaterial: 0
        });        
        var textMaterial = new THREE.MeshFaceMaterial(materialArray);
        learnMesh = new THREE.Mesh(textGeom, textMaterial );
        learnMesh.position.set( centerX - spaceRadius + 0.3, centerY, centerZ );    
        PIEaddElement(learnMesh);
        learnMesh.callback = function() { showOptions = false; learnMesh.visible = false; practiceMesh.visible = false; }

        var textGeom = new THREE.TextGeometry( "Practice", 
        {
            size: 1, height: 0.1, curveSegments: segments,
            font: font, weight: "bold", style: "normal",
            bevelThickness: 0.01, bevelSize: 0.2, bevelEnabled: true,
            material: 0, extrudeMaterial: 0
        });
        practiceMesh = new THREE.Mesh(textGeom, textMaterial );
        practiceMesh.position.set( centerX - spaceRadius - 0.2, centerY - 1.5, centerZ );    
        PIEaddElement(practiceMesh);
        practiceMesh.callback = function() { modal.style.display = "block"; }

        targetList.push(learnMesh, practiceMesh);
    });

    var clickButton = document.getElementById("start");
    clickButton.click();

    /* Instantiate experiment controls */
    initialiseControls();

    /* Reset all positions */
    resetExperiment();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
    
    // when the mouse moves, call the given function
    document.addEventListener( 'mousedown', onDocumentMouseDown, false ); 
}

var textMesh, textMeshWords, loader = new THREE.FontLoader();
function createText(text) {
    var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
    var materialArray = [ materialFront, materialSide ];
    
    loader.load( 'optimer_bold.typeface.js', function ( font ) {
        var textGeom = new THREE.TextGeometry( text, 
        {
            size: 1, height: 0.1, curveSegments: segments,
            font: font, weight: "bold", style: "normal",
            bevelThickness: 0.01, bevelSize: 0.01, bevelEnabled: true,
            material: 0, extrudeMaterial: 0
        });        
        var textMaterial = new THREE.MeshFaceMaterial(materialArray);
        textMesh = new THREE.Mesh(textGeom, textMaterial );
        textMesh.position.set( centerX + spaceRadius, centerY, centerZ );    
        PIEaddElement(textMesh);

        var textGeom = new THREE.TextGeometry( textCountArray[text], 
        {
            size: 0.3, height: 0.1, curveSegments: segments,
            font: font, weight: "bold", style: "normal",
            bevelThickness: 0.01, bevelSize: 0.01, bevelEnabled: true,
            material: 0, extrudeMaterial: 0
        });
        textMeshWords = new THREE.Mesh(textGeom, textMaterial );
        textMeshWords.position.set( centerX + spaceRadius, centerY - 0.5, centerZ );    
        PIEaddElement(textMeshWords);
    });
}
/******************* End of Load Experiment objects code ***********************/

/******************* Reset Experiment code ***********************/

/**
 * This function resets the position of all experiment elements to their default values.
 * <p>
 * This is called during initial document load.
 * This is also be called by the system provided reset button.
 * <p>
 * Apart from the position, this should also reset all variables which can be controlled by the user.
 * This function will also clear any output variables/graphs
 */
function resetExperiment()
{
    /* initialise Other Variables */
    initialiseOtherVariables();

    /* Reset all positions */
    timeToWait = 0;
    timeSinceLastAdd = 0;
    numBalls = 0;
    actBalls = 0;
    for(var k=0; k<spheres.length; k++)
    {                    
        PIEscene.remove(spheres[k]);
    }
    textAdded = false;
    spheres = [];
    
    PIEscene.remove(textMesh);       
    PIEscene.remove(textMeshWords);
    controls.target.set(centerX, centerY, centerZ);
    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
}

/******************* End of Reset Experiment code ***********************/

/******************* Update (animation changes) code ***********************/

/**
 * This function updates the location of all experiment elements during each animation frame.
 * <p>
 * The function receives both animation time as well as the dt (time difference) from last call.
 * This function is expected to implement the laws of physics to update the position.
 * This function will also update any output variables/graphs
 * @param  t       The time in milliseconds elapsed since the beginning of animation cycle
 * @param  dt      The time in milliseconds elapsed since the last acll to this function
 */

var numBalls = 0, actBalls = 0, timeSinceLastAdd = 0, timeToWait = 0, textAdded = false, spheres = [], showOptions = true;
function updateExperimentElements(t, dt)
{
    if(!showOptions) 
    {
        if(actBalls < numBalls)
        {
            timeSinceLastAdd += dt;
            if(timeSinceLastAdd > 1000)
            {
                timeSinceLastAdd = 0;
                var geometry = new THREE.SphereBufferGeometry( ballRadius, 32, 16 );
                var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: PIEscene.background } );
                var material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff, roughness: 1 });
                 
                var envMap = new THREE.TextureLoader().load('envMap.png');
                envMap.mapping = THREE.SphericalReflectionMapping;
                material.envMap = envMap;
                var roughnessMap = new THREE.TextureLoader().load('roughnessMap.png');
                roughnessMap.magFilter = THREE.NearestFilter;
                material.roughnessMap = roughnessMap;
                roughnessMap.magFilter = THREE.NearestFilter;
                material.roughnessMap = roughnessMap;
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = centerX + ((2 * Math.random() - 1) * spaceRadius * 0.9);
                mesh.position.y = centerY + ((2 * Math.random() -1)* spaceRadius * 0.9);
                mesh.position.z = centerZ + ((2 * Math.random() -1)* spaceRadius * 0.9);
                PIEscene.add(mesh);
                spheres.push(mesh);
                actBalls += 1;
            }
        }
        else 
        {        
            timeToWait += dt;
            if(textAdded == false)
            {
                createText(numBalls);
                textAdded = true;
            }
            if(timeToWait > 4000)
            {
                timeToWait = 0;
                numBalls += 1;
                if(numBalls == 10)
                    {
                        numBalls = 0;
                        showOptions = true;
                        practiceMesh.visible = true;
                        learnMesh.visible = true;
                    }
                actBalls = 0;
                for(var k=0; k<spheres.length; k++)
                {                    
                    PIEscene.remove(spheres[k]);
                }
                PIEscene.remove(textMesh);            
                PIEscene.remove(textMeshWords);  
                textAdded = false;
                spheres = [];
            }
        }                 
        var timer = 0.0001 * Date.now();
        for ( var i = 0, il = spheres.length; i < il; i ++ ) {
            var sphere = spheres[ i ];
            var dX, dY, dZ;

            dx = Math.random() * 2 - 1;
            dy = Math.random() * 2 - 1;
            dz = Math.random() * 2 - 1;
            sphere.position.x = sphere.position.x + (dx*0.02);
            sphere.position.z = sphere.position.z + (dz*0.02);
            // sphere.material.color.setRGB(Math.random(),Math.random(),Math.random());
        }   

        /* Finally Update the Display Panel with new values */
        PIEchangeDisplayText(numDigitText, numBalls);
        PIEchangeDisplayText(numWordsText, textCountArray[numBalls]);
    }
    else
    {
        PIEchangeDisplayText(numDigitText, "");
        PIEchangeDisplayText(numWordsText, "");
    }
    controls.update(); 
}

/******************* Update (animation changes) code ***********************/

/******************* Practice code ***********************/

function startActivityWithOpenExample()
{
    document.head.innerHTML += `
     <style>
    /* The Modal (background) */
    .modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        padding-top: 0; /* Location of the box */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content */
    .modal-content {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 90%;
        height: 100%;
        overflow: auto;
    }

    /* The Close Button */
    .close {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }    

    /* The snackbar - position it at the bottom and in the middle of the screen */
    #snackbar {
        visibility: hidden; /* Hidden by default. Visible on click */
        min-width: 250px; /* Set a default minimum width */
        margin-left: -125px; /* Divide value of min-width by 2 */
        background-color: #333; /* Black background color */
        color: #fff; /* White text color */
        text-align: center; /* Centered text */
        border-radius: 2px; /* Rounded borders */
        padding: 16px; /* Padding */
        position: fixed; /* Sit on top of the screen */
        z-index: 100; /* Add a z-index if needed */
        left: 50%; /* Center the snackbar */
        bottom: 30px; /* 30px from the bottom */
    }

    /* Show the snackbar when clicking on a button (class added with JavaScript) */
    #snackbar.show {
        visibility: visible; /* Show the snackbar */

        /* Add animation: Take 0.5 seconds to fade in and out the snackbar. 
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }

    /* Animations to fade the snackbar in and out */
    @-webkit-keyframes fadein {
        from {bottom: 0; opacity: 0;} 
        to {bottom: 30px; opacity: 1;}
    }

    @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }

    @-webkit-keyframes fadeout {
        from {bottom: 30px; opacity: 1;} 
        to {bottom: 0; opacity: 0;}
    }

    @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
    </style>
`;

    createModal();
}

var modal, closeButton, resultDiv, textResultDiv, imageResultDiv;
function createModal() 
{
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "myModal";
    var innerDiv = document.createElement("div");
    innerDiv.className = "modal-content";
    innerDiv.id = "modal-content";
    var heading = document.createElement("h1");
    heading.innerHTML = "Practice";
    closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    var infoPara = document.createElement("h3");
    infoPara.innerHTML = "How many balls can you see?";

    innerDiv.appendChild(closeButton);
    innerDiv.appendChild(heading);
    innerDiv.appendChild(infoPara);
    modal.appendChild(innerDiv);
    document.body.appendChild(modal); 
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    closeButton.onclick = function() 
    {
        modal.style.display = "none";
        controls.target.set(centerX, centerY, centerZ);
        PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
        PIErender();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
        if (event.target == modal) 
        {
            modal.style.display = "none";
            controls.target.set(centerX, centerY, centerZ);
            PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
            PIErender();
        }
    }

    initExample();

    for(i=0; i<10; i++) {        
        (function(i) {
            var numButton = document.createElement("button");
            numButton.setAttribute("id", "checkbutton"+i);
            numButton.innerHTML = i;
            numButton.style.marginRight = "15px";
            numButton.style.fontSize = "30px"
            innerDiv.appendChild(numButton);

            numButton.addEventListener("click", function(){
                for(var p=0; p<10; p++)
                {
                    document.getElementById("checkbutton"+p).disabled = true;
                }
                changeButton.disabled = true;
                var actualAnswer = 0;

                for(var x=0; x<9; x++)
                {
                    if(spheresPractice[x].visible)
                        actualAnswer++;
                }
                if(resultDiv == undefined)
                {
                    resultDiv = document.createElement("div");
                    imageResultDiv = document.createElement("img");
                    textResultDiv = document.createElement("h2");
                    resultDiv.id = "snackbar";
                    resultDiv.appendChild(imageResultDiv);
                    resultDiv.appendChild(textResultDiv);
                    document.body.appendChild(resultDiv);
                }

                if(actualAnswer == i)
                {
                    imageResultDiv.src = "tick_icon.png";
                    textResultDiv.innerHTML = "Correct!";                
                    hideRandomBalls();                
                }
                else
                {
                    imageResultDiv.src = "cross_icon.png";
                    textResultDiv.innerHTML = "Wrong! Try Again.";                
                }
            
                // Add the "show" class to DIV
                resultDiv.className = "show";

                // After 3 seconds, remove the show class from DIV
                setTimeout(function(){
                        resultDiv.className = resultDiv.className.replace("show", ""); 
                        for(var p=0; p<10; p++)
                        {
                            document.getElementById("checkbutton"+p).disabled = false;
                        }
                        changeButton.disabled = false;
                    }, 3000);
            });
        })(i);
    }    

    var changeButton = document.createElement("button");
    changeButton.setAttribute("id", "nextquesbutton");
    changeButton.innerHTML = "Change";
    changeButton.style.fontSize = "20px";
    changeButton.addEventListener("click", function(){
        hideRandomBalls();
    });
    innerDiv.appendChild(changeButton); 
    
    modal.style.display = "none";
}
               
var container, modalContent;
var cameraExample, sceneExample, rendererExample;
var outerMan, circle;
function toRad(degrees) {
  return degrees * Math.PI / 180;
}

spheresPractice = [];
function createBalls()
{
    var x = sceneExample.position.x, y = 130, z = sceneExample.position.z;
    for(var p=0; p<9; p++) {
        var geometry = new THREE.SphereBufferGeometry( ballRadius, 32, 16 );
        var material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff, roughness: 1 });
         
        var envMap = new THREE.TextureLoader().load('envMap.png');
        envMap.mapping = THREE.SphericalReflectionMapping;
        material.envMap = envMap;
        var roughnessMap = new THREE.TextureLoader().load('roughnessMap.png');
        roughnessMap.magFilter = THREE.NearestFilter;
        material.roughnessMap = roughnessMap;
        roughnessMap.magFilter = THREE.NearestFilter;
        material.roughnessMap = roughnessMap;
        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = x + ((2 * Math.random() - 1) * 500 * 0.7);
        mesh.position.y = y + ((2 * Math.random() -1)* 500 * 0.7);
        mesh.position.z = z + ((2 * Math.random() -1)* 500 * 0.7);
        sceneExample.add(mesh);
        spheresPractice.push(mesh);    
    }
}

function hideBalls(count)
{
    var positionsToHide = [];
    for(var x=0; x<count; x++)
    {
        var ballNo = Math.floor(Math.random() * 9);
        positionsToHide.push(ballNo);
    }
    for(var x=0; x<9; x++)
    {
        if(positionsToHide.indexOf(x)>-1)
        {
            spheresPractice[x].visible = false;
            renderExample();
        }
        else
        {
            spheresPractice[x].visible = true;
            renderExample();
        }            
    }
}

function hideRandomBalls()
{    
    var randomNumber = Math.round((Math.random() * 9) + 1);
    if (randomNumber < 0) randomNumber = 0;
    else if(randomNumber > 9) randomNumber = 9;    
    hideBalls(randomNumber);    
}

function initExample() 
{                
    // sceneExample
    sceneExample = new THREE.Scene();
    sceneExample.fog = new THREE.Fog( 0xcce0ff, 700, 10000 );

    modalContent = document.getElementById('modal-content');
    // cameraExample
    cameraExample = new THREE.PerspectiveCamera( 30, (modalContent.clientWidth - 40) / (0.65 * modalContent.clientHeight), 1, 10000 );
    cameraExample.position.x = 1000;
    cameraExample.position.y = 50;
    cameraExample.position.z = 1500;
    sceneExample.add( cameraExample );
    // lights
    var light, materials;
    sceneExample.add( new THREE.AmbientLight( 0x666666 ) );
    light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    var d = 300;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    sceneExample.add( light );
    
    var loader = new THREE.TextureLoader();

    // ground
    var groundTexture = loader.load( 'grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
    var groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    groundMesh.position.y = - 250;
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;
    sceneExample.add( groundMesh );

    // rendererExample
    rendererExample = new THREE.WebGLRenderer( { antialias: true } );
    
    rendererExample.setPixelRatio( window.devicePixelRatio );
    rendererExample.setSize( modalContent.clientWidth - 40, 0.65 * modalContent.clientHeight );

    rendererExample.setClearColor( sceneExample.fog.color );
    modalContent.appendChild( rendererExample.domElement );
    rendererExample.gammaInput = true;
    rendererExample.gammaOutput = true;
    rendererExample.shadowMap.enabled = true;

    // controls
    var controlsExample = new THREE.OrbitControls( cameraExample, rendererExample.domElement );
    controlsExample.maxPolarAngle = Math.PI * 0.5;
    controlsExample.minDistance = 1000;
    controlsExample.maxDistance = 7500;
    
    window.addEventListener( 'resize', function() {
            rendererExample.setSize( modalContent.clientWidth - 40, 0.65 * modalContent.clientHeight );
            cameraExample.aspect = (modalContent.clientWidth - 40) / (0.65 * modalContent.clientHeight);
            cameraExample.updateProjectionMatrix();
        }, false );
    
    var axisMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: .3,
        side: THREE.DoubleSide
    });

    createBalls();
    hideRandomBalls();
    animateExample();         
}

var angleRotRev =0, prevTime, timeDiff;
function animateExample()
{
    requestAnimationFrame( animateExample ); 
    for ( var i = 0, il = spheresPractice.length; i < il; i ++ ) {
        var sphere = spheresPractice[ i ];
        var dX, dY, dZ;

        dx = Math.random() * 2 - 1;
        dy = Math.random() * 2 - 1;
        dz = Math.random() * 2 - 1;
        sphere.position.x = sphere.position.x + (dx*3);
        sphere.position.z = sphere.position.z + (dz*3);
        sphere.material.color.setRGB(Math.random(),Math.random(),Math.random());
    }
    renderExample();
}

function renderExample()
{
    cameraExample.lookAt( sceneExample.position );
    rendererExample.render( sceneExample, cameraExample );
}

/******************* Practice code ***********************/
