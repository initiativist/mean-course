// Routing module for the app (from home)

//Angular Imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component Imports
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {path: '', component: PostListComponent }, // Home
  {path: 'create', component: PostCreateComponent}, // New Post
  {path: 'edit/:postId', component: PostCreateComponent} // Edit Post (handled by newpost component)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
