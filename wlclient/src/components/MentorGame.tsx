import React from 'react';
import Game from './Game';
import { GameProps, GameMentorProps } from './Game';
import { OnActionPopupMentorProps } from './Popups/OnActionPopup';
import { SocketContext } from '../socket/socket';

const MentorGame = (props: GameProps): React.ReactElement => {
    
    const socket = React.useContext(SocketContext);
    
    function handleActionApprove() {
        socket?.emit("action_ok");
    }
    
    function handleActionReject() {
        socket?.emit("action_reject");
    }
    
    const onActionPopupMentorProps: OnActionPopupMentorProps = {
        handleActionApprove: handleActionApprove,
        handleActionReject: handleActionReject
    }
    
    const gameMentorProps: GameMentorProps = {
        onActionPopupMentorProps: onActionPopupMentorProps
    }
    
    return (
        <div>
            <div style={{height: "70px"}}></div>
            <span style={{border: "2px solid green"}}>Mentor Powers!</span>
            <Game {...props} isMentor={true} gameMentorProps={gameMentorProps}/>
        </div>
    );
}

export default MentorGame;