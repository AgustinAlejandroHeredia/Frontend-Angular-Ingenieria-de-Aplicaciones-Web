import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecortesComponent } from './recortes.component';

describe('RecortesComponent', () => {
  let component: RecortesComponent;
  let fixture: ComponentFixture<RecortesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecortesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecortesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
