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
var axisOfRotation;

/* Moon variables */
var moon;
var moonRadius;
var moonAxisOfRotation;

/* Sun variables */
var sun;             
var sunRadius;
var solarRotationPeriodInDays;
var singleSolarDegreeRotationTime;

/* Orbit variables */
var orbitRadius;
var moonOrbit;
var moonOrbitRadius;
var revolutionTime;
var singleDegreeRotationTime;

/* Display Panel Variables */
var posX;
var posY;
var orbitText;
var moonPosX;
var moonPosY;
var moonOrbitRadius;

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
    orbitText = "Earth Orbit Radius";

    moonPosX = "Moon (X)";
    moonPosY = "Moon (Y)";
    moonOrbitText = "Moon Orbit Radius";
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
    PIEaddDisplayText(moonOrbitText, moonOrbitRadius);
    PIEaddDisplayText(moonPosX, moon.position.x - sunCenterX);
    PIEaddDisplayText(moonPosY, moon.position.y - sunCenterY);
    PIEaddInputCheckbox("View from Earth", false, changeView);
    PIEaddInputCheckbox("Axes of Rotation", true, changeAxisOfRotationView);
    insertAfter = function(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }
    var ref = document.querySelector('li.cr.boolean:last-child');
    //var ref = arr.slice(-1)[0];
    var listItem = document.createElement("li");
    var button = document.createElement("button");
    button.setAttribute("id", "openexample");
    button.innerHTML = "Open Example";
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
    helpContent = helpContent + "<h2>Visible Face of the Moon experiment help</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>This experiment shows that only one side of the moon is visible from Earth.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>In this stage, you can see a control window at the right. You have access to a slider and two checkboxes.</p>";
    helpContent = helpContent + "<p>You can control the following:</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Revolution (sec)</b>&nbsp;&nbsp;:&nbsp;Controls the time taken by Earth (in seconds) to complete a single revolution around the sun in this simulation. Since, a fixed number of rotations occur in a complete revolution, this in turn, affects the speed of rotation of Earth on its axis.</li>";
    helpContent = helpContent + "<li><b>View from Earth</b>&nbsp;&nbsp;:&nbsp;Switches the view. The system can be viewed as a whole where <i>earth, moon and sun can be seen all at once</i> or <i>from the earth's surface where the moon (and its various phases) can be seen through the cloud cover</i> as it orbits the earth.</li>";
    helpContent = helpContent + "<li><b>Axes of Rotation</b>&nbsp;&nbsp;:&nbsp;Show/Hide Earth’s and Moon's axes of rotation.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>Once you setup the experiment, you can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>In the animation stage, earth will start rotating on its tilted (at an angle of 23.5°) axis and revolving on its orbit around the sun and moon earth will start rotating on its tilted (at an angle of 6.68°) axis and revolving on its orbit around the earth. </p>";
    helpContent = helpContent + "<p>Earth covers 365.25 rotations in a single revolution. The sun takes 24.47 days (24.47 earth rotations) to complete a single rotation.</p>";
    helpContent = helpContent + "<p>The moon orbits the Earth once every 27.322 days. It also takes approximately 27 days for the moon to rotate once on its axis. As a result, the moon does not seem to be spinning but appears to observers from Earth to be keeping almost perfectly still.</p>";
    helpContent = helpContent + "<p>The right hand panel now shows the values of the three experiment variables during animation.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Earth Orbit Radius</b>&nbsp;&nbsp;:&nbsp;Shows size of Earth's orbit in the simulation.</li>";
    helpContent = helpContent + "<li><b>Earth (X)</b>&nbsp;&nbsp;:&nbsp;Shows position of Earth in the X-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "<li><b>Earth (Y)</b>&nbsp;:&nbsp;Shows position of Earth in the Y-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "<li><b>Moon Orbit Radius</b>&nbsp;&nbsp;:&nbsp;Shows size of Moon's orbit in the simulation.</li>";
    helpContent = helpContent + "<li><b>Moon (X)</b>&nbsp;&nbsp;:&nbsp;Shows position of Moon in the X-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "<li><b>Moon (Y)</b>&nbsp;:&nbsp;Shows position of Moon in the Y-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>Note that the distances and sizes in this demonstration are not to scale. They have been changed for better visualization and understanding.</p>";
    helpContent = helpContent + "<p>One of the moon's longitude has been added as a reference to observe the rotation about its axis.</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line.</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animaion by uing the speed control buttons.</p>";
    helpContent = helpContent + "<p>Click and drag to pan, scroll to zoom in and out and use the arrow keys to move in a particular direction.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Visible Face of the Moon experiment concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>This experiment shows that only one side of the moon is visible from Earth.</p>";
    
    infoContent = infoContent + "<h3>Moon's Rotation and Revolution</h3>";
    infoContent = infoContent + "<p>The moon orbits the Earth once every 27.322 days. It also takes approximately 27 days for the moon to rotate once on its axis. As a result, the moon does not seem to be spinning but appears to observers from Earth to be keeping almost perfectly still. Scientists call this sychronous rotation.</p>";
    infoContent = infoContent + "<p>The side of the moon that perpetually faces Earth is known as the near side. The opposite or back side is the far side.</p>";
    
    infoContent = infoContent + "<h3>Axial Tilt and Orbits</h3>";
    infoContent = infoContent + "<p>Earth's obliquity oscillates between 22.1 and 24.5 degrees on a 41,000-year cycle. Earth's mean obliquity is currently 23°26′13.4″ (around 23.5°) and is decreasing.</p>";
    infoContent = infoContent + "<p>The mean inclination of the lunar orbit to the ecliptic plane is 5.14°.</p>";
    infoContent = infoContent + "<p>The rotational axis of the Moon is also not perpendicular to its orbital plane, so the lunar equator is not in the plane of its orbit, but is inclined to it by a constant value of 6.68° (this is the obliquity).</p>";    
    
    infoContent = infoContent + "<h3>Libration</h3>";
    infoContent = infoContent + "<p>Because the lunar orbit is also inclined to Earth's ecliptic plane by 5.1°, the rotational axis of the Moon seems to rotate towards and away from Earth during one complete orbit.</p>";
    infoContent = infoContent + "<p>This apparent wobbling is referred to as latitudinal libration, which allows one to see almost 7° of latitude beyond the pole on the far side.</p>";
    
    infoContent = infoContent + "<h3>Lunar Phases</h3>";
    infoContent = infoContent + "<p>The lunar phase or phase of the moon is the shape of the illuminated (sunlit) portion of the Moon as seen by an observer on Earth. The lunar phases change cyclically as the Moon orbits the Earth, according to the changing positions of the Moon and Sun relative to the Earth.</p>";
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
    moonRadius = mySceneW/40.0;
    orbitRadius = mySceneH/1.8;
    moonOrbitRadius = mySceneH/5.0;
    earthCloudRadius = earthRadius + 0.01;
    solarRotationPeriodInDays = 24.47;
    singleSolarDegreeRotationTime = revolutionTime / ((365.25 / solarRotationPeriodInDays) *360);
    segments = 32;
    singleDegreeRotationTime = revolutionTime / (365.25 * 360);
}

