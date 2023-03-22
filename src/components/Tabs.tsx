import styled from 'styled-components';
import type {ReactNode} from 'react';

type TabsProps = {
  tabs: ReactNode[],
  selected: number,
  onTabSelect: (selected: number) => void,
  className?: string,
  selectionColor?: string
}

export const Tabs = ({className, tabs, selected, onTabSelect, selectionColor = 'rgba(255,255,255,0.82)'}: TabsProps) => {
  return (
    <TabsWrapper className={className}>
      {tabs.map((tab, i) => (
        <Tab key={i} selected={selected == i} selectionColor={selectionColor} onClick={() => onTabSelect(i)}>
          {tab}
        </Tab>
      ))}
    </TabsWrapper>
  );
};

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  
  height: 3rem;
`;

const Tab = styled.div<{selectionColor: string, selected: boolean}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;

  align-items: center;
  justify-content: space-around;

  cursor: pointer;
  vertical-align: center;
  transition: 0.2s;

  background: ${({selected}) => selected ? 'transparent' : 'rgba(0,0,0,0.3)'};
  border-top: 3px solid ${({selectionColor, selected}) => selected ? selectionColor : 'transparent'};
  
  :hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;
