import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from 'src/app/modeles/produit';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-modifier-produit',
  templateUrl: './modifier-produit.component.html',
  styleUrls: ['./modifier-produit.component.css']
})
export class ModifierProduitComponent implements OnInit {

  public produitForm : FormGroup;
  public loading = false;
  public isSubmit : boolean = false;
  public imagePreview: string;
  public messageErreur: string;
  public produitAddOK: boolean; 
  public produit: Produit;
  
  constructor(private formBuilder: FormBuilder,
              private produitService: ProduitService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = true; 
    //Initialisation du form. 
    this.produitForm = this.formBuilder.group({
      nom: [null, Validators.required],
      description: [null, Validators.required],
      categorie: [null, Validators.required],
      quantity: [0, Validators.required],
      prix: [0, Validators.required],
      photoPrincipal: [null, Validators.required],

    });
    //Remplit les champs du produit en question
    this.route.params.subscribe(
      (params) => {
        this.produitService.getProduitById(params.id).then(
          (produit: Produit) => {
            this.produit = produit;
            this.produitForm = this.formBuilder.group({
              nom: [this.produit.nom, Validators.required],
              description: [this.produit.description, Validators.required],
              categorie: [this.produit.categorie, Validators.required],
              quantity: [this.produit.quantity, Validators.required],
              prix: [this.produit.prix, Validators.required],
              photoPrincipal: [this.produit.photoPrincipal, Validators.required],
            });
            this.imagePreview = produit.photoPrincipal;
            this.loading = false;
          }
        );
      }
    );
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
      this.produitService.modifierProduit(this.produit._id ,produit, this.produitForm.get('photoPrincipal').value).then(
        () => {
          this.produitForm.reset();
          this.loading = false;
          this.produitAddOK = true; 
          this.router.navigate(['/liste-Produits']);
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
  
  /**
   * Permet d'afficher le fichier du 
   */
  afficherFichierParDefaut(){

  }

}
