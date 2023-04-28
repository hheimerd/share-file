import styled from 'styled-components';
import {useEffect} from 'react';
import {useRef} from 'react';
import {memo} from 'react';

type SelectionBoxProps = {
  wrapper: HTMLDivElement,
  onIntersection: (target: Element[]) => void
};

type SelectionType = {x: number, y: number, enabled: boolean, rect: DOMRect | null}

export const SelectionBox = memo(({wrapper, onIntersection}: SelectionBoxProps) => {
  const selection = useRef<SelectionType>({x: 0, y: 0, enabled: false, rect: null});
  const selectionBox = useRef<HTMLDivElement | null>(null);

  const startSelect = (e: MouseEvent) => {
    if (!selectionBox.current || selection.current.enabled)
      return;

    selection.current.rect = wrapper.getBoundingClientRect();
    selection.current.x = e.clientX - selection.current.rect.left;
    selection.current.y = e.clientY - selection.current.rect.top;
    selection.current.enabled = true;

    selectionBox.current.style.transform = `translate3D(${selection.current.x}px, ${selection.current.y}px, 0)`;
  };

  const moveSelection = (e: MouseEvent) => {
    if (!selection.current.enabled || !selectionBox.current)
      return;

    let width = e.clientX - selection.current.rect!.left - selection.current.x;
    let height = e.clientY - selection.current.rect!.top - selection.current.y;

    let top = selection.current.y;
    let left = selection.current.x;

    // Handle inverted selection
    if (width < 0) {
      width *= -1;
      left -= width;
    }

    if (height < 0) {
      height *= -1;
      top -= height;
    }

    selectionBox.current.style.visibility = 'visible';
    selectionBox.current.style.transform = `translate3D(${left}px, ${top}px, 0)`;
    selectionBox.current.style.width = `${width}px`;
    selectionBox.current.style.height = `${height}px`;
  };

  const endSelect = () => {
    if (!selectionBox.current || !selection.current.enabled)
      return;

    selection.current.enabled = false;

    const selectorBox = selectionBox.current?.getBoundingClientRect();

    const targets = Array.from(wrapper.getElementsByClassName('selectable'));

    onIntersection(targets.filter(x => {
      const box = x.getBoundingClientRect();

      return box.bottom > selectorBox.top
        && box.right > selectorBox.left
        && box.top < selectorBox.bottom
        && box.left < selectorBox.right;
    }));

    selectionBox.current.style.visibility = 'hidden';
  };

  useEffect(() => {
    document.addEventListener('mouseup', endSelect);
    wrapper.addEventListener('pointerdown', startSelect);
    wrapper.addEventListener('pointermove', moveSelection);

    return () => {
      wrapper.removeEventListener('pointerdown', moveSelection);
      wrapper.removeEventListener('pointermove', moveSelection);
      document.removeEventListener('mouseup', endSelect);
    };
  }, [endSelect, moveSelection, startSelect, wrapper]);


  return (<SelectionBoxEl ref={selectionBox}/>);
});

SelectionBox.displayName = 'SelectionBox';

const SelectionBoxEl = styled.div`
  visibility: hidden;
  background: rgba(114, 114, 255, 0.71);
  border: 1px solid rgb(114, 114, 255);
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
`;
