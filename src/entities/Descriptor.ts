import type {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';
import type {LocalDirDescriptor} from '@/entities/LocalDirDescriptor';
import {v4 as uuid} from 'uuid';

export enum DescriptorType {
  Back = 0,
  LocalFile = 3,
  LocalDirectory = 1,
  RemoteFile = 4,
  RemoteDirectory = 2
}

export abstract class Descriptor {
  id: string;
  name: string;
  abstract type: DescriptorType;


  constructor(name: string) {
    this.id = uuid();
    this.name = name;
  }
}

export function isDir(descriptor: Descriptor): descriptor is LocalDirDescriptor | BackDescriptor { // TODO: add remote dir type
  return descriptor.type == DescriptorType.RemoteDirectory
    || descriptor.type == DescriptorType.LocalDirectory
    || descriptor.type == DescriptorType.Back;
}

export const BackDescriptor: BackDescriptor = {
  id: '0',
  name: '..',
  type: DescriptorType.Back,
};

export type BackDescriptor = {
  id: '0',
  name: '..',
  type: DescriptorType.Back
}

export type AnyDescriptor = LocalDirDescriptor | LocalFileDescriptor;
export type LocalDescriptor = LocalDirDescriptor | LocalFileDescriptor;
