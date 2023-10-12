import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AbstractHttpDataService} from "./abstract-http.data.service";
import {Repository, Work} from "../../../components/me/me";

@Injectable({
  providedIn: 'root'
})
export class MeDataService extends AbstractHttpDataService{


  constructor(protected override http: HttpClient) {
    super(http);
  }

  fetchRepositories(params? : Map<string, string>): Observable<Repository[]> {
    return this.get(`/projects/repositories`, params);
  }

  fetchWorkExperiences(params? : Map<string, string>): Observable<Work[]> {
    return this.get(`/work/experiences`, params);
  }
}
