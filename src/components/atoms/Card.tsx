import { Component, JSX } from 'solid-js';
import { styled } from 'solid-styled-components';

interface CardProps {
  children: JSX.Element;
  style?: string;
}

const StyledCard = styled('div')`
  background: var(--background-lighter);
  border-radius: 8px;
  overflow: hidden;
  padding: 0.5rem 1rem;
  box-shadow: 2px 2px 3px #0000005e;
`;

const Card: Component<CardProps> = (props) => {
  return (
    <StyledCard style={props.style || ''} >
      <div class="card">
        {props.children}
      </div>
    </StyledCard>
  );
};

export default Card;
