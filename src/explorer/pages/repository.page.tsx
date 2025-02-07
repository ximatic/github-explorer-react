import React, { useEffect, useRef, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import moment from 'moment';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { defaultExplorerPagination, ExplorerPagination, RepositoryIssue } from '../models/explorer.model';
import { selectRepository, loadRepository, selectExplorerEvent } from '../store/explorer.slice';
import { ExplorerEventName, ExplorerEventType } from '../store/explorer.state';

import RepositoryInfo from '../components/repository-info.component';
import Pagination from '../components/pagination.component';

function RepositoryPage() {
  const dispatch = useAppDispatch();

  const routeParams = useParams<{ owner: string; name: string }>();
  const repository = useAppSelector(selectRepository);
  const explorerEvent = useAppSelector(selectExplorerEvent);

  const [loading, setLoading] = useState(true);
  const loadRepositoryDispatched = useRef<boolean>(false);

  // pagination

  function onPaginationChange(pagination: ExplorerPagination): void {
    setLoading(true);
    dispatchLoadRepository(pagination);
  }

  // other

  function dispatchLoadRepository(pagination: ExplorerPagination): void {
    const { owner, name } = routeParams;
    if (owner && name) {
      dispatch(loadRepository({ owner, name, pagination }));
    }
  }

  function getRepositoryIssueDate(issue: RepositoryIssue): string {
    return moment(new Date(issue.createdAt)).format('DD-MM-YYYY');
  }

  // handle explorer events
  useEffect(() => {
    if (!explorerEvent) {
      return;
    }

    if (explorerEvent.name === ExplorerEventName.LoadRepository && explorerEvent.type === ExplorerEventType.Error) {
      setLoading(false);
    }
  }, [explorerEvent]);

  // handle repository
  useEffect(() => {
    if (!repository) {
      return;
    }

    setLoading(false);
  }, [repository]);

  // load repositories
  useEffect(() => {
    if (loadRepositoryDispatched.current) {
      return;
    }

    loadRepositoryDispatched.current = true;
    dispatchLoadRepository(defaultExplorerPagination);
  }, []);

  return (
    <div className='repositories h-full'>
      {repository ? (
        <React.Fragment>
          <div className='mb-4'>
            <Link to={{ pathname: '/repositories' }}>
              <Button text severity='secondary' className='block !p-0'>
                <i className='pi pi-angle-left'></i>
                <span className='ml-1'>Repositories</span>
              </Button>
            </Link>
          </div>

          <div className='mb-4'>
            <RepositoryInfo repository={repository} />
          </div>

          <div className={loading ? 'panel--disabled mb-4' : 'mb-4'}>
            <Panel header='Issues'>
              {!repository.issues ? (
                <div>No issues available for selected repository.</div>
              ) : (
                repository.issues?.map((issue: RepositoryIssue, index: number) => (
                  <React.Fragment key={issue.url}>
                    <div className='mb-2'>
                      <div>
                        <span className='font-bold'>{issue.title}</span>
                        <a href={issue.url} target='_blank' className='ml-2' title='Issue URL'>
                          <span className='pi pi-link text-color'></span>
                        </a>
                      </div>
                      <div>
                        <small>
                          {issue.author} | {getRepositoryIssueDate(issue)}
                        </small>
                      </div>
                    </div>
                    {index < (repository.issues?.length || 0) - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </Panel>
          </div>
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
                <p className='mt-2'>No repository available.</p>
                <p className='mt-2'>Please refresh page or try again later.</p>
              </div>
            </Panel>
          </div>
          <div className='mt-4'>
            <Link to={{ pathname: '/repositories' }}>
              <Button severity='secondary' className='block w-full'>
                <span>Repositories</span>
              </Button>
            </Link>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default RepositoryPage;
