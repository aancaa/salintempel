import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { UserAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '../components/Layout';

const Login = () => {
  const { googleSignIn, user, signIn } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {}
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate('/');
    }
  }, [user]);

  return (
    <Layout title="Login">
      <div className="flex items-center flex-col gap-5 justify-center pt-5">
        <h1 className="text-4xl font-bold text-center">
          Sign in to your account
        </h1>
        <p className="py-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="underline">
            register here.
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col py-2">
            <label className="mb-2block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black rounded-md px-3 py-2 w-full"
              type="email"
            />
          </div>
          <div className="flex flex-col py-2">
            <label className="mb-2block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black rounded-md px-3 py-2 w-full"
              type="password"
            />
          </div>
          <button className="w-full mt-10 mx-auto font-bold py-3 px-4 rounded border border-black shadow-sm hover:bg-black hover:text-white transition-all duration-300">
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-between w-full gap-5">
          <div className="w-full border-b border-slate-700"></div>
          <p className="py-2 w-full max-w-xs text-slate-700">
            Or continue with
          </p>
          <div className="w-full border-b border-slate-700"></div>
        </div>

        <button onClick={() => handleGoogleSignIn()}>
          <FcGoogle className="inline-block text-3xl" />
        </button>
      </div>
    </Layout>
  );
};

export default Login;
