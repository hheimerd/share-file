import {makeAutoObservable, runInAction} from 'mobx';
import {SelectableData} from '@/utils/selectable-data';
import type {RemoteDescriptorsRepository} from '@/data/remote-descriptors.repository';
import type {Descriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';

export class RemoteDescriptorVM {
  public get descriptors() { return this._descriptorsStack[this._descriptorsStack.length - 1]; }

  private _descriptorsStack: Descriptor[][] = [[]];
  private readonly selectableDescriptors = new SelectableData<Descriptor>();
  private _descriptorRepository: RemoteDescriptorsRepository;

  constructor(descriptorRepository: RemoteDescriptorsRepository) {
    this._descriptorRepository = descriptorRepository;
    this._descriptorsStack[0] = [];
    makeAutoObservable(this);
  }

  public toggleFileSelected = this.selectableDescriptors.toggleSelectedData;

  public unselectAll = this.selectableDescriptors.clearSelectedData;

  public get selectedFiles() {return this.selectableDescriptors.selectedData;}

  private setDescriptors(descriptors: Descriptor[]) {
    this._descriptorsStack[0] = descriptors;
    this.unselectAll();
  }

  public refetch = async () => {
    const descriptors = await this._descriptorRepository.getFiles();
    this.setDescriptors(descriptors);
  };

  public openFile = async (descriptor: Descriptor) => {
    this.unselectAll();

    if (isDir(descriptor)) {
      await this.openRemoteDir(descriptor);
    }
  };

  private async openRemoteDir(descriptor: Descriptor) {
    const content = await this._descriptorRepository.getDirContent(descriptor.id);

    runInAction(() => {
      this._descriptorsStack.push(content);
    });
  }

  public goBack = () => {
    this._descriptorsStack.pop();
  };

  public get onGoBack(): (() => void) | undefined {
    return this._descriptorsStack.length == 1
      ? undefined
      : this.goBack;
  }

}
