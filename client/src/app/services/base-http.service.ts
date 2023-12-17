import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export abstract class BaseHttpService {
  protected baseUrl = environment.apiUrl;
  protected get rootUrl() {return `${this.baseUrl}${this.controllerName}/`};

    constructor(
        protected http: HttpClient,
        protected controllerName: string
        ) {
          if(this.controllerName.endsWith('/'))
            this.controllerName.slice(this.controllerName.length -1, 1);
          if(!this.baseUrl.endsWith('/'))
            this.baseUrl = `${this.baseUrl}/`
      }
}