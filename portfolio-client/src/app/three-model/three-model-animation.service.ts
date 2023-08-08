import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root'
})
export class ThreeModelAnimationService {
  private controls: OrbitControls;

  constructor(private readonly scene: THREE.Scene, private readonly camera: THREE.Camera, private readonly renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    console.log(camera.position)

    // Set up orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(-11, 2, -4);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.addEventListener('change', () => this.renderer.render(this.scene, this.camera));
  }

  animate() {
    // Animation loop logic goes here
    requestAnimationFrame(() => this.animate());
    // Update the 3D model or any other objects here
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onResize(){
    window.addEventListener('resize', () => {
      const camera = this.camera as THREE.PerspectiveCamera;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  onMouseMove(){
    window.addEventListener('mousemove', this.updateCameraPosition, false);
  }
  updateCameraPosition(event: any) {
    const target = new THREE.Vector3(-11, 2, -4);

    const mouseMoveTarget = new THREE.Vector3(-5, 4, -2)
    const radius = 5; // Radius of the circle
    const angleFactor = 0.1; // Factor to reduce the range of angles, making movement slower
    const zMin = -4; // Minimum bound on the z-axis
    const zMax = 0;  // Maximum bound on the z-axis
    // Normalize the mouse position from -1 to 1
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;

    // Map the normalized mouse position to an angle (in radians)
    // Multiply by angleFactor to reduce the range of angles
    const angle = mouseX * Math.PI * angleFactor;

    // Calculate the camera's x and z coordinates on the circle

    let z = mouseMoveTarget.z - radius * Math.sin(angle);

    // Clamp the z coordinate to the defined bounds
    z = Math.max(zMin, Math.min(zMax, z));

    // Update the camera's position
    this.camera.position.set(this.camera.position.x, this.camera.position.y, z);

    // Keep the camera focused on the target
    this.camera.lookAt(target);
  }



  animateCamera(duration: number = 2) {
    // GSAP animation for moving the camera
    let path = [
      new THREE.Vector3(1, 6, 3),


      new THREE.Vector3(-3, 4, 1),
      new THREE.Vector3(-4, 4, 2),


      new THREE.Vector3(-5, 4, -2),
    ];

    const curve = new THREE.CubicBezierCurve3(...path);
    const points = curve.getPoints(50);

    const target = new THREE.Vector3(-11, 2, -4);
    let tl = gsap.timeline({repeat: 0, delay: 1});
    for (let i = 0; i < points.length; i++) {
      let pt = points[i];
      tl.to(this.camera.position, {
        duration: .05,
        x: pt.x,
        y: pt.y,
        z: pt.z,
        ease: "power1.inOut",
        onUpdate: () => {
          //controls.target = target;
          this.camera.lookAt(target);
        }
      });
    }
  }
}
