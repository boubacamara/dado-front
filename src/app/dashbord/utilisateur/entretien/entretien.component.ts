import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import du CommonModule pour async pipe

interface ParticipantVideo {
  id: string;
  video: HTMLVideoElement;
  stream: MediaStream;
}

@Component({
  selector: 'app-entretien',
  standalone: true,
  imports: [CommonModule], // Assure-toi d'importer CommonModule ici
  templateUrl: './entretien.component.html',
  styleUrl: './entretien.component.scss'
})
export class EntretienComponent {
  private socket!: Socket;
  private peer!: Peer;
  private myVideoStream!: MediaStream;
  private ROOM_ID!: string;
  private type!: string;
  msgs: { message: string, userName: string, userImg: string }[] = [];
  private userId: string | null = null;
  private roomId!: number;
  salonName!: string;
  currentDate!: Date;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private connectionAttempts: Map<string, number> = new Map();
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds


  private participantVideos = new BehaviorSubject<ParticipantVideo[]>([]);
  participantVideos$: Observable<ParticipantVideo[]> = this.participantVideos.asObservable();

  @ViewChild('videoGrid', { static: true }) videoGrid!: ElementRef;
  @ViewChild('showChat', { static: true }) showChat!: ElementRef;
  @ViewChild('send', { static: true }) send!: ElementRef;
  @ViewChild('messages', { static: true }) messages!: ElementRef;
  @ViewChild('text', { static: true }) text!: ElementRef;
  @ViewChild('inviteButton', { static: true }) inviteButton!: ElementRef;
  @ViewChild('muteButton', { static: true }) muteButton!: ElementRef;
  @ViewChild('stopVideo', { static: true }) stopVideo!: ElementRef;
  @ViewChild('leaveCallButton', { static: true }) leaveCallButton!: ElementRef;
  @ViewChild('raiseHandButton', { static: true }) raiseHandButton!: ElementRef;
  @ViewChild('screenShareButton', { static: true }) screenShareButton!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.roomId = params['id'];
      this.ROOM_ID = params['roomId'];
      this.salonName = params['salonNom'];
      this.currentDate = new Date();
    });
    
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.closeSalon();
  }

  private async initializeComponent(): Promise<void> {
    try {
      await this.startWebcam();
      await this.initializePeer();
      this.initializeSocket();
      this.joinRoom();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error during component initialization:', error);
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  }

  private initializeSocket(): void {
    this.socket = io('https://192.168.1.46:8000/salon');
    //console.log('Socket initialized');

    this.socket.on('user-connected', (userId: string, userName: string, userImg: string) => {
      //console.log(User connected: ${userId});
      if (this.peer && this.peer.id) {
        this.connectToNewUser(userId);
        const alert: any = document.querySelector(".alert");
        alert.style.display = "flex";
        alert.innerHTML = `${userName} has joined the conference.`;

        setTimeout(() => {
          alert.style.display = "none";
        }, 3000);
      } else {
        console.error('Peer not initialized when trying to connect to new user');
      }
    });

    this.socket.on('user-already-in-room', (userId: string, userName: string, userImg: string) => {
      //console.log(Existing user in room: ${userId});
      this.connectToNewUser(userId);
    });

    this.socket.on('createMessage', (message: string, userName: string, userImg: string) => {
      this.msgs.push({ message: message, userName: userName, userImg: userImg });
    });

    this.socket.on('user-disconnected', (userId: string) => {
      //console.log(User disconnected: ${userId});
      this.removeParticipantVideo(userId);
    });

    this.socket.on('user-raised-hand', (userName: string) => {
      const alert: any = document.querySelector(".alert");
      alert.style.display = "flex";
      alert.innerHTML =`✋ ${userName}`;

      setTimeout(() => {
        alert.style.display = "none";
      }, 3000);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('invalid-data', (message: string) => {
      console.error(message);
    });

    this.socket.on('salon-closed', () => {
      //console.log('Salon closed');
      this.handleSalonClosed();
    });
  }

  private async initializePeer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer({
        host: '192.168.1.46',
        port: 8000,
        path: '/peerjs',
        secure: true,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: 'turn:numb.viagenie.ca',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              username: '28224511:1379330808'
            }
          ]
        },
        debug: 3
      });

      this.peer.on('open', (id: string) => {
        //console.log(Peer opened with ID: ${id});
        this.userId = id;
        resolve();
      });

      this.peer.on('error', (err: any) => {
        console.error('PeerJS error:', err);
        this.handlePeerError(err);
        reject(err);
      });

      this.peer.on('call', this.handleIncomingCall.bind(this));
    });
  }

  private joinRoom(): void {
    const user = {
      nom: 'dado',
      photo: 'photo'
    };

    //console.log(Joining room: ${this.ROOM_ID});
    this.socket.emit('join-room', this.ROOM_ID, this.userId, user.nom, user.photo);
  }

  private handleIncomingCall(call: MediaConnection): void {
    //console.log(Incoming call from ${call.peer});
    call.answer(this.myVideoStream);
    this.setupCallListeners(call);
  }

  private setupCallListeners(call: MediaConnection): void {
    call.on('stream', (userVideoStream: MediaStream) => {
      //console.log(Received stream from ${call.peer});
      this.addParticipantVideo(call.peer, userVideoStream);
    });

    call.on('error', (err: any) => {
      console.error(`PeerJS call error with ${call.peer}:`, err);
      this.handleCallError(call.peer, err);
    });

    call.on('close', () => {
      //console.log(Call closed with ${call.peer});
      this.removeParticipantVideo(call.peer);
    });
  }

  private connectToNewUser(userId: string): void {
    if (this.peerConnections.has(userId) || userId === this.userId) {
      //console.log(Already connected to ${userId} or it's the current user);
      return;
    }

    //console.log(Attempting to connect to ${userId});
    const call = this.peer.call(userId, this.myVideoStream);
    this.setupCallListeners(call);
    this.peerConnections.set(userId, call.peerConnection);

    call.on('error', (err: any) => {
      console.error(`Error calling ${userId}:`, err);
      this.peerConnections.delete(userId);
      this.retryConnection(userId);
    });
  }

  private handleCallError(userId: string, error: any): void {
    console.error(`Call error with ${userId}:`, error);
    this.removeParticipantVideo(userId);
    this.retryConnection(userId);
  }

  private retryConnection(userId: string): void {
    const attempts = this.connectionAttempts.get(userId) || 0;
    if (attempts < this.maxRetries) {
      this.connectionAttempts.set(userId, attempts + 1);
      setTimeout(() => {
        //console.log(Retrying connection to ${userId}, attempt ${attempts + 1});
        this.connectToNewUser(userId);
      }, this.retryDelay * Math.pow(2, attempts)); // Exponential backoff
    } else {
      console.error(`Failed to connect to ${userId} after ${this.maxRetries} attempts`);
      this.connectionAttempts.delete(userId);
    }
  }

  private handlePeerError(error: any): void {
    console.error('Peer error:', error);
    if (error.type === 'network' || error.type === 'disconnected') {
      this.reconnectPeer();
    }
  }

  private reconnectPeer(): void {
    //console.log('Attempting to reconnect peer');
    this.peer.destroy();
    this.initializePeer();
  }

  private async startWebcam(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      //console.log('Webcam started successfully');
      this.myVideoStream = stream;
      const myVideo = document.createElement('video');
      myVideo.muted = true;
      myVideo.id = 'my-video';
      this.addVideoStream(myVideo, stream);
    } catch (error) {
      console.error("Error activating webcam:", error);
      throw error; // Propager l'erreur pour la gestion dans initializeComponent
    }
  }

  private addVideoStream(video: HTMLVideoElement, stream: MediaStream): void {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    this.videoGrid.nativeElement.append(video);

    video.style.position = "absolute";
    video.style.top = "50%";
    video.style.left = "50%";
    video.style.width = "100%";
    video.style.objectFit = "cover";
    video.style.transform = "translate(-50%, -50%)";
    video.style.height = "100%";
  }

  private addParticipantVideo(userId: string, stream: MediaStream): void {
    const participants = this.getParticipantVideos();
    if (!participants.some(participant => participant.id === userId)) {
      //console.log(Adding video for participant ${userId});
      const video = document.createElement('video');
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      participants.push({ id: userId, video: video, stream: stream });
      this.setParticipantVideos(participants);
      this.videoGrid.nativeElement.append(video);
    }
  }

  private removeParticipantVideo(userId: string): void {
    //console.log(Removing video for participant ${userId});
    const participants = this.getParticipantVideos().filter(p => p.id !== userId);
    this.setParticipantVideos(participants);
    this.peerConnections.delete(userId);
  }

  private setupEventListeners(): void {
    this.setupUIEventListeners();
  }

  private setupUIEventListeners(): void {
    this.send.nativeElement.addEventListener('click', () => {
      const message = this.text.nativeElement.value;
      if (message.length !== 0) {
        this.socket.emit('message', message);
        this.text.nativeElement.value = '';
      }
    });

    this.text.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && this.text.nativeElement.value.length !== 0) {
        const message = this.text.nativeElement.value;
        this.socket.emit('message', message);
        this.text.nativeElement.value = '';
      }
    });

    this.muteButton.nativeElement.addEventListener('click', () => {
      const enabled = this.myVideoStream.getAudioTracks()[0].enabled;
      if (enabled) {
        this.myVideoStream.getAudioTracks()[0].enabled = false;
        this.muteButton.nativeElement.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
      } else {
        this.myVideoStream.getAudioTracks()[0].enabled = true;
        this.muteButton.nativeElement.innerHTML = `<i class="fas fa-microphone"></i>`;
      }
    });

    this.stopVideo.nativeElement.addEventListener('click', () => {
      const enabled = this.myVideoStream.getVideoTracks()[0].enabled;
      if (enabled) {
        this.myVideoStream.getVideoTracks()[0].enabled = false;
        this.stopVideo.nativeElement.innerHTML = `<i class="fas fa-video-slash"></i>`;
      } else {
        this.myVideoStream.getVideoTracks()[0].enabled = true;
        this.stopVideo.nativeElement.innerHTML = `<i class="fas fa-video"></i>`;
      }
    });

    this.leaveCallButton.nativeElement.addEventListener('click', () => {
      const alert: any = document.querySelector(".modal-overlay");
      alert.style.display = "flex";
      this.socket.emit('disconnect');
    });

    this.raiseHandButton.nativeElement.addEventListener('click', () => {
      this.socket.emit('raise-hand');
    });

    this.screenShareButton.nativeElement.addEventListener('click', () => {
      this.startScreenShare();
    });
  }

  private startScreenShare(): void {
    navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
    .then((stream) => {
      //console.log('Screen share started');
      if (this.myVideoStream) {
        this.myVideoStream.getTracks().forEach(track => track.stop());
      }

      const myVideo = document.getElementById('my-video') as HTMLVideoElement;
      myVideo.muted = true;
      myVideo.id = 'my-video';
      this.addVideoStream(myVideo, stream);
      this.replaceStream(stream);

      stream.getVideoTracks()[0].onended = () => {
        this.stopScreenShare();
      };
    })
    .catch((error) => {
      console.error("Error sharing screen:", error);
    });
  }

  private stopScreenShare(): void {
    //console.log('Stopping screen share');
    if (this.myVideoStream) {
      this.myVideoStream.getTracks().forEach(track => track.stop());
    }
    this.startWebcam();
  }

  private replaceStream(newStream: MediaStream): void {
    const videoTrack = newStream.getVideoTracks()[0];
    this.peerConnections.forEach((peerConnection) => {
      const sender = peerConnection.getSenders().find(s => s.track?.kind === videoTrack.kind);
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });

    this.myVideoStream = newStream;
  }

  closeSalon(): void {
   this.handleSalonClosed(); 
  }

  private handleSalonClosed(): void {
    if (this.peer && this.socket) {
      this.peer.destroy();
      this.socket.disconnect();
    }

    if (this.myVideoStream) {
      this.myVideoStream.getTracks().forEach(track => track.stop());
    }
    const user = {
      
    };
    const modal: any = document.querySelector(".modal-overlay");
    modal.style.display = "";
    this.router.navigate(['connexion']);
  }

  getParticipantVideos(): ParticipantVideo[] {
    return this.participantVideos.getValue();
  }

  setParticipantVideos(participantVideos: ParticipantVideo[]): void {
    this.participantVideos.next(participantVideos);
  }

  onClose(): void {
    const modal: any = document.querySelector(".modal-overlay");
    modal.style.display = "";
  }
}
