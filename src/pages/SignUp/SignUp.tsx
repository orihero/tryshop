import { useSignUp } from './useSignUp';
import AuthLayout from '@/components/auth/AuthLayout';
import SignUpForm from './components/SignUpForm';

const SignUp = () => {
  const props = useSignUp();
  return (
    <AuthLayout
      onBack={props.handleBack}
      contentClassName="px-6 pt-8 pb-6 flex flex-col overflow-y-auto"
      contentStyle={{ maxHeight: '85vh' }}
    >
      <SignUpForm {...props} />
    </AuthLayout>
  );
};

export default SignUp;
