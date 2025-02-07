import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { ProgressSpinner } from 'primereact/progressspinner';

import { useAppDispatch, useAppSelector } from './store/hooks';

import { selectToken, verifyToken } from './explorer/store/explorer.slice';

import TokenPage from './explorer/pages/token.page';
import RepositoriesPage from './explorer/pages/repositories.page';
import RepositoryPage from './explorer/pages/repository.page';

import Header from './explorer/components/header.component';

import './App.scss';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector(selectToken);

  const [loading, setLoading] = useState(true);
  // TODO - consider better solution
  const storageToken = useRef<string>(JSON.parse(localStorage.getItem('gh-explorer-token') || '""'));
  const verifyTokenDispatched = useRef<boolean>(false);

  useEffect(() => {
    if (verifyTokenDispatched.current) {
      return;
    }

    if (storageToken.current) {
      dispatch(verifyToken({ token: storageToken.current, storeToken: false }));
      verifyTokenDispatched.current = true;
    } else {
      navigate('/');
      setLoading(false);
    }
  }, [storageToken]);

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(false);
  }, [token]);

  return (
    <div className='flex h-full w-full justify-center'>
      <div className='main flex h-screen w-full max-w-5xl flex-col xl:border-x'>
        {loading ? (
          <div className='grid h-full w-full place-items-center'>
            <ProgressSpinner />
          </div>
        ) : (
          <React.Fragment>
            <div>
              <Header></Header>
            </div>

            <div className='grow p-3 md:p-5'>
              <Routes>
                <Route path='/' element={<TokenPage />} />
                <Route path='/repositories' element={<RepositoriesPage />} />
                <Route path='/:owner/:name' element={<RepositoryPage />} />
              </Routes>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default App;
