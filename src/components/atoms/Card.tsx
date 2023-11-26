import { Component, JSX } from 'solid-js';

interface CardProps {
  children: JSX.Element;
}

const styles = `
  .card {
    background: var(--background-lighter);
    border-radius: 8px;
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
