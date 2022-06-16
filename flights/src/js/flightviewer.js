require('aframe-globe-component');

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import planeModel from '../assets/boeing787lp.fbx';

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

        // Test rendering of random arcs (flight paths)
        /*
        const N = 10;
        const arcsData = [...Array(N).keys()].map(() => ({
            startLat: (Math.random() - 0.5) * 180,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 180,
            endLng: (Math.random() - 0.5) * 360,
            color: [['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]]
        }));
        this.globeEl.setAttribute('globe', {
            arcsData: arcsData,
            arcColor: 'color',
        });
        */

        const loader = new FBXLoader();
        loader.load(planeModel, (fbx) => {
            this.planeMesh = fbx;
        }, undefined, (error) => {
            console.error(error);
        });

        // Build plane icon
        const planeShape = new THREE.Shape();
        planeShape.moveTo(0, 0);
        planeShape.lineTo(1, 0.5);
        planeShape.lineTo(2, 0);
        planeShape.lineTo(1, 2);
        planeShape.lineTo(0, 0);
        const extrudeSettings = { depth: 0.1, bevelEnabled: false };
        this.planeGeometry = new THREE.ExtrudeGeometry(planeShape, extrudeSettings);
        this.planeMaterial = new THREE.MeshLambertMaterial({ color: 'red', transparent: true, opacity: 0.7 });

        this.renderFlights();
        setInterval(this.renderFlights, 15000);
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
                        const obj = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
                        //const obj = this.planeMesh;
                        //obj.scale.set(0.1, 0.1, 0.1);
                        const dir = objectData['dir'] * Math.PI / 180.0;
                        const lat = objectData['lat'] * Math.PI / 180.0;
                        const lng = objectData['lng'] * Math.PI / 180.0;
                        const euler = new THREE.Euler(-lat, lng, dir, 'YXZ');
                        obj.setRotationFromEuler(euler);
                        return obj;
                    },
                    objectsData: flights
                });
                //console.log(this.globeEl.getAttribute('globe')['objectsData'][0]['__threeObj']);
                //var obj = this.globeEl.getAttribute('globe')['objectsData'][0]['__threeObj'];
                //obj.rotateZ(1.5);
            });
    },

    onThumbstickMoved: function (evt) {
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
