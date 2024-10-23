import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { CandidatEnregistrerComponent } from './candidat/candidat-enregistrer/candidat-enregistrer.component';
import { OffreDetailComponent } from './offre/offre-detail/offre-detail.component';
import { RecruteurEnregistrerComponent } from './recruteur/recruteur-enregistrer/recruteur-enregistrer.component';
import { ChoixCreationCompteComponent } from './choix-creation-compte/choix-creation-compte.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { AccueilComponent as Accueil } from './dashbord/accueil/accueil.component';
import { CategorieComponent } from './dashbord/categories/categorie/categorie.component';
import { CategorieAjouterComponent } from './dashbord/categories/categorie-ajouter/categorie-ajouter.component';
import { RoleComponent } from './dashbord/roles/role/role.component';
import { RoleAjouterComponent } from './dashbord/roles/role-ajouter/role-ajouter.component';
import { ProfileAjouterComponent } from './dashbord/profiles/profile-ajouter/profile-ajouter.component';
import { ProfileComponent } from './dashbord/profiles/profile/profile.component';
import { ProfileModifierComponent } from './dashbord/profiles/profile-modifier/profile-modifier.component';
import { ModifierEmailComponent } from './dashbord/utilisateur/modifier-email/modifier-email.component';
import { OffreAjouterComponent } from './dashbord/offres/offre-ajouter/offre-ajouter.component';
import { OffreListeComponent } from './dashbord/offres/offre-liste/offre-liste.component';
import { EntrepriseAjouterComponent } from './dashbord/entreprises/entreprise-ajouter/entreprise-ajouter.component';
import { EntrepriseModifierComponent } from './dashbord/entreprises/entreprise-modifier/entreprise-modifier.component';
import { EntretienComponent } from './dashbord/utilisateur/entretien/entretien.component';
import { CreateMeetingComponent } from './dashbord/utilisateur/create-meeting/create-meeting.component';

import { authGuard } from './guards/auth.guard';
import { AfficherCurriculumComponent } from './dashbord/utilisateur/afficher-curriculum/afficher-curriculum.component';
import { recruteurPermissionGuard } from './guards/recruteur-permission.guard';
import { ConseilComponent } from './conseil/conseil.component';



export const routes: Routes = [
    {path: '', component: AccueilComponent, pathMatch: 'full'},
    {path: 'creation/compte', component: ChoixCreationCompteComponent},
    {path: 'recruteur/enregistrer', component: RecruteurEnregistrerComponent},
    {path: 'candidat/enregistrer', component: CandidatEnregistrerComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'offre/:id', component: OffreDetailComponent},
    {path: 'entretien', component: EntretienComponent},
    {path: 'reunion', component: CreateMeetingComponent},
    {path: 'conseils-carriere', component: ConseilComponent},

    {path: 'dashbord', canActivate: [authGuard], component: Accueil},
    {path: 'profile/ajouter', component: ProfileAjouterComponent},
    {path: 'utilisateur/profile', canActivate: [authGuard], component: ProfileComponent},
    {path: 'utilisateur/email/modifier', canActivate: [authGuard], component: ModifierEmailComponent},
    {path: 'profile/modifier', canActivate: [authGuard], component: ProfileModifierComponent},
    {path: 'recruteur/entreprise/enregistrer', canActivate: [authGuard], component: EntrepriseAjouterComponent},
    {path: 'entreprise/:id/modifier', component: EntrepriseModifierComponent},
    {path: 'categories', component: CategorieComponent},
    {path: 'categorie/ajouter', component: CategorieAjouterComponent},
    {path: 'roles', component: RoleComponent},
    {path: 'role/ajouter', component: RoleAjouterComponent},
    {path: 'utilisateur/offre/enregistrer', component: OffreAjouterComponent},
    {path: 'utilisateur/offres', component: OffreListeComponent},
    {path: 'candidat/:id/curriculum-vitae', canActivate:[recruteurPermissionGuard], component: AfficherCurriculumComponent}
    
];
