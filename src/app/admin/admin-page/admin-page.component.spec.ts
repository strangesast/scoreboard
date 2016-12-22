/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminPageComponent } from './admin-page.component';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRoute } from '@angular/router'; 
import { ActivatedRouteStub } from '../../../testing/router-stubs';

import { AdminService } from '../admin.service';
import { GameService } from '../../games/game.service';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPageComponent ],
      providers: [
        AdminService,
        GameService,
        { provide: ActivatedRoute,
          useClass: ActivatedRouteStub }
      ],
      imports: [
        RouterTestingModule.withRoutes([]) // future routes here
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
