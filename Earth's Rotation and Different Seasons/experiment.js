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
var controls;
var summerSeason;
var winterSeason;
var springSeason;
var autumnSeason;

/* Earth variables */
var earth;           
var earthRadius;        
var earthCloud;
var earthCloudRadius;  
var equator;
var tropicOfCancer;
var tropicOfCapricorn;
var arcticCircle;
var antarcticCircle;
var axisOfRotation;
var latitudes;

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
var dateText;
var northSeason;
var southSeason;

/******************* GUI control objects code ***********************/
var revolveTimeLabel;   /* Revolution time Slider Label */
var revolveTimeDefault; /* Revolution time Slider Default Value */
var revolveTimeMin;     /* Minimum revolution time */
var revolveTimeMax;     /* Maximum revolution time */
var revolveTimeStep;    /* Revolution time Slider Step */

/* Hemisphere Label Variables */
var northHemisphereTextElement;
var southHemisphereTextElement;
var positionNorthTextTop;
var positionSouthTextTop;
var positionTextLeft;

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
    dateText = "Date";
    orbitText = "Orbit Radius";
    northSeason = "Northern Hemisphere";
    southSeason = "Southern Hemisphere";
    summerSeason = "Summer";
    winterSeason = "Winter";
    springSeason = "Spring";
    autumnSeason = "Fall";
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
    PIEaddDisplayText(dateText, "");
    PIEaddDisplayText(northSeason, "");
    PIEaddDisplayText(southSeason, "");
    PIEaddInputCheckbox("Latitudes", true, changeLatitudeView);
    PIEaddInputCheckbox("Axis of Rotation", true, changeAxisOfRotationView);
}


/******************* End of GUI control objects code ***********************/

