/*

Handles post interactions from the frontend.
- HTTP requests are sent from here
- Frontend Active Database is stored here
- Injected into components using it through @Injectable

*/

// Angular Imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// RxJs Imports
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

// Custom Imports
import { Post } from './post.model';

// Also counted injectable from app.module.ts
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []; // Frontend Posts DB
  private postsUpdated = new Subject<Post[]>(); // Event stream (Subject) for updating posts

  // Import HttpClient
  // Import Router from app-routing.module.ts
  constructor(private http: HttpClient, private router: Router) {}

  // Request full list of posts
  getPosts() {
    this.http

      //Send get request via http protocol to server - returning javascript object of type { message: string; posts: any }
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')

      // format the data through a pipe that changes _id to id.
      .pipe(
        // Asynchronous Map from the observable
        map((postData) => {
          return postData.posts.map((post: any) => {
            // Map Function working through array
            return {
              title: post.title,
              content: post.content,
              id: post._id, // Changing it to fronted id
              imagePath: post.imagePath,
            };
          });
        })
      )

      // Await response asynchronously
      .subscribe((transformedPosts) => {
        // Transformed posts are "piped" through the map function

        // Set frontend array to response
        this.posts = transformedPosts;

        // Send out update to listeners of the subject that posts have updated
        this.postsUpdated.next([...this.posts]);
      });
  }

  // For subscribing to the update event
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // HTTP request to get a single post
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string; // returns the URL of the image on the server
    }>('http://localhost:3000/api/posts/' + id);
  }

  // HTTP Post request for creating a new post
  addPost(title: string, content: string, image: File) {
    // FormData allows the form to send the image back - where Multer handles it
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // The title becomes part of the image URL

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData // This is the FormData object we're sending
      )

      // Image path and ID received from server assignment for frontend DB
      .subscribe((responseData) => {
        // Create post object from response data (contains post object)
        const newPost: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
        };

        // UPDATING LOCAL DB (after successful POST request)

        // Setting the post id for the new post
        newPost.id = responseData.post.id;

        // Adding new post to local db
        this.posts.push(newPost);

        // Trigger event listeners
        this.postsUpdated.next([...this.posts]);

        // Go back to home
        this.router.navigate(['/']);
      });
  }

  // Functionality for using the "EDIT" button on the frontend - Uses PUT request
  // Image may be a file or a string because when the image is uploaded at first, it's a file.
  // When the image remains the same after editing, then it's just a string object.
  updatePost(id: string, title: string, content: string, image: File | string) {
    // null object insurance so postData always exists
    let postData: Post | FormData;

    // Testing for image object type
    if (typeof image === 'object') {
      // Uploading a new image requires FormData (handled by multer)
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title); // Title used as part of filename - image is a file in this instance
    } else {
      // Without a new image, just Javascript object necessary
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image, // A string in this instance
      };
    }

    console.log(postData);
    // Send HTTP request with postData object - either PostData or just object
    this.http
      // Server routing for post manipulation
      .put('http://localhost:3000/api/posts/' + id, postData)

      // On success
      .subscribe((response) => {
        // placeholder array
        const updatedPosts = [...this.posts];

        // Find the post being updated
        const oldPostId = this.posts.findIndex((p) => p.id === id);

        // Create new post for frontend DB
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: '',
        };

        // Update placeholder array
        updatedPosts[oldPostId] = post;

        // Update frontend array
        this.posts = updatedPosts;

        // Trigger event listener
        this.postsUpdated.next({ ...this.posts });

        //Navigate Home
        this.router.navigate(['/']);
      });
  }

  // DELETE HTTP request
  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)

      // On Success
      .subscribe(() => {
        // Placeholder array filters for deleted post
        const updatedPosts = this.posts.filter((post) => post.id !== postId);

        // Update frontend array with placeholder array
        this.posts = updatedPosts;

        // Trigger event listner
        this.postsUpdated.next([...this.posts]);
      });
  }
}
