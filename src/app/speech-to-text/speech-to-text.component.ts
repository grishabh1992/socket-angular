import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { VoiceRecognitionService } from '../services/voice.recognition.service';
@UntilDestroy()
@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.scss']
})
export class SpeechToTextComponent implements OnInit {
  @Output()
  processedText = new EventEmitter<string>();
  isRunning = false;
  constructor(
    private voiceRecognitionService : VoiceRecognitionService
  ) {
    this.voiceRecognitionService.init({
      isManualStop : false
    });

  }

  ngOnInit() {
    this.voiceRecognitionService.words$.pipe(untilDestroyed(this)).subscribe((data)=> {
      this.isRunning = false;
      this.processedText.emit(data);
    });
  }

  startMic() {
    this.voiceRecognitionService.start();
    this.isRunning = true;
  }

}