/******************* Load Experiment objects code ***********************/

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Earth's Rotation and Different Seasons</h2>";
    
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>This experiment demonstrates the reason for occurence of different seasons on Earth.</p>";
    
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>In this stage, you can see a control window at the right. You have access to a slider and two checkboxes.</p>";
    helpContent = helpContent + "<p>You can control the following:</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Revolution (sec)</b>&nbsp;&nbsp;:&nbsp;Controls the time taken by Earth (in seconds) to complete a single revolution around the sun in this simulation. Since, a fixed number of rotations occur in a complete revolution, this in turn, affects the speed of rotation of Earth on its axis.</li>";
    helpContent = helpContent + "<li><b>Latitudes</b>&nbsp;&nbsp;:&nbsp;Show/Hide the latitudes [Equator, Tropic of Cancer (23.5°N), Tropic of Capricorn (23.5°S), Arctic Circle (66.5°N) and Antarctic Circle (66.5°S)].</li>";
    helpContent = helpContent + "<li><b>Axis of Rotation</b>&nbsp;&nbsp;:&nbsp;Show/Hide Earth’s axis of rotation.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>Once you setup the experiment, you can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>The animation stage, is divided into two parts:</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Right part shows earth rotating on its tilted (at an angle of 23.5°) axis and revolving on its orbit around the sun. Earth covers 365.25 rotations in a single revolution. The sun takes 24.47 days (24.47 earth rotations) to complete a single rotation.</li>";
    helpContent = helpContent + "<li>Left part shows a direct view of the Earth. Changes in the amount of light received from the sun at different latitudes and at different positions in the orbit can be seen here. Observe the angle at which the sun rays strike the earth's surface at different latitudes.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>The right hand panel now shows the values of variables during animation.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li><b>Orbit Radius</b>&nbsp;&nbsp;:&nbsp;Shows size of Earth's orbit in the simulation.</li>";
    helpContent = helpContent + "<li><b>Earth (X)</b>&nbsp;&nbsp;:&nbsp;Shows position of Earth in the X-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "<li><b>Earth (Y)</b>&nbsp;:&nbsp;Shows position of Earth in the Y-direction taking Sun's position as the origin.</li>";
    helpContent = helpContent + "<li><b>Date</b>&nbsp;:&nbsp;Shows the date according to earth's position in its orbit around the sun.</li>";
    helpContent = helpContent + "<li><b>Northern Hemisphere</b>&nbsp;:&nbsp;Shows the current season in the northern hemisphere.</li>";
    helpContent = helpContent + "<li><b>Southern Hemisphere</b>&nbsp;:&nbsp;Shows the current season in the southern hemisphere.</li>";
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
    infoContent = infoContent + "<h2>Earth's Rotation and Different Seasons</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>This experiment demonstrates the reason for occurence of different seasons on Earth.</p>";
    
    infoContent = infoContent + "<h3>Axial Tilt</h3>";
    infoContent = infoContent + "<p>The seasons are caused as the Earth, tilted on its axis, travels in a loop around the Sun each year.</p>";
    infoContent = infoContent + "<p>Summer happens in the hemisphere tilted towards the Sun, and winter happens in the hemisphere tilted away from the Sun. As the Earth travels around the Sun, the hemisphere that is tilted towards or away from the Sun changes.</p>";
    infoContent = infoContent + "<p>The hemisphere that is tilted towards the Sun is warmer because sunlight travels more directly to the Earth’s surface so less gets scattered in the atmosphere.</p>";
    infoContent = infoContent + "<p>That means that when it is summer in the Northern Hemisphere, it is winter in the Southern Hemisphere. The hemisphere tilted towards the Sun has longer days and shorter nights.</p>";
    
    infoContent = infoContent + "<h3>Change with latitude</h3>";
    infoContent = infoContent + "<p>In general, the further away from the equator you travel, the cooler summer and winter temperatures become.</p>";
    infoContent = infoContent + "<p>At the equator there are no seasons because each day the Sun strikes at about the same angle. Every day of the year the equator receives about 12 hours of sunlight.</p>";
    infoContent = infoContent + "<p>The poles remain cool because they are never tilted in a direct path of sunlight. Much light is scattered by the atmosphere before reaching the Earth surface at the poles. During midwinter, when a pole is tilted away from the Sun, there is no daylight at all. The sun never rises! However, during the summer, a pole receives sunlight all the time and there is no night!</p>";

    infoContent = infoContent + "<h3>Seasons</h3>";
    infoContent = infoContent + "<table border=\"1\"><tr><th>Duration</th><th>Northern Hemisphere</th><th>Southern Hemisphere</th></tr>";
    infoContent = infoContent + "<tr><td>March Equinox to June Solstice</td><td>Spring</td><td>Fall</td></tr>";
    infoContent = infoContent + "<tr><td>June Solstice to September Equinox</td><td>Summer</td><td>Winter</td></tr>";
    infoContent = infoContent + "<tr><td>September Equinox to December Solstice</td><td>Fall</td><td>Spring</td></tr>";
    infoContent = infoContent + "<tr><td>December Solstice to March Equinox</td><td>Winter</td><td>Summer</td></tr>";
    infoContent = infoContent + "</table><br/>";
    infoContent = infoContent + "<table border=\"1\"><tr><th>Event</th><th>Date</th></tr>";
    infoContent = infoContent + "<tr><td>March Equinox</td><td>March 20</td></tr>";
    infoContent = infoContent + "<tr><td>June Solstice</td><td>June 21</td></tr>";
    infoContent = infoContent + "<tr><td>September Equinox</td><td>September 23</td></tr>";
    infoContent = infoContent + "<tr><td>December Solstice</td><td>December 21</td></tr>";
    infoContent = infoContent + "</table>";
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

    revolutionTime = 365.25 *2 ;

    updateHemisphereTextPositions();    
}

function updateHemisphereTextPositions()
{
    positionNorthTextTop = (window.innerHeight / 7) + 10;
    positionSouthTextTop = 6.5 * window.innerHeight / 7;
    positionTextLeft = (0.35 * window.innerWidth) / 3;

    if(window.innerWidth < 590 || window.innerHeight < 400)
    {
        if(northHemisphereTextElement != undefined)
        northHemisphereTextElement.style.visibility = "hidden";
        if(southHemisphereTextElement != undefined)
        southHemisphereTextElement.style.visibility = "hidden";
    }
    else
    {
    if(northHemisphereTextElement != undefined)
        northHemisphereTextElement.style.visibility = "visible";
    if(southHemisphereTextElement != undefined)
        southHemisphereTextElement.style.visibility = "visible";
    }
}

