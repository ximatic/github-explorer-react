import React, { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { ProgressSpinner } from 'primereact/progressspinner';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { defaultExplorerPagination, ExplorerPagination, Repository } from '../models/explorer.model';
import { selectRepositories, loadRepositories, selectExplorerEvent } from '../store/explorer.slice';
import { ExplorerEventName, ExplorerEventType } from '../store/explorer.state';

import RepositoryInfo from '../components/repository-info.component';
import Pagination from '../components/pagination.component';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

function RepositoriesPage() {
  const dispatch = useAppDispatch();

  const repositories = useAppSelector(selectRepositories);
  const explorerEvent = useAppSelector(selectExplorerEvent);

  const [loading, setLoading] = useState(true);
  const loadRepositoriesDispatched = useRef<boolean>(false);

  // pagination

  function onPaginationChange(pagination: ExplorerPagination): void {
    setLoading(true);
    dispatch(loadRepositories({ pagination }));
  }

  // handle explorer events
  useEffect(() => {
    if (!explorerEvent) {
      return;
    }

    if (explorerEvent.name === ExplorerEventName.LoadRepositories && explorerEvent.type === ExplorerEventType.Error) {
      setLoading(false);
    }
  }, [explorerEvent]);

  // handle repository
  useEffect(() => {
    if (!repositories) {
      return;
    }

    setLoading(false);
  }, [repositories]);

  // load repositories
  useEffect(() => {
    if (loadRepositoriesDispatched.current) {
      return;
    }

    loadRepositoriesDispatched.current = true;
    dispatch(loadRepositories({ pagination: defaultExplorerPagination }));
  }, []);

  return (
    <div className='repositories h-full'>
      {repositories ? (
        <React.Fragment>
          {repositories.map((repository: Repository) => (
            <div className={loading ? 'panel--disabled mb-4' : 'mb-4'} key={`${repository.owner}/${repository.name}`}>
              <Link to={{ pathname: `/${repository.owner}/${repository.name}` }}>
                <RepositoryInfo repository={repository} />
              </Link>
            </div>
          ))}
          <Pagination onPaginationChange={onPaginationChange} />
        </React.Fragment>
      ) : loading ? (
        <div className='grid h-full w-full place-items-center'>
          <ProgressSpinner />
        </div>
      ) : (
        <React.Fragment>
          <div>
            <Panel className='p-panel--border'>
              <div className='grid place-items-center'>
                <p>
                  <span className='pi pi-exclamation-circle !text-5xl'></span>
                </p>
                <p className='mt-2'>No repositories available.</p>
                <p className='mt-2'>Please refresh page or try again later.</p>
              </div>
            </Panel>
          </div>
          <div className='mt-4'>
            <Link to={{ pathname: '/' }}>
              <Button severity='secondary' className='block w-full'>
                <span>Home</span>
              </Button>
            </Link>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default RepositoriesPage;
