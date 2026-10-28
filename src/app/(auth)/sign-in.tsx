import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function SignIn() {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
      <Text>Buffer</Text>
      <Text>Buffer</Text>
      <Text>Buffer</Text>
      <Text>Buffer</Text>
      <Text>Buffer</Text>
      <Text>Buffer</Text>
      <Link href="/">Go Home</Link>
    </View>
  );
}
