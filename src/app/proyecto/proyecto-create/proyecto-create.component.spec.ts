import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoCreateComponent } from './proyecto-create.component';

describe('ProyectoCreateComponent', () => {
  let component: ProyectoCreateComponent;
  let fixture: ComponentFixture<ProyectoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
