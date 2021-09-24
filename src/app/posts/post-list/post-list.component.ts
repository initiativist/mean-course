// Angular Imports
import { Component, OnDestroy, OnInit } from '@angular/core';

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

  // Import Posts Service
  constructor(public PostsService: PostsService) {}

  ngOnInit() {
    // Start loading animations
    this.isLoading = true;

    // Update Frontend Array in PostsService
    this.PostsService.getPosts();

    // Assign event listener (Subscription) to Posts Service Post Update event
    this.postsSub = this.PostsService.getPostUpdateListener()
      // To execute on activation - returns post array
      .subscribe((posts: Post[]) => {
        // End loading animations
        this.isLoading = false;

        // Update local array
        this.posts = posts;
      });
  }

  // Delete post - Posts service handles array, sends updated list back
  onDelete(postId: string) {
    this.PostsService.deletePost(postId);
  }

  // End Custom Subscription to event listener
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
