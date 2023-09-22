import {Injectable} from '@angular/core';
import {MeDataService} from "../../shared/services/data/me.data.service";
import {Observable} from "rxjs";
import {Repository} from "./me";

@Injectable({
  providedIn: 'root'
})
export class MeService {


  constructor(private readonly meDataService : MeDataService ) {
  }

  fetchGithubRepositories(params? : Map<string, string>): Observable<Repository[]> {
    return this.meDataService.fetchRepositories(params)
  }

}
