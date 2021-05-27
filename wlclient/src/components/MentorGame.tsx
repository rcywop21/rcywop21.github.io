import React from 'react';
import Game from './Game';
import { GameProps, GameMentorProps } from './Game';
import { OnActionPopupMentorProps } from './Popups/OnActionPopup';
import { SocketContext } from '../socket/socket';
import './MentorGame.css';

const MentorGame = (props: GameProps): React.ReactElement => {
    const { playerState } = props;

    const socket = React.useContext(SocketContext);

    function handleActionApprove() {
        socket?.emit('action_ok');
    }

    function handleActionReject() {
        socket?.emit('action_reject');
    }

    const onActionPopupMentorProps: OnActionPopupMentorProps = {
        handleActionApprove: handleActionApprove,
        handleActionReject: handleActionReject,
    };

    const gameMentorProps: GameMentorProps = {
        onActionPopupMentorProps: onActionPopupMentorProps,
    };

    function onPause() {
        //Implement actual pause functionality
        if (playerState.pausedOxygen) {
            socket?.emit('pause', false);
        } else {
            socket?.emit('pause', true);
        }
    }

    return (
        <div className="mentorGame">
            <div className="mentorTopGap"></div>
            <h3>~ Mentor Powers! ~</h3>
            <span>
                <b>Pause</b> disables all player actions and pauses the oxygen
                timer.{' '}
            </span>
            <span>
                {playerState.pausedOxygen
                    ? 'Your team is currently paused. '
                    : ''}
            </span>
            <span>&emsp;</span>
            <button onClick={onPause}>
                {playerState.pausedOxygen ? 'Resume' : 'Pause'}
            </button>
            <Game
                {...props}
                isMentor={true}
                gameMentorProps={gameMentorProps}
            />
        </div>
    );
};

export default MentorGame;
