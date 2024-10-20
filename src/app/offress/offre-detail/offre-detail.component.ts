import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule, ViewportScroller } from '@angular/common';
import { OffreService } from '../../services/offre.service';
import { UtilisateurService } from '../../services/utilisateur.service';

declare const M:any;

@Component({
  selector: 'app-offre-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
],
  templateUrl: './offre-detail.component.html',
  styleUrl: './offre-detail.component.scss'
})

export class OffreDetailComponent implements OnInit{

  private viewportScroller = inject(ViewportScroller);
  offreSRV = inject(OffreService);
  router = inject(Router);
  activedRoute = inject(ActivatedRoute);
  utilisateurSRV = inject(UtilisateurService);

  utilisateur:any = {};

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.recupererUtilisateur()
  }

  private recupererUtilisateur(){
    this.utilisateurSRV.recuperer().subscribe({
      next: (res:any) => this.utilisateur = res,
      error: () => console.log('Erreur interne du serveur')
    })
  }

  postuler() {
    const id = +this.activedRoute.snapshot.params['id'];
    this.offreSRV.postuler(id).subscribe({
      next: (response:any) => {
        M.toast({html: response.msg, displayLength: 1000, classes: 'white teal-text text-darken-4'})
        this.router.navigateByUrl('/');
      },
      error: (erreurs) => console.log(erreurs)
    })
  }

}
