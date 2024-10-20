import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class EntrepriseService {

  private uri:string = environment.apiUrl;
  private http = inject(HttpClient);

  recuper(id:number) {
    return this.http.get<any>(this.uri+`entreprise/${id}/recuperer`)
  }
  enregistrerEntreprise(entrepriseDonnees:any) {
    return this.http.post<any>(this.uri+'entreprise/enregistrer', entrepriseDonnees)
  }

  modifier(id:number, entrepriseDonnees:any) {
    return this.http.put<any>(this.uri+`entreprise/${id}/modifier`, entrepriseDonnees)
  }

  supprimer(id:number) {
    return this.http.delete<any>(this.uri+`entreprise/${id}/supprimer`)
  }
}
