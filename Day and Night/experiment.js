/* Global Variables */
/* Scene Dimensions */
var mySceneTLX;        /* Top Left corner X coordinate */
var mySceneTLY;        /* Top Left corner Y coordinate */
var mySceneBRX;        /* Bottom Right corner X coordinate */
var mySceneBRY;        /* Bottom Right corner Y coordinate */
var mySceneW;          /* Scene Width */
var mySceneH;          /* Scene Height */
var sunCenterX;         /* Scene Center X coordinate */
var sunCenterY;         /* Scene Center Y coordinate */
var sunCenterZ;         /* Scene Center Z coordinate */
var earthCenterX;         /* Scene Center X coordinate */
var earthCenterY;         /* Scene Center Y coordinate */
var earthCenterZ;         /* Scene Center Z coordinate */

var segments;
var showEarthView;
var controls;
var shotPoint;

/* Earth variables */
var earth;           
var earthRadius;        
var earthCloud;
var earthCloudRadius;          

/* Sun variables */
var sun;             
var sunRadius;
var solarRotationPeriodInDays;
var singleSolarDegreeRotationTime;

/* Orbit variables */
var orbitRadius;
var revolutionTime;
var singleDegreeRotationTime;

/* Display Panel Variables */
var posX;
var posY;
var orbitText;

/******************* GUI control objects code ***********************/
var revolveTimeLabel;   /* Revolution time Slider Label */
var revolveTimeDefault; /* Revolution time Slider Default Value */
var revolveTimeMin;     /* Minimum revolution time */
var revolveTimeMax;     /* Maximum revolution time */
var revolveTimeStep;    /* Revolution time Slider Step */

/*
 * This function handles the X position slider change
 * <p>
 * Updates the earth position variable.
 * Effect is felt immediately.
 * <p>
 * @param newValue       New Value of the slider
 */
function handleRevolveTimeChange(newValue)
{
    revolutionTime = newValue;
    singleSolarDegreeRotationTime = revolutionTime / ((365.25 / solarRotationPeriodInDays) *360);
    singleDegreeRotationTime = revolutionTime / (365.25 * 360);

    PIErender();
}

function initialiseControlVariables()
{
    revolveTimeLabel = "Revolution (sec)";
    revolveTimeDefault = 365;
    revolveTimeMin = 60;
    revolveTimeMax = 365 * 5;
    revolveTimeStep = 5;

    posX = "Earth (X)";
    posY = "Earth (Y)";
    orbitText = "Orbit Radius"
}


function initialiseControls()
{
    initialiseControlVariables();
    /* Create Input Panel */
    PIEaddInputSlider(revolveTimeLabel, revolveTimeDefault, handleRevolveTimeChange, revolveTimeMin, revolveTimeMax, revolveTimeStep);        
    /* Create Display Panel */
    PIEaddDisplayText(orbitText, orbitRadius);
    PIEaddDisplayText(posX, earthCenterX - sunCenterX);
    PIEaddDisplayText(posY, earthCenterY - sunCenterY);
}


/******************* End of GUI control objects code ***********************/

