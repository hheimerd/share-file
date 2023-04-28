import {makeAutoObservable, runInAction} from 'mobx';
import {SelectableData} from '@/utils/selectable-data';
import type {RemoteDescriptorsRepository} from '@/data/remote-descriptors.repository';
import type {RemoteDescriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';
import {IS_ELECTRON} from '@/constants/environment';
import type {RemoteDirDescriptor} from '@/entities/RemoteDirDescriptor';
import type {FileSystem} from '@/services/file-system/file-system';

export class RemoteDescriptorVM {
  public get descriptors() { return this._descriptorsStack[this._descriptorsStack.length - 1]; }

  private _descriptorsStack: RemoteDescriptor[][] = [[]];
  private readonly selectableDescriptors = new SelectableData<RemoteDescriptor>();
  private _descriptorRepository: RemoteDescriptorsRepository;
  private fs?: FileSystem;

  constructor(descriptorRepository: RemoteDescriptorsRepository) {
    this._descriptorRepository = descriptorRepository;
    this._descriptorsStack[0] = [];
    makeAutoObservable(this);
    this.getFs().then(fs => this.fs = fs);
  }

  public toggleFileSelected = this.selectableDescriptors.toggleSelectedData;

  public unselectAll = this.selectableDescriptors.clearSelectedData;

  public get selectedFiles() {return this.selectableDescriptors.selectedData;}

  private setDescriptors(descriptors: RemoteDescriptor[]) {
    this._descriptorsStack[0] = descriptors;
    this.unselectAll();
  }

  public refetch = async () => {
    const descriptors = await this._descriptorRepository.getFiles();
    this.setDescriptors(descriptors);
  };

  public openFile = async (descriptor: RemoteDescriptor) => {
    this.unselectAll();

    if (isDir(descriptor)) {
      await this.openRemoteDir(descriptor);
    } else {
      // await this.saveFile(descriptor);
    }
    // TODO: Open remote files
  };

  private async openRemoteDir(descriptor: RemoteDirDescriptor) {
    const content = await descriptor.content();

    runInAction(() => {
      this._descriptorsStack.push(content);
    });
  }

  private async saveFile(descriptor: RemoteDescriptor, path?: string) {
    if (!path) {
      console.debug('Save path not selected or something wrong');
      return;
    }

    await this.fs?.saveDescriptor(descriptor, path);
  }

  private async getFs() {
    if (IS_ELECTRON) {
      const FsImpl = (await import('@/services/file-system/node-file-system')).NodeFileSystem;
      return new FsImpl();
    } else {
      throw Error('Not implemented'); // TODO: implement remote FS
    }
  }

  public goBack = () => {
    this._descriptorsStack.pop();
  };

  public get onGoBack(): (() => void) | undefined {
    return this._descriptorsStack.length == 1
      ? undefined
      : this.goBack;
  }

  public startDrag = (descriptor: RemoteDescriptor) => {
    this.fs?.startDrag(descriptor);
  };

}
