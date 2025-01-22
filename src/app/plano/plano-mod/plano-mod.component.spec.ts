import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoModComponent } from './plano-mod.component';

describe('PlanoModComponent', () => {
  let component: PlanoModComponent;
  let fixture: ComponentFixture<PlanoModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoModComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
