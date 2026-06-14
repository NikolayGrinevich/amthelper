import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<'Auth' | 'Main'>('Auth')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      setInitialRoute(session ? 'Main' : 'Auth')
      setIsLoading(false)
    })

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInitialRoute(session ? 'Main' : 'Auth')
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {initialRoute === 'Auth' ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainStack} />
      )}
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
    </Stack.Navigator>
  )
}

function MainStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documents' }} />
      <Tab.Screen name="Deadlines" component={DeadlinesScreen} options={{ title: 'Deadlines' }} />
      <Tab.Screen name="Letters" component={LettersScreen} options={{ title: 'Letters' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  )
}

// Placeholder screens
function SignInScreen() {
  return null
}

function SignUpScreen() {
  return null
}

function DocumentsScreen() {
  return null
}

function DeadlinesScreen() {
  return null
}

function LettersScreen() {
  return null
}

function AccountScreen() {
  return null
}