function changeAxisOfRotationView()
{
    axisOfRotation.visible = !axisOfRotation.visible;
    moonAxisOfRotation.visible = !moonAxisOfRotation.visible;
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
    startActivityWithOpenExample();
    PIEsetExperimentTitle("Visible Face of the Moon");
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
            bumpScale: 0.05
        })
        var mesh    = new THREE.Mesh(geometry, material)
        return mesh 
    }

    createMoon = function() {        
        var geometry = new THREE.SphereGeometry(moonRadius, segments, segments);
        var texture = THREE.ImageUtils.loadTexture("moon.jpg")
        var material    = new THREE.MeshPhongMaterial({
            map : texture,
            shininess: 0
        })
        var mesh = new THREE.Mesh(geometry, material);        
        return mesh;
    }

    createEarth = function(){
        var geometry    = new THREE.SphereGeometry(earthRadius, segments, segments)
        var material    = new THREE.MeshPhongMaterial({
            map     : THREE.ImageUtils.loadTexture('earthmap1k.jpg'),
            bumpMap     : THREE.ImageUtils.loadTexture('earthbump1k.jpg'),
            bumpScale   : 0.01,        
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

    var geometry  = new THREE.SphereGeometry(100, 32, 32);
    var material  = new THREE.MeshBasicMaterial();
    material.map   = THREE.ImageUtils.loadTexture('galaxy_starfield.jpg');
    material.side  = THREE.BackSide;
    var mesh  = new THREE.Mesh(geometry, material);
    PIEaddElement(mesh);

    sun = createSun();
    sun.receiveShadow = false;
    var whitePointLight = new THREE.PointLight(0xffffff, 50, 150, 2);
    sun.add(whitePointLight);

    earth = createEarth();
    earthCloud = createEarthCloud();
    earth.add(earthCloud);
    earth.castShadow = false;
    earth.rotation.set(toRad(90), 0, -1*toRad(23.5));
    PIEaddElement(earth);
    
    var axisMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: false,
      opacity: .3,
      side: THREE.DoubleSide
    });
    
    geometry = new THREE.Geometry();
    geometry.vertices.push(
            new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z ),
            new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z + earthRadius + 0.05),
            new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z - earthRadius - 0.05)
        );
    axisOfRotation = new THREE.Line(geometry, axisMaterial);
    axisOfRotation.rotation.set(toRad(90), 0, -1*toRad(23.5));
    earth.add(axisOfRotation);

    shotPoint = new THREE.Vector3(earth.position.x - moonOrbitRadius, earth.position.y, earth.position.z - (moonOrbitRadius * Math.sin(toRad(5.14))));    

    moon = createMoon();
    moon.castShadow = false;
    moon.rotation.set(toRad(90), 0, toRad(6.68));
    PIEaddElement(moon);

    geometry = new THREE.Geometry();
    geometry.vertices.push(
            new THREE.Vector3( moon.position.x, moon.position.y, moon.position.z ),
            new THREE.Vector3( moon.position.x, moon.position.y, moon.position.z + moonRadius + 0.05),
            new THREE.Vector3( moon.position.x, moon.position.y, moon.position.z - moonRadius - 0.05)
        );
    moonAxisOfRotation = new THREE.Line(geometry, axisMaterial);
    moonAxisOfRotation.rotation.set(toRad(90), 0, toRad(6.68));
    moon.add(moonAxisOfRotation);

    var moonLong = new THREE.Line(new THREE.CircleGeometry(moonRadius, 90), axisMaterial);
    moonLong.position.set(moon.position.x, moon.position.y, moon.position.z);
    moonLong.rotateY(toRad(90));
    moon.add(moonLong);

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
    orbit.position.set(sunCenterX, sunCenterY, sunCenterZ);
    PIEaddElement(orbit);

    moonOrbit = new THREE.Line(
    new THREE.CircleGeometry(moonOrbitRadius, 90),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: .3,
      side: THREE.BackSide
    }));
    moonOrbit.geometry.vertices.shift();
    moonOrbit.rotation.set(0, -1 * toRad(5.14), 0);
    PIEaddElement(moonOrbit);

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
    }, 5000);

    /* Instantiate experiment controls */
    initialiseControls();    

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
    moonOrbit.position.set(earthCenterX, earthCenterY, earthCenterZ);
    shotPoint = new THREE.Vector3(earthCenterX - moonOrbitRadius, earthCenterY, earthCenterZ - (moonOrbitRadius * Math.sin(toRad(5.14))));
    moon.position.set(shotPoint.x, shotPoint.y, shotPoint.z);
    angleInDegree = 0;
    angle = 0;
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

