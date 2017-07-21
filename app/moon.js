module.exports = function() {
    var container;
    var camera, scene, renderer;
    var mouseX = 0,
        mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var hilbert_line;
    var geometry_line, mesh_line;
    var material;
    var i, h, particles, size;
    var subdivisions = 3;
    var point_count = 0;
    init();
    animate();

    function init() {
        c1_stat_div = document.getElementById('c1_stat');
        stat1 = new Stats();
        stat1.dom.style.position = 'relative';
        c1_stat_div.appendChild(stat1.dom);
        //**renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        c1_canvas_div = c1_stat_div = document.getElementById('c1_canvas');
        c1_canvas_div.appendChild(renderer.domElement);
        renderer.setClearColor(0xffffff);

        //**scene
        scene = new THREE.Scene();
        //scene.fog = new THREE.FogExp2(0x000000,0.0007);
        //**camera 
        camera = new THREE.OrthographicCamera(-windowHalfX, windowHalfX, windowHalfY, -windowHalfY, 1, 1000);
        camera.position.set(0, 500, 0);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);
        var directionalLight = new THREE.DirectionalLight(0xffcc00);
        directionalLight.position.set(0, 4, 0).normalize();
        directionalLight.target.position.set(0, 0, 0);
        scene.add(directionalLight);

        hilbert_line = hilbert3D(new THREE.Vector3(0, 0, 0),
            250, 2);
        //hilbert_line[200] = new THREE.Vector3(0,0,0);
        //hilbert_line[201] = new THREE.Vector3(0,0,0);
        var spline = new THREE.CatmullRomCurve3(hilbert_line);
        point_count = subdivisions * hilbert_line.length;
        geometry_line = new THREE.BufferGeometry();
        var positions = new Float32Array(point_count * 3);
        var colors = new Float32Array(point_count * 3);
        geometry_line.addAttribute('position', new THREE.BufferAttribute(
            positions, 3
        ));
        geometry_line.addAttribute('color', new THREE.BufferAttribute(
            colors, 3
        ));
        var color_line = [];
        //var positions = geometry_line.geometry.attributes.position.array;
        var index = 0,
            index_sp = 0,
            position_sp;
        var x_color = Math.random();
        for (i = 0; i < point_count; i++) {
            index_sp = i / (point_count);
            position_sp = spline.getPoint(index_sp);
            positions[i * 3] = position_sp.x;
            positions[i * 3 + 1] = position_sp.y;
            positions[i * 3 + 2] = position_sp.z;
            colors[i * 3] = ((point_count - i) / (point_count / 2) + x_color) % 1;
            colors[i * 3 + 1] = i / (point_count / 2) % 1;
            colors[i * 3 + 2] = x_color + 0.2;
        }
        material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors
        })
        geometry_line.color = colors;
        mesh_line = new THREE.Line(geometry_line, material);
        scene.add(mesh_line);
    }
    var alltimme = 10; //10s
    var p_index = 0;

    function　 animate() {
        requestAnimationFrame(animate);
        render();
    }
    var times = Date.now();
    var position_mesh = new THREE.Vector3(0, 0, 0);
    var flag_r = false,
        rota = false;

    function render() {
        stat1.begin();
        camera.position.x = -(mouseX) * 0.05;
        camera.position.z = (-mouseY) * 0.05;
        //camera.lookAt(new THREE.Vector3(0,0,0));
        var time = Date.now();
        var zz = time % 10000;
        if (flag_r) {
            p_index -= 3;
        } else {
            p_index += 3;
        }
        if (p_index <= 0)
            flag_r = false;
        if (p_index > point_count)
            flag_r = true;
        geometry_line.setDrawRange(0, p_index);

        if (mesh_line.position.x != mouseX ||
            mesh_line.position.z != mouseY) {
            mesh_line.position.x += (mouseX - mesh_line.position.x) / 50;
            mesh_line.position.z += (mouseY - mesh_line.position.z) / 50;
        }
        if (rota) {
            mesh_line.rotation.z += 0.01;
            mesh_line.rotation.y += 0.02;
        }

        renderer.render(scene, camera);
        stat1.end();
    }
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener("dblclick", function() {

    });
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    }

    function onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }

    }

    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }
    document.addEventListener('click', show, false);

    function show() {
        if (rota) rota = false;
        else rota = true;
        console.log(mouseX, mouseY);

    }
}();