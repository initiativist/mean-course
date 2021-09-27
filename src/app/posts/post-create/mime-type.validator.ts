import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// externally accessible mimetype validator
export const mimeType = (
  control: AbstractControl // FormControl with data
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  // If FormControl Image has a url instead of a file, return nothing
  if (typeof(control.value) === "string") {
    return of(null);
  }
  // Grab control value
  const file = control.value as File;

  // instantiate reader
  const fileReader = new FileReader();

  // Create validity observable
  const frObs = Observable.create( // TODO: fix observable from deprecated
    (observer: Observer<{ [key: string]: any }>) => {
      // When file is loaded event
      fileReader.addEventListener('loadend', () => {
        // Place filedata into array for analyzation
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );

        // iterate through filedata array to develop fileheader
        let header = '';
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        };

        // Validate header against known filetypes
        switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }

        // Return null if valid, or else error in Javascript Object
        if (isValid ) {
          observer.next(null);
        } else {
          observer.next({invalidMimeType: true})
        }

        // Close observable
        observer.complete();
      });

      // Kickoff observable
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
