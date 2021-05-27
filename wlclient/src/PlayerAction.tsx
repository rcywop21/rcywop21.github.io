/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

export type StatePredicate = (playerState: PlayerState) => boolean;
export type DescriptionPredicate = (
    playerState: PlayerState,
    globalState?: GlobalState
) => string;

export class PlayerAction {
    display: string;
    description: string;
    task: string;
    x: string;
    y: string;
    optionalDescription?: DescriptionPredicate;
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
        optionalDescription?: DescriptionPredicate,
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
        optionalDescription?: DescriptionPredicate,
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
    globalState?: GlobalState
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

            const actionDescription = playerAction.optionalDescription
                ? playerAction.description +
                  playerAction.optionalDescription(playerState, globalState)
                : playerAction.description;

            return {
                display: playerAction.display,
                action: actionId,
                x: playerAction.x,
                y: playerAction.y,
                isVisible: isVisible || !!isMentor,
                isEnabled,
                handleAction: handleAction(actionId),
                triggerTooltip: triggerTooltip,
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
    globalState?: GlobalState
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

            const actionDescription = dynamicPlayerAction.optionalDescription
                ? dynamicPlayerAction.description +
                  dynamicPlayerAction.optionalDescription(
                      playerState,
                      globalState
                  )
                : dynamicPlayerAction.description;

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

const coolDownMessage = (playerState: PlayerState) =>
    playerState.streamCooldownExpiry[playerState.locationId]
        ? ' You may reuse this service again at ' +
          new Date(
              playerState.streamCooldownExpiry[playerState.locationId]
          ).toLocaleTimeString() +
          '.'
        : '';

const lastUsedMessage = (
    playerState: PlayerState,
    globalState: GlobalState
) => {
    const display = globalState?.tritonOxygen.lastExtract
        ? ' This Oxygen stream was last used on ' +
          new Date(globalState?.tritonOxygen.lastExtract).toLocaleTimeString() +
          '.'
        : ' No group has used this Oxygen stream yet! Be the first!';
    return coolDownMessage(playerState) + display;
};

export const allPlayerActions = {
    [Locations.locationIds.ALCOVE]: {
        [Actions.specificActions.ALCOVE.RETRIEVE_PEARL]: new PlayerAction(
            'Retrieve Pearl',
            "You know what you're here for.",
            'Receive 1 x Pearl of Asclepius.',
            '409px',
            '399px',
            undefined,
            undefined,
            (playerState) =>
                playerState.inventory[itemDetails.UNICORN_TEAR.id] == null
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
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
            (playerState) => !playerState.quests[questIds.LIBRARIAN_PASS]
        ),
        [Actions.specificActions.ANCHOVY.INSPIRE]: new PlayerAction(
            'Inspire',
            'Inspire the Chief Librarian with your leadership!',
            'Have any member of your team perform Project Inspire.',
            '294px',
            '533px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.LIBRARIAN_PASS]?.status ===
                'incomplete'
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '209px',
            '120px'
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
            (playerState) => !playerState.quests[questIds.PYRITE]
        ),
        [Actions.specificActions.BARNACLE.HELP]: new PlayerAction(
            'Help',
            'The Pyrite Lady has mixed up some of her potion ingredients. Help her!',
            'Create a list of youngest to oldest of your whole group.',
            '437px',
            '471px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.PYRITE]?.status === 'incomplete'
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '729px',
            '113px'
        ),
    },
    [Locations.locationIds.BUBBLE]: {
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '434px',
            '524px'
        ),
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
            coolDownMessage,
            undefined,
            (playerState) =>
                playerState.inventory[itemDetails.BUBBLE.id]?.qty > 0
        ),
    },
    [Locations.locationIds.CATFISH]: {
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '169px',
            '348px'
        ),
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
            coolDownMessage
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
            (playerState) => !playerState.quests[questIds.FINCHES]
        ),
        [Actions.specificActions.CORALS.LEARN_LANG]: new PlayerAction(
            'Learn Language',
            'The ancient language of the Undersea is interesting. Devote some time to learning it.',
            "Gather items: 2 brushes, 2 pieces of paper, 2 storybooks; Each person then has to say 'hi' in a different language and say what language it is.",
            '427px',
            '419px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.FINCHES]?.status === 'incomplete',
            (playerState) => !playerState.knowsLanguage
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '26px',
            '106px'
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
            coolDownMessage
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
            (playerState) => !playerState.quests[questIds.SHRINE_1]
        ),
        [Actions.specificActions.KELP.CLIMB_DOWN]: new PlayerAction(
            'Climb Down Valley',
            'You have found a small shrine tucked away in a valley. However, the journey there looks difficult.',
            'Online Maze: https://www.mathsisfun.com/games/mazes.html. Complete one Hard maze.',
            '360px',
            '487px',
            undefined,
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
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '122px',
            '117px'
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
            (playerState) => !playerState.quests[questIds.ARTEFACTS_1]
        ),
        [Actions.specificActions.LIBRARY.STUDY_CRIMSON]: new PlayerAction(
            'Study Challenge Mode',
            'Learn more about Challenge Mode, an ancient ritual which outsiders from the Undersea went through.',
            'Have any member share an incident when things did not go as planned for a training/ project and how did the plan get adapted.',
            '99px',
            '503px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.FINCHES_2]?.status === 'incomplete',
            (playerState) =>
                playerState.inventory[itemDetails.LIBRARY_PASS.id] !== undefined
        ),
        [Actions.specificActions.LIBRARY.STUDY_ARTEFACT]: new PlayerAction(
            'Study Artefact Legends',
            'Learn more about the artefacts.',
            'Create a new group cheer and do it to energise yourselves.',
            '630px',
            '202px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.ARTEFACTS_1]?.status ===
                'incomplete',
            (playerState) =>
                playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty >= 0
        ),
        [Actions.specificActions.LIBRARY.DECODE_ARTEFACT]: new PlayerAction(
            'Decode Artefact',
            'The artefact legend is written in an ancient language. You will need to decode it before you can understand it.',
            "Decode 'Hwljaxawv Ljalgf'.",
            '703px',
            '265px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.ARTEFACTS_2]?.status ===
                'incomplete',
            (playerState) => playerState.knowsLanguage
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '33px',
            '171px'
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
            (playerState) => !playerState.quests[questIds.ARGUMENT]
        ),
        [Actions.specificActions.SALMON.CONFRONT]: new PlayerAction(
            'Confront',
            'The children are chasing each other with a long and pointy stick. Tell them what is right.',
            'Have any member of your team perform Project MTW.',
            '142px',
            '542px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.ARGUMENT]?.status === 'incomplete'
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '18px',
            '96px'
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
            coolDownMessage
        ),
    },
    [Locations.locationIds.SHALLOWS]: {
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '45px',
            '120px'
        ),
    },
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
            'Give Hair',
            "The shrinekeeper says he can transform a Unicorn's Hair into a Unicorn's Tear.",
            "Give 1 x Unicorn's Hair.",
            '434px',
            '449px',
            undefined,
            undefined,
            (playerState) =>
                !!playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty
        ),
        [Actions.specificActions.SHRINE.COLLECT_HAIR]: new PlayerAction(
            'Collect Tear',
            'Collect the Unicorn Tear from the Shrine.',
            'Receive 1 x Unicorn Tear.',
            '434px',
            '495px',
            undefined,
            (playerState) => playerState.quests[questIds.SHRINE_2]?.stages[4],
            (playerState) =>
                !playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '52px',
            '123px'
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
            (playerState) => !playerState.foundEngraving || playerState.quests[questIds.ARTEFACTS_4]?.status === 'incomplete'
        ),
        [Actions.specificActions.STATUE.DECODE_ENGRAVING]: new PlayerAction(
            'Decode Engraving',
            'You have found an engraving written in the ancient language. Decode it to learn what it says.',
            "Decode 'Vwwh Ujaekgf'",
            '250px',
            '553px',
            undefined,
            (playerState) => playerState.foundEngraving,
            (playerState) => playerState.knowsLanguage
        ),
        [Actions.specificActions.STATUE.CAST_COOLING_AURA]: new PlayerAction(
            'Cast Cool Aura',
            "The Crimson's body temperature is kept low as part of its slumber. Prevent it from getting too high!",
            'Water Parade.',
            '414px',
            '324px',
            undefined,
            (playerState) => playerState.knowsCrimson,
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
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '689px',
            '100px'
        ),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction(
            'Get Oxygen',
            'The Statue of Triton has a publicly-accessible storage of Oxygen, which slowly builds up 4 minutes of Oxygen every minute. You can get all the Oxygen inside this store. Note that this storage is shared between everyone.',
            'Conduct a Water Parade (skip if fasting) to receive all Oxygen stored at the statue.',
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
            (playerState, globalState) =>
                lastUsedMessage(playerState, globalState!)
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
                    : new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            undefined,
            (playerState) => !playerState.inventory['Map']
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
                    : new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            },
            undefined,
            (playerState) => !playerState.inventory['OxygenGuide']
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
                    : new Date(0),
            1800000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            }
        ),
        [Actions.specificActions.STORE
            .BUY_BUBBLE_PASS]: new DynamicPlayerAction(
            'Buy Bubble Pass',
            'This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.',
            'Pay 40 minutes of Oxygen to receive 1 x Bubble Pass.',
            '433px',
            '344px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
                    : new Date(0),
            2400000,
            (setIsVisible, setIsEnabled): void => {
                setIsEnabled(false);
            },
            (): void => {
                return;
            }
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '99px',
            '251px'
        ),
    },
    [Locations.locationIds.TUNA]: {
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '615px',
            '141px'
        ),
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
            coolDownMessage
        ),
    },
    [Locations.locationIds.UMBRAL]: {
        [Actions.specificActions.UMBRAL.EXPLORE]: new DynamicPlayerAction(
            'Explore',
            'This is a shady, run-down area. Apparently it used to be a residential district, but the Oxygen Stream here vanished one day, suddenly. You shudder as you walk around the area.',
            'Use 5 minutes of Oxygen.',
            '656px',
            '402px',
            (playerState) =>
                playerState.oxygenUntil
                    ? new Date(playerState.oxygenUntil)
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
            (playerState) => !playerState.quests[questIds.CLOAK_1]
        ),
        [Actions.specificActions.UMBRAL.GIVE_PAN]: new PlayerAction(
            'Show Pyrite Pan',
            'Show Alyusi the Pyrite Pan.',
            'Give 1 x Pyrite Pan.',
            '579px',
            '197px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.CLOAK_1]?.status === 'incomplete',
            (playerState) =>
                playerState.inventory[itemDetails.PYRITE_PAN.id] !== undefined
        ),
        [Actions.specificActions.UMBRAL.GIVE_ROCK]: new PlayerAction(
            'Give Rock',
            'Give Alyusi the Chmyrrkyth.',
            'Give 1 x Mysterious Black Rock.',
            '749px',
            '177px',
            undefined,
            (playerState) =>
                playerState.quests[questIds.CLOAK_2]?.status === 'incomplete',
            (playerState) =>
                playerState.inventory[itemDetails.BLACK_ROCK.id] !== undefined
        ),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction(
            'Store Oxygen',
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
            'No task required.',
            '870px',
            '488px',
            undefined,
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
            undefined,
            (playerState) =>
                playerState.storedOxygen !== null &&
                playerState.challengeMode !== null
        ),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction(
            'Resurface',
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
            'No task required.',
            '60px',
            '304px'
        ),
    },
    [Locations.locationIds.WOODS]: {
        [Actions.specificActions.WOODS.GET_HAIR]: new PlayerAction(
            'Get Hair',
            'It is said that a herd of unicorns live in the Whispering Woods, and they only appear to the pure of heart. Fortunately, we only need to find the hair that they shed.',
            'Share a point in time when you received help and support from others to receive 1 X Unicorn Hair.',
            '703px',
            '382px',
            undefined,
            (playerState) =>
                !(
                    playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty ||
                    playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty
                )
        ),
    },
};
