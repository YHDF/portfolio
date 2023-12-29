import {Injectable} from "@angular/core";
import {MeService} from "../../components/me/me.service";
import {lastValueFrom, Subject} from "rxjs";
import {Repository, Work} from "../../components/me/me";
import {InteractiveGeometry, ThreeModelBuilder} from "../../components/three-model/three-model";
import {ThreeModelBuilderService} from "../../components/three-model/three-model-builder.service";
import {InternationalizationLangService} from "./internationalization-lang.service";
import {THREE} from "../../components/three-model/three-wrapper";

//json configuration
import * as threeModelConfig from '../../../assets/json/three-config.json';
import * as darkModeLightConfig from '../../../assets/json/lights_dark-mode.json';
import * as lightModeLightConfig from '../../../assets/json/lights_light-mode.json';
import * as materialConfig from '../../../assets/json/materials.json';
import * as interactiveMapConfig from '../../../assets/json/interactive-map.json';
import * as contactInfoConfig from '../../../assets/json/contact-info.json';

@Injectable({providedIn : 'root'})
export class SharedDataProviderService {
  static EMPTY_NULL_MESSAGE;

  static {
    this.EMPTY_NULL_MESSAGE = "";
  }


  showMeSubject$ = new Subject<boolean>();

  private _repositories: Repository[] = [];
  showHeaderSubject$ = new Subject<boolean>();
  showGreetingSubject$ = new Subject<boolean>();
  showIndicatorsSubject$ = new Subject<boolean>();
  AlertInfoSubject$ = new Subject<AlertInfo>();
  languageChangeSubject$ = new Subject<boolean>();

  constructor(private readonly meService : MeService,
              readonly internationalizationLangService : InternationalizationLangService,
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

  private _isThreeModelHidden: boolean = false;

  get threeModelBuilder(): ThreeModelBuilder {
    return this._threeModelBuilder!;
  }

  get showMe(): boolean {
    return this._showMe;
  }

  set showMe(value: boolean) {
    this._showMe = value;
  }


  get isThreeModelHidden(): boolean {
    return this._isThreeModelHidden;
  }

  set isThreeModelHidden(value: boolean) {
    this._isThreeModelHidden = value;
  }

  set threeModelBuilder(value: ThreeModelBuilder) {
    this._threeModelBuilder = value;
  }

  private _interactiveIcons : any[] = [];

  private _lightModelights : THREE.Light[] = [];

  get lightModelights(): THREE.Light[] {
    return this._lightModelights;
  }

  get interactiveIcons(): any[] {
    return this._interactiveIcons;
  }

  set interactiveIcons(value: any[]) {
    this._interactiveIcons = value;
  }

  set lightModelights(value: THREE.Light[]) {
    this._lightModelights = value;
  }

  private _darkModelights : THREE.Light[] = [];

  get darkModelights(): THREE.Light[] {
    return this._darkModelights;
  }

  set darkModelights(value: THREE.Light[]) {
    this._darkModelights = value;
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

  private _showIndicators: boolean = false;

  private _showAlert: boolean = false;

  get showIndicators(): boolean {
    return this._showIndicators;
  }

  set showIndicators(value: boolean) {
    this._showIndicators = value;
  }


  get showAlert(): boolean {
    return this._showAlert;
  }

  set showAlert(value: boolean) {
    this._showAlert = value;
  }

  private _contactInfo : any;

  get contactInfo(): any {
    return this._contactInfo;
  }

  set contactInfo(value: any) {
    this._contactInfo = value;
  }

  private _alertMessage: string = "";


  get alertMessage(): string {
    return this._alertMessage;
  }

  set alertMessage(value: string) {
    this._alertMessage = value;
  }

  private _canvas : HTMLElement | any;

  get canvas(): any {
    return this._canvas;
  }

  set canvas(value: any) {
    this._canvas = value;
  }

  loadContactInfo() {
    const contactInfoArr : any[] = [];
    this._contactInfo = {...contactInfoConfig}
    const contactInfoValues: any[] = [...Object.values(this._contactInfo)]
    contactInfoValues.splice(-1);
    for(let index = 0; index < contactInfoValues.length; index++){
      contactInfoArr.push(contactInfoValues[index])
    }
    return contactInfoArr;
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
      const darkLights = this.threeModelBuilderService.createLights(darkModeLightConfig);
      const lightLights = this.threeModelBuilderService.createLights(lightModeLightConfig);
      const materials = this.threeModelBuilderService.createMaterials(materialConfig, true);
      const geometry = this.threeModelBuilderService.createGeometry(scene, materials, materialConfig, interactiveMapConfig.interactiveMap, false)
        .then(() => {
          resolve({ scene, camera, darkLights, lightLights, materials, geometry });
        })
        .catch((error) => {
          reject(error);
        });
    })
      .then((value: any) => {
        this.lightModelights = value.lightLights
        this.darkModelights = value.darkLights
        this.threeModelBuilder.setScene(value.scene);
        this.threeModelBuilder.setCamera(value.camera);
        this.threeModelBuilder.setLights(value.darkLights);
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

export type AlertInfo = {
  showAlert: boolean;
  alertMessage: string;
  alertOperationType : AlertOperationType
};

export enum AlertOperationType {
  NA,
  SYNC,
  ASYNC,
}
