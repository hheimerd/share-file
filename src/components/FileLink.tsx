import folderIcon from '@/assets/icons/folder.svg';
import {getIcon} from 'material-file-icons';
import styled from 'styled-components';
import type {FileLink as FLink} from '@/entities/FileLink';
import type {HTMLAttributes} from 'react';

type FileLinkProps = {
  fileLink: FLink,
  selected: boolean,
  dragFilesCount?: number
} & HTMLAttributes<HTMLDivElement>

export function FileLink({fileLink, selected, dragFilesCount = 0, ...divProps}: FileLinkProps) {
  return (

    <FileLinkEl draggable={true}
      {...divProps}
      selected={selected}

    >
      <IconWrapper>
        {fileLink.isFolder
          ? <img src={folderIcon} alt="folder"/>
          : <div dangerouslySetInnerHTML={{__html: getIcon(fileLink.path).svg}}/>
        }
      </IconWrapper>
      <span>{fileLink.name}</span>
      {
        dragFilesCount > 1 &&
        <PlusNDrag>
          +{dragFilesCount - 1}
        </PlusNDrag>
      }
    </FileLinkEl>
  );
}

const FileLinkEl = styled.div<{ selected: boolean }>`
  width: 5rem;
  height: 7rem;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  transition: 0.1s;

  img {
    height: 4rem;
    object-fit: contain;
    margin: 0 auto;
    user-drag: none;
    user-select: none;
  }

  span {
    word-break: break-word;
    padding: 0 0.3rem;
    border-radius: 2px;
    background: ${({selected}) => selected ? 'rgba(114,114,255,0.71)' : 'transparent'};
    font-size: 0.8em;
  }
`;

const IconWrapper = styled.div`
  height: 4rem;
  margin-bottom: 0.5rem;
`;

const PlusNDrag = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: aliceblue;
  height: 1.5rem;
  text-align: center;
  width: 1.5rem;
  border-radius: 2px;
  color: black;
`;
