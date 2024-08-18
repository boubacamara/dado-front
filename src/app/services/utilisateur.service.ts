import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private url:string = 'http://localhost:8000/api/';

  private http = inject(HttpClient);

  enregistrerCandidat(candidatDonnees:any){
    return this.http.post<string>(this.url+'candidat/enregistrer', candidatDonnees);
  }

  enregistrerRecruteur(recruteurDonnees:any){
    return this.http.post<string>(this.url+'recruteur/enregistrer', recruteurDonnees);
  }

  recuperer() {
    return this.http.get<any>(this.url+`utilisateur`);
  }

  recupererPourAdmin(id:number) {
    return this.http.get<any>(this.url+`utilisateur?id=${id}`);
  }

  recupererUtilisateurs() {
    return this.http.get<any>(this.url+'utilisateurs');
  }
  enregistrerProfile(profileDonnees:any) {
    return this.http.post<any>(this.url+'utilisateur/profile/enregistrer', profileDonnees);
  }

  supprimerMonCompte(jeton:string) {
    return this.http.delete<any>(this.url+`utilisateur/supprimer-${jeton}`);
  }

  modifierProfile(profileDonnees:any) {
    return this.http.put<any>(this.url+'utilisateur/profile/modifier', profileDonnees);
  }

  connexion(utilisateurDonnees:any) {
    return this.http.post<any>(this.url+'connexion', utilisateurDonnees);
  }

  creerJeton(jeton:any) {
    localStorage.setItem('jeton', jeton);
  }

  recuperJeton() {
    return localStorage.getItem('jeton') ?? '';
  }

  estConnecte() {
    return !!this.recuperJeton();
  }

  deconnexion() {
    localStorage.removeItem('jeton');
  }
}