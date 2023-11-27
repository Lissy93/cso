import { Component, For } from 'solid-js';
import { styled } from 'solid-styled-components';

const SnackListWrap = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  li {
    background: var(--background);
    // padding: 0.5rem 0.75rem;
    border-radius: 4px;
    text-transform: capitalize;
    box-shadow: 1px 1px 1px #000;
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      width: 3rem;
      border-radius: 4px;
    }
  }
`;

interface SnackListProps {
  snacks: () => any[]; // Accepts a function returning an array
}

const SnackList: Component<SnackListProps> = (props) => {
  return (
    <SnackListWrap>
      <For each={props.snacks()}>
        {(snack) => (
          <li>
            <img src={`https://snack-product-photo.as93.workers.dev/${snack.snack_name}/96`} alt="" />
            {snack.snack_name}
          </li>
        )}
      </For>
    </SnackListWrap>
  );
};

export default SnackList;
