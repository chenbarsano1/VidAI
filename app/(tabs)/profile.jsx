import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts, getUserPosts, searchPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { router, useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import InfoBox from '../../components/InfoBox'

const Profile = () => {
  const {user, setUser, setIsLoggedIn} = useGlobalContext()
  // get the data and rename it to posts, and then use useAppwrite which is a
  // custom hook to which we're passing a fucntion to it
  const {data: posts} = useAppwrite(() => getUserPosts(user.$id))

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in')
  }
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts} // passing the data
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => ( // how the data will be rendered
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => ( // the header component for the list
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity 
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image 
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image 
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
            </View>

            <InfoBox 
              title={user?.username}
              containerStyles='mt-5'
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles='mr-10'
                titleStyles="text-xl"
              />
              <InfoBox 
              title="1.2k"
              subtitle="Followers"
              titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile