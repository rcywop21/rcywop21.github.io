import React from 'react';

export interface InventoryItemProps {
    name: string;
}

const InventoryItem = (props: InventoryItemProps): React.ReactElement => {
    const { name } = props;
    
    return (<p>{name}</p>);
}

export default InventoryItem;