/******************* Load Experiment objects code ***********************/

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Day and Night experiment help</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>This experiment shows planet Earth revolving around the sun in its orbit as well as its simultaneous rotation on its own axis.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>In this stage, you can see a control window at the right. You have access to a slider and a checkbox.</p>";
    helpContent = helpContent + "<p>You can control the following:</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Revolution (sec)</b>&nbsp;&nbsp;:&nbsp;Controls the time taken by Earth (in seconds) to complete a single revolution around the sun in this simulation. Since, a fixed number of rotations occur in a complete revolution, this in turn, affects the speed of rotation of Earth on its axis.</li>";
    helpContent = helpContent + "<li><b>View from Earth</b>&nbsp;&nbsp;:&nbsp;Switches the view. The system can be viewed as a whole where <i>Earth can be seen rotating from west to east</i> or <i>from the Earth's surface where the sun can be seen moving from east to west</i> through the cloud cover.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>Once you setup the experiment, you can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>In the animation stage, earth will start rotating on its tilted (at an angle of 23.5°) axis and revolving on its orbit around the sun. </p>";
    helpContent = helpContent + "<p>Earth covers 365.25 rotations in a single revolution. The sun takes 24.47 days (24.47 earth rotations) to complete a single rotation.</p>";
    helpContent = helpContent + "<p>The right hand panel now shows the values of the three experiment variables during animation.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Orbit Radius</b>&nbsp;&nbsp;:&nbsp;Shows size of Earth's orbit in the simulation.</li>";
    helpContent = helpContent + "<li><b>Earth (X)</b>&nbsp;&nbsp;:&nbsp;Shows position of Earth in the X-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "<li><b>Earth (Y)</b>&nbsp;:&nbsp;Shows position of Earth in the Y-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animaion by uing the speed control buttons</p>";
    helpContent = helpContent + "<p>Click and drag to pan, scroll to zoom in and out and use the arrow keys to move in a particular direction.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Day and Night experiment concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>This experiment shows planet Earth revolving around the sun in its orbit as well as its simultaneous rotation on it's own axis.</p>";
    infoContent = infoContent + "<h3>Earth's Rotation</h3>";
    infoContent = infoContent + "<p>Earth’s rotation occurs from west to east, which is why the Sun always appears to be rising on the eastern and setting on the western horizon when viewed from the earth's surface.</p>";
    infoContent = infoContent + "<p>If you could view Earth from above, looking down at the northern polar region, the planet would appear to be rotating counter-clockwise.</p>";
    infoContent = infoContent + "<p>However, viewed from the southern polar region, it appears to be rotating clockwise.</p>";
    infoContent = infoContent + "<p>Earth rotates once in about 24 hours (1 day) with respect to the Sun.</p>";
    infoContent = infoContent + "<p>Time taken by Earth to complete its orbit around the sun is 365.25 days that is, it rotates about 365.25 times on its axis in a single revolution.</p>";
    infoContent = infoContent + "<h3>Axial Tilt</h3>";
    infoContent = infoContent + "<p>Due to Earth’s axial tilt (or obliquity), day and night are not evenly divided.</p>";
    infoContent = infoContent + "<p>Earth's obliquity oscillates between 22.1 and 24.5 degrees on a 41,000-year cycle. Earth's mean obliquity is currently 23°26′13.4″ (around 23.5°) and is decreasing.</p>";
    infoContent = infoContent + "<p>If Earth’s axis was perpendicular to its orbital plane around the Sun, all places on Earth would experience equal amounts of day and night (i.e. 12 hours of day and night, respectively) every day during the year and there would be no seasonal variability.</p>";
    infoContent = infoContent + "<p>Instead, at any given time of the year, one hemisphere is pointed slightly more towards the Sun, leaving the other pointed away.</p>";
    infoContent = infoContent + "<p>During this time, one hemisphere will be experiencing warmer temperatures and longer days while the other will experience colder temperatures and longer nights.</p>";
    infoContent = infoContent + "<h3>Seasonal Changes</h3>";
    infoContent = infoContent + "<p>Since, Earth is revolving around the Sun and not just rotating on its axis, this process is reversed during the course of a year.</p>";
    infoContent = infoContent + "<p>Every six months, the Sun undergoes a half orbit and changes positions to the other side of the Sun, allowing the other hemisphere to experience longer days and warmer temperatures.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
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
    sunCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    sunCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
    sunCenterZ    = -2.0;
    orbitRadius = mySceneH/1.8;
    earthCenterX = sunCenterX + orbitRadius;
    earthCenterY = sunCenterY;
    earthCenterZ = sunCenterZ;

    showEarthView = false;
    revolutionTime = 365.25 *2 ;
}

