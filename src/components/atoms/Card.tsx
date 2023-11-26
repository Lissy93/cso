import { Component, JSX } from 'solid-js';

interface CardProps {
  children: JSX.Element;
}

const styles = `
  .card {
    background: var(--background-lighter);
    border-radius: 8px;
    overflow: hidden;
    padding: 0.5rem 1rem;
    box-shadow: 2px 2px 3px #0000005e;
  }
`;

const Card: Component<CardProps> = (props) => {
  return (
    <>
      <style>{styles}</style>
      <div class="card">
        {props.children}
      </div>
    </>
  );
};

export default Card;
