/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import {
    PlayerState,
    Actions,
    questIds,
    itemDetails,
    GlobalState,
    Locations,
} from 'wlcommon';
import { ActionProps } from './components/Location/Action';
import { DynamicActionProps } from './components/Location/DynamicAction';
import {
    ActionHandlerCreator,
    TooltipTrigger,
} from './components/Location/LocationComponent';
import './PlayerAction.css';
import { formatTime } from './util';

export type StatePredicate = (playerState: PlayerState) => boolean;
export type DescriptionCreator = (
    playerState: PlayerState,
    globalState: GlobalState
) => React.ReactNode;

export class PlayerAction {
    display: string;
    description: string;
    task: string;
    x: string;
    y: string;
    optionalDescription?: DescriptionCreator;
    getVisibility?: StatePredicate;
    getEnabled?: StatePredicate;
    isVisible: boolean;
    isEnabled: boolean;
    constructor(
        display: string,
        description: string,
        task: string,
        x: string,
        y: string,
        optionalDescription?: DescriptionCreator,
        visibility?: StatePredicate,
        enabled?: StatePredicate
    ) {
        this.display = display;
        this.description = description;
        this.task = task;
        this.x = x;
        this.y = y;
        this.isVisible = true;
        this.isEnabled = true;
        this.optionalDescription = optionalDescription;
        this.getVisibility = visibility;
        this.getEnabled = enabled;
    }
}

export class DynamicPlayerAction extends PlayerAction {
    timeToCompare: (ps: PlayerState) => Date;
    howRecentToTrigger: number;
    triggerEffectsIfRecent: (
        v: (b: boolean) => void,
        e: (b: boolean) => void
    ) => void;
    triggerEffectsIfNotRecent: (
        v: (b: boolean) => void,
        e: (b: boolean) => void
    ) => void;

    constructor(
        display: string,
        description: string,
        task: string,
        x: string,
        y: string,
        timeToCompare: (ps: PlayerState) => Date,
        howRecentToTrigger: number,
        triggerEffectsIfRecent: (
            v: (b: boolean) => void,
            e: (b: boolean) => void
        ) => void,
        triggerEffectsIfNotRecent: (
            v: (b: boolean) => void,
            e: (b: boolean) => void
        ) => void,
        optionalDescription?: DescriptionCreator,
        visibility?: StatePredicate,
        enabled?: StatePredicate
    ) {
        super(
            display,
            description,
            task,
            x,
            y,
            optionalDescription,
            visibility,
            enabled
        );
        this.timeToCompare = timeToCompare;
        this.howRecentToTrigger = howRecentToTrigger;
        this.triggerEffectsIfRecent = triggerEffectsIfRecent;
        this.triggerEffectsIfNotRecent = triggerEffectsIfNotRecent;
    }
}

export const makeActionProps = (
    actions: Record<string, PlayerAction>,
    isMentor: boolean | undefined,
    playerState: PlayerState,
    handleAction: ActionHandlerCreator,
    triggerTooltip: TooltipTrigger,
    globalState: GlobalState
): ActionProps[] =>
    Object.entries(actions)
        .filter(
            ([, playerAction]) => !(playerAction instanceof DynamicPlayerAction)
        )
        .map(([actionId, playerAction]) => {
            const isVisible = playerAction.getVisibility
                ? playerAction.getVisibility(playerState)
                : true;

            const isEnabled =
                isVisible &&
                (playerAction.getEnabled
                    ? playerAction.getEnabled(playerState)
                    : true);

            const actionDescription = (
                <React.Fragment>
                    <p>{playerAction.description}</p>
                    {playerAction.optionalDescription && playerAction.optionalDescription(playerState, globalState)}
                </React.Fragment>
            );

            return {
                display: playerAction.display,
                action: actionId,
                x: playerAction.x,
                y: playerAction.y,
                isVisible: isVisible || !!isMentor,
                isEnabled,
                handleAction: handleAction(actionId),
                triggerTooltip,
                tooltipInfo: [
                    playerAction.display,
                    actionDescription,
                    playerAction.task,
                ],
            };
        });

