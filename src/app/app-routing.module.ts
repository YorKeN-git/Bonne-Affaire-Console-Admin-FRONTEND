import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProduitsComponent } from './components/add-produits/add-produits.component';
import { ListProduitsComponent } from './components/list-produits/list-produits.component';
import { ModifierProduitComponent } from './components/modifier-produit/modifier-produit.component';


const routes: Routes = [
  {path: 'addProduits', component: AddProduitsComponent},
  {path: 'liste-Produits', component: ListProduitsComponent},
  {path: 'modifier-Produit/:id', component: ModifierProduitComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
