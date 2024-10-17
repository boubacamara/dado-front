import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

declare const M:any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  @ViewChild('offreModal', {static: true}) modalRef ?: ElementRef<HTMLDivElement>

  private utilisateurSRV = inject(UtilisateurService);

  utilisateur:any = {};
  avatar:any = {}
  location = inject(Location)

  ngOnInit(): void {

    this.utilisateurSRV.recuperer().subscribe({
      next: (reponse) => {
        this.utilisateur = reponse;

        this.avatar = reponse.media.find((avatar:any) =>  avatar.type === 'avatar')
      },
      error: (erreurs) => console.log(erreurs.error)
    })
  }

  permissionAdmin() {
    return this.utilisateur?.role?.intitule === 'admin'
  }

  permissionAdminOuRecruteur() {
    return (this.utilisateur?.role?.intitule === 'admin' || this.utilisateur?.role?.intitule === 'recruteur') && this.utilisateur.profile;
  }

  deconnexion() {
    this.utilisateurSRV.supprimerLeToken();
    this.location.replaceState(this.location.path())
  }
}

