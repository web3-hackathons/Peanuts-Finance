export default function Overlay({...children}) {

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            zIndex: 99,
            backgroundColor: "rgba(0,0,0,0.25)"
        }} {...children} />
    )
}