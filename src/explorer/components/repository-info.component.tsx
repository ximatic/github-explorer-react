import moment from 'moment';

import { Panel } from 'primereact/panel';

import { Repository } from '../models/explorer.model';

export interface RepositoryInfoProps {
  repository: Repository;
}

export default function RepositoryInfo({ repository }: RepositoryInfoProps) {
  function getRepositoryDate(): string {
    return moment(new Date(repository.createdAt)).format('DD-MM-YYYY');
  }

  return (
    <div className='repository-info'>
      <Panel header={`${repository.owner}/${repository.name}`}>
        <div>
          <span className='pi pi-star-fill mr-2'></span>
          {repository.stars} | {getRepositoryDate()}
        </div>
        <div className='mt-1'>{repository.description}</div>
        {repository.url ? (
          <div className='mt-2'>
            <a href={repository.url} target='_blank' className='underline'>
              <span className='pi pi-link mr-2'></span>Repository URL
            </a>
          </div>
        ) : (
          ''
        )}
      </Panel>
    </div>
  );
}