function initialiseOtherVariables()
{
    /* Initialise variables */
    sunRadius = mySceneW/10.0;
    earthRadius = mySceneW/20.0;
    orbitRadius = mySceneH/1.8;
    earthCloudRadius = earthRadius + 0.005;
    solarRotationPeriodInDays = 24.47;
    singleSolarDegreeRotationTime = revolutionTime / ((365.25 / solarRotationPeriodInDays) *360);
    segments = 32;
    singleDegreeRotationTime = revolutionTime / (365.25 * 360);
}

function toRad(degrees) 
{
  return degrees * Math.PI / 180;
}

function changeLatitudeView()
{
    latitudes.visible = !latitudes.visible;
}

function changeAxisOfRotationView()
{
    axisOfRotation.visible = !axisOfRotation.visible;
}

function renderViews()
{
    for ( var ii = 0; ii < views.length; ++ii ) 
    {
        view = views[ii];
        camera = view.camera;

        view.updateCamera( camera, PIEscene);
        windowWidth  = window.innerWidth;
        windowHeight = window.innerHeight;
        var left   = Math.floor( windowWidth  * view.left );
        var bottom = Math.floor( windowHeight * view.bottom );
        var width  = Math.floor( windowWidth  * view.width );
        var height = Math.floor( windowHeight * view.height );
        PIErenderer.setViewport( left, bottom, width, height );
        PIErenderer.setScissor( left, bottom, width, height );
        PIErenderer.setScissorTest( true );
        PIErenderer.setClearColor( view.background );

        camera.aspect = width / height;
        PIEcamera.aspect = width / height;
        PIEcamera.updateProjectionMatrix();
        camera.updateProjectionMatrix();

        PIErenderer.render( PIEscene, camera );
    }
    PIErender();
}

 var views = [
                {
                    left: 0,
                    bottom: 0,
                    width: 0.35,
                    height: 1.0,
                    background: new THREE.Color().setRGB( 0.5, 0.5, 0.7 ),
                    eye: [ 0, 300, 1800 ],
                    up: [ 0, 1, 0 ],
                    fov: 30,
                    updateCamera: function ( camera, scene) {
                        camera.position.set(sun.position.x + (orbitRadius * Math.cos(toRad(angleInDegree - 42.35))), sun.position.y + (orbitRadius * Math.sin(toRad(angleInDegree - 42.35))), earth.position.z);
                        camera.up = new THREE.Vector3(0, 0, 1);
                        camera.lookAt( earth.position );
                    }
                },
                {
                    left: 0.37,
                    bottom: 0,
                    width: 0.63,
                    height: 1.0,
                    background: new THREE.Color().setRGB( 0, 0, 0),
                    eye: [ 0, 1800, 0 ],
                    up: [ 0, 0, 1 ],
                    fov: 30,
                    updateCamera: function ( camera, scene) { return; }
                }
            ];

/**
 * This function creates the scene of the experiment.
 */

