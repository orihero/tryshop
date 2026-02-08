import { useSignIn } from './useSignIn';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInForm from './components/SignInForm';

const SignIn = () => {
  const props = useSignIn();
  return (
    <AuthLayout onBack={props.handleBack}>
      <SignInForm {...props} />
    </AuthLayout>
  );
};

export default SignIn;
