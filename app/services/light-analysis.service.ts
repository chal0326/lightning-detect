export class LightAnalysisService {
  private readonly SAMPLE_SIZE = 10;
  private readonly THRESHOLD_MULTIPLIER = 2.5;
  private lightReadings: number[] = [];
  private baselineAverage: number = 0;
  
  analyzeLightLevel(currentReading: number): boolean {
    this.updateReadings(currentReading);
    
    if (this.lightReadings.length < this.SAMPLE_SIZE) {
      return false;
    }

    const suddenIncrease = this.detectSuddenIncrease();
    const isValidPattern = this.validateLightningPattern();
    
    return suddenIncrease && isValidPattern;
  }

  private updateReadings(reading: number): void {
    this.lightReadings.push(reading);
    if (this.lightReadings.length > this.SAMPLE_SIZE) {
      this.lightReadings.shift();
    }
    
    // Update baseline average excluding the latest reading
    const baselineReadings = this.lightReadings.slice(0, -1);
    this.baselineAverage = baselineReadings.reduce((a, b) => a + b, 0) / baselineReadings.length;
  }

  private detectSuddenIncrease(): boolean {
    const latestReading = this.lightReadings[this.lightReadings.length - 1];
    return latestReading > this.baselineAverage * this.THRESHOLD_MULTIPLIER;
  }

  private validateLightningPattern(): boolean {
    // Lightning typically shows as a sharp spike followed by rapid decay
    const readings = [...this.lightReadings];
    const peak = Math.max(...readings);
    const peakIndex = readings.indexOf(peak);
    
    if (peakIndex === readings.length - 1) {
      return false; // Need more readings after peak
    }

    // Check for rapid decay after peak
    const postPeakReadings = readings.slice(peakIndex + 1);
    const isDecaying = postPeakReadings.every((val, idx) => 
      idx === 0 || val <= postPeakReadings[idx - 1]
    );

    return isDecaying;
  }

  reset(): void {
    this.lightReadings = [];
    this.baselineAverage = 0;
  }
}