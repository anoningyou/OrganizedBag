import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';


const routes: Routes = [
  {path: '', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**',component: NotFoundComponent,pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
