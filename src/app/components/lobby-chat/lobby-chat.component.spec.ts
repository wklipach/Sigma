import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyChatComponent } from './lobby-chat.component';

describe('LobbyChatComponent', () => {
  let component: LobbyChatComponent;
  let fixture: ComponentFixture<LobbyChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LobbyChatComponent]
    });
    fixture = TestBed.createComponent(LobbyChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
