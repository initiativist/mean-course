import { stripGeneratedFileSuffix } from "@angular/compiler/src/aot/util"

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
}
