// Angular Imports
import { Component, OnDestroy, OnInit } from '@angular/core';

// Material Imports
import { PageEvent } from '@angular/material/paginator';

// Package Imports
import { Subscription } from 'rxjs';

// Custom Imports
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // Implements onDestroy for destroying custom-made observables

  // Postlist frontend DB
  posts: Post[] = [];

  // Subscription to Update Posts event listener in Posts Service
  private postsSub: Subscription = new Subscription();

  // For loading components
  isLoading = false;

  // For Pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  // Import Posts Service
  constructor(public PostsService: PostsService) {}

  ngOnInit() {
    // Start loading animations
    this.isLoading = true;

    // Update Frontend Array in PostsService
    this.PostsService.getPosts(this.postsPerPage, this.currentPage);

    // Assign event listener (Subscription) to Posts Service Post Update event
    this.postsSub = this.PostsService.getPostUpdateListener()
      // To execute on activation - returns post array
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        // End loading animations
        this.isLoading = false;

        // Update local array
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
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
  }
}
