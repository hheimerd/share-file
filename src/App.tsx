import styled from 'styled-components';
import {useState} from 'react';
import {Tabs} from '@/components/Tabs';
import {Upload} from '@/pages/Upload';
import {Download} from '@/pages/Download';

function App() {

  const [tab, setTab] = useState(0);

  return (
    <AppWrapper className="App">
      <Tabs selected={tab} tabs={['Upload ⬆️', 'Download ⬇️']} onTabSelect={setTab}/>
      <ContentWrapper>
        <StyledUpload selected={tab == 0}/>
        <StyledDownload selected={tab == 1}/>
      </ContentWrapper>
    </AppWrapper>
  );
}

const StyledUpload = styled(Upload)<{ selected: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;

  visibility: ${({selected}) => selected ? 'visible' : 'hidden'};
  opacity: ${({selected}) => selected ? '1' : '0'};

`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledDownload = styled(Download)<{ selected: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;

  visibility: ${({selected}) => selected ? 'visible' : 'hidden'};
  opacity: ${({selected}) => selected ? '1' : '0'};
`;


const AppWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default App;
