import { Component, createSignal, onCleanup } from 'solid-js';
import { styled } from 'solid-styled-components';
import { CircularProgress } from '@suid/material'

const LoadWrap = styled('div')`
  flex: 1;
  margin: 5rem auto;
  padding: 1rem;
  text-align: center;
  h2 {
    font-size: 4rem;
    margin: 0.5rem 0;
    &.meow { font-size: 8rem; }
  }
  p {
    font-size: 1rem;
    margin: 2rem auto;
    font-family: RobotoMono, sans-serif;
  }
`;

const Loading: Component = () => {

  const [isProbzError, setIsProbzError] = createSignal(false);

  const timer = setTimeout(() => setIsProbzError(true), 3500);

  onCleanup(() => clearTimeout(timer));

  return (
    <LoadWrap>
      { isProbzError()? (
        <>
        <h2>Oops</h2>
        <h2 class="meow">😿</h2>
        <p>
          It looks like something unexpected has happened
        </p>
        <p>
          Try refreshing the page, or logging in/out again.<br />
          If the issue persists, please report it so we can get it fixed.
        </p>
        </>
      ) : (
        <>
          <h2>Loading</h2>
          <CircularProgress color="secondary" size="128px" />
          <p>Just a sec...</p>
        </>
      )
      }
    </LoadWrap>
  );
};

export default Loading;
