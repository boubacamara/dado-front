import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { OffreService } from '../../../services/offre.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { Router, RouterModule } from '@angular/router';


declare const M:any;

@Component({
  selector: 'app-candidat',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    FilterPipe
  ],
  templateUrl: './candidat.component.html',
  styleUrl: './candidat.component.scss'
})


export class CandidatComponent implements OnInit, AfterViewInit{

  @Input({required: true}) offreSRV!: OffreService;
  @Input({required: true}) utilisateurSRV!: UtilisateurService;

  @ViewChild('tabsCandidat', {static: true}) tabsCandidatRef ?: ElementRef<HTMLUListElement>;

  router = inject(Router);

  rechercher:any = ''
  listeOffres:any[] = []
  utilisateur:any = {}

  ngOnInit(): void {
    this.recuperOffres()
    this.recuperUtilisateur()
  }

  ngAfterViewInit(): void {
    this.initialisationTabs()
  }

  afficherStatutCandidature(statut:string) {

    if(statut === 'attente') return `En attente d'examen`;
    if(statut === 'accepter') return 'Votre candidature est acceptée';
    if(statut === 'refuser') return 'Candidature non retenue';
    return null;
  }

  private recuperOffres() {
    this.offreSRV.recuperers().subscribe({
      next: (reponse: any[]) => {
        this.listeOffres = reponse;
        console.log(reponse)
      },
      error: (erreurs) => console.log(erreurs)
    })
  }

  private recuperUtilisateur() {
    this.utilisateurSRV.recuperer().subscribe({
      next: (reponse )=> {
        this.utilisateur = reponse;
        console.log(reponse)
      },
      error: (erreurs) => console.log(erreurs)
    })
  }
  
  supprimerCandidature(id:number) {
    this.offreSRV.supprimerCandidature(id).subscribe({
      next: (rep:any) => {
        M.toast({html: rep.msg, classes: 'rounded green'})
        this.recuperUtilisateur();
      },
      error: (erreurs) => console.log(erreurs)
    })
  }

  initialisationTabs() {
    if(this.tabsCandidatRef?.nativeElement) M.Tabs.init(this.tabsCandidatRef?.nativeElement)
  }
}