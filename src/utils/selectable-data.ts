import {makeAutoObservable} from 'mobx';

export class SelectableData<T> {
  selectedData: T[];

  constructor(initialData: T[] = []) {
    this.selectedData = initialData;
    makeAutoObservable(this);
  }

  clearSelectedData = () => this.selectedData = [];

  toggleSelectedData = (data: T, newSelectedState?: boolean) => {
    const selected = this.selectedData.includes(data);

    if (newSelectedState == true && selected)
      return this.selectedData;

    newSelectedState ??= !selected;

    this.selectedData = newSelectedState
      ? [...this.selectedData, data]
      : this.selectedData.filter(x => x !== data);
  };
}
