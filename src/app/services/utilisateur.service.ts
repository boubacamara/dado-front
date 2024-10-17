import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private url:string = 'https://192.168.1.7:8000/api/';

  private http = inject(HttpClient);
  private router = inject(Router);

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
    return this.http.get<any[]>(this.url+'utilisateurs');
  }
  enregistrerProfile(profileDonnees:any) {
    return this.http.post<any>(this.url+'utilisateur/profile/enregistrer', profileDonnees);
  }

  supprimerMonCompte(jeton:string) {
    return this.http.delete<any>(this.url+`utilisateur/supprimer-${jeton}`);
  }

  suppressionCompteParAdmin(jeton:string, id:number) {
    return this.http.delete<any>(this.url+`utilisateur/supprimer-${jeton}?id=${id}`);
  }

  modifierProfile(profileDonnees:any) {
    return this.http.put<any>(this.url+'utilisateur/profile/modifier', profileDonnees);
  }

  modifierEmail(jeton:string, profileDonnees:any) {
    return this.http.put<any>(this.url+`email/modifie-${jeton}`, profileDonnees);
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

  supprimerLeToken() {
    localStorage.removeItem('jeton')
  }

  deconnexion() {
    return this.http.get<any>(this.url+'utilisateur/deconnexion');
  }
}
