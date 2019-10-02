import { Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'anms-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilelistComponent implements OnInit {
  @Input()
  fileAttachment: FileAttachment;
  constructor() { }

  ngOnInit() {
  }

  onSPOpenFile(urlFile: string, spOpen?: number) {
    if (spOpen == undefined || spOpen == null) spOpen = 0;
    if (spOpen == 0) {
      window.open(urlFile, '_blank');
    }
    else if (spOpen == 1) {
      window.open(urlFile + "?web=1", '_blank');
    }
    console.log(urlFile);
  }
}
export interface FileAttachment { name?: string; urlFile?: string }
