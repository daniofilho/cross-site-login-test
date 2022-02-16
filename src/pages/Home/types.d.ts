export type ComponentProps = {
  isLoading: boolean;
  userToken: string | null;

  signIn: (email: string) => Promise<void>;
  signOut: () => void;
};
