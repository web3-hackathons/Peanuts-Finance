import { useEffect, useState, useCallback, createContext, useContext, useMemo } from "react";
import { vaults, vaultImages, vaultName, vaultDeposited, vaultAddress, vaultTokenAddr } from "../../views/Vaults";
import { Typography, PageHeader, Col, Row, Input, Button } from "antd";
const { Title } = Typography;

const findVaultByName = (name) => {
    for (let i = 0; i < vaults.length; i += 1){
        if (name == vaults[i][vaultName]){
            return vaults[i]
        }    
    }
    return undefined
}

export default function PoolDetails({
    index_p,
    vaultName_p,
    parentStyle
}) {
    const [vaultInfo, setVaultInfo] = useState()
    if (index_p != undefined){
        setVaultInfo(vaults[index_p])
    } else if (vaultName_p != undefined){
        let temp = findVaultByName(vaultName_p)
        temp ? setVaultInfo(temp):""
    }
    
    return (
        <div style={{...parentStyle,
            borderRadius: "16px",
            backgroundColor: "#FFF",
            filter: "drop-shadow(8px 8px 4px #000"
        }}>
            {vaultInfo?(
                <Title level={3}>vaultInfo[vaultName]</Title>
            ):(
                <Title level={3}>No such vault!</Title>
            )}
            

        </div>
    )

}