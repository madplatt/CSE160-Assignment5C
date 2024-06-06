import * as THREE from 'three';

export class Rain{
    constructor(xyz, speed, droplets) {
        this.rainLen = xyz[0];
        this.rainHeight = xyz[1];
        this.rainWidth = xyz[2];
        this.rainVertices = [];
        this.rain1Y = this.rainHeight;
        this.rain2Y = this.rainHeight * 2;
        this.speed = speed;
        for (let i=0; i < droplets; i++) {
            this.rainVertices.push(Math.random() * this.rainLen - this.rainLen / 2);
            this.rainVertices.push(Math.random() * this.rainHeight);
            this.rainVertices.push(Math.random() * this.rainWidth - this.rainWidth / 2);
        }
        this.rainGeometry = new THREE.BufferGeometry()
        this.rainGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(this.rainVertices), 3));
        this.rainMaterial = new THREE.PointsMaterial({
            color: 0x5b90ff,
            size: .5,
            transparent: false
        });
        this.rain1 = new THREE.Points(this.rainGeometry, this.rainMaterial);
        this.rain2Geometry = this.rainGeometry.clone();
        this.rain2Geometry.translate(0, this.rainHeight, 0);
        this.rain2 = new THREE.Points(this.rain2Geometry, this.rainMaterial)
    }

    addToScene(scene) {
        scene.add(this.rain1);
        scene.add(this.rain2);
    }
    update() {
        if (this.rain1Y > 0) {
            this.rainGeometry.translate(0, -this.speed, 0);
            this.rain1Y -= this.speed;
        }
        else {
            this.rainGeometry.translate(0, this.rainHeight * 2, 0);
            this.rain1Y = this.rainHeight * 2;
        }

        if (this.rain2Y > 0) {
            this.rain2Geometry.translate(0, -this.speed, 0);
            this.rain2Y -= this.speed;
        }
        else {
            this.rain2Geometry.translate(0, this.rainHeight * 2, 0);
            this.rain2Y = this.rainHeight * 2;
        }
    }
}