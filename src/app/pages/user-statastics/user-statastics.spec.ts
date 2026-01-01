import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatastics } from './user-statastics';

describe('UserStatastics', () => {
  let component: UserStatastics;
  let fixture: ComponentFixture<UserStatastics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStatastics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStatastics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
