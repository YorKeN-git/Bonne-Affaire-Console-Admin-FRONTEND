import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produit } from 'src/app/modeles/produit';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-list-produits',
  templateUrl: './list-produits.component.html',
  styleUrls: ['./list-produits.component.css']
})
export class ListProduitsComponent implements OnInit {

  public loading: boolean;
  public pasdeProduit: boolean;
  private produitSub: Subscription;
  public produits: Produit[] = []; 

  constructor(private produitService: ProduitService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.produitSub = this.produitService.produit$.subscribe(
      (produit) => {
        if(produit.length > 0){
          this.produits = produit;
          console.log(produit);
          this.loading = false
        }else{
          this.loading = false;
          this.pasdeProduit = true;
        }
        
      }
    );
    this.produitService.getAllProduit();

  }

  editerProduit(id: string){
    this.router.navigate(['modifier-Produit/' + id]);
  }

  supprimerProduit(id: string){
    this.loading = true; 
    this.produitService.supprimerProduit(id).then(
      () => {
        this.loading = false;
        location.reload();
      }
    )
  }

}
