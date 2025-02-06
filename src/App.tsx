import { Routes, Route } from 'react-router-dom';

import { PrimeReactProvider } from 'primereact/api';

import TokenPage from './explorer/pages/token.page';
import RepositoriesPage from './explorer/pages/repositories.page';
import RepositoryPage from './explorer/pages/repository.page';

import Header from './explorer/components/header.component';

import './App.scss';

function App() {
  return (
    <PrimeReactProvider>
      <div className='flex h-full w-full justify-center'>
        <div className='main flex h-screen w-full max-w-5xl flex-col xl:border-x'>
          <div>
            <Header></Header>
          </div>

          <div className='grow p-3 md:p-5'>
            <Routes>
              <Route path='/' element={<TokenPage />} />
              <Route path='/repositories' element={<RepositoriesPage />} />
              <Route path='/repository' element={<RepositoryPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
