import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { OffreService } from '../../../services/offre.service';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare const M:any;

@Component({
  selector: 'app-recruteur',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    FilterPipe
  ],
  templateUrl: './recruteur.component.html',
  styleUrl: './recruteur.component.scss'
})
export class RecruteurComponent implements OnInit, AfterViewInit{

  @Input({required: true}) offreSRV!: OffreService;
  @ViewChild('recruteurTabs', { static: true}) tabsRef ?: ElementRef<HTMLUListElement>;
  @ViewChild('offreModal', { static: true}) modalRef ?: ElementRef<HTMLDivElement>;

  offres:any[] = [];
  rechercher:string = '';
  candidats:any[] = [];


  ngOnInit(): void {
    this.recuperOffres();
  }

  ngAfterViewInit(): void {
    if(this.tabsRef?.nativeElement) M.Tabs.init(this.tabsRef?.nativeElement)
    if(this.tabsRef?.nativeElement) M.Modal.init(this.modalRef?.nativeElement)
  }

  private recuperOffres() {
    this.offreSRV.recuperersParRecruteur().subscribe({
      next: reponse => {
        this.offres = reponse;
        console.log(reponse)
      },
      error: erreurs => console.log(erreurs)
    })
  }

  recupererLesCandidat(id:number) {
    this.offreSRV.recupererParId(id).subscribe({
      next: (res:any) => {
        this.candidats = res.candidat;
        console.log(res)
      }
    })
  }

  retenir(offre: any) {
    // Changer le statut de l'offre à 'accepter'
    offre.UtilisateurOffres.statut = 'accepter';
    const email = offre.email;
    
    this.offreSRV.modifierCandidature(email, offre.UtilisateurOffres.offreId, offre.UtilisateurOffres).subscribe({
      next: (rep: any) => {
        // Afficher un message de succès
        M.toast({html: rep.msg, classes: 'rounded green'});
      },
      error: (erreurs) => {
        console.error(erreurs);
        M.toast({html: 'Une erreur est survenue lors de la modification.', classes: 'rounded red'});
      }
    });
  }

  rejeter(offre: any) {
    // Changer le statut de l'offre à 'accepter'
    offre.UtilisateurOffres.statut = 'refuser';
    const email = offre.email;
    
    this.offreSRV.modifierCandidature(email, offre.UtilisateurOffres.offreId, offre.UtilisateurOffres).subscribe({
      next: (rep: any) => {
        // Afficher un message de succès
        M.toast({html: rep.msg, classes: 'rounded green'});
      },
      error: (erreurs) => {
        console.error(erreurs);
        M.toast({html: 'Une erreur est survenue lors de la modification.', classes: 'rounded red'});
      }
    });
  }

}
