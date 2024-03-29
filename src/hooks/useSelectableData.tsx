import {useState} from 'react';
import {useCallback} from 'react';


export function useSelectableData<T>(initialData: T[] = []) {
  const [selectedData, setSelectedData] = useState<T[]>(initialData);
  const clearSelectedData = useCallback(() => setSelectedData([]), []);

  const toggleSelectedData = useCallback((data: T, newSelectedState?: boolean) => {
    setSelectedData(oldValues => {
      const selected = oldValues.includes(data);

      if (newSelectedState == true && selected)
        return oldValues;

      newSelectedState ??= !selected;

      return  newSelectedState
        ? [...oldValues, data]
        : oldValues.filter(x => x !== data);
    });
  }, []);


  return {selectedData, toggleSelectedData, clearSelectedData};
}
