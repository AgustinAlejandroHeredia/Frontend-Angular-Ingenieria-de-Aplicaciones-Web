import { TestBed } from '@angular/core/testing';

import { CrearOrganizacionService } from './crear-organizacion.service';

describe('CrearOrganizacionService', () => {
  let service: CrearOrganizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearOrganizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
