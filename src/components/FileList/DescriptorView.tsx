import folderIcon from '@/assets/icons/folder.svg';
import {getIcon} from 'material-file-icons';
import styled, {css} from 'styled-components';
import type {HTMLAttributes, MouseEvent as ReactMouseEvent} from 'react';
import type {BackDescriptor, Descriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';
import {useRef} from 'react';

type FileLinkProps = {
  descriptor: Descriptor | BackDescriptor,
  selected: boolean,
  dragFilesCount?: number
} & HTMLAttributes<HTMLDivElement>

const DOUBLE_CLICK_DELAY = 400;

export function DescriptorView({descriptor, selected, dragFilesCount = 0, onDoubleClickCapture, ...divProps}: FileLinkProps) {
  const prevClick = useRef(false);

  // Default double click doesn't work when click many times in a row
  const doubleClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (prevClick.current == false) {
      prevClick.current = true;
      setTimeout(() => prevClick.current = false, DOUBLE_CLICK_DELAY);
    } else {
      onDoubleClickCapture?.(e);
    }
  };

  return (

    <FileLinkEl draggable={true}
      {...divProps}
      selected={selected}
      onClickCapture={doubleClick}
    >
      <IconWrapper>
        {isDir(descriptor)
          ? <img src={folderIcon} alt="folder"/>
          : <div dangerouslySetInnerHTML={{__html: getIcon(descriptor.name).svg}}/>
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
