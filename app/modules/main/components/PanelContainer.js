import React from 'react';
import Panel from "mesan-react-native-panel";

const PanelContainer = ({ data = [] }) => {
    return (
        <>
            {
                data.map((panel, index) => {
                    let renderItem = (panel?.renderItem) ? ({ item, index }) => panel?.renderItem({ item, index, panel }): null
                    let onPress = (panel?.onPress) ? () => panel.onPress(panel) : null;
                    return (
                        <Panel key={`panel_${index}`} {...panel} renderItem={renderItem} onPress={onPress}/>
                    )
                })
            }
        </>
    )
}

export default PanelContainer;