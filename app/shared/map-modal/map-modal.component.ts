import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center = {lat: -34.397, lng: 150.644} ;
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = "Pick Location";
  clickListener: any;
  googleMaps: any;
  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngAfterViewInit() {
    this.getGoogleMap().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 16
      });
      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });
      if(this.selectable) {
        this.clickListener = map.addListener('click', event => {
          let selectedCoords = {
            lat: event.latLng.lat(), 
            lng: event.latLng.lng()}
          this.modalCtrl.dismiss(selectedCoords);
        })
      } else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: this.title
        });
        marker.setMap(map);
      }
      
    }).catch(err => {
      console.log(err);
    });
  }

  private getGoogleMap(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if(googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`;
      // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDX2Pa6NX3x_r0yPUku3MgBAZuS3JHtKEo`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      }
    })
  }

  ngOnDestroy() {
    if(this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
}
