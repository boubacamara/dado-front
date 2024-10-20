import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private url:string = environment.apiUrl;
  private http = inject(HttpClient);

  recuperer(id:number) {
    return this.http.get<any[]>(this.url+`categorie/${id}/recuperer`);
  }

  enregistrerCategorie(categorieDonnees:any) {
    return this.http.post<any>(this.url+'categorie/enregistrer', categorieDonnees);
  }

  getCategories() {
    return this.http.get<any[]>(this.url+'categorie/recuperers');
  }

  modifier(id:number, categorieDonnees:any) {
    return this.http.put<any[]>(this.url+`categorie/${id}/modifier`, categorieDonnees);
  }

  supprimer(id:number) {
    return this.http.delete<any[]>(this.url+`categorie/${id}/supprimer`);
  }


}
