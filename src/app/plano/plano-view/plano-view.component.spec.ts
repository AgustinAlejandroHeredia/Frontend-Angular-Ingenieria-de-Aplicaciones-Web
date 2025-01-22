import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoViewComponent } from './plano-view.component';

describe('PlanoViewComponent', () => {
  let component: PlanoViewComponent;
  let fixture: ComponentFixture<PlanoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