var angleInDegree = 0, angle = 0, angleToRotateInDegrees;
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
        earth.rotateY(toRad(angleToRotateInDegrees));
        
        angle += angleToRotateInDegrees / 27;
        shotPoint.x = earth.position.x - (moonOrbitRadius * Math.cos(toRad(angle)));
        shotPoint.y = earth.position.y - (moonOrbitRadius * Math.sin(toRad(angle)));
        shotPoint.z = earth.position.z - (moonOrbitRadius * Math.cos(toRad(angle)) * Math.sin(toRad(5.14)));

        moon.position.set(shotPoint.x, shotPoint.y, shotPoint.z);
        moonOrbit.position.set(earth.position.x, earth.position.y, earth.position.z);

        moon.rotateY(toRad(angleToRotateInDegrees / 27));

        earthCloud.rotateY(toRad(angleToRotateInDegrees));

        var solarAngleToRotateInDegrees = dt / (1000 * singleSolarDegreeRotationTime);
        sun.rotateZ(toRad(solarAngleToRotateInDegrees));
    }
    /* Finally Update the Display Panel with new values */
    PIEchangeDisplayText(posX, earth.position.x - sunCenterX);
    PIEchangeDisplayText(posY, earth.position.y - sunCenterY);
    PIEchangeDisplayText(moonPosX, moon.position.x - sunCenterX);
    PIEchangeDisplayText(moonPosY, moon.position.y - sunCenterY);
}

