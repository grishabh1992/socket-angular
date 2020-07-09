import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinAppComponent } from './join-app.component';

describe('JoinAppComponent', () => {
  let component: JoinAppComponent;
  let fixture: ComponentFixture<JoinAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
