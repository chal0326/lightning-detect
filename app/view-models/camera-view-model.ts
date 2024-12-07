import { Observable, EventData } from '@nativescript/core';
import { CameraService } from '../services/camera.service';
import { CameraPreviewService } from '../services/camera-preview.service';
import { LightningDetectorService } from '../services/lightning-detector.service';

export class CameraViewModel extends Observable {
  private cameraService: CameraService;
  private cameraPreview: CameraPreviewService;
  private lightningDetector: LightningDetectorService;
  private _isMonitoring: boolean = false;
  private _lastPhotoPath: string = '';
  private _status: string = 'Ready';
  private _settings = {
    iso: 100,
    shutterSpeed: 1000,
    focusDistance: 'infinity'
  };

  constructor() {
    super();
    this.cameraService = new CameraService();
    this.cameraPreview = new CameraPreviewService();
    this.lightningDetector = new LightningDetectorService();
    
    this.setupLightningDetection();
  }

  async onPreviewLoaded(args: EventData): Promise<void> {
    const preview = args.object;
    try {
      await this.cameraPreview.startPreview(preview);
      this.status = 'Camera preview started';
    } catch (error) {
      this.status = 'Preview failed: ' + error.message;
    }
  }

  private async setupLightningDetection() {
    const hasPermission = await this.cameraService.requestPermissions();
    if (!hasPermission) {
      this.status = 'Camera permission denied';
      return;
    }

    this.lightningDetector.on('lightningDetected', async () => {
      try {
        const image = await this.cameraService.captureImage();
        this._lastPhotoPath = image.android || image.ios;
        this.notifyPropertyChange('lastPhotoPath', this._lastPhotoPath);
        this.status = 'Lightning captured!';
      } catch (error) {
        this.status = 'Failed to capture: ' + error.message;
      }
    });
  }

  get isMonitoring(): boolean {
    return this._isMonitoring;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    if (this._status !== value) {
      this._status = value;
      this.notifyPropertyChange('status', value);
    }
  }

  get lastPhotoPath(): string {
    return this._lastPhotoPath;
  }

  get settings() {
    return this._settings;
  }

  updateSettings(newSettings: any) {
    this._settings = { ...this._settings, ...newSettings };
    this.notifyPropertyChange('settings', this._settings);
  }

  toggleMonitoring() {
    this._isMonitoring = !this._isMonitoring;
    
    if (this._isMonitoring) {
      this.lightningDetector.startMonitoring();
      this.status = 'Monitoring for lightning...';
    } else {
      this.lightningDetector.stopMonitoring();
      this.status = 'Monitoring stopped';
    }
    
    this.notifyPropertyChange('isMonitoring', this._isMonitoring);
  }
}