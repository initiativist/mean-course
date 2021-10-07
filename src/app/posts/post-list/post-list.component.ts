// Angular Imports
import { Component, OnDestroy, OnInit } from '@angular/core';

// Material Imports
import { PageEvent } from '@angular/material/paginator';

// Package Imports
import { Subscription } from 'rxjs';

// Custom Imports
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // Implements onDestroy for destroying custom-made observables

  // Postlist frontend DB
  posts: Post[] = [];

  // Subscriptions
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription;

  public userIsAuthenticated = false;
  public userId: string;

  // For loading components
  isLoading = false;

  // For Pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  // Import Posts Service
  constructor(
    public PostsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Start loading animations
    this.isLoading = true;

    // Update Frontend Array in PostsService
    this.PostsService.getPosts(this.postsPerPage, this.currentPage);

    this.userId = this.authService.getUserId();

    this.postsSub = this.PostsService.getPostUpdateListener().subscribe(
      (postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      }
    );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.PostsService.getPosts(this.postsPerPage, this.currentPage);
  }

  // Delete post - Posts service handles array, sends updated list back
  onDelete(postId: string) {
    this.isLoading = true;
    this.PostsService.deletePost(postId).subscribe(() => {
      this.PostsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  // End Custom Subscription to event listener
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
