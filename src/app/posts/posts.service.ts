import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PostCreateComponent } from './post-create/post-create.component';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  internalCopyPost(oldPost: Post | undefined) {
    //instead of spread since spread returns undefined on types if they are empty and strict mode won't allow it
    if (typeof oldPost === 'object') {
      const newPost: Post = {
        id: oldPost.id,
        title: oldPost.title,
        content: oldPost.content,
        imagePath: oldPost.imagePath
      };
      return newPost;
    } else {
      const p: Post = { id: '', title: '', content: '', imagePath: '' };
      return p;
    }
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        const newPost: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        const id = responseData.post.id;
        newPost.id = id;
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content, imagePath: null };
    console.log('post created');
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(() => {
        const updatedPosts = [...this.posts];
        const oldPostId = this.posts.findIndex((p) => p.id === id);
        updatedPosts[oldPostId] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next({ ...this.posts });
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
