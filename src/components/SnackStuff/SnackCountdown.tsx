import { styled } from 'solid-styled-components';

import { fetchUserFromSession, useUserEmail } from '../../services/authService';

import supabase from '../../services/supabaseClient';
import toast from 'solid-toast';
import { Show, createResource, createSignal, createEffect, onCleanup } from 'solid-js';

const WelcomeMsg = styled('h2')`
  font-size: 3rem;
  text-transform: capitalize;
  margin: 0;
`;

const HomeHeader = styled('div')`
  max-width: 1200px;
  margin: 0.5rem auto 1rem auto;
  width: 80vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CountdownWrapper = styled('div')`
  span {
    display: block;
  }
  .next, .last {
    font-size: 0.8rem;
    opacity: 0.6;
    b {
      font-family: PoppinsBold;
      margin-left: 4px;
    }
  }
  .when {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const fetchSnackDeliveries = async () => {
  const userId = (await fetchUserFromSession())?.id;
  if (userId) {
    const { data, error } = await supabase
      .from('Orders')
      .select('*');
    if (error) {
      toast.error('Unable to fetch order delivery date.');
      return [];
    }
    return data;
  }
  return [];
};

interface Delivery {
  order_id: string;
  schedule_date: string;
}

const getNextDelivery = (deliveries: Delivery[]) => {
  const today = new Date();
  const nextDelivery = deliveries
  .sort(
    (a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime()
  )
  .find(delivery => {
    const deliveryDate = new Date(delivery.schedule_date);
    return deliveryDate > today;
  });
  return nextDelivery;
};

const getLastDelivery = (deliveries: Delivery[]) => {
  const today = new Date();
  const lastDelivery = deliveries
  .sort(
    (a, b) => new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime()
  )
  .find(delivery => {
    const deliveryDate = new Date(delivery.schedule_date);
    return deliveryDate < today;
  });
  return lastDelivery;
};

const makeCountDownString = (datetimeString: string | undefined): string => {
  if (!datetimeString) return 'Unknown';
  const inputDate = new Date(datetimeString);
  const currentDate = new Date();
  const diffMinutes = Math.floor((inputDate.getTime() - currentDate.getTime()) / (1000 * 60));
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60).toString().padStart(2, '0');
  const minutes = (diffMinutes % 60).toString().padStart(2, '0');
  const seconds = (Math.floor((inputDate.getTime() - currentDate.getTime()) / 1000) % 60).toString().padStart(2, '0');

  return `${days} days, ${hours}hrs ${minutes}:${seconds}`;
}

const makeCountUpString = (datetimeString: string | undefined): string => {
  if (!datetimeString) return 'Unknown';
  const inputDate = new Date(datetimeString);
  const formattedDate = inputDate.toLocaleDateString('en-US', { day: 'numeric',  month: 'long' });

  const day = inputDate.getDate();
  
  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) {
      suffix = 'st';
  } else if (day % 10 === 2 && day !== 12) {
      suffix = 'nd';
  } else if (day % 10 === 3 && day !== 13) {
      suffix = 'rd';
  }
  return `${formattedDate}${suffix}`;
}

export default function HomePage() {

  const userEmail = useUserEmail();
  const [deliveries] = createResource(fetchSnackDeliveries);

  const nextDelivery = () => getNextDelivery(deliveries() || []);
  const lastDelivery = () => getLastDelivery(deliveries() || []);

  const [countdown, setCountdown] = createSignal(makeCountDownString((nextDelivery() || {}).schedule_date));

  createEffect(() => {
    const interval = setInterval(() => {
      const next = nextDelivery();
      if (next) {
        setCountdown(makeCountDownString(next.schedule_date));
      }
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  const getNameFromEmail = (email: string) => {
    return email.split('.')[0] || email;
  };

  return (
    <HomeHeader>
      <WelcomeMsg>Hey {getNameFromEmail(userEmail())} 👋</WelcomeMsg>
      <CountdownWrapper>
        <Show when={deliveries.loading}>
          <span>Loading delivery dates...</span>
        </Show>
        <Show when={!deliveries.loading && nextDelivery()}>
          <span class="next">Next snack order arriving in</span>
          <span class="when">{countdown()}</span>
        </Show>
        <Show when={!deliveries.loading && lastDelivery()}>
          <span class="last">Last order was placed on
          <b>{makeCountUpString((lastDelivery() || {}).schedule_date)}</b></span>
        </Show>
      </CountdownWrapper>
    </HomeHeader>
  );
}
