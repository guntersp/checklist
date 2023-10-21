import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistComponent } from './checklist/checklist.component';
import { ListAllComponent } from './list-all/list-all.component';

const routes: Routes = [
  {
    path: ':category/:checklist',
    component: ChecklistComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ListAllComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: ':category',
    component: ListAllComponent,
    //canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
