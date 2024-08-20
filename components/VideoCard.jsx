import { View, Text, Image, TouchableOpacity, ImageComponent } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'

const VideoCard = ({video: {title, thumbnail, video, creator: {username, avatar}}}) => {
    const [play, setPlay] = useState(false)
  return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center p-0.5">
                    <Image 
                        source={{uri: avatar}}
                        className="w-full h-full rounded-lg"
                        resizeMode='cover'
                    />
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                    <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
                </View>
            </View>
            <View className="pt-2">
                <Image source={icons.menu} className="w-5 h-5" resizeMode='contain' />
            </View>
        </View>

        {play ? (
            <Video 
            source={{uri: video}}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.COVER}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
                if(status.didJustFinish) {
                    setPlay(false)
                }
            }}
            onError={(error) => console.error('Video playback error:', error)}
        />
        ) : (
            <TouchableOpacity 
                className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
            >
                <Image 
                    source={{uri: thumbnail}} // in Image, if the source is a url we need to go by uri and then point to the url
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode='cover'
                />
                <Image 
                    source={icons.play} // but if it's a local image we can just do source and then point to the path of that image
                    className="w-12 h-12 absolute"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}

    </View>
  )
}

export default VideoCard