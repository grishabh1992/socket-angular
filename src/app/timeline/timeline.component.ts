import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {

  @Input() headerText: string;
  @Input() isLoading = true;
  @Input() lastGroup = false;

  constructor() { }

}
