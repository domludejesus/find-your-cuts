import { Component, ElementRef, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native'
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';
import { AlertController } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // web access google maps 
  @ViewChild('mapweb') mapwebRef: ElementRef;
  mapweb: GoogleMap;
  // native app access view child 
  @ViewChild('map') mapView: ElementRef;
  constructor(private alertCtrl: AlertController) { }

  ionViewDidEnter() {
    this.createMapWeb();
  }

  async createMapWeb() {
    this.mapweb = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapwebRef.nativeElement,
      forceCreate: true,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8,
      }
    })
  }
  // Native App access from here 
  createMap() {
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    console.log("~ file: tab2.page.ts ~ Line 21 ~ HomePage ~ createMap ~boundingRect", boundingRect)

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      //latitude?: Number,
      //Longitude?: Number, 
      zoom: 3,
      //liteMode?: Boolean 
    });

    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      CapacitorGoogleMaps.setMapType({
        type: 'hybrid' // can be changed to whatever type needed 
      });

      this.showCurrentPosition();
    });

    CapacitorGoogleMaps.addListener('didTapPOIWithPlaceID', async (ev) => {
      const result = ev.results;

      const alert = await this.alertCtrl.create({
        header: result.name,
        message: `Place ID: ${result.placeID}`,
        buttons: ['OK']

      })
    });

  }



  showCurrentPosition() {
    Geolocation.requestPermissions().then(async permission => {
      const coordinates = await Geolocation.getCurrentPosition();

      CapacitorGoogleMaps.addMarker({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        title: 'Current Location',
        snippet: 'This is you'
      });

      CapacitorGoogleMaps.setCamera({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        zoom: 12,
        bearing: 0
      })
    })
  }

  draw() {
    const points: LatLng[] = [
      {
        latitude: 51.88,
        longitude: 7.60,
      },
      {
        latitude: 55,
        longitude: 10,
      }
    ];

    CapacitorGoogleMaps.addPolyline({
      points,
      color: '#ff00ff',
      width: 2
    })
  }
}
