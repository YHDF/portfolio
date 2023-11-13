import {Injectable} from "@angular/core";
import {MeService} from "../../components/me/me.service";
import {lastValueFrom} from "rxjs";
import {Repository, Work} from "../../components/me/me";

@Injectable({providedIn : 'root'})
export class SharedDataProviderService {

  constructor(private readonly meService : MeService) {
  }

  private _repositories: Repository[] = [];

  get repositories(): Repository[] {
    return this._repositories;
  }

  private _experiences: Work[] = [];

  get experiences(): Work[] {
    return this._experiences;
  }

  private _showMe: boolean = false;

  get showMe(): boolean {
    return this._showMe;
  }

  set showMe(value: boolean) {
    this._showMe = value;
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
}
