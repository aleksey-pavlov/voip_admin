/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClientsEditComponent } from './clients-edit.component';

describe('ClientsEditComponent', () => {
  let component: ClientsEditComponent;
  let fixture: ComponentFixture<ClientsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
