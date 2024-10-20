import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private http = inject(HttpClient)

  private uri:string =  environment.apiUrl;

  enregistrerOffre(offreDonnees:any) {
    return this.http.post<any>(this.uri+'offre/enregistrer', offreDonnees)
  }

  recupererParId(id:number):Observable<any[]> {
    return this.http.get<any>(this.uri+`offre/${id}/recuperer`);
  }

  recuperers(): Observable<any[]> {
    return this.http.get<any>(this.uri+'offre/recuperers').pipe(
      tap(reponse => reponse)
    )
  }

  recuperersParRecruteur() {
    return this.http.get<any>(this.uri+'offre/recruteur/recuperers');
  }

  modifierOffre(id: number, offreDonnees: any) {
    return this.http.put<any>(`${this.uri}offre/${id}/modifier`, offreDonnees);
  }

  accepterCandidature(offreId:number, candidatId:number, data:any) {
    return this.http.put<any>(`${this.uri}candidat/${offreId}/${candidatId}/accepter`, data);
  }

  refuserCandidature(offreId:number, candidatId:number, data:any) {
    return this.http.put<any>(`${this.uri}candidat/${offreId}/${candidatId}/refuser`, data);
  }

  supprimer(id:number) {
    return this.http.delete<any>(this.uri+`offre/${id}/supprimer`);
  }

  postuler(id:number) {
    return this.http.get(this.uri+`offre/${id}/candidature`);
  }

  supprimerCandidature(id:number) {
    return this.http.delete(this.uri+`offre/${id}/candidature-suppression`);
  }
}
