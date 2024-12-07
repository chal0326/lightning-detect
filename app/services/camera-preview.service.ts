import { Observable } from '@nativescript/core';
import { CameraPlus } from '@nstudio/nativescript-camera-plus';

export class CameraPreviewService extends Observable {
  private preview: CameraPlus;
  private _isPreviewActive: boolean = false;
  private _isInitialized: boolean = false;

  async startPreview(previewView: CameraPlus): Promise<void> {
    if (!previewView) {
      throw new Error('Preview view is required');
    }

    try {
      this.preview = previewView;
      
      const hasPermissions = await this.preview.requestCameraPermissions();
      if (!hasPermissions) {
        throw new Error('Camera permissions denied');
      }

      if (!this._isInitialized) {
        await this.preview.initCamera({
          saveToGallery: false,
          keepAspectRatio: true,
          autoFocus: false,
          flashMode: 'off',
          whiteBalance: 'cloudy'
        });
        this._isInitialized = true;
      }

      // Configure optimal settings for lightning detection
      await this.configureOptimalSettings();
      
      this._isPreviewActive = true;
      this.notify({ eventName: 'previewStarted', object: this });
      
    } catch (error) {
      console.error('Preview start failed:', error);
      this.notify({ 
        eventName: 'previewError', 
        object: this, 
        data: { error: error.message } 
      });
      throw error;
    }
  }

  private async configureOptimalSettings(): Promise<void> {
    try {
      // Set camera properties optimal for lightning detection
      this.preview.autoFocus = false;
      this.preview.zoom = 0;
      this.preview.flashMode = 'off';
      this.preview.whiteBalance = 'cloudy';

      // Additional settings specific to lightning photography
      if (this.preview.setManualFocus) {
        await this.preview.setManualFocus(1.0); // Set to infinity
      }
      
      if (this.preview.setExposureCompensation) {
        await this.preview.setExposureCompensation(-1.0); // Slightly underexpose
      }
    } catch (error) {
      console.warn('Some optimal settings could not be applied:', error);
    }
  }

  async stopPreview(): Promise<void> {
    if (!this._isPreviewActive) return;
    
    try {
      await this.preview?.destroy();
      this._isPreviewActive = false;
      this._isInitialized = false;
      this.notify({ eventName: 'previewStopped', object: this });
    } catch (error) {
      console.error('Preview stop failed:', error);
      throw error;
    }
  }

  get isPreviewActive(): boolean {
    return this._isPreviewActive;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }
}