import React, { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { ProgressSpinner } from 'primereact/progressspinner';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { defaultExplorerPagination, ExplorerPagination, Repository } from '../models/explorer.model';
import { selectRepositories, loadRepositories, selectExplorerEvent } from '../store/explorer.slice';
import { ExplorerEventName } from '../store/explorer.state';

import RepositoryInfo from '../components/repository-info.component';
import Pagination from '../components/pagination.component';

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

    if (explorerEvent.name === ExplorerEventName.LoadRepositories) {
      setLoading(false);
    }
  }, [explorerEvent]);

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
            <div className={loading ? 'panel--disabled' : 'mb-4'} key={`${repository.owner}/${repository.name}`}>
              <Link to={{ pathname: 'repository' }}>
                <RepositoryInfo repository={repository} />
              </Link>
            </div>
          ))}
          <Pagination onPaginationChange={onPaginationChange} />
        </React.Fragment>
      ) : (
        <div className='grid h-full w-full place-items-center'>
          <ProgressSpinner />
        </div>
      )}
    </div>
  );
}

export default RepositoriesPage;
