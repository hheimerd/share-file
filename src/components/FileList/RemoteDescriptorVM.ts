import {makeAutoObservable} from 'mobx';
import {SelectableData} from '@/utils/selectable-data';
import type {RemoteDescriptorsRepository} from '@/data/remote-descriptors.repository';
import type {Descriptor} from '@/entities/Descriptor';

export class RemoteDescriptorVM {
  public get descriptors() { return this._descriptorsStack[this._descriptorsStack.length - 1]; }

  private _descriptorsStack: Descriptor[][] = [[]];
  private _filesHash: string[] = [];
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
  };

  public goBack = () => {
    this._descriptorsStack.pop();
  };

  public get onGoBack(): (() => void) | undefined {
    return this._descriptorsStack.length == 1
      ? undefined
      : this.goBack;
  }

}
