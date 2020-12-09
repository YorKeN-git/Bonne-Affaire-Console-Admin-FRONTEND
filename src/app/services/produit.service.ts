import { Injectable } from '@angular/core';
import { Produit } from '../modeles/produit';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  public produit$ = new Subject<Produit[]>();
  constructor(private http: HttpClient) { }

  private produit: Produit[] = [];

  addProduit(produit: Produit, photoPrincipal: File){
    return new Promise((resolve, reject) => {
      const produitData = new FormData();
      produitData.append('produit', JSON.stringify(produit));
      produitData.append('photoPrincipal', photoPrincipal, produit.nom);
      this.http.post('http://localhost:3000/api/produit', produitData).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllProduit(){
    this.http.get('http://localhost:3000/api/produit').subscribe(
      (produit: Produit[]) => {
        if(produit){
          this.produit = produit;
          this.emitProduit();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  emitProduit() {
    this.produit$.next(this.produit);
  }

  supprimerProduit(id: string){
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/produit/' + id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getProduitById(id: string){
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/produit/' + id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  modifierProduit(id: string, produit: Produit, photoPrincipal: File | string){
    console.log("Je suis dans le service");
    console.log(id);
    return new Promise((resolve, reject) => {
      let produitData: Produit | FormData;
      if(typeof photoPrincipal === 'string'){
        produit.photoPrincipal = photoPrincipal;
        produitData = produit;
      }else{
        produitData = new FormData();
        produitData.append('produit', JSON.stringify(produit));
        produitData.append('image', photoPrincipal, produit.nom);
      }
      this.http.put('http://localhost:3000/api/produit/' + id, produitData).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
