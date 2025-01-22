import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plano-view',
  standalone: true,
  imports: [],
  templateUrl: './plano-view.component.html',
  styleUrl: './plano-view.component.css'
})
export class PlanoViewComponent implements OnInit{

  constructor(private route:ActivatedRoute){}

  idPlano: string | null = null;

  async ngOnInit(): Promise<void> {
    this.idPlano = this.route.snapshot.paramMap.get('idPlano')
  }

}
