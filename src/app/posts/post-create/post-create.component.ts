// Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

// Custom Imports
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  // Constants for form functionality
  enteredContent = '';
  enteredTitle = '';
  isLoading = false;

  // Using form group for a reactive form
  form: FormGroup = new FormGroup({});
  imagePreview: string = '';

  // Determine between create and edit modes
  private mode = 'create';
  private postId = '';

  // Post to update based on form
  post: Post = { id: '', title: '', content: '', imagePath: null };

  // import posts service ++ activated route to determine active url
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  // Angular Constructor
  ngOnInit() {
    this.form = new FormGroup({
      // Reactive form with three inputs: Title, Content, Field
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType], // Custom validator for JPG and PNG filetypes (Async for operation time)
      }),
    });

    // Retreive route information, and on success ->
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // If URL has an id in it, then we're in edit mode, need to show data from backend that we're editing
      if (paramMap.has('postId')) {
        this.mode = 'edit';

        // Set id from edit URL
        this.postId = String(paramMap.get('postId'));

        // Start loading animations
        this.isLoading = true;

        // Get post from backend
        this.postsService.getPost(this.postId).subscribe((post) => {
          // On success, end loading animations
          this.isLoading = false;

          // Post object from response
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath, // Should be a string or empty!
          };

          // Set Value recreates the reactive form with values in it.
          this.form.setValue({
            image: this.post.imagePath, // Here's the URL or empty we should have
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        //if URL does not have an id in it, we're in create mode. Form is empty
        this.mode = 'create';
      }
    });
  }

  // After image uploaded to image element
  onImagePicked(event: Event) {
    // Force non null (!) because event will always return file.
    const file = (event.target as HTMLInputElement).files![0];

    // Change single value in reactive form
    this.form.patchValue({ image: file });

    // Validate image
    this.form.get('image')?.updateValueAndValidity();

    // Render file on frontend
    const reader = new FileReader();

    // Set handler for completing file load
    reader.onload = () => {

      // reader.result contains a url to load the image from
      this.imagePreview = reader.result as string;
    };

    // Kickoff reader loading
    reader.readAsDataURL(file);
  }

  // Event for clicking "Save Post" button on edit or create pages
  onSavePost() {
    // Check form validity - no action taken, handler doesn't run because of premature return
    if (this.form.invalid) {
      return;
    }
    // Start loading animations
    this.isLoading = true;

    // Check for update vs create modes
    if (this.mode === 'create') {
      // Create mode - add a post with posts Service
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      // Edit mode, update post with posts service
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image // may contain string or file 🤷‍♂️
      );
    }

    // clears the form!
    this.form.reset();
  }
}