var initialSetupDone = false;
function loadExperimentElements()
{
    PIEsetExperimentTitle("Earth's Rotation and Different Seasons");
    PIEsetDeveloperName("Nikhil Gupta");
    PIEhideControlElement();

    /* initialise help and info content */
    initialiseHelp();
    initialiseInfo();
    /* initialise Scene */
    initialiseScene();

    /* initialise Other Variables */
    initialiseOtherVariables();

    for (var ii =  0; ii < views.length; ++ii ) 
    {
        var view = views[ii];
        camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.x = view.eye[ 0 ];
        camera.position.y = view.eye[ 1 ];
        camera.position.z = view.eye[ 2 ];
        camera.up.x = view.up[ 0 ];
        camera.up.y = view.up[ 1 ];
        camera.up.z = view.up[ 2 ];
        view.camera = camera;
    }

    controls = new THREE.OrbitControls(PIEcamera);
    controls.addEventListener('change', renderViews);
    controls.target.set(sunCenterX, sunCenterY, sunCenterZ);

    window.addEventListener('resize', function(){
        PIEcamera.aspect = window.innerWidth / window.innerHeight;
        PIEcamera.updateProjectionMatrix();
        PIErenderer.setSize( window.innerWidth, window.innerHeight );

        updateHemisphereTextPositions();
        northHemisphereTextElement.style.top = positionNorthTextTop + "px";
        northHemisphereTextElement.style.left = positionTextLeft + "px";
        southHemisphereTextElement.style.top = positionSouthTextTop + "px";
        southHemisphereTextElement.style.left = positionTextLeft + "px";

        renderViews();
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
    earth.rotation.set(toRad(90), 0, -1*toRad(23.5)); 
    PIEaddElement(earth);
    
    var latitudeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: false,
      opacity: .3,
      side: THREE.DoubleSide
    });

    equator = new THREE.Line(new THREE.CircleGeometry(earthRadius, 90), latitudeMaterial);
    equator.position.set(earth.position.x, earth.position.y, earth.position.z);    
    equator.rotateX(toRad(90));

    tropicOfCancer = new THREE.Line(new THREE.CircleGeometry(earthRadius * Math.cos(toRad(23.5)), 90), latitudeMaterial);
    tropicOfCancer.position.set(earth.position.x, earth.position.y + (earthRadius * Math.sin(toRad(23.5))), earth.position.z);
    tropicOfCancer.rotateX(toRad(90));

    tropicOfCapricorn = new THREE.Line(new THREE.CircleGeometry(earthRadius * Math.cos(toRad(23.5)), 90), latitudeMaterial);
    tropicOfCapricorn.position.set(earth.position.x, earth.position.y - (earthRadius * Math.sin(toRad(23.5))), earth.position.z);
    tropicOfCapricorn.rotateX(toRad(90));

    arcticCircle = new THREE.Line(new THREE.CircleGeometry(earthRadius * Math.cos(toRad(66.5)), 90), latitudeMaterial);
    arcticCircle.position.set(earth.position.x, earth.position.y + (earthRadius * Math.sin(toRad(66.5))), earth.position.z);
    arcticCircle.rotateX(toRad(90));

    antarcticCircle = new THREE.Line(new THREE.CircleGeometry(earthRadius * Math.cos(toRad(66.5)), 90), latitudeMaterial);
    antarcticCircle.position.set(earth.position.x, earth.position.y - (earthRadius * Math.sin(toRad(66.5))), earth.position.z);
    antarcticCircle.rotateX(toRad(90));  

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
            new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z ),
            new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z + earthRadius + 0.05),
            new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z - earthRadius - 0.05)
        );
    axisOfRotation = new THREE.Line(geometry, latitudeMaterial);
    axisOfRotation.rotation.set(toRad(90), 0, -1*toRad(23.5));
    earth.add(axisOfRotation);

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

    latitudes = new THREE.Object3D();
    latitudes.add(equator);
    latitudes.add(tropicOfCancer);
    latitudes.add(tropicOfCapricorn);
    latitudes.add(arcticCircle);
    latitudes.add(antarcticCircle);
    latitudes.position.set(earth.position.x, earth.position.y, earth.position.z);
    earth.add(latitudes);    

    sun = createSun();
    sun.receiveShadow = false;
    var whitePointLight = new THREE.PointLight(0xffffff, 10, 150, 2);
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

    /* Instantiate experiment controls */
    initialiseControls();

    /* Reset all positions */
    resetExperiment();

    northHemisphereTextElement = document.createElement('div');
    northHemisphereTextElement.style.position = 'absolute';
    northHemisphereTextElement.style.color = "white";
    northHemisphereTextElement.innerHTML = northSeason;
    northHemisphereTextElement.style.top = positionNorthTextTop + "px";
    northHemisphereTextElement.style.left = positionTextLeft + "px";
    document.body.appendChild(northHemisphereTextElement);

    southHemisphereTextElement = document.createElement('div');
    southHemisphereTextElement.style.position = 'absolute';
    southHemisphereTextElement.style.color = "white";
    southHemisphereTextElement.innerHTML = southSeason;
    southHemisphereTextElement.style.top = positionSouthTextTop + "px";
    southHemisphereTextElement.style.left = positionTextLeft + "px";
    document.body.appendChild(southHemisphereTextElement);

    initialSetupDone = false;
    var clickButton = document.getElementById("start");
    clickButton.click();
    setTimeout(function() {
        var clickButton = document.getElementById("stop");
        clickButton.click();
        initialSetupDone = true;
    }, 3000);   
    
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

