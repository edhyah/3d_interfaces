AFRAME.registerComponent('flightviewer', {
    init: function () {
        var el = this.el;

        this.onThumbstickMoved = this.onThumbstickMoved.bind(this);

        this.initCameraRig();

        this.globeEl = document.createElement('a-entity');
        this.globeEl.id = 'globe';
        this.globeEl.object3D.scale.set(0.1, 0.1, 0.1);
        this.globeEl.setAttribute('globe', {'globeImageUrl': '//unpkg.com/three-globe/example/img/earth-night.jpg'})
        el.appendChild(this.globeEl);

        this.leftHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
        this.rightHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);

        this.cameraRigEl.object3D.position.set(0, 0, 25);
        this.cameraRigEl.setAttribute('movement-controls', {fly: true, speed: 0.5});
    },

    initCameraRig: function () {
        var cameraRigEl = this.cameraRigEl = document.createElement('a-entity');
        var cameraEl = this.cameraEl = document.createElement('a-camera');
        var rightHandEl = this.rightHandEl = document.createElement('a-entity');
        var leftHandEl = this.leftHandEl = document.createElement('a-entity');

        cameraEl.setAttribute('look-controls', {
            pointerLockEnabled: false,
        });
        cameraEl.setAttribute('wasd-controls', {
            enabled: false,
        });

        leftHandEl.setAttribute('laser-controls', {hand: 'left'});
        leftHandEl.setAttribute('raycaster', {objects: ['globe'], interval: 100, lineColor: 'steelblue', lineOpacity: 0.85});
        rightHandEl.setAttribute('laser-controls', {hand: 'right'});
        rightHandEl.setAttribute('raycaster', {objects: ['globe'], interval: 100, lineColor: 'steelblue', lineOpacity: 0.85});

        cameraRigEl.appendChild(cameraEl);
        cameraRigEl.appendChild(leftHandEl);
        cameraRigEl.appendChild(rightHandEl);

        this.el.appendChild(cameraRigEl);
    },

    onThumbstickMoved: function (evt) {
        console.log('Thumbstick moved!');
        console.log(this.cameraRigEl.getAttribute('position'));
    }
});
