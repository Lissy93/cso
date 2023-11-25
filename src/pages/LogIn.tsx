import supabase from '../services/supabaseClient';

const LoginPage = () => {
	

  const signInWithGoogle = async () => {
    // setIsPending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    // setIsPending(false);
    if (error) {
      alert(error.message);
    }
  }

  // const handleLogin = async () => {
  //   let { user, session, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google'
  //   });

  //   supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //   })
    

  //   // Handle the response (e.g., navigate to home page, display error)
  // };

  return (
    <div>
      <p>Let's get started!</p>
      <p>In order to put your snack requests in, verify who you are by logging in with your work </p>
      <button onClick={signInWithGoogle}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
