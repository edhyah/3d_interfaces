AFRAME.registerComponent('racetracker', {
    init: function () {
        console.log('hello world from inside component!');
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x4CC3D9} );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(-1, 0.5, -3);
        this.el.setObject3D('cube', cube);
        console.log(cube.position);

        var model = this.el.sceneEl.querySelector('#trackmodel');
        console.log(model);
        const scale = 0.01;
        model.object3D.scale.set(scale, scale, scale);

        var model2 = this.el.sceneEl.querySelector('#carmodel');
        const scale2 = 0.5;
        model2.object3D.scale.set(scale2, scale2, scale2);
    },
});