function setSeasons(daynumber)
{    
    //December Solstice to March Equinox
    if(daynumber >= 355 || daynumber < 79)
    {
        PIEchangeDisplayText(northSeason, winterSeason);
        PIEchangeDisplayText(southSeason, summerSeason);
    }
    //March Equinox to June Solstice
    else if(daynumber >= 79 && daynumber < 172)
    {
        PIEchangeDisplayText(northSeason, springSeason);
        PIEchangeDisplayText(southSeason, autumnSeason);
    }
    //June Solstice to September Equinox
    else if(daynumber >= 172 && daynumber < 265)
    {
        PIEchangeDisplayText(northSeason, summerSeason);
        PIEchangeDisplayText(southSeason, winterSeason);
    }
    //September Equinox to December Solstice
    else
    {
        PIEchangeDisplayText(northSeason, autumnSeason);
        PIEchangeDisplayText(southSeason, springSeason);
    }
}

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

var angleInDegree = 0, angleToRotateInDegrees, yearsCompleted = 0;
function updateExperimentElements(t, dt)
{
    PIEscene.remove(PIEspotLight);
    if(initialSetupDone)
    {
        
        controls.update();     

        angleInDegree = angleInDegree + ((dt / (revolutionTime * 1000)) * 360);
        earth.position.x = sun.position.x + (orbitRadius * Math.cos(toRad(angleInDegree)));
        earth.position.y = sun.position.y + (orbitRadius * Math.sin(toRad(angleInDegree)));

        if(angleInDegree >= 360)
        {
            angleInDegree = 0;
            yearsCompleted += 1;
            if(yearsCompleted == 4)
                yearsCompleted = 0;
        }

        var daynumber, date;
        if(yearsCompleted != 3)
        {
            daynumber = (((angleInDegree/360) * 365) + 355) % 365;
            date = new Date(2017, 0);    
        }
        else
        {
            daynumber = (((angleInDegree/360) * 366) + 355) % 366;
            date = new Date(2020, 0);    
        }
        date = new Date(date.setDate(daynumber));
        var options = {
            month: "short", day: "numeric"
        };
        var dateString = date.toLocaleDateString("en-US", options);    

        setSeasons(daynumber);

        angleToRotateInDegrees = dt / (1000 * singleDegreeRotationTime);
        earth.rotateY(toRad(angleToRotateInDegrees));    

        earthCloud.rotateOnAxis( new THREE.Vector3(Math.sin(toRad(23.5)),Math.cos(toRad(23.5)),0), toRad(angleToRotateInDegrees));

        var solarAngleToRotateInDegrees = dt / (1000 * singleSolarDegreeRotationTime);
        sun.rotateZ(toRad(solarAngleToRotateInDegrees));

        /* Finally Update the Display Panel with new values */
        PIEchangeDisplayText(posX, earth.position.x - sunCenterX);
        PIEchangeDisplayText(posY, earth.position.y - sunCenterY);
        PIEchangeDisplayText(dateText, dateString);
        PIErenderer.setClearColor (0xff0000, 1);        
    }
    renderViews();
}

/******************* Update (animation changes) code ***********************/
