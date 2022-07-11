require('aframe-globe-component');

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import planeModel from '../assets/boeing787lp.fbx';
require('../assets/boeing787lp.png');

// Quest supports up to 8k texture maps
// Source: https://www.shadedrelief.com/natural3/
import globeImg from '../assets/earthmap8k.jpg';
import bumpImg from '../assets/earthbump8k.jpg';

AFRAME.registerComponent('flightviewer', {
    init: function () {
        this.onThumbstickMoved = this.onThumbstickMoved.bind(this);
        this.onTriggerDown = this.onTriggerDown.bind(this);
        this.onTriggerUp = this.onTriggerUp.bind(this);
        this.renderFlights = this.renderFlights.bind(this);

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

        // Face North America first
        this.globeEl.object3D.rotateX(0.78);
        this.globeEl.object3D.rotateY(1.5);

        this.loader = new FBXLoader();
        this.loader.load(planeModel, (fbx) => {
            this.mesh = fbx;

            // Change material to different color without lighting
            var material = this.mesh.children[0].material.clone();
            material.emissiveIntensity = 1.0;
            material.emissive.setHex(0xe0e0e0);
            this.mesh.children[0].material = material;
            this.mesh.children[1].removeFromParent();

            this.renderFlights();
            //setInterval(this.renderFlights, 15000);

            /*
            const test = true;
            if (test) {
                this.globeEl.setAttribute('globe', {
                    objectThreeObject: (objectData) => {
                        const obj = this.mesh.clone();
                        obj.scale.set(0.005, 0.005, 0.005);
                        const dir = objectData['dir'] * Math.PI / 180.0;
                        const lat = objectData['lat'] * Math.PI / 180.0;
                        const lng = objectData['lng'] * Math.PI / 180.0;
                        const euler = new THREE.Euler(-lat, lng, dir, 'YXZ');
                        obj.setRotationFromEuler(euler);
                        obj.rotateX(Math.PI/2);
                        obj.rotateY(-Math.PI/2);
                        return obj;
                    },
                    objectsData: [{
                        lat: 41.8781,
                        lng: -87.6298,
                        alt: 1000,
                        dir: 0
                    }]
                });
                return;
            }
            */
        }, undefined, (error) => {
            console.error(error);
        });
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
        this.globeEl.setAttribute('globe', {'globeImageUrl': globeImg, 'bumpImageUrl': bumpImg})
        this.globeEl.classList.add('raycastable');
        this.el.appendChild(this.globeEl);
    },

    renderFlights: function () {
        fetch('https://opensky-network.org/api/states/all')
            .then(response => response.json())
            .then(data => {
                const states = data['states'].filter(state => /DAL(.*)/.test(state[1]));
                const flights = states.map(state => ({
                    lat: state[6],
                    lng: state[5],
                    alt: (state[13] ? state[13] : 0),
                    dir: (state[10] ? state[10] : 0)
                }));
                this.globeEl.setAttribute('globe', {
                    objectThreeObject: (objectData) => {
                        const obj = this.mesh.clone();
                        obj.scale.set(0.005, 0.005, 0.005);

                        const dir = objectData['dir'] * Math.PI / 180.0;
                        const lat = objectData['lat'] * Math.PI / 180.0;
                        const lng = objectData['lng'] * Math.PI / 180.0;
                        const euler = new THREE.Euler(-lat, lng, dir, 'YXZ');
                        obj.setRotationFromEuler(euler);

                        // Rotate object so that plane is flat and points north
                        obj.rotateX(Math.PI/2);
                        obj.rotateY(-Math.PI/2);
                        return obj;

                    },
                    objectsData: flights
                });
            });
    },

    onThumbstickMoved: function (evt) {
        if (!this.globeEl) { return; }
        var globeScale = this.globeScale || this.globeEl.object3D.scale.x;
        globeScale -= evt.detail.y / 20;
        globeScale = Math.min(Math.max(0.1, globeScale), 0.18);
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
        if (!this.globeEl) { return; }

        var intersection = this.activeHandEl.components.raycaster.getIntersection(this.globeEl);
        if (!intersection) { return; }

        var intersectionPosition = intersection.point;
        this.oldHandX = this.oldHandX || intersectionPosition.x;
        this.oldHandY = this.oldHandY || intersectionPosition.y;

        this.globeEl.object3D.rotation.y -= (this.oldHandX - intersectionPosition.x) / 18;
        this.globeEl.object3D.rotation.x += (this.oldHandY - intersectionPosition.y) / 18;

        this.oldHandX = intersectionPosition.x;
        this.oldHandY = intersectionPosition.y;
    }
});
