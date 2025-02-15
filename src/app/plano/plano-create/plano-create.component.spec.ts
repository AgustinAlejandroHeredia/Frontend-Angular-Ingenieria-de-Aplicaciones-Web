import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoCreateComponent } from './plano-create.component';

describe('PlanoCreateComponent', () => {
  let component: PlanoCreateComponent;
  let fixture: ComponentFixture<PlanoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
