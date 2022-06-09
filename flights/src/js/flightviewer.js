require('aframe-globe-component');

AFRAME.registerComponent('flightviewer', {
    init: function () {
        this.onThumbstickMoved = this.onThumbstickMoved.bind(this);
        this.onTriggerDown = this.onTriggerDown.bind(this);
        this.onTriggerUp = this.onTriggerUp.bind(this);

        this.initCameraRig();
        this.initGlobe();

        this.leftHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
        this.rightHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
        this.leftHandEl.addEventListener('triggerdown', this.onTriggerDown);
        this.rightHandEl.addEventListener('triggerdown', this.onTriggerDown);
        this.leftHandEl.addEventListener('triggerup', this.onTriggerUp);
        this.rightHandEl.addEventListener('triggerup', this.onTriggerUp);

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
        leftHandEl.setAttribute('raycaster', {objects: ['.raycastable'], interval: 100, lineColor: 'steelblue', lineOpacity: 0.85});
        rightHandEl.setAttribute('laser-controls', {hand: 'right'});
        rightHandEl.setAttribute('raycaster', {objects: ['.raycastable'], interval: 100, lineColor: 'steelblue', lineOpacity: 0.85});

        cameraRigEl.appendChild(cameraEl);
        cameraRigEl.appendChild(leftHandEl);
        cameraRigEl.appendChild(rightHandEl);

        this.el.appendChild(cameraRigEl);
    },

    initGlobe: function () {
        this.globeEl = document.createElement('a-entity');
        this.globeEl.id = 'globe';
        this.globeEl.object3D.scale.set(0.1, 0.1, 0.1);
        this.globeEl.setAttribute('globe', {'globeImageUrl': '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'})
        this.globeEl.classList.add('raycastable');
        this.el.appendChild(this.globeEl);
    },

    onThumbstickMoved: function (evt) {
        var globeScale = this.globeScale || this.globeEl.object3D.scale.x;
        globeScale -= evt.detail.y / 20;
        globeScale = Math.min(Math.max(0.1, globeScale), 0.22);
        this.globeEl.object3D.scale.set(globeScale, globeScale, globeScale);
        this.globeScale = globeScale;
    },

    onTriggerDown: function (evt) {
        this.activeHandEl = evt.srcElement;
    },

    onTriggerUp: function (evt) {
        this.oldHandX = undefined;
        this.oldHandY = undefined;
        this.activeHandEl = undefined;
    },

    tick: function () {
        if (!this.el.sceneEl.is('vr-mode') || !this.activeHandEl) { return; }

        var intersection = this.activeHandEl.components.raycaster.getIntersection(this.globeEl);
        if (!intersection) { return; }

        var intersectionPosition = intersection.point;
        this.oldHandX = this.oldHandX || intersectionPosition.x;
        this.oldHandY = this.oldHandY || intersectionPosition.y;

        this.globeEl.object3D.rotation.y -= (this.oldHandX - intersectionPosition.x) / 12;
        this.globeEl.object3D.rotation.x += (this.oldHandY - intersectionPosition.y) / 12;

        this.oldHandX = intersectionPosition.x;
        this.oldHandY = intersectionPosition.y;
    }
});
