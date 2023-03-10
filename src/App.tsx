import {DragAndDropZone} from '@/components/DragAndDropZone';
import styled from 'styled-components';

function App() {
  return (
    <AppWrapper className="App" >
      <DragAndDropZone onFileDropped={console.log}>
        Test
      </DragAndDropZone>
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default App
