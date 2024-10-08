import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields')
    }
    
    setIsSubmitting(true)
    try {
      await signIn(form.email, form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      Alert.alert("Success","User signed in successfully")
      
      // after we get the result we'll set it to global state using context...
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false) // either way the loading is done
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center h-full px-4 my-6">
            <Image source={images.my_logo}
                  resizeMode='contain'
                  className="w-[115px] h-[35px]"
            />
            <Text className='text-2xl text-white text-semibold mt-10  font-psemibold'>Log in to VidAI</Text>

            <FormField 
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({...form, email: e})}
              otherStyles="mt-7"
              keyboardType="email-address"
              placeholder="Enter your email"
            />

            <FormField 
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({...form, password: e})}
              otherStyles="mt-7"
              placeholder="Enter your password"
            />

            <CustomButton 
              title="Sign In"
              handlePress={submit}
              containerStyles='mt-7'
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
                <Link href='/sign-up' className='text-lg font-psemibold text-secondary'>Sign Up</Link>
            </View>

          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn