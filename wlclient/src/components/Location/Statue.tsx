import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { DynamicPlayerAction, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const Statue = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const coolDownMessage = playerState.streamCooldownExpiry[playerState.locationId]
        ? " You may reuse this service again at " + new Date(playerState.streamCooldownExpiry[playerState.locationId]).toLocaleTimeString()
        : "";

    const actions: Record<string, PlayerAction> = {
        [Actions.specificActions.STATUE.EXPLORE]: new DynamicPlayerAction("The Statue of Triton is a monument to Triton, famed hero of the Undersea. Walk around the statue to learn more about Triton.", 
            "Use 5 minutes of Oxygen.", "256px", "441px",
            (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
            (): void => { return; },),
        [Actions.specificActions.STATUE.DECODE_ENGRAVING]: new PlayerAction("You have found an engraving written in the ancient language. Decode it to learn what it says.", 
            "Decode 'Vwwh Ujaekgf'", "250px", "553px",
            (playerState) => playerState.knowsLanguage),
        [Actions.specificActions.STATUE.CAST_COOLING_AURA]: new PlayerAction("The Crimson's body temperature is kept low as part of its slumber. Prevent it from getting too high!",
            "Water Parade.", "414px", "324px",
            (playerState) => playerState.knowsCrimson),
        [Actions.specificActions.STATUE.STRENGTHEN_BEFUDDLEMENT]: new PlayerAction("A Befuddlement Spell keeps the Crimson from waking up. However, it may weaken over time, and you will have to strengthen it.",
            "Do 10 Jumping Jacks/Buddha Claps.", "125px", "122px",
            (playerState) => playerState.knowsCrimson),
        [Actions.specificActions.STATUE.POWER_CONTAINMENT]: new PlayerAction("The Containment Arrays attempt to isolate the Crimson so that it doesn't sense the artefacts and awaken. You will need to power it to keep the isolation secure.",
            "Everyone to present a different battery brand/type (including portable batteries).", "376px", "135px",
            (playerState) => playerState.knowsCrimson),
        [Actions.specificActions.STATUE.PURIFY_CORRUPTION]: new PlayerAction("As the Crimson begins to awaken, it will start to corrupt the surroundings. It draws even more power from this corruption. You will need to purify the corruption to keep the Crimson weak.",
            "Everyone to present a hand sanitiser of different brands.", "100px", "304px",
            (playerState) => playerState.knowsCrimson),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
            "No task required.", "870px", "488px",
            (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
        [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
            "No task required.", "870px", "543px",
            (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
            "No task required.", "689px", "100px"),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction("The Statue of Triton has a publicly-accessible storage of Oxygen, which slowly builds up 4 minutes of Oxygen every minute. You can get all the Oxygen inside this store. Note that this storage is shared between everyone." + coolDownMessage, 
            "Conduct a Water Parade (skip if fasting) to receive all Oxygen stored at the statue.",
            "826px", "238px",
            (playerState) => playerState.streamCooldownExpiry[playerState.locationId] ? new Date(playerState.streamCooldownExpiry[playerState.locationId]) : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => { setIsEnabled(true);},
            (setIsVisible, setIsEnabled): void => { setIsEnabled(false);},)
    }

    const actionProps = Object.entries(actions)
        .filter(([, playerAction]) => !(playerAction instanceof DynamicPlayerAction))
        .map(([actionId, playerAction]) => ({
            action: actionId,
            x: playerAction.x,
            y: playerAction.y,
            isVisible: isMentor ? 
                true :
                playerAction.getVisibility ? 
                    playerAction.getVisibility(playerState) : 
                    true,
            isEnabled: playerAction.getVisibility ? 
                playerAction.getVisibility(playerState) : true &&
                playerAction.getEnabled ? playerAction.getEnabled(playerState) : true,
            handleAction: handleAction(actionId),
            triggerTooltip: triggerTooltip,
            tooltipInfo: [actionId, playerAction.description, playerAction.task]
    }));
    
    const dynamicActionProps = Object.entries(actions)
        .filter(([, playerAction]) => playerAction instanceof DynamicPlayerAction)
        .map(([actionId, playerAction]) => {
            const dynamicPlayerAction = playerAction as DynamicPlayerAction;
            return {
                actionProps: {
                    action: actionId,
                    x: dynamicPlayerAction.x,
                    y: dynamicPlayerAction.y,
                    isVisible: isMentor ? 
                        true :
                        dynamicPlayerAction.getVisibility ? 
                            dynamicPlayerAction.getVisibility(playerState) : 
                            true,
                    isEnabled: dynamicPlayerAction.getVisibility ? 
                        dynamicPlayerAction.getVisibility(playerState) : true &&
                        dynamicPlayerAction.getEnabled ? dynamicPlayerAction.getEnabled(playerState) : true,
                    handleAction: handleAction(actionId),
                    triggerTooltip: triggerTooltip,
                    tooltipInfo: [actionId, dynamicPlayerAction.description, dynamicPlayerAction.task]
                },
                timeToCompare: dynamicPlayerAction.timeToCompare(playerState),
                howRecentToTrigger: dynamicPlayerAction.howRecentToTrigger,
                triggerEffectsIfRecent: dynamicPlayerAction.triggerEffectsIfRecent,
                triggerEffectsIfNotRecent: dynamicPlayerAction.triggerEffectsIfNotRecent
            };
        });
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('corals.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Statue;
