import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
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

  joinMeeting() {
    if (this.joinMeetingLink) {
      // Extraire l'ID de la réunion du lien et naviguer vers la page de la réunion
      const roomId = this.extractRoomIdFromLink(this.joinMeetingLink);
      if (roomId) {
        this.router.navigate(['/entretien'], {
          queryParams: {
            type: 'public',
            id: roomId,
            roomId: roomId
          }
        });
      } else {
        console.error('Invalid meeting link');
      }
    }
  }

  private extractRoomIdFromLink(link: string): string | null {
    // Implémentez la logique pour extraire l'ID de la réunion du lien
    // Par exemple, si le lien est de la forme "https://monapp.com/reunion/12345"
    const match = link.match(/\/reunion\/(\w+)$/);
    return match ? match[1] : null;
  }
}