import {createPortal} from 'react-dom';
import type {ReactNode} from 'react';
import styled from 'styled-components';
import useOnClickOutside from '@/hooks/useClickOutside';
import {useRef} from 'react';

export type ContextMenuItem = {
  title: string,
  onClick: () => void,
}

type ContextMenuProps = {
  items: ContextMenuItem[],
  position: { x: number, y: number },
  onDismiss: () => void,
}

function ContextMenuPortal({children}: { children: ReactNode }) {
  return createPortal(children, document.getElementById('context-menu')!);
}

export const ContextMenu = ({items, position: {x, y}, onDismiss}: ContextMenuProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, onDismiss);

  const width = 205;
  const height = 40 * items.length;
  
  if (window.document.body.clientWidth < (x + width))
    x -= width;
  if (window.document.body.clientHeight < (y + height))
    y -= height;


  return (
    <ContextMenuPortal>
      <Wrapper ref={wrapperRef} style={{transform: `translate3d(${x}px, ${y}px, 0)`}}>
        {items.map((item,i) => (
          <CMItem onClick={() => {
            item.onClick();
            onDismiss();
          }} key={i}>{item.title}</CMItem>
        ))}
      </Wrapper>
    </ContextMenuPortal>
  );
};

const Wrapper = styled.div`
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  
  min-width: 200px;
  max-width: 200px;
  transition: 0.2s;
  
  @keyframes fade-in {
    from { opacity: 0;}
    to {opacity: 1;}
  }
  
  animation: fade-in 0.2s ease-in;
  
  background: #242424; // TODO: add Theme
  color: rgba(255, 255, 255, 0.87);
  border: 2px solid white;
`;

const CMItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  :hover {
    background: rgba(255, 255, 255, 0.09);
  }
`;