export const makeDynamicActionProps = (
    actions: Record<string, PlayerAction>,
    isMentor: boolean | undefined,
    playerState: PlayerState,
    handleAction: ActionHandlerCreator,
    triggerTooltip: TooltipTrigger,
    globalState: GlobalState
): DynamicActionProps[] =>
    Object.entries(actions)
        .filter(
            ([, playerAction]) => playerAction instanceof DynamicPlayerAction
        )
        .map(([actionId, playerAction]) => {
            const dynamicPlayerAction = playerAction as DynamicPlayerAction;

            const isVisible = dynamicPlayerAction.getVisibility
                ? dynamicPlayerAction.getVisibility(playerState)
                : true;
            const isEnabled =
                isVisible &&
                (dynamicPlayerAction.getEnabled
                    ? dynamicPlayerAction.getEnabled(playerState)
                    : true);

            const actionDescription = (
                <React.Fragment>
                    <p>{playerAction.description}</p>
                    {playerAction.optionalDescription && playerAction.optionalDescription(playerState, globalState)}
                </React.Fragment>
            );

            return {
                actionProps: {
                    display: dynamicPlayerAction.display,
                    action: actionId,
                    x: dynamicPlayerAction.x,
                    y: dynamicPlayerAction.y,
                    isVisible: isVisible || !!isMentor,
                    isEnabled,
                    handleAction: handleAction(actionId),
                    triggerTooltip: triggerTooltip,
                    tooltipInfo: [
                        dynamicPlayerAction.display,
                        actionDescription,
                        dynamicPlayerAction.task,
                    ],
                },
                timeToCompare: dynamicPlayerAction.timeToCompare(playerState),
                howRecentToTrigger: dynamicPlayerAction.howRecentToTrigger,
                triggerEffectsIfRecent:
                    dynamicPlayerAction.triggerEffectsIfRecent,
                triggerEffectsIfNotRecent:
                    dynamicPlayerAction.triggerEffectsIfNotRecent,
            };
        });

const makeOxygenStreamMessage: DescriptionCreator = (playerState, globalState) => {
    return (
        <React.Fragment>
            {playerState.challengeMode && (
                <p className="warning">As you are in Challenge Mode, you will receive {
                    playerState.knowsCrimson ?  `only ${Math.max(15, 12.5 + 2.5 * globalState.artefactsFound).toFixed(1)}% of the stated Oxygen amount!` : 'less Oxygen than stated!'
                }</p>
            )}
            {playerState.streamCooldownExpiry[playerState.locationId] && (
                <p className="informative">You can use this Oxygen Stream starting from {formatTime(new Date(playerState.streamCooldownExpiry[playerState.locationId]))}.</p>
            )}
        </React.Fragment>
    )
}

const lastUsedMessage = (
    playerState: PlayerState,
    globalState: GlobalState
) => {
    const { lastTeam, lastExtract } = globalState.tritonOxygen;
    const lastTeamLbl = lastTeam === undefined ? 'an unknown person' : `Team ${lastTeam}`;

    return (
        <React.Fragment>
            <p>This Oxygen Stream was last used by {lastTeamLbl} at {formatTime(new Date(lastExtract))}.</p>
            {makeOxygenStreamMessage(playerState, globalState)}
        </React.Fragment>
    )
};

const oxygenPumpActions = {
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
        'Store Oxygen',
        'Store all your Oxygen (except 1.5 mins, enough for you to resurface) into your Oxygen Pump.',
        'No task required.',
        '870px',
        '488px',
        (playerState) => {
            if (playerState.storedOxygen === null)
                return (<p className="warning">This action is disabled as you do not have an oxygen pump.</p>);
            if (playerState.challengeMode !== null)
                return (<p className="warning">This action is disabled as you are in Challenge Mode.</p>);
        },
        (playerState) =>
            playerState.storedOxygen !== null &&
            playerState.challengeMode !== null
    ),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction(
        'Withdraw Oxygen',
        'Withdraw all Oxygen from your Oxygen Pump.',
        'No task required.',
        '870px',
        '543px',
        (playerState) => {
            if (playerState.storedOxygen === null)
                return (<p className="warning">This action is disabled as you do not have an oxygen pump.</p>);
            if (playerState.challengeMode !== null)
                return (<p className="warning">This action is disabled as you are in Challenge Mode.</p>);
        },
        (playerState) =>
            playerState.storedOxygen !== null &&
            playerState.challengeMode !== null
    ),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
        'Resurface',
        'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
        'No task required.',
        '729px',
        '101px'
    ),
}

