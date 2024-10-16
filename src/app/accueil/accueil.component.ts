import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { OffreService } from '../services/offre.service';
import { FilterPosteLieuPipe } from '../pipes/filter-poste-lieu.pipe';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    NavbarComponent,
    FilterPosteLieuPipe
],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})

export class AccueilComponent implements OnInit{
  
  private offreSRV = inject(OffreService);

  offres:any[] = [];
  poste:string = '';
  lieu:string = '';

  ngOnInit(): void {
    this.recuperOffres();
  }

  private recuperOffres() {
    this.offreSRV.recuperers().subscribe({
      next: res => {
        this.offres = res
        console.log(res)
      },
      error: () => console.log('Erreur interne du serveur')
    })
  }
}
