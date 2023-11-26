import { Component, JSX } from 'solid-js';

interface ButtonProps {
  children: JSX.Element;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

const styles = `
  .button {
    background: var(--primary);
    color: var(--foreground);
    border-radius: 4px;
    outline: none;
    border: none;
    font-family: PoppinsBold;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }
  .button:hover {
    background: var(--primary-darker);
  }
`;

const sizes = {
  small: `.button {
    font-size: 0.75rem;
  }`,
  medium: `.button {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }`,
  large: `.button {
    font-size: 2rem;
    margin: 1rem auto;
    padding: 0.75rem 1.5rem;
  }`,
};

const Button: Component<ButtonProps> = (props) => {
  const size = props.size || 'medium';

  return (
    <>
      <style>{styles} {sizes[size]}</style>
      <button class="button" onClick={props.onClick}>
        {props.children}
      </button>
    </>
  );
};

export default Button;
