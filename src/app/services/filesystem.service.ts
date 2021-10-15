import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

@Injectable({
  providedIn: 'root',
})
export class FilesystemService {
  constructor(private fileChooser: FileChooser) {}

  async openFile() {
    const uri = await this.fileChooser.open();
    console.log(uri);
    return uri;
  }
}
