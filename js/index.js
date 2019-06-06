var controls;
var w = window.innerWidth,
  h = window.innerHeight;
window.onresize = function() {
  var w = window.innerWidth,
    h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  controls.handleResize();
};

objects = [[]];
nt=0;lt=0;
xSize = 40; // Not in GUI
ySize = 40; // Not in GUI
heightScale = 5;
xTurbulence = 20;
yTurbulence = 20;
noiseSpeed = 0.003;
lightPosition = 10;
lightSpeed = 0.003;
lightIntensity = 1;
lightDistance = 30;
saturationOffset = -1;
colorHue = 0;
colorLightness = 0.5;
lightColor1 = "rgb(255,0,0)";
lightColor2 = "rgb(0,255,0)";
lightColor3 = "rgb(0,0,255)";

var controlsGUI = new function() {
  this.heightScale = heightScale;
  this.xTurbulence = xTurbulence;
  this.yTurbulence = yTurbulence;
  this.noiseSpeed = noiseSpeed;
  this.saturationOffset = saturationOffset;
  this.lightSpeed = lightSpeed;
  this.lightPosition = lightPosition;
  this.lightDistance = lightDistance;
  this.lightIntensity = lightIntensity;
  this.lightColor1 = lightColor1;
  this.lightColor2 = lightColor2;
  this.lightColor3 = lightColor3;
  this.colorHue = colorHue;
  this.colorLightness = colorLightness;
  
  this.mainChange = function() {
    xTurbulence = controlsGUI.xTurbulence;
    yTurbulence = controlsGUI.yTurbulence;
    heightScale = controlsGUI.heightScale;
    noiseSpeed = controlsGUI.noiseSpeed;
    saturationOffset = controlsGUI.saturationOffset;
    lightSpeed = controlsGUI.lightSpeed;
    colorHue = controlsGUI.colorHue;
    colorLightness = controlsGUI.colorLightness;
  }
  this.lightPositionChange = function(){
    lightPosition = controlsGUI.lightPosition;
    cl1.position.y = lightPosition;
    cl2.position.y = lightPosition;
    cl3.position.y = lightPosition;
    co1.position.y = lightPosition;
    co2.position.y = lightPosition;
    co3.position.y = lightPosition;
  }
  this.lightDistanceChange = function(){
    cl1.distance = controlsGUI.lightDistance;
    cl2.distance = controlsGUI.lightDistance;
    cl3.distance = controlsGUI.lightDistance;
  }
  this.lightIntensityChange = function(){
    cl1.intensity = controlsGUI.lightIntensity;
    cl2.intensity = controlsGUI.lightIntensity;
    cl3.intensity = controlsGUI.lightIntensity;
  }
  this.lightColorChange = function(){
    var col1 = controlsGUI.lightColor1.substring(4, controlsGUI.lightColor1.length-1).replace(/ /g, '').split(',');
    var col2 = controlsGUI.lightColor2.substring(4, controlsGUI.lightColor2.length-1).replace(/ /g, '').split(',');
    var col3 = controlsGUI.lightColor3.substring(4, controlsGUI.lightColor3.length-1).replace(/ /g, '').split(',');
    cl1.color.setRGB(col1[0]/255,col1[1]/255,col1[2]/255);
    cl2.color.setRGB(col2[0]/255,col2[1]/255,col2[2]/255);
    cl3.color.setRGB(col3[0]/255,col3[1]/255,col3[2]/255);
    co1.material.color.setRGB(col1[0]/255,col1[1]/255,col1[2]/255);
    co2.material.color.setRGB(col2[0]/255,col2[1]/255,col2[2]/255);
    co3.material.color.setRGB(col3[0]/255,col3[1]/255,col3[2]/255);
  }
}

var gui = new dat.GUI();
f1 = gui.addFolder("Main");
f2 = gui.addFolder("Lights");
f1.add(controlsGUI, "xTurbulence", 1, 50).step(1).onChange(controlsGUI.mainChange);
f1.add(controlsGUI, "yTurbulence", 1, 50).step(1).onChange(controlsGUI.mainChange);
f1.add(controlsGUI, "heightScale", 1, 10).step(1).onChange(controlsGUI.mainChange);
f1.add(controlsGUI, "noiseSpeed", 0.0000, 0.01).onChange(controlsGUI.mainChange);
f1.add(controlsGUI, "saturationOffset", -1, 2).onChange(controlsGUI.mainChange);
f1.add(controlsGUI, "colorHue", 0, 360).onChange(controlsGUI.mainChange);
f1.add(controlsGUI, "colorLightness", 0.2, 0.8).onChange(controlsGUI.mainChange);
f2.add(controlsGUI, "lightSpeed", 0.0000, 0.01).onChange(controlsGUI.mainChange);
f2.add(controlsGUI, "lightPosition", -30, 30).onChange(controlsGUI.lightPositionChange);
f2.add(controlsGUI, "lightDistance", 10, 50).onChange(controlsGUI.lightDistanceChange);
f2.add(controlsGUI, "lightIntensity", 0.1, 5).onChange(controlsGUI.lightIntensityChange);
f2.addColor(controlsGUI, "lightColor1").onChange(controlsGUI.lightColorChange);
f2.addColor(controlsGUI, "lightColor2").onChange(controlsGUI.lightColorChange);
f2.addColor(controlsGUI, "lightColor3").onChange(controlsGUI.lightColorChange);
f1.open();f2.open();

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

