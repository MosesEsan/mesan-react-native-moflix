import React, { } from 'react';
import { SafeAreaView } from 'react-native';

// NAVIGATION
import { useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import YoutubePlayer from "react-native-youtube-iframe";
import Orientation from 'react-native-orientation-locker';

// CONFIG
import { colors } from "../core/Config"

export default function MediaPlayer(props) {
    const route = useRoute();
    const video = route.params?.video;
    
    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        if (isFullScreen) {
            Orientation.lockToLandscape();
        } else {
            Orientation.lockToPortrait();
        }
        return () => {
            Orientation.unlockAllOrientations();
        }

    }, [section]);

    // function checkFullScreen(isFullScreen) {
    //     if (isFullScreen) {
    //         Orientation.lockToLandscape();
    //     } else {
    //         Orientation.lockToPortrait();
    //     }
    // }

    // ==========================================================================================
    //6 - RENDER VIEW
    //==========================================================================================
    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor:colors.primary}}>
            <YoutubePlayer
                height={300}
                play={true}
                videoId={video?.key}
            // onChangeState={onStateChange}
            // onFullScreenChange={checkFullScreen}
            />
        </SafeAreaView>
    );
}
