import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface SpeechRecgnitionConf {
  isManualStop: boolean;
}

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  conf: SpeechRecgnitionConf;
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords;

  words$ = new Subject<string>();
  error$ = new Subject<string>();
  stop$ = new Subject();
  constructor() { }

  init(conf: SpeechRecgnitionConf) {
    this.conf = conf;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e) => {
      // var transcript = event.results[0][0].transcript;
      // var confidence = event.results[0][0].confidence;

      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
    // this.recognition.addEventListener('start', (e) => {
    //   console.log("<small>listening, please speak...</small>");
    // });

    if (!conf.isManualStop) {
      this.recognition.addEventListener('speechend', (e) => {
        console.log('Speech end...');
        this.stop();
      });
    }
    this.recognition.addEventListener('nomatch', (e) => {
      console.log('nomatch', e);
      this.error$.next('No mtach found')
    });

    this.recognition.addEventListener('error', (e) => {
      console.log('error', e);
      this.error$.next('Error')
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log('Speech recognition started');
    if (this.conf.isManualStop) {
      this.recognition.addEventListener('end', (condition) => {
        if (this.isStoppedSpeechRecog) {
          this.recognition.stop();
          console.log('End speech recognition')
        } else {
          this.wordConcat()
          this.recognition.start();
        }
      });
    }
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log('End speech recognition');
    this.stop$.next();
  }

  wordConcat() {
    if (this.conf.isManualStop) {
      this.text = `${this.text}${this.text ? ' ' : ''}${this.tempWords}.`;
    } else {
      this.text = this.tempWords;
    }
    this.tempWords = '';
    this.words$.next(this.text);
  }
}
