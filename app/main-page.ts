import { EventData, Page } from '@nativescript/core';
import { CameraViewModel } from './view-models/camera-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new CameraViewModel();
}