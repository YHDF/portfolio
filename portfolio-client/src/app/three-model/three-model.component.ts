import {Component, ElementRef} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {ThreeModelBuilderService} from "./three-model-builder.service";
import {ThreeModel} from "./three-model";
//json configurtion
import * as threeModelConfig from '../../assets/json/three-config.json';
import * as lightConfig from '../../assets/json/lights.json';
import {ThreeModelAnimationService} from "./three-model-animation.service";


gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.scss']
})
export class ThreeModelComponent {
  constructor(private el: ElementRef,
              private threeModelBuilderService: ThreeModelBuilderService) {

  }

  ngAfterViewInit(): void {
    const canvas = this.el.nativeElement.querySelector('#room');

    const threeModel: ThreeModel = this.threeModelBuilderService.createThreeModel(canvas, threeModelConfig, lightConfig)
    threeModel.getRenderer().setSize(window.innerWidth, window.innerHeight);
    threeModel.getRenderer().setPixelRatio(window.devicePixelRatio);
    threeModel.getRenderer().toneMapping = THREE.NoToneMapping;
    threeModel.getLights().map((value, index) => {
      threeModel.getScene().add(value);
    });

    const threeAnimation = new ThreeModelAnimationService(threeModel.getScene(), threeModel.getCamera(), threeModel.getRenderer());

    //threeAnimation.animate();




    function makeLabelCanvas(size: any, name: any) {
      let menuCanvas = document.createElement('canvas');
      menuCanvas.width = 512;
      menuCanvas.height = 512;

      let ctx: any = menuCanvas.getContext('2d');

      // Draw background
      ctx.fillStyle = '#0e1a29';
      ctx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);


      // draw background
      ctx.fillStyle = "#FD0";
      ctx.fillRect(menuCanvas.width / 2 - 50, menuCanvas.height / 2 - 50, 50, 50);
      ctx.fillStyle = "#6C0";
      ctx.fillRect(menuCanvas.width / 2, menuCanvas.height / 2 - 50, 50, 50);
      ctx.fillStyle = "#09F";
      ctx.fillRect(menuCanvas.width / 2 - 50, menuCanvas.height / 2, 50, 50);
      ctx.fillStyle = "#F30";
      ctx.fillRect(menuCanvas.width / 2, menuCanvas.height / 2, 50, 50);
      ctx.fillStyle = "#FFF";

      // set transparency value
      ctx.globalAlpha = 0.1;


      // Define the taskbar size and position
      const taskbarHeight = 40;
      const taskbarY = menuCanvas.height - taskbarHeight;

      // Draw the taskbar background
      ctx.fillStyle = '#444'; // Color of the taskbar
      ctx.fillRect(0, taskbarY, menuCanvas.width, taskbarHeight);


      // Draw some example icons on the taskbar
      const iconSize = 30;
      const iconSpacing = 10;
      for (let i = 0; i < 5; i++) {
        const iconX = iconSpacing + (iconSize + iconSpacing) * i;
        const iconY = taskbarY + (taskbarHeight - iconSize) / 2;

        // Draw icon rectangle (replace this with an actual icon image if needed)
        ctx.fillStyle = 'white';
        ctx.fillRect(iconX, iconY, iconSize, iconSize);

        // Optional: Add a label for the icon
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Icon${i}`, iconX, iconY + iconSize + 12);
      }


      return ctx.canvas;
    }


    const cnvs = makeLabelCanvas(3, "text");
    let menuTexture = new THREE.CanvasTexture(cnvs);
    menuTexture.flipY = false;
    menuTexture.needsUpdate = true;
    menuTexture.minFilter = THREE.LinearFilter;
    menuTexture.wrapS = THREE.ClampToEdgeWrapping;
    menuTexture.wrapT = THREE.ClampToEdgeWrapping;
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: menuTexture,
      //side: THREE.DoubleSide,
      transparent: false,
    });
    //const labelGeometry = new THREE.PlaneGeometry(1, 1);
    //const label = new THREE.Mesh(labelGeometry, labelMaterial);


    const loader = new GLTFLoader();

    // Load the GLTF model for the room
    loader.load('./assets/3d-models/room.gltf', (gltf) => {
      const objects = gltf.scene;
      threeModel.getScene().add(objects);

      objects.traverse((object: any) => {
        if (!["DirectionalLight", "PointLight", "SpotLight"].includes(object.type)) {
          object.castShadow = true;
          object.receiveShadow = true;
          if (object.name === 'Cube002_1' && object.isMesh) {
            object.material = labelMaterial;
            // Perform the necessary actions here
            // such as opening the menu or changing the texture
          }
        }
      });
    }, undefined, function (error) {
      console.error(error);
    });



    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event: any) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, threeModel.getCamera());

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(threeModel.getScene().children, true);

      for (let i = 0; i < intersects.length; i++) {
        const intersection: any = intersects[i].object;
        if (intersection.name === 'Cube002_1' && intersection.isMesh) {
          console.log("clicked")
          // Perform the necessary actions here
          // such as opening the menu or changing the texture
        }
      }
    }

    window.addEventListener('click', onMouseClick, false);

    threeAnimation.animate();
    threeAnimation.onResize();
    threeAnimation.animateCamera();

  }
}
