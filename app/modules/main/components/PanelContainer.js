import Panel from "mesan-react-native-panel";

const PanelContainer = ({ data = [] }) => {
    return (
        <>
            {
                data.map((panel, index) => {
                    return (
                        <Panel key={`panel_${index}`} {...panel}/>
                    )
                })
            }
        </>
    )
}

export default PanelContainer;