import { Component, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import toast from 'solid-toast';
import type { Snack } from '../../typings/Snack';

import supabase from '../../services/supabaseClient';
import Button from '../atoms/Button';


const SnackListWrap = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  li {
    position: relative;
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
    .delete {
      display: none;
      position: absolute;
      top: 0.1rem;
      right: 0.1rem;
      transform: scale(0.8);
    }
    &:hover {
      .delete {
        display: block;
      }
    }
  }
`;

interface SnackListProps {
  snacks: () => Snack[]; // Accepts a function returning an array
  allowDeletion?: boolean;
  handleDeletion?: (snack: Snack) => void;
}

const SnackList: Component<SnackListProps> = (props) => {
  return (
    <SnackListWrap>
      <For each={props.snacks()}>
        {(snack) => (
          <li>
            <img src={`https://snack-product-photo.as93.workers.dev/${snack.snack_name}/96`} alt="" />
            {snack.snack_name}
            <Show when={props.allowDeletion}>
              <span class="delete">
              <Button
                size="small"
                onClick={() => { props.handleDeletion ? props.handleDeletion(snack) : () => {}}}
              >
                Delete
              </Button>
              </span>
            </Show>
          </li>
        )}
      </For>
    </SnackListWrap>
  );
};

export default SnackList;
