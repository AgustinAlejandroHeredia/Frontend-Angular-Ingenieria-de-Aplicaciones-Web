import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearOrganizacionComponent } from './crear-organizacion.component';

describe('CrearOrganizacionComponent', () => {
  let component: CrearOrganizacionComponent;
  let fixture: ComponentFixture<CrearOrganizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearOrganizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearOrganizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
