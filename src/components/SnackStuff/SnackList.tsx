import { Component, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import type { Snack, SnackWithVotes, SnackVote, Vote } from '../../typings/Snack';
import Button from '../atoms/Button';

import UpVoteSolid from '../../assets/icons/upvote-solid.svg';
import UpVoteEmpty from '../../assets/icons/upvote-empty.svg';
import DownVoteSolid from '../../assets/icons/downvote-solid.svg';
import DownVoteEmpty from '../../assets/icons/downvote-empty.svg';

const SnackListWrap = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.25rem;
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

const VotesContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  .vote-arrow {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    img {
      height: 1.5rem;
      width: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        transform: scale(1.1);
        filter: drop-shadow(2px 2px 1px #000);
      }
    }
    .vote-count {
      font-size: 0.8rem;
      color: var(--primary);
    }
  }
`;

interface SnackListProps {
  snacks: () => Snack[] | SnackWithVotes[]; // Accepts a function returning an array
  allowDeletion?: boolean;
  handleDeletion?: (snack: Snack | SnackWithVotes) => void;
  handleVote?: (snack: SnackWithVotes, vote: SnackVote) => void;
  snackVoteChecker?: (snack: SnackWithVotes) => SnackVote | null;
}

const SnackList: Component<SnackListProps> = (props) => {

  return (
    <SnackListWrap>
      <For each={props.snacks()}>
        {(snack) => (
          <li>
            { ('Votes' in snack && props.snackVoteChecker) && (
              <VotesContainer>
                <div class="vote-arrow" onClick={() => props.handleVote ? props.handleVote(snack, 'up') : () => {}}>
                  <img src={props.snackVoteChecker(snack) === 'up' ? UpVoteSolid : UpVoteEmpty} alt="" />
                  <span class="vote-count">{snack.Votes.filter((vote: Vote) => vote.vote === 'up').length}</span>
                </div>
                <div class="vote-arrow" onClick={() => props.handleVote ? props.handleVote(snack, 'down') : () => {}}>
                  <img src={props.snackVoteChecker(snack) === 'down' ? DownVoteSolid : DownVoteEmpty} alt="" />
                  <span class="vote-count">{snack.Votes.filter((vote: Vote) => vote.vote === 'down').length}</span>
                </div>
              </VotesContainer>
            )}
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
