import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoModComponent } from './proyecto-mod.component';

describe('ProyectoModComponent', () => {
  let component: ProyectoModComponent;
  let fixture: ComponentFixture<ProyectoModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoModComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