export const allPlayerActions = {
    [Locations.locationIds.ALCOVE]: {
        [Actions.specificActions.ALCOVE.RETRIEVE_PEARL]: new PlayerAction(
            'Retrieve Pearl',
            "You know what you're here for.",
            'As a team, present 8 items to your mentors which match the color of each item in this image: https://imgur.com/a/61SICv6',
            '409px',
            '399px',
            (playerState) => { 
                if (playerState.inventory[itemDetails.PEARL.id]?.qty)
                    return <p className="warning">You already have a Pearl of Asclepius.</p>
            },
            undefined,
            (playerState) =>
                !playerState.inventory[itemDetails.PEARL.id]?.qty
        ),
    },
    [Locations.locationIds.ANCHOVY]: {
        [Actions.specificActions.ANCHOVY.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'Anchovy Avenue is a residential district. The Chief Librarian of the Marine Library is said to live here.',
            'Use 5 minutes of Oxygen.',
            '466px',
            '354px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.LIBRARIAN_PASS])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.LIBRARIAN_PASS]
        ),
        [Actions.specificActions.ANCHOVY.INSPIRE]: new PlayerAction(
            'Inspire Chief Librarian',
            'Inspire the Chief Librarian with your leadership!',
            'Have any member of your team perform Project Inspire.',
            '294px',
            '533px',
            (playerState) => {
                if (playerState.quests[questIds.LIBRARIAN_PASS]?.status === 'completed')
                    return <p className="warning">You have already inspired the Chief Librarian.</p>;
                if (playerState.quests[questIds.LIBRARIAN_PASS]?.status !== 'incomplete')
                    return <p className="warning">You have not met the Chief Librarian yet.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.LIBRARIAN_PASS],
            (playerState) =>
                playerState.quests[questIds.LIBRARIAN_PASS]?.status === 'incomplete',
        ),
    },
    [Locations.locationIds.BARNACLE]: {
        [Actions.specificActions.BARNACLE.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'Barnacle Residences is a residential district. The Pyrite Lady is said to live here.',
            'Use 5 minutes of Oxygen.',
            '445px',
            '211px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.PYRITE])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.PYRITE]
        ),
        [Actions.specificActions.BARNACLE.HELP]: new PlayerAction(
            'Help Pyrite Lady',
            'The Pyrite Lady has mixed up some of her potion ingredients. Help her!',
            'Create a list of team members in your group, sorted from youngest to oldest.',
            '437px',
            '471px',
            (playerState) => {
                if (playerState.quests[questIds.PYRITE]?.status === 'completed')
                    return <p className="warning">You have already helped the Pyrite Lady.</p>;
                if (playerState.quests[questIds.PYRITE]?.status !== 'incomplete')
                    return <p className="warning">You have not met the Pyrite Lady yet.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.PYRITE],
            (playerState) =>
                playerState.quests[questIds.PYRITE]?.status === 'incomplete',
        ),
    },
    [Locations.locationIds.BUBBLE]: {
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'The Bubble Factory is one of the largest sources of Oxygen in the Undersea, giving a user 40 minutes of Oxygen. However, you will need a Bubble Pass to use it.',
            'Each of you has to show a different item from the following: Pencil case, phone application and items you bring on a holiday.',
            '55px',
            '239px',
            (playerState) =>
                new Date(
                    playerState.streamCooldownExpiry[playerState.locationId] ??
                        0
                ),
            0,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(true);
            },
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (playerState, globalState) => {
                if (!playerState.hasBubblePass)
                    return <p className="warning">You cannot use this Oxygen Stream without a Bubble Pass.</p>
                else 
                    return makeOxygenStreamMessage(playerState, globalState);
            },
            undefined,
            (playerState) =>
                playerState.inventory[itemDetails.BUBBLE.id]?.qty > 0
        ),
    },
    [Locations.locationIds.CATFISH]: {
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'The Oxygen Stream at Catfish Crescent is curiously linked with the one located at Salmon Street. Both need to be activated at roughly the same time, before you can receive 40 minutes of Oxygen.',
            'Recite Red Cross Promise.',
            '558px',
            '152px',
            (playerState) =>
                playerState.streamCooldownExpiry[playerState.locationId]
                    ? new Date(
                          playerState.streamCooldownExpiry[
                              playerState.locationId
                          ]
                      )
                    : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(true);
            },
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            makeOxygenStreamMessage
        ),
    },
    [Locations.locationIds.CORALS]: {
        [Actions.specificActions.CORALS.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'The Memorial Corals is a location of historical importance. There are various exhibits in the park. You can spend some time to look around the exhibits.',
            'Use 5 minutes of Oxygen.',
            '743px',
            '265px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.FINCHES])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.FINCHES]
        ),
        [Actions.specificActions.CORALS.LEARN_LANG]: new PlayerAction(
            'Learn Language',
            'The ancient language of the Undersea is interesting. Devote some time to learning it.',
            "Gather items: 2 brushes, 2 pieces of paper, 2 storybooks; Each person then has to say 'hi' in a different language and say what language it is.",
            '427px',
            '419px',
            (playerState) => {
                switch (playerState.quests[questIds.FINCHES]?.status) {
                    case 'completed':
                        return <p className="warning">You have already learnt this language.</p>;
                    case 'incomplete':
                        return;
                    default:
                        return <p className="warning">You have not explored enough of this area to learn this language.</p>;
                }
            },
            (playerState) =>
                !!playerState.quests[questIds.FINCHES],
            (playerState) => !playerState.knowsLanguage
        ),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'There is a small oxygen stream at the Memorial Corals. By Undersea law, after topping up Oxygen, you must wait 10 minutes before you can top up Oxygen at the same Oxygen Stream.',
            'Each person has to present a fully filled water bottle to the mentors to receive 20 minutes of Oxygen.',
            '108px',
            '438px',
            (playerState) =>
                playerState.streamCooldownExpiry[playerState.locationId]
                    ? new Date(
                          playerState.streamCooldownExpiry[
                              playerState.locationId
                          ]
                      )
                    : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(true);
            },
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            makeOxygenStreamMessage
        ),
    },
    [Locations.locationIds.KELP]: {
        [Actions.specificActions.KELP.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            "The Kelp Plains is full of seaweed, and stretches for miles and miles, and is full of seaweed. Perhaps you can find what you're looking for here.",
            'Use 5 minutes of Oxygen.',
            '73px',
            '347px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.SHRINE_1])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.SHRINE_1]
        ),
        [Actions.specificActions.KELP.CLIMB_DOWN]: new PlayerAction(
            'Climb Down Valley',
            'You have found a small shrine tucked away in a valley. However, the journey there looks difficult.',
            'Online Maze: https://www.mathsisfun.com/games/mazes.html. Complete one Hard maze.',
            '360px',
            '487px',
            (playerState) => {
                if (playerState.quests[questIds.SHRINE_1]?.status === 'completed')
                    return <p className="warning">You have already found the way to the Shrine of the Innocent. Use &lsquo;Travel&rsquo; to revisit it.</p>;
                if (playerState.quests[questIds.SHRINE_1]?.status !== 'incomplete')
                    return <p className="warning">You have not explored enough of the area to do this.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.SHRINE_1],
            (playerState) =>
                playerState.quests[questIds.SHRINE_1]?.status === 'incomplete'
        ),
        [Actions.specificActions.KELP.HARVEST]: new PlayerAction(
            'Harvest',
            'Harvest some blinkseed here.',
            'Have a member receive a message from the mentors. The rest of you have to lipread what he/she is saying.',
            '510px',
            '284px'
        ),
    },
    [Locations.locationIds.LIBRARY]: {
        [Actions.specificActions.LIBRARY.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'Talk to the librarians about the collection of the Marine Library.',
            'Use 5 minutes of Oxygen.',
            '432px',
            '385px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.ARTEFACTS_1])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.ARTEFACTS_1]
        ),
        [Actions.specificActions.LIBRARY.STUDY_CRIMSON]: new PlayerAction(
            'Study Challenge Mode',
            'Learn more about Challenge Mode, an ancient ritual which outsiders from the Undersea went through.',
            'Have any member share an incident when things did not go as planned for a training/ project and how did the plan get adapted.',
            '99px',
            '503px',
            (playerState) => {
                if (!playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty)
                    return <p className="warning">You need a Library Pass to access tomes about Challenge Mode.</p>;
                if (playerState.knowsCrimson)
                    return <p className="warning">You already know about Challenge Mode.</p>;
                if (playerState.quests[questIds.FINCHES_2])
                    return <p className="warning">You haven&apos;t learnt enough about Challenge Mode outside of the Library yet.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.FINCHES_2],
            (playerState) =>
                !!playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty && !playerState.knowsCrimson
        ),
        [Actions.specificActions.LIBRARY.STUDY_ARTEFACT]: new PlayerAction(
            'Study Artefact Legends',
            'Learn more about the artefacts.',
            'Create a new group cheer and do it to energise yourselves.',
            '630px',
            '202px',
            (playerState) => {
                if (!playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty)
                    return <p className="warning">You need a Library Pass to access tomes about artefacts.</p>;
                if (playerState.quests[questIds.ARTEFACTS_2])
                    return <p className="warning">You have already found the books about artefacts.</p>;
                if (!playerState.quests[questIds.ARTEFACTS_1])
                    return <p className="warning">You haven&apos;t explored the Library enough yet to study these books.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.ARTEFACTS_1],
            (playerState) =>
                !!playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty && !playerState.quests[questIds.ARTEFACTS_2]
        ),
        [Actions.specificActions.LIBRARY.DECODE_ARTEFACT]: new PlayerAction(
            'Decode Artefact Legends',
            'The books about artefact legends are written in an ancient language. You will need to decode it before you can understand it.',
            "Decode 'Hwljaxawv Ljalgf'.",
            '703px',
            '265px',
            (playerState) => {
                if (!playerState.knowsLanguage)
                    return <p className="warning">You don&apos;t know enough about the ancient language to decode these books.</p>;
                if (playerState.quests[questIds.ARTEFACTS_3])
                    return <p className="warning">You have already decoded these books.</p>;
                if (!playerState.quests[questIds.ARTEFACTS_2])
                    return <p className="warning">You haven&apos;t studied the books enough to decode them yet.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.ARTEFACTS_2],
            (playerState) => playerState.knowsLanguage && !playerState.quests[questIds.ARTEFACTS_3]
        ),
    },
    [Locations.locationIds.SALMON]: {
        [Actions.specificActions.SALMON.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'Salmon Street is a residential district. It was built around an Oxygen Stream located here.',
            'Use 5 minutes of Oxygen.',
            '578px',
            '362px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.ARGUMENT])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.ARGUMENT]
        ),
        [Actions.specificActions.SALMON.CONFRONT]: new PlayerAction(
            'Confront',
            'The children are chasing each other with a long, pointed stick. Tell them what is right.',
            'Have any member of your team correct the children using Project MTW.',
            '142px',
            '542px',
            (playerState) => {
                if (playerState.quests[questIds.ARGUMENT]?.status === 'completed')
                    return <p className="warning">You have already confronted the children.</p>;
                if (playerState.quests[questIds.ARGUMENT]?.status !== 'incomplete')
                    return <p className="warning">You have not met anybody to confront yet.</p>;
            },
            (playerState) =>
                !!playerState.quests[questIds.ARGUMENT],
            (playerState) =>
                playerState.quests[questIds.ARGUMENT]?.status === 'incomplete',
        ),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'The Oxygen Stream at Salmon Street is curiously linked with the one located at Catfish Crescent. Both need to be activated at roughly the same time, before you can receive 40 minutes of Oxygen.',
            'Recite Red Cross Promise.',
            '827px',
            '127px',
            (playerState) =>
                playerState.streamCooldownExpiry[playerState.locationId]
                    ? new Date(
                          playerState.streamCooldownExpiry[
                              playerState.locationId
                          ]
                      )
                    : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(true);
            },
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            makeOxygenStreamMessage
        ),
    },
    [Locations.locationIds.SHALLOWS]: {},
    [Locations.locationIds.SHORES]: {
        [Actions.specificActions.SHORES.DIVE]: new PlayerAction(
            'Dive',
            'Dive into the deep, blue sea. After diving, you will enter the Shallows location inside the Undersea. You will start your dive with 20 minutes of Oxygen.',
            'Create a shape resembling a diving board with all of your arms.',
            '445px',
            '309px'
        ),
    },
    [Locations.locationIds.SHRINE]: {
        [Actions.specificActions.SHRINE.GIVE_HAIR]: new PlayerAction(
            "Give Unicorn's Hair",
            "The shrinekeeper says he can transform a Unicorn's Hair into a Unicorn's Tear.",
            "Give 1 x Unicorn's Hair.",
            '434px',
            '449px',
            (playerState) => {
                if (!playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty)
                    return <p className="warning">You don&apos;t have any Unicorn Hair to give.</p>
            },
            undefined,
            (playerState) =>
                !!playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty
        ),
        [Actions.specificActions.SHRINE.COLLECT_HAIR]: new PlayerAction(
            'Collect Unicorn Tear',
            'Collect the Unicorn Tear from the Shrine.',
            'No task required.',
            '434px',
            '495px',
            (playerState) => {
                if (playerState.quests[questIds.SHRINE_2]?.stages[4])
                    return <p className="warning">You have not reached the final stage of the Shrine of the Innocent quest yet.</p>
                if (playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty)
                    return <p className="warning">You already have a Unicorn Tear.</p>
            },
            (playerState) => playerState.quests[questIds.SHRINE_2]?.stages[4],
            (playerState) =>
                !playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty
        ),
    },
    [Locations.locationIds.STATUE]: {
        [Actions.specificActions.STATUE.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'The Statue of Triton is a monument to Triton, famed hero of the Undersea. Walk around the statue to learn more about Triton.',
            'Use 5 minutes of Oxygen.',
            '256px',
            '441px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.ARTEFACTS_4]?.status === 'completed')
                    return <p className="warning">You have already explored this location.</p>
                if (playerState.foundEngraving)
                    return <p className="warning">There doesn&apos;t seem to be anymore interesting things here...</p>
            },
            undefined,
            (playerState) => !playerState.foundEngraving || playerState.quests[questIds.ARTEFACTS_4]?.status === 'incomplete'
        ),
        [Actions.specificActions.STATUE.DECODE_ENGRAVING]: new PlayerAction(
            'Decode Engraving',
            'You have found an engraving written in the ancient language. Decode it to learn what it says.',
            "Decode 'Vwwh Ujaekgf'",
            '250px',
            '553px',
            (playerState) => {
                if (!playerState.foundEngraving)
                    return <p className="warning">You have not found this engraving yet.</p>;
                if (!playerState.knowsLanguage)
                    return <p className="warning">You don&apos;t know enough the ancient language to decode the engraving.</p>;
                if (playerState.quests[questIds.FINCHES_2])
                    return <p className="warning">You have already decoded this engraving.</p>;
            },
            (playerState) => playerState.foundEngraving,
            (playerState) => playerState.knowsLanguage && !playerState.quests[questIds.FINCHES_2],
        ),
        /*
        [Actions.specificActions.STATUE.CAST_COOLING_AURA]: new PlayerAction(
            'Cast Cool Aura',
            "The Crimson's body temperature is kept low as part of its slumber. Prevent it from getting too high!",
            'Water Parade.',
            '414px',
            '324px',
            undefined,
            () => false,
            (playerState) =>
                playerState.quests[questIds.CHAPTER_3]?.status === 'incomplete'
        ),
        [Actions.specificActions.STATUE
            .STRENGTHEN_BEFUDDLEMENT]: new PlayerAction(
            'Befuddle Harder',
            'A Befuddlement Spell keeps the Crimson from waking up. However, it may weaken over time, and you will have to strengthen it.',
            'Do 10 Jumping Jacks/Buddha Claps.',
            '125px',
            '122px',
            undefined,
            (playerState) => playerState.knowsCrimson,
            (playerState) =>
                playerState.quests[questIds.CHAPTER_3]?.status === 'incomplete'
        ),
        [Actions.specificActions.STATUE.POWER_CONTAINMENT]: new PlayerAction(
            'Contain Power',
            "The Containment Arrays attempt to isolate the Crimson so that it doesn't sense the artefacts and awaken. You will need to power it to keep the isolation secure.",
            'Everyone to present a different battery brand/type (including portable batteries).',
            '376px',
            '135px',
            undefined,
            (playerState) => playerState.knowsCrimson,
            (playerState) =>
                playerState.quests[questIds.CHAPTER_3]?.status === 'incomplete'
        ),
        [Actions.specificActions.STATUE.PURIFY_CORRUPTION]: new PlayerAction(
            'Purify Corruption',
            'As the Crimson begins to awaken, it will start to corrupt the surroundings. It draws even more power from this corruption. You will need to purify the corruption to keep the Crimson weak.',
            'Everyone to present a hand sanitiser of different brands.',
            '100px',
            '304px',
            undefined,
            (playerState) => playerState.knowsCrimson,
            (playerState) =>
                playerState.quests[questIds.CHAPTER_3]?.status === 'incomplete'
        ),
        */
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'The Statue of Triton has a publicly-accessible storage of Oxygen, which slowly builds up 1 minute of Oxygen every minute. You can get all the Oxygen inside this store. Note that this storage is shared between everyone.',
            'Conduct a Water Parade to receive all Oxygen stored at the statue.',
            '826px',
            '238px',
            (playerState) =>
                playerState.streamCooldownExpiry[playerState.locationId]
                    ? new Date(
                          playerState.streamCooldownExpiry[
                              playerState.locationId
                          ]
                      )
                    : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(true);
            },
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            lastUsedMessage
        ),
    },
    [Locations.locationIds.STORE]: {
        [Actions.specificActions.STORE.BUY_MAP]: new DynamicPlayerAction(
            'Buy Map',
            'This map will let you find your way to more locations in the Undersea.',
            'Pay 5 minutes of Oxygen to receive 1 x Map.',
            '577px',
            '549px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen
                        ? new Date(Date.now() + playerState.pausedOxygen)
                        : new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            undefined
        ),
        [Actions.specificActions.STORE.BUY_GUIDE]: new DynamicPlayerAction(
            'Buy Guide',
            "It's an introduction of all the Oxygen Streams in the Undersea.",
            'Pay 5 minutes of Oxygen to receive 1 x Guide to the Oxygen Streams of the Undersea.',
            '717px',
            '308px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
                        ? new Date(Date.now() + playerState.pausedOxygen)
                        : new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            undefined,
            undefined,
            (playerState) => !playerState.inventory[itemDetails.OXYGEN_GUIDE.id]
        ),
        [Actions.specificActions.STORE.BUY_DOLL]: new DynamicPlayerAction(
            'Buy Doll',
            "It's a doll of The Little Mermaid! How cute UWU.",
            'Pay 10 minutes of Oxygen to receive 1 x Mermaid Doll.',
            '451px',
            '221px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            600000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            }
        ),
        [Actions.specificActions.STORE.BUY_DISCOVERS]: new DynamicPlayerAction(
            'Buy Ticket',
            'This ticket lets you go on the full tour of the Statue of Triton.',
            'Pay 20 minutes of Oxygen to receive 1 x UnderseaDiscovers Ticket.',
            '278px',
            '140px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            1200000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            }
        ),
        [Actions.specificActions.STORE.BUY_PUMP]: new DynamicPlayerAction(
            'Buy Pump',
            "This pump allows you to store all your Oxygen before you resurface, so it doesn't go to waste.",
            'Pay 30 minutes of Oxygen to receive 1 x Oxygen Pump.',
            '810px',
            '209px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            1800000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            undefined,
            (playerState) => !playerState.inventory['Pump']
        ),
        [Actions.specificActions.STORE.BUY_BLACK_ROCK]: new DynamicPlayerAction(
            'Buy Rock',
            "It's a strange looking black rock. There are odd markings on it. Nobody knows what its uses, or properties are...",
            'Pay 30 minutes of Oxygen to receive 1 x Mysterious Black Rock.',
            '252px',
            '495px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            1800000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            }
        ),
        [Actions.specificActions.STORE.BUY_BUBBLE_PASS]: new DynamicPlayerAction(
            'Buy Bubble Pass',
            'This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.',
            'Pay 40 minutes of Oxygen to receive 1 x Bubble Pass.',
            '433px',
            '344px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            2400000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            }
        ),
    },
    [Locations.locationIds.TUNA]: {
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'There is a large Oxygen Stream here, however, it has fallen into disrepair. Getting Oxygen from here will be slightly more challenging, but you can still expect to get 30 minutes of Oxygen here.',
            '2 members of your team will EACH have to draw an item while blindfolded, guided by the rest of the team. Your mentors will tell the other members of the team the items to draw. You cannot say the name of these items.',
            '198px',
            '491px',
            (playerState) =>
                playerState.streamCooldownExpiry[playerState.locationId]
                    ? new Date(
                          playerState.streamCooldownExpiry[
                              playerState.locationId
                          ]
                      )
                    : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(true);
            },
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            makeOxygenStreamMessage
        ),
    },
    [Locations.locationIds.UMBRAL]: {
        [Actions.specificActions.UMBRAL.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'This is a shady, run-down area. Apparently it used to be a residential district, but the Oxygen Stream here vanished one day, suddenly. As you walk around the ruins, a cold shiver runs down your spine.',
            'Use 5 minutes of Oxygen.',
            '656px',
            '402px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : playerState.pausedOxygen 
						? new Date(Date.now() + playerState.pausedOxygen)
						: new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            (playerState) => {
                if (playerState.quests[questIds.CLOAK_1])
                    return <p className="warning">You have already explored this location.</p>
            },
            undefined,
            (playerState) => !playerState.quests[questIds.CLOAK_1]
        ),
        [Actions.specificActions.UMBRAL.GIVE_PAN]: new PlayerAction(
            'Show Pyrite Pan',
            'Show Alyusi the Pyrite Pan.',
            'Draw a pan using the Zoom whiteboard. It should look similar to the pan on the top of the screen.',
            '579px',
            '197px',
            (playerState) => {
                if (!playerState.inventory[itemDetails.PYRITE_PAN.id])
                    return <p className="warning">You don&apos;t have a Pyrite Pan to show Alyusi.</p>
            },
            (playerState) =>
                playerState.quests[questIds.CLOAK_1]?.status === 'incomplete',
            (playerState) =>
                !!playerState.inventory[itemDetails.PYRITE_PAN.id]?.qty
        ),
        [Actions.specificActions.UMBRAL.GIVE_ROCK]: new PlayerAction(
            'Give Chmyrrkyth',
            'Give Alyusi the Chmyrrkyth.',
            'Give Alyusi something that fits his description of Chmyrrkyth.',
            '749px',
            '177px',
            (playerState) => {
                if (!playerState.inventory[itemDetails.BLACK_ROCK.id])
                    return <p className="warning">You don&apos;t have a Chmyrrkyth to give Alyusi.</p>
            },
            (playerState) =>
                playerState.quests[questIds.CLOAK_2]?.status === 'incomplete',
            (playerState) =>
                playerState.inventory[itemDetails.BLACK_ROCK.id] !== undefined
        ),
    },
    [Locations.locationIds.WOODS]: {
        [Actions.specificActions.WOODS.GET_HAIR]: new PlayerAction(
            'Get Hair',
            'It is said that a herd of unicorns live in the Whispering Woods, and they only appear to the pure of heart. Fortunately, we only need to find the hair that they shed.',
            "Share a point in time when you received help and support from others to receive 1 x Unicorn's Hair.",
            '703px',
            '382px',
            (playerState) => {
                if (playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty) 
                    return <p className="warning">You already have a Unicorn&apos;s Hair.</p>
                if (playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty) 
                    return <p className="warning">You already have a Unicorn Tear.</p>
            },
            undefined,
            (playerState) =>
                !(
                    playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty ||
                    playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty
                )
        ),
    },
};

Object.keys(allPlayerActions).forEach((key) => {
    if (Locations.locationsMapping[key]?.undersea)
        Object.assign(allPlayerActions[key], oxygenPumpActions);
})