function initialiseOtherVariables()
{
    /* Initialise variables */
    sunRadius = mySceneW/10.0;
    earthRadius = mySceneW/20.0;
    orbitRadius = mySceneH/1.8;
    earthCloudRadius = earthRadius + 0.01;
    solarRotationPeriodInDays = 24.47;
    singleSolarDegreeRotationTime = revolutionTime / ((365.25 / solarRotationPeriodInDays) *360);
    segments = 32;
    singleDegreeRotationTime = revolutionTime / (365.25 * 360);
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function changeView()
{
    showEarthView = !showEarthView;
    if(!showEarthView)
        {
            controls.target.set(sunCenterX, sunCenterY, sunCenterZ);
            PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
        }
}

/**
 * This function creates the scene of the experiment.
 */

var initialSetupDone = false;
function loadExperimentElements()
{
    PIEsetExperimentTitle("Day and Night");
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
    controls.target.set(sunCenterX, sunCenterY, sunCenterZ);

    window.addEventListener('resize', function(){
        PIEcamera.aspect = window.innerWidth / window.innerHeight;
        PIEcamera.updateProjectionMatrix();
        PIErenderer.setSize( window.innerWidth, window.innerHeight );
    }, false);

    /* Functions to create objects */
    createSun   = function(){
        var geometry    = new THREE.SphereGeometry(sunRadius, segments, segments)
        var texture = THREE.ImageUtils.loadTexture("sunmap.jpg")
        var material    = new THREE.MeshPhongMaterial({
            map : texture,
            bumpMap : texture,
            bumpScale: 0.05,
        })
        var mesh    = new THREE.Mesh(geometry, material)
        return mesh 
    }

    createEarth = function(){
        var geometry    = new THREE.SphereGeometry(earthRadius, segments, segments)
        var material    = new THREE.MeshPhongMaterial({
            map     : THREE.ImageUtils.loadTexture('earthmap1k.jpg'),
            bumpMap     : THREE.ImageUtils.loadTexture('earthbump1k.jpg'),
            bumpScale   : 0.01,
            specularMap : THREE.ImageUtils.loadTexture('earthspec1k.jpg'),
            specular    : new THREE.Color('grey'),
            shininess: 0
        })
        var mesh    = new THREE.Mesh(geometry, material)
        return mesh 
    };

    createEarthCloud = function(){
        // create destination canvas
        var canvasResult    = document.createElement('canvas')
        canvasResult.width  = 1024
        canvasResult.height = 512
        var contextResult   = canvasResult.getContext('2d')     

        // load earthcloudmap
        var imageMap    = new Image();
        imageMap.addEventListener("load", function() {
            
            // create dataMap ImageData for earthcloudmap
            var canvasMap   = document.createElement('canvas')
            canvasMap.width = imageMap.width
            canvasMap.height= imageMap.height
            var contextMap  = canvasMap.getContext('2d')
            contextMap.drawImage(imageMap, 0, 0)
            var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

            // load earthcloudmaptrans
            var imageTrans  = new Image();
            imageTrans.addEventListener("load", function(){
                // create dataTrans ImageData for earthcloudmaptrans
                var canvasTrans     = document.createElement('canvas')
                canvasTrans.width   = imageTrans.width
                canvasTrans.height  = imageTrans.height
                var contextTrans    = canvasTrans.getContext('2d')
                contextTrans.drawImage(imageTrans, 0, 0)
                var dataTrans       = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
                // merge dataMap + dataTrans into dataResult
                var dataResult      = contextMap.createImageData(canvasMap.width, canvasMap.height)
                for(var y = 0, offset = 0; y < imageMap.height; y++){
                    for(var x = 0; x < imageMap.width; x++, offset += 4){
                        dataResult.data[offset+0]   = dataMap.data[offset+0]
                        dataResult.data[offset+1]   = dataMap.data[offset+1]
                        dataResult.data[offset+2]   = dataMap.data[offset+2]
                        dataResult.data[offset+3]   = 255 - dataTrans.data[offset+0]
                    }
                }
                // update texture with result
                contextResult.putImageData(dataResult,0,0)  
                material.map.needsUpdate = true;
            })
            imageTrans.src  = 'earthcloudmaptrans.jpg';
        }, false);
        imageMap.src    = 'earthcloudmap.jpg';

        var geometry    = new THREE.SphereGeometry(earthCloudRadius, segments, segments)
        var material    = new THREE.MeshBasicMaterial({
            map     : new THREE.Texture(canvasResult),
            side        : THREE.DoubleSide,
            transparent : true,
            opacity     : 0.4,
        })
        var mesh    = new THREE.Mesh(geometry, material)
        return mesh 
    };

    var geometry  = new THREE.SphereGeometry(100, 32, 32)
    var material  = new THREE.MeshBasicMaterial()
    material.map   = THREE.ImageUtils.loadTexture('galaxy_starfield.jpg')
    material.side  = THREE.BackSide
    var mesh  = new THREE.Mesh(geometry, material)
    PIEaddElement(mesh)

    earth = createEarth();
    earthCloud = createEarthCloud();
    earth.add(earthCloud);
    earth.castShadow = false;
    PIEaddElement(earth);
    earth.rotateX(toRad(90));    

    shotPoint = new THREE.Vector3(earth.position.x + earthRadius, earth.position.y, earth.position.z);    
    earth.add(shotPoint);

    var orbit = new THREE.Line(
    new THREE.CircleGeometry(orbitRadius, 90),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: .3,
      side: THREE.BackSide
    })
    );
    orbit.geometry.vertices.shift();
    orbit.position.set(sunCenterX,sunCenterY,sunCenterZ);
    PIEaddElement(orbit);

    sun = createSun();
    sun.receiveShadow = false;
    var whitePointLight = new THREE.PointLight(0xffffff, 150, 150, 2);
    sun.add(whitePointLight);
    

    var spriteMaterial = new THREE.SpriteMaterial( 
    { 
        map: new THREE.ImageUtils.loadTexture( 'glow.png' ), 
        color: 0xffff33, transparent: false, blending: THREE.AdditiveBlending
    });
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(1.3, 1.3, 1.0);
    sun.add(sprite);
  
    PIEaddElement(sun);

    initialSetupDone = false;
    var clickButton = document.getElementById("start");
    clickButton.click();
    setTimeout(function() {
        var clickButton = document.getElementById("stop");
        clickButton.click();
        initialSetupDone = true;
    }, 2000);

    /* Instantiate experiment controls */
    initialiseControls();

    PIEaddInputCheckbox("View from Earth", false, changeView);

    /* Reset all positions */
    resetExperiment();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);    
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
    sun.position.set(sunCenterX, sunCenterY, sunCenterZ);
    earth.position.set(earthCenterX, earthCenterY, earthCenterZ);    
    angleInDegree = 0;
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

