import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipBalancerEditComponent } from './sip-balancer-edit.component';

describe('SipBalancerEditComponent', () => {
  let component: SipBalancerEditComponent;
  let fixture: ComponentFixture<SipBalancerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipBalancerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipBalancerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
