import folderIcon from '@/assets/icons/folder.svg';
import {getIcon} from 'material-file-icons';
import styled from 'styled-components';
import type {HTMLAttributes} from 'react';
import {css} from 'styled-components';
import type {AnyDescriptor, BackDescriptor} from '@/entities/Descriptor';
import { isDir} from '@/entities/Descriptor';

type FileLinkProps = {
  descriptor: AnyDescriptor | BackDescriptor,
  selected: boolean,
  dragFilesCount?: number
} & HTMLAttributes<HTMLDivElement>

export function FileLink({descriptor, selected, dragFilesCount = 0, ...divProps}: FileLinkProps) {
  return (

    <FileLinkEl draggable={true}
      {...divProps}
      selected={selected}
    >
      <IconWrapper>
        {isDir(descriptor)
          ? <img src={folderIcon} alt="folder"/>
          : <div dangerouslySetInnerHTML={{__html: getIcon(descriptor.path).svg}}/>
        }
      </IconWrapper>
      <span>{descriptor.name}</span>
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
  height: 7.5rem;
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

    text-align: center;
    ${({selected}) => !selected && css`
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}

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