for(var x=0; x<xSize; x++){
  objects.push([]);
  for(var y=0; y<ySize; y++){
    var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = x;
    cube.position.z = y;
    scene.add(cube);
    objects[x].push(cube);
  }
}

var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
camera.position.x = xSize;
camera.position.y = ySize/2;
scene.add(camera);

var controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1.5;
controls.zoomSpeed = 1.0;
controls.panSpeed = 0.3;
controls.noPan = true;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.2;
controls.target.set(xSize/2, 0, ySize/2);

var cl1 = new THREE.PointLight(lightColor1, lightIntensity, lightDistance);
var cl2 = new THREE.PointLight(lightColor2, lightIntensity, lightDistance);
var cl3 = new THREE.PointLight(lightColor3, lightIntensity, lightDistance);
cl1.position.set(xSize/2, lightPosition, ySize/2);
cl2.position.set(xSize/2, lightPosition, ySize/2);
cl3.position.set(xSize/2, lightPosition, ySize/2);
scene.add(cl1);
scene.add(cl2);
scene.add(cl3);

var cg1 = new THREE.CubeGeometry(1, 1, 1);
var cg2 = new THREE.CubeGeometry(1, 1, 1);
var cg3 = new THREE.CubeGeometry(1, 1, 1);
var cm1 = new THREE.MeshBasicMaterial({color: lightColor1});
var cm2 = new THREE.MeshBasicMaterial({color: lightColor2});
var cm3 = new THREE.MeshBasicMaterial({color: lightColor3});
var co1 = new THREE.Mesh(cg1, cm1);
var co2 = new THREE.Mesh(cg2, cm2);
var co3 = new THREE.Mesh(cg3, cm3);
co1.position.set(xSize/2, lightPosition, ySize/2);
co2.position.set(xSize/2, lightPosition, ySize/2);
co3.position.set(xSize/2, lightPosition, ySize/2);
scene.add(co1);
scene.add(co2);
scene.add(co3);

var light = new THREE.AmbientLight( 0x666666 );
scene.add(light);

var starsGeometry = new THREE.Geometry();
for(i=0; i<3000; i++){
	var star = new THREE.Vector3();
	star.x = THREE.Math.randFloatSpread(2000);
	star.y = THREE.Math.randFloatSpread(2000);
	star.z = THREE.Math.randFloatSpread(2000);
	starsGeometry.vertices.push(star);
}
var starsMaterial = new THREE.PointsMaterial({color: 0xffffff});
var starField = new THREE.Points(starsGeometry,starsMaterial);
scene.add(starField);

function render() {
  requestAnimationFrame(render);
  controls.update();
  update();
  renderer.render(scene, camera);
}
render();

function update() {
  nt += noiseSpeed;
  lt += lightSpeed;
  cl1.position.z = ySize/2+(ySize/4) * Math.cos(lt*10) - (ySize/4) * Math.sin(lt*10);
  cl1.position.x = xSize/2+(xSize/4) * Math.cos(lt*10) + (xSize/4) * Math.sin(lt*10);
  co1.position.z = ySize/2+(ySize/4) * Math.cos(lt*10) - (ySize/4) * Math.sin(lt*10);
  co1.position.x = xSize/2+(xSize/4) * Math.cos(lt*10) + (xSize/4) * Math.sin(lt*10);
  cl2.position.z = ySize/2+(ySize/4) * Math.cos((lt+0.2)*10) - (ySize/4) * Math.sin((lt+0.2)*10);
  cl2.position.x = xSize/2+(xSize/4) * Math.cos((lt+0.2)*10) + (xSize/4) * Math.sin((lt+0.2)*10);
  co2.position.z = ySize/2+(ySize/4) * Math.cos((lt+0.2)*10) - (ySize/4) * Math.sin((lt+0.2)*10);
  co2.position.x = xSize/2+(xSize/4) * Math.cos((lt+0.2)*10) + (xSize/4) * Math.sin((lt+0.2)*10);
  cl3.position.z = ySize/2+(ySize/4) * Math.cos((lt+0.4)*10) - (ySize/4) * Math.sin((lt+0.4)*10);
  cl3.position.x = xSize/2+(xSize/4) * Math.cos((lt+0.4)*10) + (xSize/4) * Math.sin((lt+0.4)*10);
  co3.position.z = ySize/2+(ySize/4) * Math.cos((lt+0.4)*10) - (ySize/4) * Math.sin((lt+0.4)*10);
  co3.position.x = xSize/2+(xSize/4) * Math.cos((lt+0.4)*10) + (xSize/4) * Math.sin((lt+0.4)*10);
  for(var x=0; x<xSize; x++){
    for(var y=0; y<ySize; y++){
      var yn = noise.simplex3(x/xTurbulence, y/yTurbulence, nt)*heightScale;
      objects[x][y].position.y = yn;
      objects[x][y].material.color.setHSL(colorHue,yn/heightScale+saturationOffset,colorLightness);
    }
  }
};