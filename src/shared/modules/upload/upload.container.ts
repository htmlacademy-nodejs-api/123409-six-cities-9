import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { Controller } from '../../libs/rest/index.js';
import { UploadController } from './upload.controller.js';

export function createUploadContainer() {
  const uploadContainer = new Container();
  uploadContainer.bind<Controller>(Component.UploadController).to(UploadController).inSingletonScope();

  return uploadContainer;
}
