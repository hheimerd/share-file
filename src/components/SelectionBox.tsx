import styled from 'styled-components';
import {useEffect} from 'react';
import {useRef} from 'react';

type SelectionBoxProps = {
  wrapper: HTMLDivElement,
  onIntersection: (target: Element[]) => void
};

export const SelectionBox = ({wrapper, onIntersection}: SelectionBoxProps) => {
  const selection = useRef({x: 0, y: 0, enabled: false});
  const selectionBox = useRef<HTMLDivElement | null>(null);


  const startSelect = (e: MouseEvent) => {
    if (!selectionBox.current)
      return;

    selection.current.x = e.clientX - wrapper.clientLeft;
    selection.current.y = e.clientY - wrapper.clientTop;
    selection.current.enabled = true;

    selectionBox.current.style.transform = `translate3D(${selection.current.x}px, ${selection.current.y}px, 0)`;
  };

  const moveSelection = (e: MouseEvent) => {
    if (!selection.current.enabled || !selectionBox.current)
      return;

    let width = e.clientX - wrapper.clientLeft - selection.current.x;
    let height = e.clientY - wrapper.clientTop - selection.current.y;

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

    selectionBox.current.style.transform = `translate3D(${left}px, ${top}px, 0)`;
    selectionBox.current.style.width = `${width}px`;
    selectionBox.current.style.height = `${height}px`;
  };

  const endSelect = () => {
    if (!selectionBox.current)
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

    selectionBox.current.style.width = '0';
    selectionBox.current.style.height = '0';
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
  }, [endSelect]);


  return (<SelectionBoxEl ref={selectionBox}/>);
};

const SelectionBoxEl = styled.div`
  background: rgba(114, 114, 255, 0.71);
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
`;
