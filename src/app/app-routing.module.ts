// Routing module for the app (from home)

//Angular Imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component Imports
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  {path: '', component: PostListComponent }, // Home
  {path: 'create', component: PostCreateComponent}, // New Post
  {path: 'edit/:postId', component: PostCreateComponent}, // Edit Post (handled by newpost component)
  {path: 'login', component: LoginComponent}, // Login
  {path: 'signup', component: SignupComponent}, // signup
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
