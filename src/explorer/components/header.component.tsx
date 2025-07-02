import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { reset, selectToken } from '../store/explorer.slice';

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector(selectToken);

  const [logoutVisible, setLogoutVisible] = useState(false);

  const headerCenterContent = (
    <React.Fragment>
      <div className='flex w-full'>
        <div className='grow text-center'>
          <span className='pi pi-github mr-2'></span>
          GitHub Explorer
        </div>
      </div>
    </React.Fragment>
  );

  const headerEndContent = (
    <React.Fragment>
      {logoutVisible ? (
        <Button icon='pi pi-power-off' text severity='secondary' onClick={resetToken} data-testid='button-logout'></Button>
      ) : (
        ''
      )}
    </React.Fragment>
  );

  function resetToken(): void {
    dispatch(reset());
    navigate('/');
  }

  // handle token
  useEffect(() => {
    setLogoutVisible(!!token);
  }, [token]);

  return <Toolbar center={headerCenterContent} end={headerEndContent}></Toolbar>;
}
