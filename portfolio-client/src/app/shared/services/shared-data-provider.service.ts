import {Injectable} from "@angular/core";
import {MeService} from "../../components/me/me.service";
import {lastValueFrom, Subject} from "rxjs";
import {Repository, Work} from "../../components/me/me";
import {InteractiveGeometry, ThreeModelBuilder} from "../../components/three-model/three-model";
import {ThreeModelBuilderService} from "../../components/three-model/three-model-builder.service";

//json configuration
import * as threeModelConfig from '../../../assets/json/three-config.json';
import * as darkModeLightConfig from '../../../assets/json/lights_dark-mode.json';
import * as materialConfig from '../../../assets/json/materials.json';
import * as interactiveMapConfig from '../../../assets/json/interactive-map.json';

@Injectable({providedIn : 'root'})
export class SharedDataProviderService {

  showMeSubject$ = new Subject<boolean>();

  private _repositories: Repository[] = [];
  showHeaderSubject$ = new Subject<boolean>();
  showGreetingSubject$ = new Subject<boolean>();

  constructor(private readonly meService : MeService,
              private threeModelBuilderService : ThreeModelBuilderService) {
  }

  private _threeModelBuilder? : ThreeModelBuilder = new ThreeModelBuilder();

  get repositories(): Repository[] {
    return this._repositories;
  }

  private _experiences: Work[] = [];

  get experiences(): Work[] {
    return this._experiences;
  }

  private _showMe: boolean = false;

  get threeModelBuilder(): ThreeModelBuilder {
    return this._threeModelBuilder!;
  }

  get showMe(): boolean {
    return this._showMe;
  }

  set showMe(value: boolean) {
    this._showMe = value;
  }

  set threeModelBuilder(value: ThreeModelBuilder) {
    this._threeModelBuilder = value;
  }

  private _interactiveIcons : any[] = [];

  get interactiveIcons(): any[] {
    return this._interactiveIcons;
  }

  set interactiveIcons(value: any[]) {
    this._interactiveIcons = value;
  }

  private _showHeader: boolean = false;

  get showHeader(): boolean {
    return this.showHeader;
  }

  set showHeader(value: boolean) {
    this.showHeader = value;
  }

  private _showGreeting: boolean = false;

  get showGreeting(): boolean {
    return this.showGreeting;
  }

  set showGreeting(value: boolean) {
    this.showGreeting = value;
  }

  fetchWorkAndProjects() : Promise<void> {
    const repositories$ = this.meService.fetchGithubRepositories();
    const repositoriesPromise = lastValueFrom(repositories$);

    const experiences = this.meService.fetchWorkExperiences();
    const experiencesPromise = lastValueFrom(experiences);

    return Promise.all([repositoriesPromise, experiencesPromise]).then((values) => {
      this._repositories = values[0];
      this._experiences = values[1];
    });
  }

  prepareThreeModelBuilder(): Promise<void> {
    return new Promise((resolve, reject) => {
      const scene = this.threeModelBuilderService.createScene(threeModelConfig.scene);
      const camera = this.threeModelBuilderService.createCamera(threeModelConfig.camera);
      const lights = this.threeModelBuilderService.createLights(darkModeLightConfig);
      const materials = this.threeModelBuilderService.createMaterials(materialConfig, true);

      const geometry = this.threeModelBuilderService.createGeometry(scene, materials, materialConfig, interactiveMapConfig.interactiveMap, false)
        .then(() => {
          resolve({ scene, camera, lights, materials, geometry });
        })
        .catch((error) => {
          reject(error);
        });
    })
      .then((value: any) => {
        this.threeModelBuilder.setScene(value.scene);
        this.threeModelBuilder.setCamera(value.camera);
        this.threeModelBuilder.setLights(value.lights);
        this.threeModelBuilder.setMaterials(value.materials);
        this.threeModelBuilder.setGeometry(value.geometry);
        this._interactiveIcons = this.findInteractiveIcons(
          this.threeModelBuilderService.getInteractiveGeometries(),
          materialConfig.materials
        );
      })
      .catch((error) => {
        console.error("Error during prepareThreeModelBuilder:", error);
      });
  }


  findInteractiveIcons(meshes: InteractiveGeometry[], materials: any[]): any[] {
    const interactiveIconsData: any[] = [];
    materials.map((value, index) => {
      meshes.map((value1, index1) => {
        if (value.parentObject === value1.mesh) {
          value1.children?.map((value2, index2) => {
            interactiveIconsData.push({
              parentMesh: value.parentObject,
              childrenConfig: value.items.find((element: any) => element?.identifier === value2)
            })
          })
        }
      })
    });
    return interactiveIconsData;
  }
}
