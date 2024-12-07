import { Observable } from '@nativescript/core';
import { LightAnalysisService } from './light-analysis.service';

export class LightningDetectorService extends Observable {
  private isMonitoring: boolean = false;
  private lightAnalysis: LightAnalysisService;
  private monitoringInterval: any;
  private readonly MONITORING_INTERVAL = 50; // ms

  constructor() {
    super();
    this.lightAnalysis = new LightAnalysisService();
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lightAnalysis.reset();
    
    this.monitoringInterval = setInterval(() => {
      this.checkForLightning();
    }, this.MONITORING_INTERVAL);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;
    
    clearInterval(this.monitoringInterval);
    this.isMonitoring = false;
    this.lightAnalysis.reset();
  }

  private checkForLightning(): void {
    // Get current light reading from device sensor
    const currentLightLevel = this.getCurrentLightLevel();
    
    if (this.lightAnalysis.analyzeLightLevel(currentLightLevel)) {
      this.notify({
        eventName: 'lightningDetected',
        object: this
      });
    }
  }

  private getCurrentLightLevel(): number {
    // In a real implementation, this would use the device's light sensor
    // For now, return a simulated value
    return Math.random() * 100;
  }
}