/******************* Update (animation changes) code ***********************/


/******************* Understanding with Example code ***********************/

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
    </style>`;

    createModal();
}

var modal, closeButton;
function createModal() 
{
    modal = document.createElement("div");        // Create a <button> element
    modal.className = "modal";
    modal.id = "myModal";
    var innerDiv = document.createElement("div");
    innerDiv.className = "modal-content";
    innerDiv.id = "modal-content";
    var heading = document.createElement("h2");
    heading.innerHTML = "Understanding with example";
    closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    var infoPara = document.createElement("p");
    infoPara.innerHTML = "Draw a circle of about 1m diameter on the ground. Ask one of your friends to stand at the centre of this circle. You revolve around your friend in such a manner that your face always remains towards him. Can your friend see your back?  How many rotations did you complete in one revolution? The moon revolves around the Earth in a similar manner.            The moon completes one rotation on its axis as it completes one revolution around the Earth. The side of the moon that perpetually faces Earth is known as the near side. The opposite or back side is the far side.";
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
        controls.target.set(sunCenterX, sunCenterY, sunCenterZ);
        PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
        PIErender();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
        if (event.target == modal) 
        {
            modal.style.display = "none";
            controls.target.set(sunCenterX, sunCenterY, sunCenterZ);
            PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
            PIErender();
        }
    }

    initExample();
    
}
               
var container, modalContent;
var cameraExample, sceneExample, rendererExample;
var outerMan, circle;

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
    var controls = new THREE.OrbitControls( cameraExample, rendererExample.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 7500;
    
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

    circle = new THREE.Line(new THREE.CircleGeometry(300, 90), axisMaterial);
    circle.position.set(sceneExample.position.x, -249, sceneExample.position.z);
    circle.rotateX(toRad(90));
    sceneExample.add(circle);

    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load( "stickman.js", function(geometry)
    {
        geometry.center();
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xD3D3D3}));
        mesh.scale.set(2,2,2);
        mesh.position.set(circle.position.x, -160, circle.position.z);
        mesh.rotateY(Math.PI / 2);
        sceneExample.add(mesh);

        outerMan = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xA9A9A9}));
        outerMan.scale.set(2,2,2);
        outerMan.position.set(circle.position.x + 300, -160, circle.position.z);
        outerMan.rotateY(-Math.PI / 2);
        sceneExample.add(outerMan);

        var manAxis = new THREE.AxisHelper(20);
        outerMan.add(manAxis);
        animateExample();
    });            
}

var angleRotRev =0, prevTime, timeDiff;
function animateExample()
{
    requestAnimationFrame( animateExample ); 
    var time = new Date().getTime();
    if(prevTime != undefined) 
        timeDiff = time - prevTime;
    else
        timeDiff = 0;
    var degrees = (30/1000) * timeDiff;                
    angleRotRev += degrees;
    outerMan.position.set(circle.position.x + (300 * Math.cos(toRad(angleRotRev))), -160, circle.position.z + (300 * Math.sin(toRad(angleRotRev))));
    outerMan.rotateY(-1 * toRad(degrees)); 
    renderExample();         
    prevTime = new Date().getTime();      
}

function renderExample()
{
    cameraExample.lookAt( sceneExample.position );
    rendererExample.render( sceneExample, cameraExample );
}

/******************* Understanding with Example code ***********************/
