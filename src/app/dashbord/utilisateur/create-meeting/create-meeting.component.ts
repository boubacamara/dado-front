import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.scss']
})
export class CreateMeetingComponent {
  meetingForm: FormGroup;
  joinMeetingLink: string = '';
  joinSalonListenerAdded = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.meetingForm = this.formBuilder.group({
      meetingName: ['', Validators.required],
      participants: ['', Validators.required],
      meetingLink: ['']
    });
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      const roomId = uuidv4();
      this.router.navigate(['/entretien'], {
        queryParams: {
          type: 'public',
          id: 1,
          roomId: roomId,
          salonNom: this.meetingForm.get('meetingName')?.value
        }
      });
    }
  }


  joinMeeting(event: Event) {
    event.preventDefault();  // Empêche le rechargement de la page

    if (this.joinMeetingLink) {
      // Crée une instance de URL pour extraire les paramètres de l'URL
      const url = new URL(this.joinMeetingLink);
      const params = new URLSearchParams(url.search);

      // Extraire les paramètres que vous voulez
      const type = params.get('type');
      const id = params.get('id');
      const roomId = params.get('roomId');
      const salonNom = params.get('salonNom');

      if (type && id && roomId && salonNom) {
        // Redirection en transférant les paramètres extraits
        this.router.navigate(['/entretien'], {
          queryParams: {
            type,
            id,
            roomId,
            salonNom
          }
        });
      } else {
        alert('Les paramètres du lien de réunion sont incomplets.');
      }
    } else {
      alert('Lien de réunion invalide.');
    }
  }



  private extractRoomIdFromLink(link: string): string | null {
    // Implémentez la logique pour extraire l'ID de la réunion du lien
    // Par exemple, si le lien est de la forme "https://monapp.com/reunion/12345"
    const match = link.match(/\/reunion\/(\w+)$/);
    return match ? match[1] : null;
  }

}