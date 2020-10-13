import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JoinAppComponent } from './join-app/join-app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './materila.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketService } from './services/socket.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { RequestInterceptor } from './services/request.interceptor';
import { ResponseInterceptor } from './services/response.interceptor';
import { TypingIndicatorComponent } from './typing-indicator/typing-indicator.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ConversationComponent } from './conversations/conversations.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { VoiceRecognitionService } from './services/voice.recognition.service';
import { VideoComponent } from './video/video.component';
import { VideoService } from './services/video.service';

@NgModule({
  declarations: [
    AppComponent,
    JoinAppComponent,
    DashboardComponent,
    UsersComponent,
    ConversationComponent,
    MessagesComponent,
    TypingIndicatorComponent,
    TimelineComponent,
    SpeechToTextComponent,
    VideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    SocketService,
    APIService,
    StorageService,
    VoiceRecognitionService,
    VideoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
