import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse) =>{
        if(error){
          switch (error.status){
            case 400:
              if(error.error.errors){
                const modelStateErrors = [];
                for (const key in error.error.errors){
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat();
              }
              else {
                this.toastr.error(error.error, error.status.toString())
              }
              break;
            case 401:
              this.toastr.error('Unathorized', error.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/errors/404')
              break;
            case 500:
              if(request.method === 'GET'){
                const navigationExtras: NavigationExtras = {state: {error: error.error}};
                this.router.navigateByUrl('/errors/server-error', navigationExtras)
              }
              else
                this.toastr.error('Server error', error.status.toString());
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        throw error;
      })
    )
  }
}
