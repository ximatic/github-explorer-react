import React, { useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import { useAppSelector } from '../../store/hooks';

import {
  defaultExplorerPagination,
  ExplorerPagination,
  ExplorerPaginationCursorKey,
  ExplorerPaginationItemsKey,
} from '../models/explorer.model';
import { selectPageInfo } from '../store/explorer.slice';

export interface PaginationProps {
  onPaginationChange: (pagination: ExplorerPagination) => void;
}

export default function Pagination({ onPaginationChange }: PaginationProps) {
  const pageInfo = useAppSelector(selectPageInfo);

  const [changeInProgress, setChangeInProgress] = useState(false);
  const [paginationOptions] = useState([
    {
      name: '5',
      code: 5,
    },
    {
      name: '10',
      code: 10,
    },
    {
      name: '25',
      code: 25,
    },
    {
      name: '50',
      code: 50,
    },
  ]);
  const [itemsPerPage, setItemsPerPage] = useState(defaultExplorerPagination.itemsValue);
  const pagination = useRef(defaultExplorerPagination);

  // pagination

  function previousPage(): void {
    if (!pageInfo) {
      return;
    }

    pagination.current = {
      itemsKey: ExplorerPaginationItemsKey.Last,
      itemsValue: itemsPerPage,
      cursorKey: ExplorerPaginationCursorKey.Before,
      cursorValue: `"${pageInfo.cursorStart}"`,
    };
    updatePagination();
  }

  function nextPage(): void {
    if (!pageInfo) {
      return;
    }

    pagination.current = {
      itemsKey: ExplorerPaginationItemsKey.First,
      itemsValue: itemsPerPage,
      cursorKey: ExplorerPaginationCursorKey.After,
      cursorValue: `"${pageInfo.cursorEnd}"`,
    };
    updatePagination();
  }

  function onItemsPerPageChanged(itemsPerPage: number): void {
    if (!pageInfo) {
      return;
    }

    // reset to default pagination and change itemsValue
    pagination.current = {
      ...defaultExplorerPagination,
      itemsValue: itemsPerPage,
    };
    setItemsPerPage(itemsPerPage);
    updatePagination();
  }

  function updatePagination(): void {
    setChangeInProgress(true);
    onPaginationChange(pagination.current);
  }

  // handle page info
  useEffect(() => {
    setChangeInProgress(false);
  }, [pageInfo]);

  return (
    <React.Fragment>
      {pageInfo ? (
        <div className='pagination flex w-full justify-center'>
          <Button
            icon='pi pi-angle-double-left'
            text
            severity='secondary'
            disabled={!pageInfo.hasPreviousPage || changeInProgress}
            onClick={previousPage}
            data-testid='pagination-prev-btn'
          />

          <Dropdown
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChanged(e.value)}
            options={paginationOptions}
            optionLabel='name'
            optionValue='code'
            disabled={changeInProgress}
            data-testid='pagination-dropdown'
          />

          <Button
            icon='pi pi-angle-double-right'
            text
            severity='secondary'
            disabled={!pageInfo.hasNextPage || changeInProgress}
            onClick={nextPage}
            data-testid='pagination-next-btn'
          />
        </div>
      ) : (
        ''
      )}
    </React.Fragment>
  );
}
