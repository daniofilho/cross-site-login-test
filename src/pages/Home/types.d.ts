export type ComponentProps = {
  isLoading: boolean;
  userToken: string | null;
  isCentralSite: boolean;

  signIn: (email: string) => Promise<void>;
  signOut: (silent?: boolean) => void;
};
