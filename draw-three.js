var camera, scene, renderer;
var geometry, material, mesh;

var windowHalfX = window.innerWidth / 2; 
var windowHalfY = window.innerHeight / 2; 
var radious = 2000, theta = 45, onMouseDownTheta = 45, phi = 60, onMouseDownPhi = 60, onMouseDownPosition;

function onload_result(value)
{
    if($("canvas").length !==0)
        $("canvas").remove();
    n = value.n;
    draw = false;
    if(n == 3)
    {  
        init();
        animate();
        draw = true;
    }
    var c = value.c;
    var x = new Vector(value.x0.length);
    x.v = value.x0;
    eps = value.eps;
    p_s = Popov_system(value.all_operator,x,c,eps,false);
    p_s_middle = Popov_system_middle_value(value.all_operator,x,c,eps, false);
    p_s_max = Popov_system(value.all_operator,x,c,eps,true);
    p_s_middle_max = Popov_system_middle_value(value.all_operator,x,c,eps, true);
    p_s_mod = Popov_system_modification(value.all_operator,x,c,eps);
    x_s = p_s.a.v;
    x_s_mid = p_s_middle.a.v;
    x_s_max = p_s_max.a.v;
    x_s_mid_max = p_s_middle_max.a.v;
    x_s_mod = p_s_mod.a.v;

    result = "<div class = 'result'>";
    result += "<span class = 'result_metod_name'>Метод Попова(різні \\(\\lambda_{i}\\)):</span><br>";
    result += "Кількість ітерацій: " + p_s.b + "<br>";
    result += "Розв'язок: \\(x^{*} = (";
    for(i=0; i<x_s.length; i++)
    {
        if(i !== x_s.length - 1)
            result += x_s[i] + ',';
        else
             result += x_s[i];
    }
    result += ")\\)<br><br>";

    result += "<span class = 'result_metod_name'>Метод Попова(з середнім значенням)(різні \\(\\lambda_{i}\\)):</span><br>";
    result += "Кількість ітерацій: " + p_s_middle.b + "<br>";
    result += "Розв'язок: \\(x^{*} = (";
    for(i=0; i<x_s_mid.length; i++)
    {
        if(i !== x_s_mid.length - 1)
            result += x_s_mid[i] + ',';
        else
             result += x_s_mid[i];
    }
     result += ")\\)<br><br>";

    result += "<span class = 'result_metod_name'>Метод Попова(\\(\\lambda_{max}\\)):</span><br>";
    result += "Кількість ітерацій: " + p_s_max.b + "<br>";
    result += "Розв'язок: \\(x^{*} = (";
    for(i=0; i<x_s_max.length; i++)
    {
        if(i !== x_s_max.length - 1)
            result += x_s_max[i] + ',';
        else
             result += x_s_max[i];
    }
     result += ")\\)<br><br>";

    result += "<span class = 'result_metod_name'>Метод Попова(з середнім значенням)(\\(\\lambda_{max}\\)):</span><br>";
    result += "Кількість ітерацій: " + p_s_middle_max.b + "<br>";
    result += "Розв'язок: \\(x^{*} = (";
    for(i=0; i<x_s_mid_max.length; i++)
    {
        if(i !== x_s_mid_max.length - 1)
            result += x_s_mid_max[i] + ',';
        else
             result += x_s_mid_max[i];
    }

    result += ")\\)<br><br>";

    result += "<span class = 'result_metod_name'>Метод Попова(\\(\\lambda_{k}\\) без сталої Ліпшиця):</span><br>";
    result += "Кількість ітерацій: " + p_s_mod.b + "<br>";
    result += "Розв'язок: \\(x^{*} = (";
    for(i=0; i<x_s_mod.length; i++)
    {
        if(i !== x_s_mod.length - 1)
            result += x_s_mod[i] + ',';
        else
             result += x_s_mod[i];
    }

    result += ")\\)<br><br>";

    result += "</div><br><br><br><br>";
    $('body').append(result);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    console.log(p_s);
    console.log(p_s_middle);
    console.log(p_s_max);
    console.log(p_s_middle_max);
    console.log(p_s_mod);
}

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
    camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
    camera.lookAt(new THREE.Vector3(0,0,0))
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    var line_geometry_z = new THREE.Geometry();
    line_geometry_z.vertices.push(new THREE.Vector3(0,0,0));
    line_geometry_z.vertices.push(new THREE.Vector3(0,0,radious));
    line_geometry_z.vertices.push(new THREE.Vector3(0,0,-radious));

    var line_geometry_y = new THREE.Geometry();
    line_geometry_y.vertices.push(new THREE.Vector3(0,0,0));
    line_geometry_y.vertices.push(new THREE.Vector3(0,radious,0));
    line_geometry_y.vertices.push(new THREE.Vector3(0,-radious,0));

    var line_geometry_x = new THREE.Geometry();
    line_geometry_x.vertices.push(new THREE.Vector3(0,0,0));
    line_geometry_x.vertices.push(new THREE.Vector3(radious,0,0));
    line_geometry_x.vertices.push(new THREE.Vector3(-radious,0,0));

    var material_line = new THREE.LineBasicMaterial({color : 0x000000})

    var line_z = new THREE.Line(line_geometry_z,material_line);
    scene.add(line_z);

    var line_y = new THREE.Line(line_geometry_y,material_line);
    scene.add(line_y);

    var line_x = new THREE.Line(line_geometry_x,material_line);
    scene.add(line_x);

    document.body.insertBefore( renderer.domElement , document.body.firstChild);
    onMouseDownPosition = new THREE.Vector2();
    document.addEventListener( 'mousedown', onDocumentMouseDown, false ); 
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();


    theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 )
            + onMouseDownTheta;
    phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 )
          + onMouseDownPhi;

    phi = Math.min( 180, Math.max( -180, phi ) );

    camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
    camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
    camera.updateMatrix();

    

    camera.lookAt(new THREE.Vector3(0,0,0))
    // mouse3D = projector.unprojectVector(
    //     new THREE.Vector3(
    //         ( event.clientX / renderer.domElement.width ) * 2 - 1,
    //         - ( event.clientY / renderer.domElement.height ) * 2 + 1,
    //         0.5
    //     ),
    //     camera
    // );
    // ray.direction = mouse3D.subSelf( camera.position ).normalize();


}
function onDocumentMouseUp( event ) { 
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false ); 
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false ); 
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false ); 
} 
function onDocumentMouseOut( event ) { 
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false ); 
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false ); 
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false ); 
} 
function onDocumentMouseDown( event ) { 
    event.preventDefault(); 
    document.addEventListener( 'mousemove', onDocumentMouseMove, false ); 
    document.addEventListener( 'mouseup', onDocumentMouseUp, false ); 
    document.addEventListener( 'mouseout', onDocumentMouseOut, false ); 
    onMouseDownTheta = theta;
    onMouseDownPhi = phi;
    onMouseDownPosition.x = event.clientX;
    onMouseDownPosition.y = event.clientY;
}
function onDocumentMouseWheel( event ) {

    radious -= event.wheelDeltaY;

    camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.updateMatrix();
}
var is_cube = false;
function draw_cube(c)
{
    if(is_cube) return;
    geometry = new THREE.CubeGeometry( c[0]*100,c[1]*100,c[2]*100);
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true} );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = c[0]*100/2;
    mesh.position.y = c[1]*100/2;
    mesh.position.z=c[2]*100/2;
    scene.add( mesh );
    is_cube = true;
}
function draw_line(x0,y0,z0,x,y,z,color_line)
{
    var line_geometry = new THREE.Geometry();
    line_geometry.vertices.push(new THREE.Vector3(x0*100,y0*100,z0*100));
    line_geometry.vertices.push(new THREE.Vector3(x*100,y*100,z*100));
    var material_line = new THREE.LineBasicMaterial({color : color_line});
    var line = new THREE.Line(line_geometry,material_line);
    scene.add(line);
}
function draw_point(x,y,z,color_point)
{
    var point_geometry = new THREE.SphereGeometry(0.5);
    var point_texture = new THREE.MeshBasicMaterial({color : color_point});
    var point  = new THREE.Mesh(point_geometry,point_texture);
    point.position.x = x*100;
    point.position.y = y*100;
    point.position.z = z*100;

    scene.add(point);
}
function draw_point_start(x,y,z,color_point)
{
    var point_geometry = new THREE.SphereGeometry(10);
    var point_texture = new THREE.MeshBasicMaterial({color : color_point});
    var point  = new THREE.Mesh(point_geometry,point_texture);
    point.position.x = x*100;
    point.position.y = y*100;
    point.position.z = z*100;

    scene.add(point);
}