import { TestBed } from '@angular/core/testing';

import { RecortesService } from './recortes.service';

describe('RecortesService', () => {
  let service: RecortesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecortesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
