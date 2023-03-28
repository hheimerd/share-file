import {makeAutoObservable, runInAction} from 'mobx';
import type {LocalDescriptor} from '@/entities/Descriptor';
import {DescriptorType} from '@/entities/Descriptor';
import {fileRepository} from '@/data/local-files.repository';
import {SelectableData} from '@/utils/selectable-data';

function createFileHash(file: File) {
  return `${file.path}${file.lastModified}${file.size}`;
}

export class LocalDescriptorGridVM {
  public get descriptors() { return this._descriptorsStack[this._descriptorsStack.length - 1]; }

  private _descriptorsStack: LocalDescriptor[][] = [[]];
  private _filesHash: string[] = [];
  private readonly selectableDescriptors = new SelectableData<LocalDescriptor>();

  constructor(initialFiles: LocalDescriptor[] = []) {
    this._descriptorsStack[0] = initialFiles;
    makeAutoObservable(this);
  }

  toggleFileSelected = this.selectableDescriptors.toggleSelectedData;

  unselectAll = this.selectableDescriptors.clearSelectedData;

  get selectedFiles() {return this.selectableDescriptors.selectedData;}

  setDescriptors(descriptors: LocalDescriptor[]) {
    this._descriptorsStack[0] = descriptors;
    this.unselectAll();
  }

  addDescriptorsFromInput = async (dataTransfer: DataTransfer) => {
    const newFiles: LocalDescriptor[] = [];

    for (const item of dataTransfer.items) {
      const file = item.getAsFile();
      if (!file) continue;

      const hash = createFileHash(file);
      if (this._filesHash.includes(hash))
        continue;

      this._filesHash.push(hash);

      const entry = item.webkitGetAsEntry();
      if (!entry)
        continue;

      const path = file?.path ?? entry.fullPath;

      newFiles.push(await fileRepository.createDescriptor(entry, path));
    }

    if (newFiles.length)
      this.setDescriptors([...this.descriptors, ...newFiles]);
  };

  openFile = async (descriptor: LocalDescriptor) => {
    this.unselectAll();

    if (descriptor.type === DescriptorType.LocalDirectory) {
      const content = await descriptor.content();

      runInAction(() => this._descriptorsStack.push(content));
    } else {
      return; // TODO: Handle file open
    }
  };

  goBack = () => {
    this._descriptorsStack.pop();
  };

  get onGoBack() {
    return this._descriptorsStack.length == 1
      ? undefined
      : this.goBack;
  }

}
