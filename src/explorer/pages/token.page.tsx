import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { selectExplorerEvent, verifyToken } from '../store/explorer.slice';
import { ExplorerEventName, ExplorerEventType } from '../store/explorer.state';

function TokenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const explorerEvent = useAppSelector(selectExplorerEvent);

  const [token, setToken] = useState('');
  const [storeToken, setStoreToken] = useState(false);

  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const [tokenInputDirty, setTokenInputDirty] = useState(false);

  function isFormInvalid(): boolean {
    return !token;
  }

  function submitForm(): void {
    if (isFormInvalid()) {
      return;
    }

    setSubmitInProgress(true);

    dispatch(verifyToken({ token, storeToken }));
  }

  function navigateTo(route: string): void {
    navigate(route);
  }

  // handle explorer events
  useEffect(() => {
    if (!explorerEvent) {
      return;
    }

    if (explorerEvent.name === ExplorerEventName.VerifyToken) {
      setSubmitInProgress(false);
      if (explorerEvent.type === ExplorerEventType.Success) {
        setInvalidToken(false);
        navigateTo('/repositories');
      } else {
        setInvalidToken(true);
      }
    }
  }, [explorerEvent]);

  return (
    <div className='dashboard'>
      <Panel className='p-panel--border mb-4 block'>
        <div className='grid place-items-center'>
          <p>
            <span className='pi pi-github !text-5xl'></span>
          </p>
          <p className='pt-2'>
            Welcome to <strong>GitHub Explorer</strong>
          </p>
          <p className='pt-2 text-center'>
            Please follow the intructions from panel below to start browsing GitHub public repositories.
          </p>
        </div>
      </Panel>

      <Panel header='GitHub Authentication' className='mb-4 block'>
        <form>
          <div className='mb-3'>Your API Token*</div>
          <div>
            <FloatLabel>
              <InputText
                value={token}
                invalid={tokenInputDirty && invalidToken}
                onChange={(e) => setToken(e.target.value)}
                onInput={() => setTokenInputDirty(true)}
                id='token'
                className='w-full'
              />
              <label htmlFor='token'>Token</label>
            </FloatLabel>
            {tokenInputDirty && invalidToken ? (
              <div className='text-error mt-1'>
                <small>
                  <p>Provided API Token is invalid.</p>
                  <p>
                    Please follow{' '}
                    <a
                      href='https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens'
                      target='_blank'
                      className='font-bold underline'
                    >
                      these instructions
                    </a>{' '}
                    to generate a new token.
                  </p>
                </small>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='mb-3 mt-3 flex items-center'>
            <Checkbox onChange={() => setStoreToken(!storeToken)} checked={storeToken} />
            <div className='ml-2'>Store token locally**</div>
          </div>
        </form>

        <div className='mt-4'>
          <Button className='block w-full' disabled={isFormInvalid()} onClick={submitForm}>
            {submitInProgress && <i className='pi pi-spin pi-spinner mr-1'></i>}
            <span>Start browsing</span>
          </Button>
        </div>

        <div className='mt-4'>
          <small className='block'>
            * By default, API Token is stored only temporarly on your machine as long as you are on this page.
          </small>
          <small className='block'>
            ** API Token can be stored locally in the browser (using <code>localStorage</code>) to simplify usage.
          </small>
        </div>
      </Panel>
    </div>
  );
}

export default TokenPage;
