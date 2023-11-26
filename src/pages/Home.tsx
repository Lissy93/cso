import { useUserEmail } from '../services/authService';

export default function HomePage() {

  const userEmail = useUserEmail();

  const getNameFromEmail = (email: string) => {
    return email.split('.')[0] || email;
  };

  return (
    <div>
      <h2>Hey {getNameFromEmail(userEmail())} 👋</h2>
    </div>
  );
}
