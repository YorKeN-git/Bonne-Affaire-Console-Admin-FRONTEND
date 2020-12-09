import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produit } from 'src/app/modeles/produit';
import { ProduitService } from 'src/app/services/produit.service';
import { isString } from 'util';

@Component({
  selector: 'app-add-produits',
  templateUrl: './add-produits.component.html',
  styleUrls: ['./add-produits.component.css']
})
export class AddProduitsComponent implements OnInit {

  public produitForm : FormGroup;
  public loading = false;
  public isSubmit : boolean = false;
  public imagePreview: string;
  public messageErreur: string;
  public produitAddOK: boolean; 

  constructor(private formBuilder: FormBuilder,
              private produitService: ProduitService) { }

  ngOnInit() {

    this.produitForm = this.formBuilder.group({
      nom: [null, Validators.required],
      description: [null, Validators.required],
      categorie: [null, Validators.required],
      quantity: [0, Validators.required],
      prix: [0, Validators.required],
      photoPrincipal: [null, Validators.required],

    });
  }

  onSubmit(){
    this.isSubmit = true; 
    this.produitAddOK = false;
    if(this.produitForm.valid){
      //recuperd les données du Form
      const produit = new Produit();
      produit.nom = this.produitForm.get('nom').value;
      produit.description = this.produitForm.get('description').value;
      produit.categorie = this.produitForm.get('categorie').value;
      produit.prix = this.produitForm.get('prix').value;
      produit.quantity = this.produitForm.get('quantity').value;
      this.imagePreview = '';
      this.produitService.addProduit(produit, this.produitForm.get('photoPrincipal').value).then(
        () => {
          this.produitForm.reset();
          document.getElementById("photoPrincipal").value = "";
          this.loading = false;
          this.produitAddOK = true; 
        },
        (error) => {
          this.loading = false;
          this.messageErreur = error.message;
        }
      );
    }else{
      //form invalide 
    }
  }

  onImagePick(event: Event) {
    const fichier = (event.target as HTMLInputElement).files[0];
    this.produitForm.get('photoPrincipal').patchValue(fichier);
    this.produitForm.get('photoPrincipal').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if(this.produitForm.get('photoPrincipal').valid){
        this.imagePreview = reader.result as string;
      }else{
        this.imagePreview = null;
      }

    };
    reader.readAsDataURL(fichier);
  }

}
