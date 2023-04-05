import type {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';
import type {LocalDirDescriptor} from '@/entities/LocalDirDescriptor';
import {v4 as uuid} from 'uuid';
import type {RemoteFileDescriptor} from '@/entities/RemoteFileDescriptor';
import type {RemoteDirDescriptor} from '@/entities/RemoteDirDescriptor';

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


  protected constructor(name: string) {
    this.id = uuid();
    this.name = name;
  }
}

export function isDir(descriptor: Descriptor): descriptor is (LocalDirDescriptor | BackDescriptor | RemoteDirDescriptor) {
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

export type AnyDescriptor = LocalDescriptor | RemoteDescriptor;
export type LocalDescriptor = LocalDirDescriptor | LocalFileDescriptor;
export type RemoteDescriptor = RemoteDirDescriptor | RemoteFileDescriptor;
export type DirDescriptor = RemoteDirDescriptor | LocalDirDescriptor;
export type FileDescriptor = RemoteFileDescriptor | LocalFileDescriptor;
