import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: 'first post', content: "content for first post"},
  //   {title: 'second post', content: "content for second post"},
  //   {title: 'third post', content: "content for third post"},
  // ]

  posts: Post[] = [];
  private postsSub: Subscription = new Subscription;
  isLoading = false;

  constructor(public PostsService: PostsService) {}


  ngOnInit() {
    this.isLoading = true
    this.PostsService.getPosts();
    this.postsSub = this.PostsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.PostsService.deletePost(postId)
  }
}
