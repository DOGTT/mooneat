module.exports = function(){
    var geo = new THREE.BoxGeometry(10,10,10);
    var mat = new THREE.MeshBasicMaterial({
        color:0xff00ff
    });
    var moon = new THREE.Mesh(geo,mat);
    

}();