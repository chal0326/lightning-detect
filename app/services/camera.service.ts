import { Camera, CameraOptions, ImageAsset } from '@nativescript/camera';

export class CameraService {
  private camera: Camera;
  private readonly OPTIMAL_SETTINGS: CameraOptions = {
    width: 4000,
    height: 3000,
    keepAspectRatio: true,
    saveToGallery: true,
    cameraFacing: 'back',
    iso: 100, // Low ISO for less noise
    shutterSpeed: 1/2000, // Even faster shutter for lightning
    focusMode: 'manual',
    whiteBalance: 'cloudy'
  };

  constructor() {
    this.camera = new Camera();
  }

  async requestPermissions(): Promise<boolean> {
    try {
      return await this.camera.requestPermissions();
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async captureImage(customSettings?: Partial<CameraOptions>): Promise<ImageAsset> {
    const options: CameraOptions = {
      ...this.OPTIMAL_SETTINGS,
      ...customSettings
    };

    try {
      const image = await this.camera.takePicture(options);
      console.log('Image captured successfully');
      return image;
    } catch (error) {
      console.error('Image capture failed:', error);
      throw error;
    }
  }
}