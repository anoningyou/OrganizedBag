import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("./modules/home/home.module").then(x => x.HomeModule)
  },
  {
    path: 'login',
    loadChildren: () => import("./modules/login/login.module").then(x => x.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import("./modules/register/register.module").then(x => x.RegisterModule)
  },
  {
    path: 'shared',
    loadChildren: () => import("./modules/shared/shared.module").then(x => x.SharedModule)
  },
  {
    path: 'error',
    loadChildren: () => import("./modules/common/errors/errors.module").then(x => x.ErrorsModule)
  },
  {
    path: '**', 
    loadChildren: () => import("./modules/common/errors/errors.module").then(x => x.ErrorsModule),
     pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
