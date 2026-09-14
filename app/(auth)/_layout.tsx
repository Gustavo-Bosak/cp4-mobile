import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { user, initializing } = useAuth();

  if (!initializing && user) {
    return <Redirect href="/(app)/index" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
