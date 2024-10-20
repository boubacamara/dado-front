import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { OffreService } from '../../../services/offre.service';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  @ViewChild('accepter', { static: true}) accepterRef ?: ElementRef<HTMLButtonElement>;

  recruteurSRV = inject(UtilisateurService)
  router = inject(Router);
  offres:any[] = [];
  rechercher:string = '';
  candidats:any[] = [];
  recruteur:any = {};
  candidatId:number = 0;
  offreId:number = 0;
  candidatAccepter:any = {
    statut: 'accepter'
  };


  ngOnInit(): void {
    this.recruteurSRV.recuperer().subscribe({
      next: (res) => this.recruteur = res
    })
    this.recuperOffres();
  }

  ngAfterViewInit(): void {
    if(this.tabsRef?.nativeElement) M.Tabs.init(this.tabsRef?.nativeElement)
    if(this.modalRef?.nativeElement) M.Modal.init(this.modalRef?.nativeElement)
    if(this.accepterRef?.nativeElement) M.Modal.init(this.accepterRef?.nativeElement)
  }

  private recuperOffres() {
    this.offreSRV.recuperersParRecruteur().subscribe({
      next: reponse => {
        this.offres = reponse;
      },
      error: erreurs => console.log(erreurs)
    })
  }

  recupererLesCandidat(id:number) {
    this.offreId = id;
    this.offreSRV.recupererParId(id).subscribe({
      next: (res:any) => {
        console.log(res)
        this.candidats = res.candidat;
        console.log(res)
      }
    })
  }

  retenir() {
    this.offreSRV.accepterCandidature(this.offreId, this.candidatId, this.candidatAccepter).subscribe({
      next: (res:any) => {
        M.toast({html: res.msg, classes: 'rounded green darken-4'});
        setTimeout(()=> window.location.reload(), 200)
      },
      error: (_) => console.log('Le serveur na puis répondre')
    });
  }

  rejeter(candidatId:number) {
    this.offreSRV.refuserCandidature(this.offreId, candidatId, {statut: 'refuser'}).subscribe({
      next: (res:any) => {
        M.toast({html: res.msg, classes: 'rounded green darken-4'});
        setTimeout(()=> window.location.reload(), 200)
      },
      error: (_) => M.toast({html: 'Le serveur na puis répondre', classes: 'rounded red'})
    });
  }

  recupererCandidatId(id: number) {
    this.candidatId = id;
  }

}
