import { styled } from 'solid-styled-components';
import { createResource, Show } from 'solid-js';

import { fetchUserFromSession } from '../../services/authService';

import Card from '../atoms/Card';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const DataTable = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0.5rem;
  max-width: 500px;
  li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    .lbl {
      font-family: PoppinsBold, sans-serif;
      font-weight: bold;
    }
    .val {
      font-family: RobotoMono, monospace;
    }
    img {
      border-radius: 4px;
      margin: 0.1rem 0;
    }
    &:not(:last-child) {
      border-bottom: 1px solid var(--background-lighter-lighter);
    }
  }
`;

const SmallText = styled('p')`
  font-size: 0.75rem;
  opacity: 0.5;
  margin: 0.5rem 0;
`;


const formatDate = (date: string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return `${d.toLocaleTimeString('en-GB', timeOptions)} on ${d.toLocaleDateString('en-GB', dateOptions)}`;
};

export default function AccountInfo() {

  const [session] = createResource(fetchUserFromSession);

  return (
    <Card style="grid-row-start: span 2;">
      <SubHeading>Account</SubHeading>
      <DataTable>
        <Show when={session()?.user_metadata}>
          <li>
            <span class="lbl">Full Name</span>
            <span class="val">{session()?.user_metadata.full_name}</span>
          </li>
          <li>
            <span class="lbl">Picture</span>
            <img src={session()?.user_metadata.picture} alt="Profile" width="96" />
          </li>
          {session()?.user_metadata?.custom_claims?.hd && (
            <li>
              <span class="lbl">Org Domain</span>
              <span class="val">{session()?.user_metadata.custom_claims.hd}</span>
            </li>
          )}
        </Show>
        <li>
          <span class="lbl">Email</span>
          <span class="val">{session()?.email}</span>
        </li>
        <li>
          <span class="lbl">Status</span>
          <span class="val">{session()?.role}</span>
        </li>
        {session()?.app_metadata?.provider && (
          <li>
            <span class="lbl">Auth Method</span>
            <span class="val">{session()?.app_metadata?.provider}</span>
          </li>
        )}
        <li>
          <span class="lbl">Created</span>
          <span class="val">{formatDate(session()?.created_at)}</span>
        </li>
        <li>
          <span class="lbl">Last Sign In</span>
          <span class="val">{formatDate(session()?.last_sign_in_at)}</span>
        </li>
      </DataTable>

      <SmallText>
        This account is managed by an SSO provider.<br />
        To update, export or delete your account data, you must do so via their website.
      </SmallText>
    </Card>
  );
}