var angleInDegree = 0, angle =0, angleToRotateInDegrees;
function updateExperimentElements(t, dt)
{
    PIEscene.remove(PIEspotLight);
    
    if(initialSetupDone)
    {
        controls.update();
             
        if(showEarthView)
        {
            PIEadjustCamera(earth.position.x,earth.position.y,earth.position.z);
            PIEcamera.up = new THREE.Vector3(0, 0, -1);
            PIEturnCamera(shotPoint.x,shotPoint.y,shotPoint.z);  
        }

        angleInDegree = angleInDegree + ((dt / (revolutionTime * 1000)) * 360);
        earth.position.x = sun.position.x + (orbitRadius * Math.cos(toRad(angleInDegree)));
        earth.position.y = sun.position.y + (orbitRadius * Math.sin(toRad(angleInDegree)));
        
        angleToRotateInDegrees = dt / (1000 * singleDegreeRotationTime);
        earth.rotateOnAxis( new THREE.Vector3(Math.sin(toRad(23.5)),Math.cos(toRad(23.5)),0), toRad(angleToRotateInDegrees));
        
        angle += angleToRotateInDegrees
        shotPoint.x = earth.position.x - (orbitRadius * Math.cos(toRad(angle)));
        shotPoint.y = earth.position.y - (orbitRadius * Math.sin(toRad(angle)));
        shotPoint.z = earth.position.z;

        earthCloud.rotateOnAxis( new THREE.Vector3(Math.sin(toRad(23.5)),Math.cos(toRad(23.5)),0), toRad(angleToRotateInDegrees));

        var solarAngleToRotateInDegrees = dt / (1000 * singleSolarDegreeRotationTime);
        sun.rotateZ(toRad(solarAngleToRotateInDegrees));

        /* Finally Update the Display Panel with new values */
        PIEchangeDisplayText(posX, earth.position.x - sunCenterX);
        PIEchangeDisplayText(posY, earth.position.y - sunCenterY);
    }
}

/******************* Update (animation changes) code ***********************/
