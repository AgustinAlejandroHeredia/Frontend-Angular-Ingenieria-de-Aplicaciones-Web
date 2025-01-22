import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaRolesComponent } from './prueba-roles.component';

describe('PruebaRolesComponent', () => {
  let component: PruebaRolesComponent;
  let fixture: ComponentFixture<PruebaRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
